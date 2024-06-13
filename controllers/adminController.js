// Assuming you have already connected to your MongoDB database using Mongoose
const MEALSCHEMA =require("../Schemas/Mealy")
const mongoose = require('mongoose');
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

// Define the schema for your meal documents
const Admin=require('../Schemas/admin')

// Optionally, query the database to retrieve the meals
async function retrieveAdmins() {
  try {
    const allAdmins = await Admin.findOne({"name":"muzaffar","email":"muzaffar571181@gmail.com","password":""});
    console.log("Loaded MealsDatabase");
    return allAdmins
  } catch (error) {
    console.error("Error retrieving meals from the database:", error);
  }
}
// function for getting one admin
async function getSingleAdmin(req,res){
  // token, email and password are required for this action
  const {email,password,phone_number}=req.body
  const username=req.originalUrl.split("/")[2]
  const foundUser=await Admin.findOne({username})
  if(!foundUser){
  res.json("not found admin")
  }else{
    try {
  // secret key is admin_access
    jwt.verify(foundUser.token,"admin_access",async function(err,decoded){
      if(err){
        res.json({"error":err})
        return;
      }
      if(decoded){
        console.log("entered decoded block",decoded)
        if(decoded.email==email  && decoded.username==username && decoded.phone_number===phone_number){
          console.log(decoded.phone_number,phone_number)
        bcrypt.compare(password,foundUser.password,async function(err,result){
          if(err){
            res.json("password mismatch")
            return
          }
          if(result){
            res.json(foundUser)
            return
          }
        })
        }else{
          res.json("not matching info")
          return;
        }
      }

    })
      
    } catch (error) {
      console.log(error)
    }
  }

  
}

const getAdminProducts= async (req,res)=>{
  console.log("req for admin products")
const {firstname}=req.body
if(!firstname){
  res.status(400).json({"message":"username not provided"})
}

if(firstname){
const foundData=await MEALSCHEMA.find({producer:firstname})
console.log("request for admin name: ",firstname)
res.json(foundData)
}


}

const addNewProduct=(req,res)=>{
console.log("req for add new product")
}



module.exports={retrieveAdmins,getSingleAdmin,getAdminProducts,addNewProduct}
