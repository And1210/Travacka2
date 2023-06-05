const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  cover_img_link: {
    type: String,
    default: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder-300x300.png'
  }
});

module.exports = mongoose.model('Book', BookSchema);
