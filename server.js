const express = require('express');
const app = express();
const mongoose=require("mongoose")
const cors=require("cors")
const connectDB=require("./config/dbConn")
const getAllMeals=require("./controllers/getItems")
// connect to mongodb
connectDB()
const PORT = 9000;

const whitelist=[
    'http://localhost:3000',
    'https://mealyteam-6gd6fa1mv-mrkadirov2005s-projects.vercel.app']
const corsOptions={
    origin:(origin,callback)=>{
        if(whitelist.indexOf(origin)!==-1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

app.use(cors(corsOptions))
// Define a route
app.get('/', (req, res) => {
    console.log("get request, main page")
  res.send('Hello, world!');
});
app.get('/meals',async (req,res)=>{
    let result= await getAllMeals()
    res.json(result)
    })

// Start the server

mongoose.connection.once('open',()=>{
    console.log("connected to DB");
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
})

