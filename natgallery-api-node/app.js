const express = require('express');
const config = require('./config.js');
const bodyParser = require('body-parser');
const request = require('request-promise');
const { refreshToken } = require('./utils/tokens');
const { Config } = require('./models/config');
const { Album } = require('./models/album');
const { Image } = require('./models/image');
const { Cover } = require('./models/cover');
const axios = require('axios');
const { dbSaveAlbums, dbRemoveAlbums, dbSaveImages, dbRemoveImages, dbSaveCover } = require('./utils/database');

const app = express();

require("./startup/db")();
require("./startup/cors")(app);

let gToken = "";
let gTokenLife = null;
let gUserId = "";

//getAlbumsAndImages();

// refresh albums every 60 minutes
//var myVar = setInterval(getAlbumsAndImages, 60 * 60 * 1000);



async function getAlbumsAndImages() {

  const t0 = new Date();

  let data = await getAlbumsFromDatabase(true);

  //console.log("Albums refreshed", data.sharedAlbums.length);
  //todo: handle data.error
  for (let i = 0; i < data.sharedAlbums.length; ++i) {
    //console.log("Auto refreshing", i, data.sharedAlbums[i].title);
    await getImagesFromDatabase(data.sharedAlbums[i].id, false);
  }

  console.log('All albums (',data.sharedAlbums.length,') in database are auto-refreshed in', parseInt(new Date() - t0) / 1000 / 60, 'minutes');

}

function clearToken() {
  console.log("Clear token", Date());
  gToken = "";
}

async function setGlobalToken() {
  if (gToken === "") {
    const data = await refreshToken();
    gToken = data.token;
    gUserId = data.userId;
    gTokenLife = new Date();

    // clear token in 30 minutes
    setTimeout(clearToken, 30 * 60 * 1000);
  }
  else{
    //console.log('Token life=', parseInt((new Date() - gTokenLife)/1000/60), 'min');
  }
}


// clear token every 50 minutes
//var myVar = setInterval(clearToken, 50*60*1000);

// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  await setGlobalToken();
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
    res.send('API for google albums');
  } else {
    //res.send('pages/frame');
  }
});

app.get('/getAlbums', async (req, res) => {

  let data = await getAlbumsFromDatabase();

  if (data.error) {
    // Error occured during the request. Albums could not be loaded.
    returnError(res, data);
  } else {
    res.status(200).send(data);
  }
});

async function getAlbumsFromDatabase(debugMode = true) {

  //if (debugMode) console.log(`---------------------------`);

  // Attempt to load the albums from database if available.
  // Temporarily caching the albums makes the app more responsive.

  let data = {};

  let t0 = new Date();

  // search in database
  let albums = await Album.find({});

  // store albums 30 minutes in the database
  if (albums.length > 0 && (parseInt((new Date() - albums[0].saveDate) / 1000 / 60)) < 30) {

    data.sharedAlbums = albums;

    if (debugMode) console.log('Loading', albums.length, 'albums from database... Done in', parseInt((new Date() - t0)), 'msec');
    if (debugMode) console.log('Saved time=', parseInt(new Date() - albums[0].saveDate) / 1000 / 60, 'minutes ago');

  }
  else {
    dbRemoveAlbums(gUserId);

    t0 = new Date();

    await setGlobalToken();

    data = await libraryApiGetAlbums(gToken);

    if (debugMode) console.log('Loading', data.sharedAlbums.length, 'albums from API... Done in', parseInt((new Date() - t0)), 'msec');

    if (data.error) {
      //return error
    } else {
      // Albums were successfully loaded from the API. Cache them
      await dbSaveAlbums(data.sharedAlbums, gUserId);
    }
  }

  //if (debugMode) console.log(`---------------------------`);

  return data;
}

async function getImagesFromDatabase(albumId, debugMode = true) {

  const authToken = gToken;

  if (debugMode) console.log(`---------------------------`);
  if (debugMode) console.log(`Importing album: ${albumId}`);

  // To list all media in an album, construct a search request
  // where the only parameter is the album ID.
  // Note that no other filters can be set, so this search will
  // also return videos that are otherwise filtered out in libraryApiSearch(..).
  const parameters = { albumId };
  let data = {};

  let t0 = new Date();
  // search in database
  let images = await Image.find({ albumId: albumId });

  // store images 30 minutes in the database
  if (images && images.length > 0 && (parseInt((new Date() - images[0].saveDate) / 1000 / 60)) < 30) {
    if (debugMode) console.log('Loading', images.length, 'images from database... Done in', parseInt((new Date() - t0)), 'msec');
    if (debugMode) console.log('Saved time=', parseInt(new Date() - images[0].saveDate) / 1000 / 60, 'minutes ago');
    data.photos = images;
  }
  else {
    //console.log("no images found or too old");
    await dbRemoveImages(albumId, debugMode);

    await setGlobalToken();

    // Submit the search request to the API and wait for the result.
    data = await libraryApiSearch(authToken, parameters, debugMode);

    for (let i = 0; i<data.photos.length; i++){
      data.photos[i].imageId = data.photos[i].id;
    }

    await dbSaveImages(data.photos, albumId, debugMode);
  }

  if (debugMode) console.log(`---------------------------`);

  return data;
}

async function libraryApiSearch(authToken, parameters, debugMode = true) {
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

        //items = result.mediaItems.filter(x => x);//result && result.mediaItems ?
        //const items2 = result.mediaItems.filter(x => !x);
        //console.log("items filtered", items2.length);

        //console.log('------before filter-', result.mediaItems.length);
        items = result.mediaItems.filter(x => x);// Filter empty or invalid items.
        //console.log('------after filter-', items.length);
        //  // Only keep media items with an image mime type.
        //  //.filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
        //  [];

        photos = [...photos, ...items];

      }

      //console.log("photos length=", photos.length, "next token=", result.nextPageToken);
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

    // TODO: check when err.response is nothing 
    error = { name: err.name, code: err.response.status, message: err.message };
    console.log(error);
  }

  if (debugMode) console.log('Google API respond in', parseInt((new Date() - t0)), 'msec');

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

  
  //populate albums with date created
  
  for (let i = 0; i < sharedAlbums.length; ++i) {
    
    let coverId = sharedAlbums[i].coverPhotoMediaItemId;
    let coverTime = null;
    
    //try to find in database creation time
    let cover = await Cover.find({ coverPhotoMediaItemId: coverId });
    
    if (cover.length > 0) {
      //console.log('get cover from db', i, '; items found', cover.length);
      coverTime = cover[0].creationTime;
    }
    else {
      //get it from api
      const url = config.apiEndpoint + '/v1/mediaItems/' + coverId;
      //console.log('get cover from api', i, url);
      let result = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      coverTime = result.data.mediaMetadata.creationTime;
      await dbSaveCover(coverId, coverTime);
    }
    
    sharedAlbums[i].creationTime = coverTime;
  }
  
  console.log('Albums loaded.');
  
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
  const parameters = { albumId };

  const data = await getImagesFromDatabase(albumId);

  returnPhotos(res, data, parameters);
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

  for (let i = 0; i<data.photos.length; i++){
    data.photos[i].imageId = data.photos[i].id;
  }
  
  returnPhotos(res, data, parameters);
});

function returnPhotos(res, data, searchParameter) {
  if (data.error) {
    returnError(res, data);
  } else {
    // Return the photos and parameters back int the response.
    res.status(200).send({ photos: data.photos, parameters: searchParameter });
  }
}

app.listen(8080, () => console.log('Listening on port 8080...'));

