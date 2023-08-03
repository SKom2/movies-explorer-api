const express = require("express");
const userController = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { validateUserRegisterBody, validateUserLoginBody } = require('../middlewares/validate');
const {PAGE_NOT_FOUND} = require("../constants/ErrorMessages");

const router = express.Router()

router.use(requestLogger);

router.use('/signup', validateUserRegisterBody, userController.createUser);
router.use('/signin', validateUserLoginBody, userController.loginUser);
router.get('/signout', userController.logoutUser);


router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError(PAGE_NOT_FOUND));
});

router.use(errorLogger);

module.exports = router;
