// eslint-disable-next-line import/no-extraneous-dependencies
const winston = require('winston');
// eslint-disable-next-line import/no-extraneous-dependencies
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' })
  ],
  format: winston.format.json()
});

const errorLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'errors.log' })
  ],
  format: winston.format.json()
});

module.exports = {
  requestLogger,
  errorLogger
};
