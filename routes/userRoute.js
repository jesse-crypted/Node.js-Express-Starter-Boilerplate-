const express = require('express');
const router = express.Router();

// require the auth Controller for user
const { registerUser, login } = require('./../controllers/authController');
const { getAllUser } = require('./../controllers/userController');

router.post('/register', registerUser);
router.post('/login', login);

router.get('/', getAllUser);

module.exports = router;
