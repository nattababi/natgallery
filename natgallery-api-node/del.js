const { Album } = require("./models/album");
const { Image } = require("./models/image");
const mongoose = require("mongoose");
const config = require("config");


async function del() {
  await mongoose.connect(config.get("db"), { useNewUrlParser: true, useUnifiedTopology: true });

  await Album.deleteMany({});
  await Image.deleteMany({});
  
  mongoose.disconnect();

  console.info("Done!");
}

del();
