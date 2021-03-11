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

//let gToken = "ya29.a0AfH6SMD4lJHy6sMlfxUUK3ylJp4IezNCPywmv9lcflf0X86CQZVDes63t7Y3nWL2Ya1le8q9gmLmwP_293ljWXABVUsv-FDvbOpEA-dXmzJQR5tfbc12eC8qzQZta6B2l_W88938Gx2BNacHfQXIAdY5jW74vpcqqYqoduAKj5o";
let gToken = "";
let gTokenLife = null;
let gUserId = "";

//getAlbumsAndImages();

// refresh albums every 60 minutes
//var myVar = setInterval(getAlbumsAndImages, 60 * 60 * 1000);

//get albums each 10 minutes
var myVar = setTimeout(getAlbums, 10 * 60 * 1000);

async function getAlbums() {

  t0 = new Date();

  //await setGlobalToken();

  data = await libraryApiGetAlbums(gToken);
  console.log('Loading', data.sharedAlbums.length, 'albums from API... Done in', parseInt((new Date() - t0)), 'msec');

  if (data.error) {
    //return error
  } else {
    // Albums were successfully loaded from the API. Cache them
    await dbRemoveAlbums();
    await dbSaveAlbums(data.sharedAlbums, gUserId);
  }

  console.log('Albums list is auto-refreshed in database in', parseInt(new Date() - t0) / 1000, 'seconds');

}

async function getAlbumsAndImages() {

  const t0 = new Date();

  let data = await getAlbumsFromDatabase(true);

  //console.log("Albums refreshed", data.sharedAlbums.length);
  //todo: handle data.error
  for (let i = 0; i < data.sharedAlbums.length; ++i) {
    //console.log("Auto refreshing", i, data.sharedAlbums[i].title);
    await getImagesFromDatabase(data.sharedAlbums[i].id, null);
  }

  console.log('All albums (', data.sharedAlbums.length, ') in database are auto-refreshed in', parseInt(new Date() - t0) / 1000 / 60, 'minutes');

}

function clearToken() {
  console.log("Clear token", Date());
  gToken = "";
}

