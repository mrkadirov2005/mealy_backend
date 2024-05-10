const mongoose=require("mongoose")
const Schema=mongoose.Schema

const Admin=new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email:{type:String,required:true},
    token: { type: String, required: true },
    address: { type: String, required: true },
    password:{type:String,required:true},
    loggedIn:{type:Boolean,required:false},
    phone_number:{type:Number,required:true}
  }
  )
  module.exports=mongoose.model('Admin',Admin)