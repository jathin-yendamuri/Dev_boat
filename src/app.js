
const express = require("express");
const {database} = require("./config/database");
const User = require("./models/User");
const {validateSignUp} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const { userauth } = require("./middleware/authorization");

const app = express();
app.use("/",express.json());   // using a middleware for converting the incoming data which is in json to a javascriot object , exprexx.json()[middleware]
app.use("/",cookieParser());
// creating an api's using get and retreving the data from the data base.

app.post("/sendingconnectionrequest",userauth,(req,res)=>
{
    res.send(req.userdata);
})

app.get("/user/profile",userauth,async (req,res)=>
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
app.post("/user/login",async (req,res)=>
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
        res.send("ERROR : "+err.message);
        console.log("ERROR : "+err.message);
    }
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


//UPDATING THE DATA USING PATCH METHOD..

app.patch("/user/update/:userid",async (req,res)=>
{
    const data = req.body;
    try{
        // await User.findOneAndUpdate({Email:req.body.Email},data,{returnDocument:"befor"});
        const noaccess = ["Email","id",];
        Object.keys(data).forEach(async (k)=>
        {
           
                if(noaccess.includes(k))
                    throw new Error("no access to update email or id");
        })
        if(Object.keys(data).includes("password"))
        {
            if(validator.isStrongPassword(data.password))   // validating password in api level eventhough we are having schema level password validation,  because after converting the password in the payload into hash ,the password my satisfy all the strong password conditions and no error is thrown when we are saving the updated password in DB even if the un-hashed password in the payload is not strong .
                {
                const encrypt = await bcrypt.hash(data?.password,10);
            }else{
                throw new Error("Set a Strong Password..")
            }
        }
        const before = await User.findByIdAndUpdate(req.params?.userid,data,{returnDocument:"before",runValidators:true}); // returns the user data before deletion .

        res.send("Data updated successfully");
        console.log(before);
    }catch(err){
        res.status(400).send(`user not found :- ${err.message}`);
        console.log("Something Went Wrong..");
    }
    
})

//delete using patch method :

app.patch("/user/delete",async (req,res)=>
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
})

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
