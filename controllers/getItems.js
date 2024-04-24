// Assuming you have already connected to your MongoDB database using Mongoose

const mongoose = require('mongoose');

// Define the schema for your meal documents
const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
  country: { type: String, required: true },
  id: { type: Number, required: true },
  ordered: { type: Number, required: true },
  image: { type: String, required: true }
});

// Create a Mongoose model based on the schema
const Meal = mongoose.model('Meal', mealSchema);
// Assuming mealsArray is your array of meal objects
// Optionally, query the database to retrieve the meals
async function retrieveMeals() {
  try {
    const allMeals = await Meal.find();
    console.log("Loaded MealsDatabase");
    return allMeals
  } catch (error) {
    console.error("Error retrieving meals from the database:", error);
  }
}



module.exports=retrieveMeals
