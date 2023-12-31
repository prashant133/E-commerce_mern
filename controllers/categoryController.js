const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel")


// create category
const createCategoryController = async(req, res , next)=> {
    try {
        const {name} = req.body;

        //validate 
        if(!name) {
            return res.status(500).send({message : "Name is required"})
        }

        // check for the existing category
        const existingCategory = await Category.findOne({name})

        if(existingCategory){
            return res.status(200).send({
                success : true,
                message : "Category Alreay Exists"

            })

        }

        const category = await new Category({name , slug:slugify(name)}).save()
        res.status(201).send({
            success : true,
            message : "Category created successfully",
            category
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            error,
            message : "Error in Category"
        })
    }

}

// update Category
const updateCategoryController = async(req ,res)=>{
    try {
        const {name}= req.body;
        const {id}= req.params;

        // check for the category using the id

        const category = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new : true});

        res.status(200).send({
            success : true,
            message : "category updated successfully",
            category,
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false, 
            error,
            message : " Error in update catefory"
        })
    }
}

// get all category
const categoryController = async(req ,res)=> {
    try {
        const category = await Category.find({});
        res.status(200).send({
            success : true,
            message : "All categories",
            category,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in get all Category",
            error
        })
    }
}

// get single category
const singleCategoryController = async(req, res)=> {
    try {
        
        
        const category = await Category.findOne({slug : req.params.slug})
        res.status(200).send({
            success : true,
            message : "getting single categeory",
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in getting single category",
            error
        })
    }
}

// delete category Controller

const deleteCategoryController = async(req, res)=>{
    try {

        const{name} = req.body;
        const{id} = req.params;

        const category = await Category.findByIdAndDelete(id);
        res.status(200).send({
            success : true,
            message : "Category deleted successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in deleting the category",
            error
            
        })
    }
}

module.exports = {createCategoryController,updateCategoryController, categoryController,singleCategoryController,deleteCategoryController}