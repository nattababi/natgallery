const { Config } = require("../models/config");
const axios = require('axios');

async function getToken() {
  const config = await Config.find().select("-__v");
  return config[0].token;
}

async function refreshToken(){
  console.log('Refreshing token...');

  // read all secret parameters from database
  let config = await Config.find().select("-__v");

  //console.log('config from database:', config);

  let tokenDetails = await axios.post("https://accounts.google.com/o/oauth2/token",
    null, {
      params: {
        "client_id": config[0].client_id,
        "client_secret": config[0].client_secret,
        "refresh_token": config[0].refresh_token,
        "grant_type": "refresh_token"
      }
  });

  return {token: tokenDetails.data.access_token, userId: config[0].user_id};
}

exports.getToken = getToken;
exports.refreshToken = refreshToken;