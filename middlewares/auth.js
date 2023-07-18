const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-err');
const {UNAUTHORIZED_USER} = require("../constants/ErrorMessages");
require('dotenv').config();

const { SECRET_KEY = 'some-secret-key' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized(UNAUTHORIZED_USER));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new Unauthorized(UNAUTHORIZED_USER));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
