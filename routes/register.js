const express = require('express');
const router = express.Router();
const registerController = require("../controllers/registerController");

// Define the route path and specify the controller function
router.post('/register', registerController)

module.exports = router;
