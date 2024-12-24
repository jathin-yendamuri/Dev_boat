const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
    {
        firstName:{type:String},
        lastName:{type:String},
        Email:{type:String},
        Password:{type:String},
        Age:{type:Number}
    }
);

const Usermodel = mongoose.model("User",userschema);

module.exports = Usermodel;

//or
//module.exports = mongoose.model()