const mongoose = require('mongoose');
const { authRegex } = require('../utils/constants');

function validateUrl(v) {
  return authRegex.test(v);
}

const filmSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: { validator: validateUrl },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: { validator: validateUrl },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: { validator: validateUrl },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRu: {
    type: String,
    required: true,
  },
  nameEng: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('film', filmSchema);
