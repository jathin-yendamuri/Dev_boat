
const JWT = require("jsonwebtoken");
const User = require("../models/User");


const userauth = async(req,res,next)=>
{                                       
   try
   {
    const token = req.cookies?.token;
   if(!token)
   {
    throw new Error("Token not valid..!!!!");
   }
   const decodeddata = JWT.verify(token,"SecretKey@123");
   const {_id} = decodeddata;
   const userdata = await User.findById(_id);
   req.userdata = userdata;
   next();
}
   catch(err)
   {
    res.status(400).send("Error : "+err.message);
   }   
}

module.exports = {userauth};