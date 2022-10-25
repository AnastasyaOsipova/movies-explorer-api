const Film = require('../models/film');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Film.find({ owner: req.user._id })
    .then((films) => res.send(films))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameEN,
    nameRU,
  } = req.body;
  const owner = req.user._id;
  Film.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameEN,
    nameRU,
    owner,
  })
    .then((film) => res.send(film))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Film.findById(req.params._id)
    .orFail(() => { throw new NotFoundError('Фильм не найден'); })
    .then((film) => {
      if (film.owner._id.toString === req.user._id.toString) {
        return film.remove()
          .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
      return next(new ForbiddenError('Вы не можете удалить этот фильм'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Невалидный id'));
      } return next(err);
    });
};
