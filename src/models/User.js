const mongoose = require("mongoose");
const validator = require("validator");

const userschema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            minLength:3,
            maxLength:16,
            required:true
        },
        lastName:{
            type:String,
            minLength:3,
            maxLength:16
        },
        Email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase :true,
            validate(value)
            {
                if(!validator.isEmail(value))
                    throw new Error("Email Not Valid..");
            }
        },
        password:{
            type:String,
            required:true,
            validate(value)
            {
                if(!validator.isStrongPassword(value))
                    throw new Error("Set a Strong Password..");
                }
        },
        gender:{
            type:String,
            validate(value){
                const required = ["male","female","others"];
                if(!required.includes(value))
                    throw new Error("Gender Not Valid..!"); 
            }
        },
        age:{
            type:Number,
            min:18,
        },
        skills:
        {
            type:[String],
            validate(value)
            {
                if(value.length>10)
                    throw new Error("write your top 10 skills only..")
            }
        },
        about:{
            type:String,
            default:"Hey..,Iam a software developer..",
            minLength:10,
            maxLength:50
        },
        photourl:{
            type:String,
            validate(value)
            {
            if(!validator.isURL(value))
                throw new Error("Enter a valid photo URL..");

        }
    }
});

const Usermodel = mongoose.model("User",userschema);

module.exports = Usermodel;

//or
//module.exports = mongoose.model()