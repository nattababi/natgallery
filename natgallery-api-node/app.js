const express = require('express');
const config = require('./config.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const request = require('request-promise');
const { refreshToken } = require('./utils/tokens');
const { Config } = require('./models/config');
const { Album } = require('./models/album');
const { Image } = require('./models/image');
const axios = require('axios');
const { dbSaveAlbums, dbRemoveAlbums, dbSaveImages, dbRemoveImages } = require('./utils/database');

const app = express();

require("./startup/db")();
require("./startup/cors")(app);

let gToken = "";
let gUserId = "";

// clear token every 50 minutes
//var myVar = setInterval(clearToken, 50*60*1000);

function clearToken (){
  console.log("Clear token", Date());
  gToken = "";
}

// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {

  if (gToken === "") {
    const data = await refreshToken();
    gToken = data.token;
    gUserId = data.userId;

    // clear token in 50 minutes
    setTimeout(clearToken, 50*60*1000);
  }

  next();
});


// Axios.interceptors.response.use(
//   response => response,
//   (error) => {
//     console.log("axios error");

//     const status = error.response ? error.response.status : null;
//     const originalRequest = error.config;

//     if (status === 401) {
//       console.log("axios 401");
//       // if (!store.state.auth.isRefreshing) {
//       //   store.dispatch('auth/refresh')
//       // }

//       const retryOrigReq = store.dispatch('auth/subscribe', token => {
//         originalRequest.headers['Authorization'] = 'Bearer ' + token;
//         Axios(originalRequest);
//       });

//       return retryOrigReq;
//     }
//     else{
//       return Promise.reject(error)
//     }
//   }
// )
// axios.interceptors.response.use(null, (error) => {
//   //console.log(error);

//   if (error.config && error.response && error.response.status === 401 &&
//       error.config.url !== "https://accounts.google.com/o/oauth2/token") {
//     console.log("axios retry");
//     return refreshToken().then((data) => {
//       console.log("callback from refreshtoken", data.token);
//       error.config.headers['Authorization'] = 'Bearer ' + data.token;
//       gToken = data.token;
//       gUserId = data.userId;
//       return axios.request(error.config);
//     });
//   }

//   return Promise.reject(error);
// });

app.get('/', (req, res) => {
  //res.send(passport);
  if (!req.user || !req.isAuthenticated()) {
    // Not logged in yet.
    res.send('api for google albums');
  } else {
    //res.send('pages/frame');
  }
});

app.get('/getAlbums', async (req, res) => {
  console.log(`---------------------------`);
  //console.log('Loading albums...');
  const userId = gUserId;//req.user.profile.id;

  let data = {};
  // Attempt to load the albums from cache if available.
  // Temporarily caching the albums makes the app more responsive.

  let t0 = new Date();
  
  // search in database
  let albums = await Album.find({});

  // store 29 minutes in the database
  if (albums.length > 0 && ( parseInt((new Date()-albums[0].saveDate)/1000/60)) < 29) {
    
    data.sharedAlbums = albums;
    res.status(200).send(data);

    console.log('Loading', albums.length, 'albums from database... Done in', parseInt((new Date()-t0)), 'msec');
    console.log('Saved time=', parseInt(new Date() - albums[0].saveDate)/1000/60, 'minutes ago');
    
  }
  else{
    dbRemoveAlbums(userId);
    
    t0 = new Date();
    data = await libraryApiGetAlbums(gToken);
    console.log('Loading ', data.sharedAlbums.length, 'albums from API... Done in', parseInt((new Date()-t0)), 'msec');

    if (data.error) {
      // Error occured during the request. Albums could not be loaded.
      returnError(res, data);
      // Clear the cached albums.
    } else {
      // Albums were successfully loaded from the API. Cache them
      await dbSaveAlbums(data.sharedAlbums, userId);
      res.status(200).send(data);
    }
  }
  console.log(`---------------------------`);
});


async function libraryApiSearch(authToken, parameters) {
  let photos = [];
  let nextPageToken = null;
  let error = null;

  let t0 = new Date();

  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.
    do {
      //console.log(
      //  `Submitting search with parameters: ${JSON.stringify(parameters)}`);

      let result = await axios.post(config.apiEndpoint + '/v1/mediaItems:search',
        parameters,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      
      result = result.data;

      //console.log(`Response: ${result}`);

      let items = [];
      if (result && result.mediaItems) {
        // The list of media items returned may be sparse and contain missing
        // elements. Remove all invalid elements.
        // Also remove all elements that are not images by checking its mime type.
        // Media type filters can't be applied if an album is loaded, so an extra
        // filter step is required here to ensure that only images are returned.
        items = result.mediaItems.filter(x => x);//result && result.mediaItems ?
        //   result.mediaItems.filter(x => x) : []// Filter empty or invalid items.
        //  // Only keep media items with an image mime type.
        //  //.filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
        //  [];

        photos = [...photos, ...items];

      }

      // Set the pageToken for the next request.
      parameters.pageToken = result.nextPageToken;

      //console.log(
      //  `Found ${items.length} images in this request. Total images: ${photos.length}`);

      // Loop until the required number of photos has been loaded or until there
      // are no more photos, ie. there is no pageToken.
    } while (photos.length < config.photosToLoad &&
      parameters.pageToken != null);

  } catch (err) {
    // If the error is a StatusCodeError, it contains an error.error object that
    // should be returned. It has a name, statuscode and message in the correct
    // format. Otherwise extract the properties.
    error = { name: err.name, code: err.response.status, message: err.message };
    console.log(error);
  }

  console.log('Google API respond in', parseInt((new Date()-t0)), 'msec');

  //console.log('Search complete.');
  return { photos, parameters, error };
}

