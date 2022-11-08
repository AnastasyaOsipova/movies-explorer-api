const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, updateUser,
} = require('../controllers/users');

userRoutes.get('/me', getUser);

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = userRoutes;
