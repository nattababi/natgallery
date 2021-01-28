const mongoose = require('mongoose');

const Config = mongoose.model('Config', new mongoose.Schema({
  client_id: {
    type: String,
    required: true,
    minlength: 5
  },
  client_secret: {
    type: String,
    required: true,
    minlength: 5
  },
  refresh_token: {
    type: String,
    required: true,
    minlength: 5
  },
  user_id: {
    type: String,
    required: true,
    minlength: 5
  }
}));

exports.Config = Config; 
