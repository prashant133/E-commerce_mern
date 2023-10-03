const User = require('../models/userModel')
const hashPassword = require('../helpers/authHelper')
const JWT = require('jsonwebtoken')


// registration of the user
const registerController = async(req, res , next) => {
    try {
        const {name , email , password , phone , address} = req.body;

        // validation
        if(!name || !email || !password || !phone || !address){
            return res.send({error : "Credintial Required"})
        }

        // check the existing user
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.send({
                success : true,
                message : "User already register"
            })
        }

        // register user
        const hashedPassword = await hashPassword.hashedPassword(password);

        // save 
        const user = await new User({
            name,
            email,
            phone,
            address,
            password : hashedPassword
        }).save()

        return res.status(201).send({
            success :true,
            message : "user created successfully",
            user
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success : false,
            message : 'Error in Registration',
            
        })
    }

}


// LOGIN OF THE USER
const loginController = async (req, res , next) =>{

    try {
        const {email , password}= req.body;

        // validation
        if(!email || !password){
            return res.send({
                success : false,
                message : "Invalid email or password"
            })

        }
        // check user 
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).send({
                success : false,
                message : "Email not registered"
            })
        }
        // compare the password with hashed password
        const match = await hashPassword.comparePassword(password,user.password)
        if(!match){
            return res.status(404).send({
                success : false,
                message : "Invalid Password"
            })

        }

        // create a token if all set
        const token =  JWT.sign({_id : user._id,}, process.env.JWT_SECRET, {expiresIn : '7d'});

         return res.status(200).send({
            success : true,
            message : "login successfully",
            user : {
                name : user.name,
                email : user.email,
                phone : user.phone,
                address : user.address,


            },
            token,
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success : false,
            message : 'Error in Login',
            
        })
    }

}


module.exports = {registerController, loginController}