const express = require('express');
const router = express.Router();
const adminController=require("../controllers/adminController")

router.get(/^\/admins\/[\w\d\W]+$/,adminController.getSingleAdmin)

module.exports = router;