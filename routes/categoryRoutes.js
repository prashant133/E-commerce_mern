const express = require("express")
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware")
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require("../controllers/categoryController")


const router = express.Router()

// routes
// crate routes
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update routes
router.put('/update-category/:id', requireSignIn , isAdmin, updateCategoryController)

// get all category
router.get('/get-category', categoryController)

// get single category
router.get('/single-category/:slug',singleCategoryController)


// delete routes
router.delete('/delete-category/:id',requireSignIn, isAdmin,deleteCategoryController)

module.exports = router
