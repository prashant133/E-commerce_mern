const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products : [
       {
        type : mongoose.ObjectId,
        ref : "user"
       }
    ],
    payment : {},
    buyer : {
        type : mongoose.ObjectId,
        ref: 'User',
    },
    status : {
        type : String,
        default : "Not Process",
        enum : ["Not Process", "Processing", "shipped", "deliverd", "cancel"]
    }

},
{timestamps : true}
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order