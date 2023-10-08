const express = require('express')
const {registerController, loginController, testController, forgotPasswordController} = require('../controllers/authController')
const {isAdmin, requireSignIn}= require('../middleware/authMiddleware')

// router-object

const router = express.Router()

// routing
router.post('/register',registerController)
router.post('/login',loginController)

router.get("/test",requireSignIn,isAdmin,testController)

// forgot password
router.post("/forgot-password", forgotPasswordController)

// protectd route auth
router.get('/user-auth', requireSignIn, (req,res) =>{
    res.status(200).send({ok : true})
})


module.exports = router;