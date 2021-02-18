const { Album } = require("../models/album");
const { Image } = require("../models/image");
const { Cover } = require("../models/cover");

async function dbSaveAlbums(data, userId) {

  let t0 = new Date();
  let albums = [];
  for (let i = 0; i < data.length; i++) {

    const album = {
      _id: data[i].id,
      userId: userId,
      title: (typeof (data[i].title) === 'undefined') ? "noname" + i : data[i].title,
      coverPhotoBaseUrl: data[i].coverPhotoBaseUrl,
      mediaItemsCount: data[i].mediaItemsCount,
      coverPhotoMediaItemId: data[i].coverPhotoMediaItemId,
      creationTime: data[i].creationTime,
      saveDate: Date()
    };

    albums.push(album);

  }
  
  await Album.insertMany(albums);

  console.log('Saving', data.length, 'albums to database... Done in', parseInt((new Date() - t0)), 'msec');
}

async function dbRemoveAlbums() {
  let t0 = new Date();

  await Album.deleteMany({});
  console.log('Removing expired albums from database... Done in', parseInt((new Date() - t0)), 'msec');

}

async function dbSaveImages(data, albumId) {
  let t0 = new Date();
  let images = [];
  for (let i = 0; i < data.length; i++) {
    const image = {
      imageId: data[i].id,
      albumId: albumId,
      baseUrl: data[i].baseUrl,
      mimeType: data[i].mimeType,
      saveDate: Date(),
      mediaMetadata: {
        height: data[i].mediaMetadata.height,
        width: data[i].mediaMetadata.width,
        creationTime: data[i].mediaMetadata.creationTime
      },
    };
    images.push(image);
  }

  await Image.insertMany(images);

  console.log('Saving', data.length, 'images to database... Done in', parseInt((new Date() - t0)), 'msec');
}

async function dbRemoveImages(albumId) {
  let t0 = new Date();

  await Image.deleteMany({ albumId: albumId });
  console.log('Removing expired images from database... Done in', parseInt((new Date() - t0)), 'msec');
}

async function dbSaveCover(coverId, creationTime) {

  const cover = new Cover({
    coverPhotoMediaItemId: coverId,
    creationTime: creationTime
  });

  await cover.save();

}

exports.dbSaveAlbums = dbSaveAlbums;
exports.dbRemoveAlbums = dbRemoveAlbums;
exports.dbSaveImages = dbSaveImages;
exports.dbRemoveImages = dbRemoveImages;
exports.dbSaveCover = dbSaveCover;