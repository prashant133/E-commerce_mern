const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel")

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


module.exports = {createCategoryController}