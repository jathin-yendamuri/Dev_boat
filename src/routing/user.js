
const express = require("express");
const User = require("../models/User");

const userrouter = express.Router();


//all data
userrouter.get("/user/feed",async (req,res)=>
    {
        try{
            const users = await User.find({}); // give alll the data (all documents in user collection)
            // const users = await User.findOne({Email:"ben23@gmail.com"});   // only give the oldest repeated document which matches the email.
            res.send(users);
            console.log("data retreved");
        }
        catch(err)
        {
            res.status(400).send("message");
            console.log("something went wrong");
        }
    
    });

module.exports = userrouter;