const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true,
    default: "Insert Bio Here"
  },
  visited_countries: {
    type: Array
  },
  desired_countries: {
    type: Array
  }
});

module.exports = mongoose.model('Personal', PersonalSchema);
