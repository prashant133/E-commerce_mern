const express = require('express')
const {registerController, loginController} = require('../controllers/authController')

// router-object

const router = express.Router()

// routing
// register
router.post('/register',registerController)
router.post('/login',loginController)


module.exports = router;