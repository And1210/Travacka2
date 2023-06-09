const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  media_count: {
    type: Number,
    default: 0
  },
  img_urls: {
    type: Array,
    required: true
  },
  coords: {
    type: Array,
    default: []
  },
  location: {
    type: String,
    default: ""
  },
  post: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('Blog', BlogSchema);
