const filmsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { authRegex } = require('../utils/constants');

const { getMovies, createMovie, deleteMovie } = require('../controllers/films');

filmsRoutes.get('/', getMovies);

filmsRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(authRegex),
    trailerLink: Joi.string().required().regex(authRegex),
    thumbnail: Joi.string().required().regex(authRegex),
    movieId: Joi.number().required(),
    nameEng: Joi.string().required(),
    nameRu: Joi.string().required(),
  }),
}), createMovie);

filmsRoutes.delete('/_id', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
}), deleteMovie);

module.exports = filmsRoutes;
