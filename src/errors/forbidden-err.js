const { FORBIDDEN } = require('../constants/ErrorStatuses');

class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenErr;
