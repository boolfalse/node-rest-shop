
const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middlewares/check-auth');

router.post('/register', UserController.register_user);
router.post('/login', UserController.login_user);
router.delete('/:userId', checkAuth, UserController.delete_user);

// EXPORTING
module.exports = router;
