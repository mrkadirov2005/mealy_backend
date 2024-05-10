const express = require('express');
const router = express.Router();
const mealsController=require("../controllers/mealsController")

router.get('/meals',mealsController.handleGetMeals )
    .get('^/meals/d+$',mealsController.getSingleMeal)

module.exports = router;