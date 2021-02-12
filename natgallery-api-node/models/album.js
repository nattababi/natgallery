const mongoose = require('mongoose');

const Album = mongoose.model('Album', new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    minlength: 5
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  coverPhotoBaseUrl: {
    type: String,
    required: true,
  },
  mediaItemsCount: {
    type: Number,
    required: true,
  },
  coverPhotoMediaItemId: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    required: true
  },
  saveDate: {
    type: Date,
    required: true
  }
}, { toJSON: { virtuals: true } }));

exports.Album = Album; 
