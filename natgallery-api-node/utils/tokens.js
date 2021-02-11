const { Config } = require("../models/config");
const axios = require('axios');

async function refreshToken() {
  console.log('Refreshing token...');

  // read all secret parameters from database
  let config = await Config.find().select("-__v");

  let tokenDetails = await axios.post("https://accounts.google.com/o/oauth2/token",
    null, {
    params: {
      "client_id": config[0].client_id,
      "client_secret": config[0].client_secret,
      "refresh_token": config[0].refresh_token,
      "grant_type": "refresh_token"
    }
  });

  //console.log('token', tokenDetails.data.access_token );

  return { token: tokenDetails.data.access_token, userId: config[0].user_id };
}

//exports.getToken = getToken;
exports.refreshToken = refreshToken;