const mongoose = require("mongoose");

//connection to database using mongoose 
const database = async ()=>
{
    //as all the mongoose operations return a promise we handle them uning await and async . connecting using connection string.
    await mongoose.connect("mongodb+srv://jathinyendamuri:ISwBbS5sBICPsVSO@tinder.gxjvi.mongodb.net/devBoat");
}

module.exports={database};