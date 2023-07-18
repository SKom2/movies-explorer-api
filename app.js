require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const router = require('./routes');
const errorHandler = require("./middlewares/errorHandler");
const {CONNECT_ADDRESS} = require("./constants/Config");
const limiter = require("./middlewares/limiter");

const { PORT = 3000 } = process.env;

const app = express();
mongoose.set('toJSON', { useProjection: true });
mongoose.connect(CONNECT_ADDRESS);
app.use(helmet());
app.use(limiter)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  next();
});
// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

// eslint-disable-next-line no-unused-vars
app.use(express.json());
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${PORT}`);
});
