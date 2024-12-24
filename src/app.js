
const express = require("express");
const {database} = require("./config/database");
const User = require("./models/User");

const app = express();
app.use("/",express.json());   // using a middleware for converting the incoming data which is in json to a javascriot object , exprexx.json()[middleware]

// creating an api's using get and retreving the data from the data base.

app.get("/user/data",async (req,res)=>
{
    try{
        const udata = await User.find({Email:req.body.email});
        if(udata.length!=0)
        {
        console.log("user found");
        res.send(udata);
        }
        else{
            res.status(400).send("user does not found");
            console.log("user does not found")
        }
    }
    catch(err)
    {
        res.status(400).send(err.message);
        console.log("Something went wrong");
    }
})

//all data
app.get("/user/feed",async (req,res)=>
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






// saving the data into DB using post by making the API dynamic , (req.body)->gives the data i.e coming from the client after converting into js object.
app.post("/user/signup",async (req,res)=>
{
    //creating instance of a user model..
    const Userdoc = new User(req.body);
    console.log(req.body);

    //Handling the error if occuers at the time of saving the data to DB (due to internet connection or etc,...)
    //saving the data into db..
        await Userdoc.save().then(()=>
        {
            res.send("Data added to DB");
        }).catch((err)=>
    {
        console.error("data not saved..!",err.message);
    })
});

//saving the data dynamically into DB ..
app.post("/user/signup/:firstName/:lastName/:Email/:Password/:Age",async (req,res)=>
    {
        const data = req.params;
        const Userdoc = new User(
           data
        );
    
        //Handling the error if occuers at the time of saving the data to DB (due to internet connection or etc,...)
        //saving the data into db..
        try{await Userdoc.save();
            res.send("Data added to DB");}
            catch(err)
            {
                console.error("data not saved..!",err.message);
            }
    });

//always start the server only after the application is connected to DB..
database().then(()=> 
{
    console.log("connected to DB");
    app.listen(7777,()=>{
        console.log("server is successfully listening on port 7777");
    });
}).catch((err)=>
{
    console.error("cant connect to DB..!");
});
