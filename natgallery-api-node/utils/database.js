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
  console.log('Removing expired albums from database... Done in', parseInt((new Date()-t0)), 'msec');
  
}

async function dbSaveImages(data, albumId){
  let t0 = new Date();

  for (let i = 0; i< data.length; i++){
    
    // try to find item with the same id
    let duplicate = await Image.find({_id: data[i].id});

    if (duplicate.length > 0){
      //find album title of duplicated images
      console.log("___ooo____ooo____________________oo____");
      console.log("_oo___oo___oo____ooooo__oo_ooo___oo____");
      console.log("oo_____oo__oo___oo____o_ooo___o_oooo___");
      console.log("ooooooooo__oo___ooooooo_oo_______oo____");
      console.log("oo_____oo__oo___oo______oo_______oo__o_");
      console.log("oo_____oo_ooooo__ooooo__oo________ooo__");
      console.log("_______________________________________");
  
      let duplicateAlbum = await Album.find({_id: duplicate[0].albumId});
      let albumOriginal = await Album.find({_id: albumId});
      console.log('Image from', albumOriginal[0].title, 'is duplicated with image from', duplicateAlbum[0].title);
      console.log("Removing", duplicateAlbum[0].title, 'from database...');
      await Image.deleteMany({albumId: duplicate[0].albumId});
    }
    
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
  
  //console.log("end saving...");
  
  console.log('Saving', data.length, 'images to database... Done in', parseInt((new Date()-t0)), 'msec');
}

async function dbRemoveImages(albumId) {
  let t0 = new Date();
  
  await Image.deleteMany({albumId: albumId});
  console.log('Removing expired images from database... Done in', parseInt((new Date()-t0)), 'msec');
}

exports.dbSaveAlbums = dbSaveAlbums;
exports.dbRemoveAlbums = dbRemoveAlbums;
exports.dbSaveImages = dbSaveImages;
exports.dbRemoveImages = dbRemoveImages;