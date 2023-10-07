const express = require('express')
const {registerController, loginController, testController} = require('../controllers/authController')
const {isAdmin, requireSignIn}= require('../middleware/authMiddleware')

// router-object

const router = express.Router()

// routing
router.post('/register',registerController)
router.post('/login',loginController)

router.get("/test",requireSignIn,isAdmin,testController)


// protectd route auth
router.get('/user-auth', requireSignIn, (req,res) =>{
    res.status(200).send({ok : true})
})


module.exports = router;