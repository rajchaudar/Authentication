const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, refreshAccessToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;