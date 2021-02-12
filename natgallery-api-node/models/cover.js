const mongoose = require('mongoose');

const Cover = mongoose.model('Cover', new mongoose.Schema({
  coverPhotoMediaItemId: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    required: true
  }
}, { toJSON: { virtuals: true } }));

exports.Cover = Cover; 
