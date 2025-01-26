const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./connection");
const { restrictToLoggedinUserOnly, checkAuth, restrictToAdminOnly } = require("./middlewares/auth");
require("dotenv").config();

const { router: adminRouter } = require("./routes/admin");
const { router: urlRouter} = require("./routes/url");
const { router: staticRouter } = require("./routes/staticRouter");
const { router: userRouter } = require("./routes/user");


const app = express();
const PORT = process.env.PORT || 5001;


// Connnection
connectToDB(process.env.MONGO_DB_URL)
    .then(() => {console.log("MongoDb connected")})
    .catch((err) => { console.log("Mongo Error")});


// set Ejs as the view Engine
app.set("view engine", "ejs");
// Define the view directory 
app.set("views", path.resolve("./views"));


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


//routes
app.use("/", staticRouter);  

app.use("/admin", restrictToAdminOnly,  adminRouter);  

app.use("/url", restrictToLoggedinUserOnly, urlRouter);         

app.use("/user", checkAuth, userRouter);
              
app.listen(PORT, () => {console.log("Server is running at port", PORT)});

