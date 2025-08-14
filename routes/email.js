const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/emailController');

router.post('/forgot-password', forgotPassword); 
router.post('/reset/:token', resetPassword);  

module.exports = router;