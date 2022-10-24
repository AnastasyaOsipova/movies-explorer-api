require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const userRoutes = require('./routes/users');
const filmRoutes = require('./routes/films');
const {
  register,
  logIn,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_URL } = require('./config');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(cors({
  Origin: 'https://api.movies-explorer.molch.nomoredomains.icu/',
  credentials: true,
}));

app.use(requestLogger);

app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), logIn);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), register);

app.use('/users', auth, userRoutes);

app.use('/movies', auth, filmRoutes);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
}, auth);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.use(errorLogger);

app.use(errors());

app.listen(PORT, () => {
  console.log(`example app listening at http://localhost:${PORT}`);
});
