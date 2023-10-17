const express = require('express')
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController } = require('../controllers/productController')
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware')
const formidable = require('express-formidable')

const router = express.Router()

// routes
// create product\
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// get-product
router.get('/get-product', getProductController)

// get single product
router.get('/get-product/:slug', getSingleProductController)

// getting product photo
router.get('/product-photo/:pid', productPhotoController)

// delete the product
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController)

//update the product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

module.exports = router