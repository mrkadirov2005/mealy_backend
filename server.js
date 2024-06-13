const express = require('express');
const app = express();
const mongoose=require("mongoose")
const cors=require("cors")
const connectDB=require("./config/dbConn")
const bcrypt=require("bcrypt")
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const cookieParser=require("cookie-parser")
const MealRoute=require("./routes/meals")
const RegisterRoute=require('./routes/register')
const AuthRoute=require("./routes/auth")
const AdminRouter=require("./routes/admin")
const path=require("path")
const Product_Router=require("./routes/product")
const add_product_route=require("./routes/add_pr")
// connect to mongodb
connectDB()

const PORT = 9000;

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// Define a route

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));



app.get('/',require("./routes/root"));
app.post('/register',RegisterRoute)
app.post('/auth',AuthRoute)
app.get('/meals',MealRoute)
app.post('/products',Product_Router)
app.post('/add_product',add_product_route)
app.get(/^\/meals\/[\w\d\W]+$/, MealRoute);
app.get(/^\/admins\/[\w\d\W]+$/,AdminRouter)


app.get("*",async (req,res)=>{
    res.status(400).json({"got this":req.originalUrl})
})

// Start the server
mongoose.connection.once('open',()=>{
    console.log("connected to DB");
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
})

