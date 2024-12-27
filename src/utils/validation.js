const validator = require("validator");

const validateSignUp = (req)=>
{
    const {firstName,lastName,Email,password} = req.body;

    if(!validator.isEmail(Email))
        throw new Error("Invalid email..")
    else if(!validator.isStrongPassword(password))
        throw new Error("set Strong PAssword");
    else if(!firstName || !lastName || firstName.length<4 || firstName.length>20 || lastName.length<4 || lastName.length>20)
        throw new Error("Required Both First name and last name with min 4 and max 20 characters");
}

module.exports = {validateSignUp};