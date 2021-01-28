const express = require('express');
const config = require('./config.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const persist = require('node-persist');
const request = require('request-promise');
const sessionFileStore = require('session-file-store');
const { refreshToken } = require('./utils/tokens');
const { Config } = require('./models/config');
const axios = require('axios');

require("./startup/db")();
//require("./utils/tokens")();

let gToken = "";
let gUserId = "";

const app = express();

const fileStore = sessionFileStore(session);

const albumCache = persist.create({
  dir: 'persist-albumcache/',
  ttl: 600000,  // 10 minutes
});
albumCache.init();

// Set up a session middleware to handle user sessions.
// NOTE: A secret is used to sign the cookie. This is just used for this sample
// app and should be changed.
const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  store: new fileStore({}),
  secret: 'photo sample',
});

// Parse application/json request data.
app.use(bodyParser.json());

// Parse application/xwww-form-urlencoded request data.
app.use(bodyParser.urlencoded({ extended: true }));

// Enable user session handling.
app.use(sessionMiddleware);

// Middleware that adds the user of this session as a local variable,
// so it can be displayed on all pages when logged in.
app.use((req, res, next) => {
  res.locals.name = '-';
  if (req.user && req.user.profile && req.user.profile.name) {
    res.locals.name =
      req.user.profile.name.givenName || req.user.profile.displayName;
  }

  res.locals.avatarUrl = '';
  if (req.user && req.user.profile && req.user.profile.photos) {
    res.locals.avatarUrl = req.user.profile.photos[0].value;
  }
  next();
});

app.use(async (req, res, next) => {

  if (gToken === "") {

    const data = await refreshToken();

    console.log("return from refreshToken", data);

    gToken = data.token;
    gUserId = data.userId;

  }

  next();
});

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
  console.log('Loading albums...');
  const userId = gUserId;//req.user.profile.id;

  // Attempt to load the albums from cache if available.
  // Temporarily caching the albums makes the app more responsive.
  const cachedAlbums = await albumCache.getItem(userId);
  if (cachedAlbums) {
    console.log('Loaded albums from cache.');
    res.status(200).send(cachedAlbums);
  } else {
    console.log('Loading albums from API.');
    // Albums not in cache, retrieve the albums from the Library API
    // and return them

    const data = await libraryApiGetAlbums(gToken);

    if (data.error) {
      // Error occured during the request. Albums could not be loaded.
      returnError(res, data);
      // Clear the cached albums.
      albumCache.removeItem(userId);
    } else {
      // Albums were successfully loaded from the API. Cache them
      // temporarily to speed up the next request and return them.
      // The cache implementation automatically clears the data when the TTL is
      // reached.
      res.status(200).send(data);
      //albumCache.setItemSync(userId, data);
    }
  }
});

async function libraryApiSearch(authToken, parameters) {
  let photos = [];
  let nextPageToken = null;
  let error = null;

  parameters.pageSize = config.searchPageSize;

  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.
    do {
      console.log(
        `Submitting search with parameters: ${JSON.stringify(parameters)}`);

      // Make a POST request to search the library or album
      const result =
        await request.post(config.apiEndpoint + '/v1/mediaItems:search', {
          headers: { 'Content-Type': 'application/json' },
          json: parameters,
          auth: { 'bearer': authToken },
        });

      console.log(`Response: ${result}`);

      // The list of media items returned may be sparse and contain missing
      // elements. Remove all invalid elements.
      // Also remove all elements that are not images by checking its mime type.
      // Media type filters can't be applied if an album is loaded, so an extra
      // filter step is required here to ensure that only images are returned.
      const items = result && result.mediaItems ?
        result.mediaItems
          .filter(x => x) : // Filter empty or invalid items.
        // Only keep media items with an image mime type.
        //.filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
        [];

      photos = photos.concat(items);

      // Set the pageToken for the next request.
      parameters.pageToken = result.nextPageToken;

      console.log(
        `Found ${items.length} images in this request. Total images: ${photos.length}`);

      // Loop until the required number of photos has been loaded or until there
      // are no more photos, ie. there is no pageToken.
    } while (photos.length < config.photosToLoad &&
      parameters.pageToken != null);

  } catch (err) {
    // If the error is a StatusCodeError, it contains an error.error object that
    // should be returned. It has a name, statuscode and message in the correct
    // format. Otherwise extract the properties.
    error = err.error.error ||
      { name: err.name, code: err.statusCode, message: err.message };
    console.log(error);
  }

  console.log('Search complete.');
  return { photos, parameters, error };
}

