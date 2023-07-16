const router = require('express').Router();
const userController = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { validateUserRegisterBody, validateUserLoginBody } = require('../middlewares/validate');

router.use(requestLogger);

router.use('/signup', validateUserRegisterBody, userController.createUser);
router.use('/signin', validateUserLoginBody, userController.loginUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('The requested page was not found'));
});

router.use(errorLogger);

module.exports = router;
