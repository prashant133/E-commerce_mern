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


module.exports = {createProductController}