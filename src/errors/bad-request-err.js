const { BAD_REQUEST } = require('../constants/ErrorStatuses');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequest;
