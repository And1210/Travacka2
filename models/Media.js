const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  media_type: {
    type: String,
    enum: ['IMAGE', 'VIDEO'],
    required: true
  },
  date: {
    type: Date
  },
  filename: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  thumbnail_url: {
    type: String
  },
  coords: {
    type: Array
  },
  location: {
    type: String
  }
});

module.exports = mongoose.model('Media', MediaSchema);
