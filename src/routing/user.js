
const express = require("express");
const User = require("../models/User");
const { userauth } = require("../middleware/authorization");
const connectionModel = require("../models/Connections");

const userrouter = express.Router();



//api for pending requests. /user/requests/received  (use ref)
userrouter.get("/user/requests/recived",userauth,async (req,res)=>
{
try
{   
    const pendingrequests = await connectionModel.find({ toId:req.userdata._id,status:"like"}).populate("fromId", "firstName lastName age gender skills about");;
    res.json({message:"Connection List",data:pendingrequests})
}catch(err)
{
    res.status(400).send("Error:"+err);
}
});

//api for fetching the ppl connected to me  


userrouter.post("/user/connections",userauth, async(req,res)=>
{
    try
    {const connections = await connectionModel.find({
        $or:[
            {toId:req.userdata._id,status:"accepted"},
            {fromId:req.userdata._id,status:"accepted"}
        ]
    }).populate("fromId" , "firstName lastName age gender skills about")
      .populate("toId", "firstName lastName age gender skills about") ;

      const connectedPplData =  connections.map((row)=>
      {
         if(req.userdata._id.equals(row.fromId._id))
         {
            return row.toId;
         }else{
            return row.fromId;
         }
      })
      res.send(connectedPplData);
    }
    catch(err)
    {
        res.status(400).send("Error:"+err);   
    }

});


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