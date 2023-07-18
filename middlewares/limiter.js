const rateLimit = require('express-rate-limit');

const limiterConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const limiter = rateLimit(limiterConfig);

module.exports = limiter;
