const express = require('express');
const router = express.Router();
const mealsController=require("../controllers/mealsController")

router.get('/meals',mealsController.handleGetMeals )
    .get(/^\/meals\/[\w\d\W]+$/,mealsController.getSingleMeal)

module.exports = router;