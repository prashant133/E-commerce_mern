const express = require('express')
const { createProductController } = require('../controllers/productController')
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')
const formidable = require('express-formidable')

const router = express.Router()

// routes
// create product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)



module.exports = router