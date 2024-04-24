const mongoose=require("mongoose")
const CONNECTION_URL=require("../constant")
console.log(CONNECTION_URL)
const connectDB=async()=>{
    try {
        await mongoose.connect(CONNECTION_URL);
    } catch (error) {
        console.log(error)
    }
}

module.exports=connectDB