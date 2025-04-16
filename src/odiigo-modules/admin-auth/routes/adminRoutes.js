const express = require('express');
const router = express.Router();
const { adminLogin, adminSignup } = require('../controller/adminController');

router.post('/login', adminLogin);
router.post('/signup', adminSignup);

module.exports = router;
