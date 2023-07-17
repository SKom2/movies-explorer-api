const Movie = require('../models/movies');
const { SUCCESS, CREATE } = require('../constants/ErrorStatuses');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');

const getMovies = (req, res, next) => Movie.find({})
  .then((movie) => {
    res.status(SUCCESS).send(movie);
  })
  .catch(next);

const createMovie = (req, res, next) => Movie.create({
  owner: req.user._id,
  ...req.body
})
  .then((movie) => {
    res.status(CREATE).send(movie);
  })
  .catch(next);

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        console.log(movie);
        next(new NotFoundError('Movie ID not found'));
        return;
      }
      const ownerId = movie.owner.toHexString();
      const userId = req.user._id;

      if (ownerId !== userId) {
        next(new ForbiddenErr('You do not have permission to delete this card'));
        return;
      }

      Movie.findByIdAndDelete(movieId)
        .then((result) => {
          if (result) {
            res.status(SUCCESS).send(result);
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie
};
