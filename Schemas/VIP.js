const mongoose=require("mongoose")
const Schema=mongoose.Schema

const VIPuser=new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone_number:{type:Number,required:true},
    password: { type: String, required: true },
    loggedIn:{type:Boolean,required:true},
    token:{type:String,required:true},
    address: { type: String, required: false },
    image: { type: String, required: false },
  }
  )
  module.exports=mongoose.model('VIP',VIPuser)