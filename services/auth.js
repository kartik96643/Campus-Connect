const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.JWT_SECRET

const generateToken = (user) =>{

    const payload = {
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    }
    const token = jwt.sign(payload, secret)
    return token;
}

const validateToken = (token)=>{
    if(token){
    const payload = jwt.verify(token,secret);
    if(!payload) throw new Error("Invalid Token")
    return payload
    }else{
        throw new Error("No token available")
    }
}

module.exports = {generateToken, validateToken}