const express = require('express');
const router = express.Router();
const adminController=require("../controllers/adminController")

router.get('list',adminController.getSingleAdmin)
    

module.exports = router;