const adminauth = (req,res,next)=>
{
    const token = "sample";
    const isauthorized = token === "sample";
    if(isauthorized)
        next();
    else
        res.status(401).send("Unauthorized access..!");
}

const userauth = (req,res,next)=>
{
    const token = "user123";
    const authorized = token === "user123";
    if(!authorized)
        res.status(401).send("Unauthorized user...!");
    else
        next();
}

module.exports = {adminauth,userauth};