const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const fs = require('fs');
const Category = require("../models/categoryModel");
const braintree = require('braintree');
const Order = require("../models/orderModel");
const dotenv = require('dotenv').config()


// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment : braintree.Environment.Sandbox,
    merchantId : process.env.BRAINTREE_MERCHANT_ID,
    publicKey : process.env.BRAINTREE_PUBLIC_KEY,
    privateKey : process.env.BRAINTREE_PRIVATE_KEY
})

const createProductController = async (req, res) => {

    try {
        // using express-formidable for form data i.e photo
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files

        // validate

        if (!name || !description || !price || !category || !quantity) {
            return res.status(500).send({
                success: false,
                error: "Provide the credintials"

            })
        }
        if (photo && photo.size > 1000000) {
            return res.status(500).send({
                error: "must be less than 1MB"
            });
        }

        const products = new Product({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success: true,
            message: "Product create successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in creating the product",
            error
        })
    }

}

// get all product
const getProductController = async (req, res) => {
    try {

        const products = await Product.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            totalProduct: products.length,
            message: "All Products",
            products,

        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting product",
            error: error.message
        })
    }

}

// get single product
const getSingleProductController = async (req, res) => {

    try {
        const product = await Product.findOne({ slug: req.params.slug }).select("-photo").populate('category')
        res.status(200).send({
            success: true,
            message: "Single Product fetched",
            product
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting single product",
            error: error.message
        })
    }

}

// getting product photo
const productPhotoController = async (req, res) => {

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
            success: false,
            message: "Error in getting product photo",
            error: error.message
        })
    }

}

// delete the product

const deleteProductController = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "product deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in deleting the Product",
            error: message.error,
        })
    }
}

const updateProductController = async (req, res) => {
    try {
        // using express-formidable for form data i.e photo
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files

        // validate

        if (!name || !description || !price || !category || !quantity) {
            return res.status(500).send({
                success: false,
                error: "Provide the credintials"

            })
        }
        if (photo && photo.size > 1000000) {
            return res.status(500).send({
                error: "must be less than 1MB"
            });
        }

        const products = await Product.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success: true,
            message: "Product create successfully",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in creating the product",
            error
        })
    }
}

// filters of product by price and category
const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await Product.find(args)
        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error

        })
    }

}
// product count controller
const productCountController = async (req, res) => {
    try {
        const total = await Product.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Error in product count"
        })
    }
}

// product list based on page
const productListController = async (req, res) => {
    try {
        const perPage = 3
        const page = req.params.page ? req.params.page : 1
        const products = await Product.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}
// search product controller
const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        })
            .select("-photo")
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}

// similar product
const relatedProductController = async (req, res) => {
    try {

        const { cid, pid } = req.params

        const products = await Product.find({
            category: cid,
            _id: {
                // exclude 
                $ne: pid
            }
        }).select("-photo").limit(3).populate("category")
        res.status(200).send({
            success : true,
            products,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error with api',
            error
        })
    }
}

// get product by category
const productCategoryController = async(req ,res)=> {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        const products = await Product.find({ category }).populate("category");
        res.status(200).send({
          success: true,
          category,
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          error,
          message: "Error While Getting products",
        });
      }
}

// payment gateway api
// token controller 
// this is the token to verifiy the account in paypal
const braintreeTokenController = async(req ,res , next)=>{
    try {
        gateway.clientToken.generate({}, function(err , response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })

        
    } catch (error) {
        console.log(error)
        
    }
}

// payment controller
const braintreePaymentController = async(req ,res , next)=>{
    try {
        // nonce is from api braintree
        const { nonce, cart } = req.body;
        // price in the cart
        let total = 0;
        cart.map((i) => {
          total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
          {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
              submitForSettlement: true,
            },
          },
          function (error, result) {
            if (result) {
              const order = new Order({
                products: cart,
                payment: result,
                buyer: req.user._id,
              }).save();
              res.json({ ok: true });
            } else {
              res.status(500).send(error);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }

}


module.exports = {
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
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController
}