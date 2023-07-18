const Movie = require('../models/movies');
const { SUCCESS, CREATE } = require('../constants/ErrorStatuses');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');
const mongoose = require("mongoose");
const BadRequest = require("../errors/bad-request-err");
const {WRONG_CREATE_MOVIE_DATA, MOVIE_ID_NOT_FOUND, ACCESS_ERROR, WRONG_DELETE_MOVIE_DATA} = require("../constants/ErrorMessages");

const getMovies = (req, res, next) => Movie.find({ owner: { $exists: true } })
  .then((movie) => {
    res.status(SUCCESS).send(movie);
  })
  .catch(next);

const createMovie = (req, res, next) => Movie.create({
  ...req.body
})
  .then((movie) => {
    res.status(CREATE).send(movie);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequest(WRONG_CREATE_MOVIE_DATA));
    }
  });

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(MOVIE_ID_NOT_FOUND));
        return;
      }
      const ownerId = movie.owner.toHexString();
      const userId = req.user._id;

      if (ownerId !== userId) {
        next(new ForbiddenErr(ACCESS_ERROR));
        return;
      }

      Movie.findByIdAndDelete(movieId)
        .then((result) => {
          if (result) {
            res.status(SUCCESS).send(result);
          }
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequest(WRONG_DELETE_MOVIE_DATA));
          }
        });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
};
