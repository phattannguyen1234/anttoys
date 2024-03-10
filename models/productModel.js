const mongoose = require('mongoose');

const productSchema = mongoose.Schema (
    {
        id: {
            type: String,
            required: [true, "Please input id"]
        },
        name: {
            type: String,
            required: true,
            default: 0
        },
        quantity: {
            type: String,
            required: true,
            default: 0
        },
        price: {
            type: String,
            required: true,
            default: 0
        }
    }
)

const Product = mongoose.model('product', productSchema);

module.exports = Product;