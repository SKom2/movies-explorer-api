const { SERVER_ERROR_MESSAGE} = require('../constants/ErrorMessages');
const {INTERNAL_SERVER_ERROR} = require("../constants/ErrorStatuses");

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // eslint-disable-next-line no-console
  console.error(`Error occurred: ${err}`);
  // eslint-disable-next-line no-console
  console.error(err.stack);

  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR ? SERVER_ERROR_MESSAGE : message,
  });
};

module.exports = errorHandler;
