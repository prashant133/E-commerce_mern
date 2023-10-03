const User = require('../models/userModel')
const hashPassword = require('../helpers/authHelper')

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

        res.status(201).send({
            success :true,
            message : "user created successfully",
            user
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : 'Error in Registration',
            
        })
    }

}


module.exports = {registerController}