const server = require("express");

const app = server();


app.post("/hello",(req,res)=>
{
    console.log("Saved data to the database."); //logic to save data in db.
    res.send("data saved to DB (iam a post call)");

})
app.get("/hello",(req,res)=>
    {
        res.send("hello hello ..! , home.(get)");
    })

app.delete("/hello",(req,res)=>
{
    // code to delete data
    res.send("data deleted..");
})
    
app.use("/hello",(req,res)=>  // if we write this code at starting always the res will be "hello from server.." because it does not allow the remaining methods to exexute as the order matters here..
    {
        res.send("hello from the server..");
    });


app.listen(3000,()=>{
    console.log("server is running at post 3000");
});