async function setGlobalToken() {
  console.log(`---------------------------`);

  const tokenLifeMin = (new Date() - gTokenLife) / 1000 / 60;
  if (tokenLifeMin > 60 || gToken === "") {
    const data = await refreshToken();
    gToken = data.token;
    gUserId = data.userId;
    gTokenLife = new Date();
  }
  else {
    console.log('Token life=', parseInt((new Date() - gTokenLife)) / 1000 / 60, 'min');
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

axios.interceptors.response.use(null, async (error) => {
  //console.log(error);

  const originalRequest = error.config;

  if (error.config && error.response && error.response.status === 401 &&
    !originalRequest._retry) {
    originalRequest._retry = true;

    console.log('I can retry after 401');

    gToken = "";
    const data = await refreshToken();
    //console.log("333");
    error.config.headers['Authorization'] = 'Bearer ' + data.token;
    gToken = data.token;
    gUserId = data.userId;
    gTokenLife = new Date();

    return axios.request(error.config);
  }

  return Promise.reject(error);
});

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

async function getAlbumsFromDatabase() {

  console.log(`---------------------------`);

  // Attempt to load the albums from database if available.
  // Temporarily caching the albums makes the app more responsive.

  let data = {};

  let t0 = new Date();

  // search in database
  let albums = await Album.find({});

  // store albums 20 minutes in the database
  if (albums.length > 0 && (parseInt((new Date() - albums[0].saveDate) / 1000 / 60)) < 20) {

    data.sharedAlbums = albums;

    console.log('Loading', albums.length, 'albums from database... Done in', parseInt((new Date() - t0)), 'msec');
    console.log('Saved time=', parseInt(new Date() - albums[0].saveDate) / 1000 / 60, 'minutes ago');

  }
  else {

    t0 = new Date();

    //await setGlobalToken();

    data = await libraryApiGetAlbums(gToken);
    console.log('Loading', data.sharedAlbums.length, 'albums from API... Done in', parseInt((new Date() - t0)), 'msec');

    if (data.error) {
      //return error
    } else {
      // Albums were successfully loaded from the API. Cache them
      await dbRemoveAlbums();
      await dbSaveAlbums(data.sharedAlbums, gUserId);
    }
  }

  console.log(`---------------------------`);

  return data;
}

async function getImagesFromDatabase(albumId, pageToken) {

  const authToken = gToken;

  //console.log(`---------------------------`);
  console.log(`Importing album: ${albumId}`);

  // To list all media in an album, construct a search request
  // where the only parameter is the album ID.
  // Note that no other filters can be set, so this search will
  // also return videos that are otherwise filtered out in libraryApiSearch(..).
  const parameters = pageToken ? { albumId, pageToken } : { albumId };

  let data = {};

  let t0 = new Date();
  // search in database
  let images = await Image.find({ albumId: albumId });

  // store images 60 minutes in the database
  //const imagesRotten = parseInt((new Date() - images[0].saveDate) / 1000 / 60) > 60;

  // TODO: chage imagesRotten criteria
  const imagesRotten = true;
  if (images && images.length > 0 && !imagesRotten) {
    console.log('Loading', images.length, 'images from database... Done in', parseInt((new Date() - t0)), 'msec');
    console.log('Saved time=', parseInt(new Date() - images[0].saveDate) / 1000 / 60, 'minutes ago');
    data.photos = images;
  }
  else {
    await dbRemoveImages(albumId);
    //await setGlobalToken();
    // Submit the search request to the API and wait for the result.
    data = await libraryApiSearch(authToken, parameters);

    for (let i = 0; i < data.photos.length; i++) {
      data.photos[i].imageId = data.photos[i].id;
    }

    await dbSaveImages(data.photos, albumId);
  }

  console.log(`---------------------------`);

  return ({ data, parameters });
}

async function libraryApiSearch(authToken, parameters) {
  let photos = [];
  let error = null;

  parameters.pageSize = config.searchPageSize;

  let t0 = new Date();

  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.
    let result = await axios.post(config.apiEndpoint + '/v1/mediaItems:search',
      parameters,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        // params: {
        //   pageSize: config.albumPageSize,
        // }
      });

    result = result.data;

    let items = [];
    if (result && result.mediaItems) {
      items = result.mediaItems.filter(x => x);// Filter empty or invalid items.
      photos = [...photos, ...items];
    }

    parameters.pageToken = result.nextPageToken;

  } catch (err) {
    // If the error is a StatusCodeError, it contains an error.error object that
    // should be returned. It has a name, statuscode and message in the correct
    // format. Otherwise extract the properties.

    // TODO: check when err.response is nothing 
    error = { name: err.name, code: err.response.status, message: err.message };
    console.log(error);
  }

  console.log('Google API respond in', parseInt((new Date() - t0)), 'msec');

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

    error = { name: err.name, code: err.response ? err.response.status : null, message: err.message };
    console.log(error);

  }


  //populate albums with date created

  // try to find in database creation time
  // read everything from Covers
  let covers = await Cover.find({});

  for (let i = 0; i < sharedAlbums.length; ++i) {

    let coverId = sharedAlbums[i].coverPhotoMediaItemId;
    let coverTime = null;

    let cover = covers.find(x => x.coverPhotoMediaItemId === coverId);

    if (cover) {
      //console.log('Get cover from db', i, '; items found', cover.length);
      coverTime = cover.creationTime;
    }
    else {
      //get it from api
      const url = config.apiEndpoint + '/v1/mediaItems/' + coverId;
      console.log('Get cover from api', i, url);
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

  const urlParams = req.query;

  const albumId = req.params.id;
  const pageToken = urlParams.pageToken;

  let data = null;

  data = await getImagesFromDatabase(albumId, pageToken);

  returnPhotos(res, data.data, data.parameters);
});

app.post('/loadFromSearch', async (req, res) => {
  const authToken = gToken;

  const urlParams = req.query;
  const pageToken = urlParams.pageToken;

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
  const parameters = pageToken ? { filters, pageToken } : { filters };
  
  // Submit the search request to the API and wait for the result.
  const data = await libraryApiSearch(authToken, parameters);

  // Return and cache the result and parameters.
  const userId = gUserId;

  for (let i = 0; i < data.photos.length; i++) {
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

