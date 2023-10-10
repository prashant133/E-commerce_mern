const express = require("express")
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware")
const { createCategoryController, updateCategoryController } = require("../controllers/categoryController")


const router = express.Router()

// routes
// crate routes
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update routes
router.put('/update-category/:id', requireSignIn , isAdmin, updateCategoryController)


// delete routes

module.exports = router
