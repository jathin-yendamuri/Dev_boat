
const express = require("express");
const {database} = require("./config/database");
const cookieParser = require("cookie-parser");
const authrouter = require("./routing/auth");
const profilerouter = require("./routing/profile");
const requestsrouter = require("./routing/requests");
const userrouter = require("./routing/user");

const app = express();
app.use(express.json());   // using a middleware for converting the incoming data which is in json to a javascriot object , exprexx.json()[middleware]
app.use(cookieParser());

app.use('/',authrouter);
app.use('/',profilerouter);
app.use('/',requestsrouter);
app.use('/',userrouter);



//always start the server only after the application is connected to DB..
database().then(()=> 
{
    console.log("connected to DB");
    app.listen(7777,()=>{
        console.log("server is successfully listening on port 7777");
    });
}).catch((err)=>
{
    console.error("cant connect to DB..!");
});
