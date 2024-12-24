
const server = require("express");
const {database} = require("./config/database");
const User = require("./models/User");

const app = server();

// saving the data into DB using post method..

app.post("/user/signup",async (req,res)=>
{
    //creating instance of a user model..
    const Userdoc = new User(
        {
            firstName:"jathin",
            lastName:"Yendamuri",
            Email:"jathin@gmail.com",
            Password:"Database@123",
            Age:21
        }
    );

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
