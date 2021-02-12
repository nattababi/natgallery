const { Album } = require("./models/album");
const { Image } = require("./models/image");
const { Cover } = require("./models/cover");
const mongoose = require("mongoose");
const config = require("config");

async function del() {
  await mongoose.connect(config.get("db"), { useNewUrlParser: true, useUnifiedTopology: true });

  await Album.deleteMany({});
  await Image.deleteMany({});
  await Cover.deleteMany({});
  
  mongoose.disconnect();

  console.info("Done!");
}

del();
