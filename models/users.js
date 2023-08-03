const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {WRONG_DATA} = require("../constants/ErrorMessages");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/.test(value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    default: 'Aleksandr',
    minLength: 2,
    maxLength: 30
  }
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(WRONG_DATA));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(WRONG_DATA));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
