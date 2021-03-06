const config = {};

config.scopes = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'profile',
];

// The number of photos to load for search requests.
config.photosToLoad = 500;

// The page size to use for search requests. 100 is recommended.
config.searchPageSize = 50;

// The page size to use for the listing albums request. 50 is recommended.
config.albumPageSize = 50;

// The API end point to use. Do not change.
config.apiEndpoint = 'https://photoslibrary.googleapis.com';

module.exports = config;
