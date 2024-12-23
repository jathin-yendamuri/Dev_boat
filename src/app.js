
const server = require("express");

const app = server();

const {adminauth,userauth} = require("./middleware/authorization.js");

app.use("/admin",adminauth);

// here we no need to check the auth fro user because its login .
app.post("/user/login",(req,res)=>           
{
    res.send("logged in..");                            
});
//here we user need to be authorized
app.get("/user/details",userauth,(req,res)=>          
{
    res.send("user details..!");
})



app.get("/admin/getalldetails",(req,res,next)=>{

    //auth code..
    // const token = "sample";
    // const isauthorized = token === "sample";
    // if(!isauthorized)
    //     res.status(401).send("unauthorized access..!");
    // else
    //     //fetch data from DB ..
        res.send({Id:9,name:"jathin",Age:21,e_mail:"jathinyendamuri@gmail.com"});
});


app.get("/admin/deleteuser",(req,res)=>
{
    //auth code..
    //delete user from DB..
    res.send("user deleted");
});


app.get("/adduser",(req,res)=>
{
    //auth code..
    //code for adding user in DB..
    res.send("user added");
});


app.listen(7777,()=>{
    console.log("server is running at use 7777");
});
