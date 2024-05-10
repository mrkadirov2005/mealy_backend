const express = require('express');
const router = express.Router();
const AuthController=require('../controllers/authController')
router.post('/auth',AuthController.handleAdminLogIn)

module.exports = router;