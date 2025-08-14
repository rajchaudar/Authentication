const express = require('express');
const router = express.Router();
const { googleLogin, googleCallback } = require('../controllers/googleAuthController');

router.get('/google', googleLogin);
router.post('/google', googleLogin);
router.get('/google/callback', googleCallback);

module.exports = router;