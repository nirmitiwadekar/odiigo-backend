const express = require('express');
const router = express.Router();
const { adminLogin, adminSignup, adminForgotPassword, adminResetPassword } = require('../controller/adminController');

router.post('/login', adminLogin);
router.post('/signup', adminSignup);
router.post('/forgot-password', adminForgotPassword);
router.post('/reset-password/:token', adminResetPassword);

module.exports = router;
