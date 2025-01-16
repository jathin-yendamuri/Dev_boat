const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const connectionschema = new mongoose.Schema(
    {
        fromId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        toId:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        status:
        {
            type:String,
            required:true,
            enum :{
                values:["like","dislike","accepted","rejected"],
                message:`{VALUE} is not a type(Status)`
            }
        }
    },
    {timestamps:true}
);

connectionschema.index({Email:1});   // specifying index for fast retrival of the data .

const connectionModel = new mongoose.model("connectionModel",connectionschema);

module.exports = connectionModel;