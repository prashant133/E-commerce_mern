const JWT = require('jsonwebtoken')
const User = require('../models/userModel')
// protect routes token base

const requireSignIn = async(req , res , next)=>{
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET,
        );
        req.user =decode;
        next()
    } catch (error) {
        console.log(error)
    }
}

// admin access

const isAdmin = async(req, res , next)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user.role !==1){
            return res.status(401).send({
                success : false,
                message : "UnAuthorized Access"
            })
        }else {
            next()
        }
        
    } catch (error) {
        console.log(error)
        res.send({
            success : false,
            error, 
            message : "Error in admin middleware"
        })
        
    }
}
module.exports = {requireSignIn, isAdmin}

