const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const fs = require('fs')

const createProductController = async(req, res)=> {

    try {
        // using express-formidable for form data i.e photo
        const {name, slug, description, price , category, quantity, shipping} = req.fields;
        const {photo}= req.files

        // validate

        if(!name  || !description || !price || !category || !quantity  ) {
            return res.status(500).send({
                success :false,
                error : "Provide the credintials"

            })
        }
        if (photo && photo.size > 1000000) {
            return res.status(500).send({
                error: "must be less than 1MB"
            });
        }

        const products = new Product({...req.fields,slug : slugify(name)});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success : true,
            message : "Product create successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in creating the product",
            error
        })
    }

}

// get all product
const getProductController = async(req, res)=>{
    try {

        const products = await Product.find({}).populate('category').select("-photo").limit(12).sort({createdAt : -1})
        res.status(200).send({
            success : true,
            totalProduct : products.length,
            message : "All Products",
            products,
            
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in getting product",
            error : error.message
        })
    }

}

// get single product
const getSingleProductController = async(req ,res)=> {

    try {
        const product = await Product.findOne({slug : req.params.slug}).select("-photo").populate('category')
        res.status(200).send({
            success : true,
            message : "Single Product fetched",
            product
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message :"Error in getting single product",
            error : error.message
        })
    }

}

// getting product photo
const productPhotoController = async(req, res)=> {

    try {

        const product = await Product.findById(req.params.pid).select("photo")

        if (product && product.photo && product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        } else {
            
            res.status(404).send("Product photo not found");
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in getting product photo",
            error : error.message
        })
    }

}

// delete the product

const deleteProductController = async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success : true,
            message : "product deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in deleting the Product",
            error : message.error,
        })
    }
}

const updateProductController = async(req, res)=> {
    try {
        // using express-formidable for form data i.e photo
        const {name, slug, description, price , category, quantity, shipping} = req.fields;
        const {photo}= req.files

        // validate

        if(!name  || !description || !price || !category || !quantity  ) {
            return res.status(500).send({
                success :false,
                error : "Provide the credintials"

            })
        }
        if (photo && photo.size > 1000000) {
            return res.status(500).send({
                error: "must be less than 1MB"
            });
        }

        const products = await Product.findByIdAndUpdate(req.params.pid,{...req.fields,slug : slugify(name)},{new : true});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success : true,
            message : "Product create successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "Error in creating the product",
            error
        })
    }
}


module.exports = {createProductController,getProductController,getSingleProductController,productPhotoController,deleteProductController,updateProductController}