const mongoose = require('mongoose');
const { mediaMetadataSchema } = require('./mediaMetadata');

const Image = mongoose.model('Image', new mongoose.Schema({
  imageId: {
    type: String,
    required: true,
    minlength: 5
  },
  albumId: {
    type: String,
    required: true,
    minlength: 5
  },
  baseUrl: {
    type: String,
    required: true,
  },
  mimeType:{
    type: String,
    required: true,
  },
  mediaMetadata: {
    type: mediaMetadataSchema,
    required: true
  },
  saveDate: {
    type: Date,
    required: true
  }
}, { toJSON: { virtuals: true } }));

exports.Image = Image; 