async function libraryApiGetAlbums(authToken) {
  let sharedAlbums = [];
  let nextPageToken = null;
  let error = null;


  let config1 = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    params: {
      pageSize: config.albumPageSize,
    }
  }

  try {
    // Loop while there is a nextpageToken property in the response until all
    // albums have been listed.
    do {
      console.log(`Loading albums. Received so far: ${sharedAlbums.length}`);
      // Make a GET request to load the albums with optional parameters (the
      // pageToken if set).
      // https://photoslibrary.googleapis.com/v1/sharedAlbums

      let result = await axios.get(config.apiEndpoint + '/v1/sharedAlbums', config1);
      result = result.data;

      if (result && result.sharedAlbums) {
        console.log(`Number of albums received: ${result.sharedAlbums.length}`);
        // Parse albums and add them to the list, skipping empty entries.
        const items = result.sharedAlbums;//.filter(x => !!x);
        sharedAlbums = [...sharedAlbums, ...items];
      }

      config1.params.pageToken = result.nextPageToken;

      // Loop until all albums have been listed and no new nextPageToken is
      // returned.
    } while (config1.params.pageToken != null);
  }
  catch (err) {

    // If the error is a StatusCodeError, it contains an error.error object that
    // should be returned. It has a name, statuscode and message in the correct
    // format. Otherwise extract the properties.

    error = { name: err.name, code: err.response.status, message: err.message };
    console.log(error);

  }

  console.log('Albums loaded.');

  //sharedAlbums = sharedAlbums.filter(x => )
  //const items = sharedAlbums.filter(x => x);
  return { sharedAlbums, error };
}

// Responds with an error status code and the encapsulated data.error.
function returnError(res, data) {
  // Return the same status code that was returned in the error or use 500
  // otherwise.
  const statusCode = data.error.code || 500;
  // Return the error.
  res.status(statusCode).send(data.error);
}

app.post('/loadFromAlbum/:id', async (req, res) => {
  const albumId = req.params.id;
  const userId = gUserId;
  const authToken = gToken;

  console.log(`---------------------------`);
  console.log(`Importing album: ${albumId}`);

  // To list all media in an album, construct a search request
  // where the only parameter is the album ID.
  // Note that no other filters can be set, so this search will
  // also return videos that are otherwise filtered out in libraryApiSearch(..).
  const parameters = { albumId };
  let data = {};

  let t0 = new Date();
  // search in database
  let images = await Image.find({albumId: albumId});

  // store images 40 minutes in the database
  if (images.length > 0 && ( parseInt((new Date()-images[0].saveDate)/1000/60)) < 40) {
    console.log('Loading', images.length, 'images from database... Done in', parseInt((new Date()-t0)), 'msec');
    console.log('Saved time=', parseInt(new Date() - images[0].saveDate)/1000/60, 'minutes ago');
    data.photos = images;
  }
  else{
    //console.log("no images found or too old");
    await dbRemoveImages(albumId);
    // Submit the search request to the API and wait for the result.
    data = await libraryApiSearch(authToken, parameters);

    await dbSaveImages(data.photos, albumId);
  }

  console.log(`---------------------------`);
  returnPhotos(res, userId, data, parameters)
});

app.post('/loadFromSearch', async (req, res) => {
  const authToken = gToken;

  console.log('Loading images from search.');
  console.log('Received form data: ', req.body);

  // Construct a filter for photos.
  // Other parameters are added below based on the form submission.
  const filters = { contentFilter: {}, mediaTypeFilter: { mediaTypes: ['PHOTO'] } };

  if (req.body.includedCategories) {
    // Included categories are set in the form. Add them to the filter.
    filters.contentFilter.includedContentCategories =
      [req.body.includedCategories];
  }

  // if (req.body.excludedCategories) {
  //   // Excluded categories are set in the form. Add them to the filter.
  //   filters.contentFilter.excludedContentCategories =
  //       [req.body.excludedCategories];
  // }

  // Add a date filter if set, either as exact or as range.
  // if (req.body.dateFilter == 'exact') {
  //   filters.dateFilter = {
  //     dates: constructDate(
  //         req.body.exactYear, req.body.exactMonth, req.body.exactDay),
  //   }
  // } else if (req.body.dateFilter == 'range') {
  //   filters.dateFilter = {
  //     ranges: [{
  //       startDate: constructDate(
  //           req.body.startYear, req.body.startMonth, req.body.startDay),
  //       endDate:
  //           constructDate(req.body.endYear, req.body.endMonth, req.body.endDay),
  //     }]
  //   }
  // }

  // Create the parameters that will be submitted to the Library API.
  const parameters = { filters };

  // Submit the search request to the API and wait for the result.
  const data = await libraryApiSearch(authToken, parameters);

  // Return and cache the result and parameters.
  const userId = gUserId;
  returnPhotos(res, userId, data, parameters);
});

function returnPhotos(res, userId, data, searchParameter) {
  if (data.error) {
    returnError(res, data);
  } else {
    // Remove the pageToken and pageSize from the search parameters.
    // They will be set again when the request is submitted but don't need to be
    // stored.

    //delete searchParameter.pageToken;
    //delete searchParameter.pageSize;

    // Cache the media items that were loaded temporarily.

    //mediaItemCache.setItemSync(userId, data.photos);

    // Store the parameters that were used to load these images. They are used
    // to resubmit the query after the cache expires.

    //storage.setItemSync(userId, {parameters: searchParameter});

    // Return the photos and parameters back int the response.
    res.status(200).send({ photos: data.photos, parameters: searchParameter });
  }
}

app.listen(8080, () => console.log('Listening on port 8080...'));

