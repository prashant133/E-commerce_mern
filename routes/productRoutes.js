const express = require('express')
const { 
    createProductController, 
    getProductController,
    getSingleProductController, 
    productPhotoController,
    deleteProductController, 
    updateProductController, 
    productFilterController,
    productCountController, 
    productListController,
    searchProductController,
    relatedProductController
    } = require('../controllers/productController')

    
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

// filter product
router.post('/product-filters', productFilterController)

// product count
router.get('/product-count',productCountController)

// product per page
router.get('/product-list/:page' ,productListController)

// search
router.get('/search/:keyword', searchProductController)

// similar product
router.get('/related-product/:pid/:cid',relatedProductController)

module.exports = router