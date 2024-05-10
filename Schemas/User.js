const mongoose=require("mongoose")
const Schema=mongoose.Schema

const User=new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone_number:{type:Number,required:true},
    password: { type: String, required: true },
    access_token:{type:String,required:true},
    refresh_token:{type:String,required:false},
    loggedIn:{type:Boolean,required:true},
    address: { type: String, required: false },
    image: { type: String, required: false },
  }
  )
  module.exports=mongoose.model('User',User)