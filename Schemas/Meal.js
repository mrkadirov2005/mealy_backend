const mongoose=require("mongoose")
const Schema=mongoose.Schema

const mealSchema=new Schema({
    name: { type: String, required: true },
    ingredients: { type: [String], required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    country: { type: String, required: true },
    id: { type: Number, required: true },
    ordered: { type: Number, required: true },
    image: { type: String, required: true }
  }
  )
  module.exports=mongoose.model('Meal',mealSchema)