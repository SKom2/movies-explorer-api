const { celebrate, Joi } = require('celebrate');

const validateUserRegisterBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().custom((value, helpers) => {
      if (!/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30)
  })
});

const validateUserLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().custom((value, helpers) => {
      if (!/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    password: Joi.string().required()
  })
});

const validateUserEdit = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().custom((value, helpers) => {
      if (!/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    name: Joi.string().min(2).max(30)
  })
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (!/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (!/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (!/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/.test(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required()
  })
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
});

module.exports = {
  validateUserRegisterBody,
  validateUserLoginBody,
  validateUserEdit,
  validateMovieBody,
  validateMovieId
};
