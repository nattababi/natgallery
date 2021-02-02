const { Album } = require("../models/album");
const { Image } = require("../models/image");

async function dbSaveAlbums(data, userId) {
  
  let t0 = new Date();
  
  for (let i = 0; i< data.length; i++){
    const obj1 = await new Album({ 
     userId: userId,
     _id: data[i].id,
     title: (typeof(data[i].title) === 'undefined')? "noname" + i: data[i].title,
     coverPhotoBaseUrl : data[i].coverPhotoBaseUrl,
     mediaItemsCount: data[i].mediaItemsCount,
     saveDate: Date()
   }).save();
  }
  
  console.log('Saving', data.length, 'albums to database... Done in', parseInt((new Date()-t0)), 'msec');
}

async function dbRemoveAlbums(userId) {
  let t0 = new Date();
  
  await Album.deleteMany({});
  console.log('Removing albums from database... Done in', parseInt((new Date()-t0)), 'msec');
  
}

async function dbSaveImages(data, albumId){
  let t0 = new Date();
  
  for (let i = 0; i< data.length; i++){
    
    const image = new Image({
      _id: data[i].id,
      albumId: albumId,
      baseUrl: data[i].baseUrl,
      mimeType: data[i].mimeType,
      saveDate: Date(),
      mediaMetadata: {
        height : data[i].mediaMetadata.height,
        width: data[i].mediaMetadata.width,
        creationTime: data[i].mediaMetadata.creationTime
      },
    });

    await image.save();
    
  }
  
  console.log('Saving', data.length, 'images to database... Done in', parseInt((new Date()-t0)), 'msec');
}

async function dbRemoveImages(albumId) {
  let t0 = new Date();
  
  await Image.deleteMany({albumId: albumId});
  console.log('Removing images (album=', albumId,') from database... Done in', parseInt((new Date()-t0)), 'msec');
  
}
exports.dbSaveAlbums = dbSaveAlbums;
exports.dbRemoveAlbums = dbRemoveAlbums;
exports.dbSaveImages = dbSaveImages;
exports.dbRemoveImages = dbRemoveImages;