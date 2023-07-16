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
        res.status(CREATE).send(user);
      })
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
          next(new ConflictError('This user already exists'));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequest('Incorrect data sent'));
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
      res.status(SUCCESS).send({ token });
    })
    .catch((err) => {
      next(new Unauthorized(err.message));
    });
};

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
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Invalid User Id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser
};
