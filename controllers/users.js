const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  SUCCESS, CREATE
} = require('../constants/ErrorStatuses');
const ConflictError = require('../errors/conflict-error');
const BadRequest = require('../errors/bad-request-err');
const Unauthorized = require('../errors/unauthorized-err');
const {EMAIL_ALREADY_EXISTS, WRONG_USER_DATA, USER_ID_NOT_FOUND, WRONG_USER_EMAIL, UNAUTHORIZED_USER, USER_LOGGED_OUT} = require("../constants/ErrorMessages");

const SALT_ROUNDS = 10;
const { SECRET_KEY = 'some-secret-key' } = process.env;
const MONGO_DUPLICATE_KEY_ERROR = 11000;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name
    })
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          SECRET_KEY,
          { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(CREATE).send({
          user,
          token
        });
      })
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
          next(new ConflictError(EMAIL_ALREADY_EXISTS));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequest(WRONG_USER_DATA));
        } else {
          next(err);
        }
      }));
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' }
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(SUCCESS).send({ token });
    })
    .catch(() => {
      next(new Unauthorized(WRONG_USER_DATA));
    });
};

const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(SUCCESS).send({ message: USER_LOGGED_OUT });
}

const getUser = (req, res, next) => {
  const currentUserId = req.user._id;

  return User.findOne({ _id: currentUserId })
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true }
  )
    .then((user) => {
      res.status(SUCCESS).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest(WRONG_USER_EMAIL));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest(USER_ID_NOT_FOUND));
      } else if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS));
      }
      else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser
};
