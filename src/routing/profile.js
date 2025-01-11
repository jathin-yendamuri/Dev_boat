const express = require("express");
const User = require("../models/User");
const validator = require("validator");
const {userauth} = require("../middleware/authorization");
const bcrypt = require("bcrypt");
const {updatevalidation} = require("../utils/validation");

const profilerouter = express.Router();


profilerouter.get("/user/profile",userauth,async (req,res)=>
    {
        try{
            const {userdata} = req;
            res.send(userdata);
            }
        catch(err)
        {
            res.status(400).send(err.message);
            console.log("Something went wrong");
        }
    });


//UPDATING THE DATA USING PATCH METHOD..

profilerouter.patch("/user/update",userauth,async (req,res)=>
    {
        const data = req.body;
        try{
            // await User.findOneAndUpdate({Email:req.body.Email},data,{returnDocument:"befor"});
            // const noaccess = ["Email","_id",];
            // Object.keys(data).forEach(async (k)=>
            // {               
            //         if(noaccess.includes(k))
            //             {
            //             throw new Error("no access to update email or id");
            //         }
            // })
            if(updatevalidation(req))
            {
                throw new Error("No access to change Email Or password");
            }
            if(Object.keys(data).includes("password"))
            {
                if(validator.isStrongPassword(data.password))   // validating password in api level eventhough we are having schema level password validation,  because after converting the password in the payload into hash ,the password my satisfy all the strong password conditions and no error is thrown when we are saving the updated password in DB even if the un-hashed password in the payload is not strong .
                    {
                    const encrypt = await bcrypt.hash(data?.password,10);
                    data.password=encrypt;
                }else{
                    throw new Error("Set a Strong Password..")
                }
            }
            //updating the req.userdata first.
            Object.keys(data).forEach((k)=>
            {
                req.userdata[k]=data[k];
            })
            // updating the user data present in DB.
            // const after = await User.findByIdAndUpdate(req.userdata._id,data,{returnDocument:"after",runValidators:true}); // returns the user data before deletion .
                             await req.userdata.save();
            res.send(req.userdata.firstName +" , Your data updated successfully");
        }catch(err){
            res.status(400).send(`Erroe :- ${err.message}`);
            console.log("Something Went Wrong..");
        }
        
    });


//delete using patch method :

profilerouter.patch("/user/delete",async (req,res)=>
    {
        try{
            // User.findByIdAndDelete(req.body.id);
            const Ddata = await User.findOneAndDelete({Email:req.body.Email});
            if(Ddata === null)
                res.status(401).send("User not Found..");
            else{
                res.send("user deleted from DB");
                console.log(Ddata);
            }
        }
        catch(err)
        {
            res.status(400).send(err.message);
            console.log("something went wrong");
        }
    });

module.exports=profilerouter;