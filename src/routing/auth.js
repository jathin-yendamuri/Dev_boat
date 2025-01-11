const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {validateSignUp} = require("../utils/validation")


const authrouter = express.Router();


// saving the data into DB using post by making the API dynamic , (req.body)->gives the data i.e coming from the client after converting into js object.
authrouter.post("/user/signup",async (req,res)=>
    {
        
        console.log(req.body);
    
        //Handling the error if occuers at the time of saving the data to DB (due to internet connection or etc,...)
        //saving the data into db..
        try{
            validateSignUp(req);
            const encrypt = await bcrypt.hash(req.body?.password,10);
            console.log(encrypt);
            req.body.password=encrypt;
            //creating instance of a user model..
        const Userdoc = new User(req.body);
            await Userdoc.save()
                res.send("Data added to DB");
            }catch(err)
        {
            res.status(400).send("data not saved.. : " + err.message);
            console.error("data not saved.. : " + err.message);
        }
    });
    
    //Logging in the user 
authrouter.post("/user/login",async (req,res)=>
    {
        const profile = await User.findOne({Email:req.body.email})
        console.log(profile);
        try{
            if(profile!=null)
            {
                // const bool = await bcrypt.compare(req.body.password , profile.password);
                const bool = await profile.passwordValidation(req);
                if(bool){
                    // const jwttoken =  JWT.sign({_id:profile._id},"SecretKey@123",{expiresIn:'1h'});
                    const jwttoken = await profile.getJWT();
                    res.cookie("token",jwttoken,{expires: new Date(Date.now()+1*3200000)});
                    res.send("Login Success..! ");
                }else{
                    throw new Error("Invalid cred..");
                }
    
            }else{
                throw new Error("invalid cred..");
            }
        }catch(err)
        {
            res.status(400).send("ERROR : "+err.message);
            console.log("ERROR : "+err.message);
        }
    });
 

authrouter.post("/user/logout",(req,res)=>
{
    res.cookie("token",null,{expires : new Date(Date.now())});
    res.send("logout successful..");
})

// //saving the data dynamically into DB ..
// app.post("/user/signup/:firstName/:lastName/:Email/:Password/:Age",async (req,res)=>
//     {
//         const data = req.params;
//         const Userdoc = new User(
//            data
//         );
    
//         //Handling the error if occuers at the time of saving the data to DB (due to internet connection or etc,...)
//         //saving the data into db..
//         try{
//             await Userdoc.save();
//             res.send("Data added to DB");}
//             catch(err)
//             {
//                 console.error("data not saved..!",err.message);
//             }
//     });

module.exports = authrouter;