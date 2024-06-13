const express = require('express');
const router = express.Router();
const adminController=require("../controllers/adminController")

router.post('/add_product',adminController.addNewProduct)
    

module.exports = router;