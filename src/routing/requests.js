const express = require("express");
const {userauth} = require("../middleware/authorization");

const requestsrouter = express.Router();

requestsrouter.post("/sendingconnectionrequest",userauth,(req,res)=>
    {
        res.send(req.userdata);
    })

module.exports = requestsrouter;