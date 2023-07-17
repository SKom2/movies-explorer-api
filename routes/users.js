const router = require('express').Router();
const {
  getUser,
  updateUser
} = require('../controllers/users');
const { validateUserEdit } = require('../middlewares/validate');

router.get('/me', getUser);
router.patch('/me', validateUserEdit, updateUser);

module.exports = router;