async function libraryApiGetAlbums(authToken) {
  let sharedAlbums = [];
  let nextPageToken = null;
  let error = null;
  let parameters = { pageSize: config.albumPageSize };

  try {
    // Loop while there is a nextpageToken property in the response until all
    // albums have been listed.
    do {
      console.log(`Loading albums. Received so far: ${sharedAlbums.length}`);
      // Make a GET request to load the albums with optional parameters (the
      // pageToken if set).
      //https://photoslibrary.googleapis.com/v1/sharedAlbums
      const result = await request.get(config.apiEndpoint + '/v1/sharedAlbums', {
        headers: { 'Content-Type': 'application/json' },
        qs: parameters,
        json: true,
        auth: { 'bearer': authToken },
      });

      if (result && result.sharedAlbums) {
        console.log(`Number of albums received: ${result.sharedAlbums.length}`);
        // Parse albums and add them to the list, skipping empty entries.
        const items = result.sharedAlbums.filter(x => !!x);

        sharedAlbums = sharedAlbums.concat(items);
      }
      parameters.pageToken = result.nextPageToken;
      // Loop until all albums have been listed and no new nextPageToken is
      // returned.
    } while (parameters.pageToken != null);

  } catch (err) {
    // If the error is a StatusCodeError, it contains an error.error object that
    // should be returned. It has a name, statuscode and message in the correct
    // format. Otherwise extract the properties.
    error = err.error.error ||
      { name: err.name, code: err.statusCode, message: err.message };
    console.log(error);
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
  const userId = gUserId;
  const authToken = gToken;

  console.log(`Importing album: ${albumId}`);

  // To list all media in an album, construct a search request
  // where the only parameter is the album ID.
  // Note that no other filters can be set, so this search will
  // also return videos that are otherwise filtered out in libraryApiSearch(..).
  const parameters = { albumId };

  // Submit the search request to the API and wait for the result.
  const data = await libraryApiSearch(authToken, parameters);

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

async function libraryApiSearch(authToken, parameters) {
  let photos = [];
  let nextPageToken = null;
  let error = null;

  parameters.pageSize = config.searchPageSize;

  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.
    do {
      console.log(
        `Submitting search with parameters: ${JSON.stringify(parameters)}`);

      // Make a POST request to search the library or album
      const result =
        await request.post(config.apiEndpoint + '/v1/mediaItems:search', {
          headers: { 'Content-Type': 'application/json' },
          json: parameters,
          auth: { 'bearer': authToken },
        });

      console.log(`Response: ${result}`);

      // The list of media items returned may be sparse and contain missing
      // elements. Remove all invalid elements.
      // Also remove all elements that are not images by checking its mime type.
      // Media type filters can't be applied if an album is loaded, so an extra
      // filter step is required here to ensure that only images are returned.
      const items = result && result.mediaItems ? result.mediaItems.filter(x => x) : // Filter empty or invalid items.
        // Only keep media items with an image mime type.
        // .filter(x => x.mimeType && x.mimeType.startsWith('image/')) :
        [];

      photos = photos.concat(items);

      // Set the pageToken for the next request.
      parameters.pageToken = result.nextPageToken;

      console.log(
        `Found ${items.length} images in this request. Total images: ${photos.length}`);

      // Loop until the required number of photos has been loaded or until there
      // are no more photos, ie. there is no pageToken.
    } while (photos.length < config.photosToLoad &&
      parameters.pageToken != null);

  } catch (err) {
    // If the error is a StatusCodeError, it contains an error.error object that
    // should be returned. It has a name, statuscode and message in the correct
    // format. Otherwise extract the properties.
    error = err.error.error ||
      { name: err.name, code: err.statusCode, message: err.message };
    console.log(error);
  }

  console.log('Search complete.');
  return { photos, parameters, error };
}

app.listen(8080, () => console.log('Listening on port 8080...'));

