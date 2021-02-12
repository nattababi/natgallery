const { Album } = require("../models/album");
const { Image } = require("../models/image");
const { Cover } = require("../models/cover");

async function dbSaveAlbums(data, userId) {
  
  let t0 = new Date();
  
  console.log(data[0]);

  for (let i = 0; i< data.length; i++){
    
    console.log(data[i].coverPhotoMediaItemId);

    let duplicate = await Album.find({_id: data[i].id});

    if (duplicate.length > 0){
      
      //find album title of duplicated images
      console.log("___ooo____ooo____________________oo____");
      console.log("_oo___oo___oo____ooooo__oo_ooo___oo____");
      console.log("oo_____oo__oo___oo____o_ooo___o_oooo___");
      console.log("ooooooooo__oo___ooooooo_oo_______oo____");
      console.log("oo_____oo__oo___oo______oo_______oo__o_");
      console.log("oo_____oo_ooooo__ooooo__oo________ooo__");
      console.log("_______________________________________");
  
      console.log('AlbumId from', data[i].title, 'is duplicated with albumId from', duplicate[0].title);
      console.log("Removing", duplicate[0].title, 'from database...');
      await Album.deleteMany({_id: data[i].id});
    }

    const album = new Album({ 
      _id: data[i].id,
     userId: userId,
     title: (typeof(data[i].title) === 'undefined')? "noname" + i: data[i].title,
     coverPhotoBaseUrl : data[i].coverPhotoBaseUrl,
     mediaItemsCount: data[i].mediaItemsCount,
     coverPhotoMediaItemId: data[i].coverPhotoMediaItemId,
     creationTime: data[i].creationTime,
     saveDate: Date()
   });

    await album.save();
  }
  
  console.log('Saving', data.length, 'albums to database... Done in', parseInt((new Date()-t0)), 'msec');
}

async function dbRemoveAlbums(userId) {
  let t0 = new Date();
  
  await Album.deleteMany({});
  console.log('Removing expired albums from database... Done in', parseInt((new Date()-t0)), 'msec');
  
}

async function dbSaveImages(data, albumId, debugMode = true){
  let t0 = new Date();

  for (let i = 0; i< data.length; i++){
    const image = new Image({
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
  
  //console.log("end saving...");
  
  if (debugMode) console.log('Saving', data.length, 'images to database... Done in', parseInt((new Date()-t0)), 'msec');
}

async function dbRemoveImages(albumId, debugMode = true) {
  let t0 = new Date();
  
  await Image.deleteMany({albumId: albumId});
  if (debugMode) console.log('Removing expired images from database... Done in', parseInt((new Date()-t0)), 'msec');
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