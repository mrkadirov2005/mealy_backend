// Assuming you have already connected to your MongoDB database using Mongoose
const mongoose = require('mongoose');
const MealScheme=require("../Schemas/Mealy")
// Assuming mealsArray is your array of meal objects
// Optionally, query the database to retrieve the meals
const handleGetMeals=async (req,res)=>{
  try {
    const allMeals = await MealScheme.find();
    console.log("Loaded MealsDatabase\n properties are "+JSON.stringify(req.Authorization));
    res.json(allMeals)
  } catch (error) {
    console.error("Error retrieving meals from the database:", error);
  }
}

const getSingleMeal=async (req,res)=>{
  const {id,_id}=req.body
  if(!id || !_id){
    res.json("please provide whole data")
    return
  }
  try {
    // split out the id
    const urlID=Number(req.originalUrl.split("/")[2])
    const selectedMeal= await MealScheme.findOne({id:urlID,_id}).exec()
    if(!selectedMeal){
      console.log(selectedMeal)
      res.json({"message":"not found meals"})
      return;
    }
    if(selectedMeal){
      res.json({"status":"success","message":selectedMeal})
    }else{
      res.json({"message":"not found","error":error})
      return;
    }
    
  } catch (error) {
    res.json(error)
  }
}
  

module.exports={handleGetMeals,getSingleMeal}


