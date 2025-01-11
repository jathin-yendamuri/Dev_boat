const mongoose = require("mongoose");

const connectionschema = new mongoose.Schema(
    {
        fromId:{
            type:mongoose.Schema.ObjectId,
            required:true
        },
        toId:{
            type:mongoose.Schema.ObjectId,
            required:true
        },
        status:
        {
            type:String,
            required:true,
            enum :{
                values:["like","dislike","accepted","ignored"],
                message:`{VALUE} is not a type(Status)`
            }
        }
    },
    {timestamps:true}
);

const connectionModel = new mongoose.model("connectionModel",connectionschema);

module.exports = connectionModel;