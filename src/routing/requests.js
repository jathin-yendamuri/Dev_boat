const express = require("express");
const {userauth} = require("../middleware/authorization");
const connectionModel = require("../models/Connections");
const User = require("../models/User");

const requestsrouter = express.Router();

requestsrouter.post("/request/send/:status/:toId",userauth,async (req,res)=>
    {
        try
       { 
        //checking if the status is sent correct or not.
        const validStatus = ["like","dislike"];
        if(!validStatus.includes(req.params.status))
        {
            throw new Error("Invalid Status sent..!");
        }

        //ckecking if the user sending the request to self..
        if(req.userdata._id.equals(req.params.toId)){
            return res.status(400).json({message:"can not send request to self..!"});
        }

         //checking if the user exist in our DB or not
         const userExist = await User.findById(req.params.toId);
         console.log(userExist)
         if(userExist===null)
         {
           return res.status(400).json({message:"User Does Not Exist..!"});
         }
         //ckecking if there is already a connection request / connection between these tow (current user sent a request OR from_user sent a request).
         const connectionExist = await connectionModel.findOne(
           {   
                $or:[
                {
                    fromId:req.userdata._id,
                    toId:req.params.toId
                },
                {
                    fromId:req.params.toId,
                    toId:req.userdata._id
                }
                ]
            });
         if(connectionExist)
         {
            return res.status(400).json({message:"Connection request already exist."});
         }
       const fromId=req.userdata._id;
       const toId=req.params.toId;
       const status = req.params.status;

       const connectiondoc = new connectionModel({
        fromId,
        toId,
        status
       });

       await connectiondoc.save();
       return res.send(`${req.userdata.firstName} ${status} ${userExist.firstName}`);
    }
    catch(err)
    {
        res.status(400).json({message:`Error : ${err}`});
    }

    })

module.exports = requestsrouter;
