const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const CookieParser = require("cookie-parser")

//create instance of an express 
const app = express()

//add body-paser middleware----- convert incomming request body into json format
app.use(bodyParser.json())

//add cookie parser
app.use(CookieParser())

//backend running port
const PORT = process.env.PORT || 8050 ;
 


//customer router
const customerRouter = require("./routes/customerRoute.js");


 
//set path to customer router
app.use("/api/v1/customer",customerRouter);

// app.get('/setcookie', (req, res) => {
//     res.cookie(`Cookie token name`,`encrypted cookie string Value`);
//     res.send('Cookie have been saved successfully');
// });


//start the server for incomming requests
app.listen(PORT,()=>{
    
    console.log(`Server is up and running on port ${PORT}`)

})



