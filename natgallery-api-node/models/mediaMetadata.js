const mongoose = require('mongoose');

const mediaMetadataSchema = new mongoose.Schema({
  height: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  creationTime: {
    type: Date,
    required: true
  }
});

exports.mediaMetadataSchema = mediaMetadataSchema;

