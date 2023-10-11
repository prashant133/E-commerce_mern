const express = require('express')
const { createProductController, getProductController } = require('../controllers/productController')
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')
const formidable = require('express-formidable')

const router = express.Router()

// routes
// create product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

// get-product
router.get('/get-product',getProductController)

module.exports = router