const mongoose = require('mongoose');

const cartSchema = mongoose.Schema (
    {
        cartId: {
            type: String,
            required: true,
            default: 1
        },
        productId: {
            type: String,
            required: [true, "Please input product id"],
            default: 0
        },
        quantity: {
            type: Number,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            },
            default: 1
        },
        price: {
            type: Number,
            required: true,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            },
            default: 0
        }
    }
)

const CartItem = mongoose.model('cartdetail', cartSchema);

module.exports = CartItem;