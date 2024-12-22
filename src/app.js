const server = require("express");

const app = server();

app.use("/home",(req,res)=>
{
    res.send("hello from the server..");
});

app.listen(3000,()=>{
    console.log("server is running at post 3000");
});