const mongoose = require('mongoose');

const cartSchema = mongoose.Schema (
    {
        id: {
            type: String,
            required: [true, "Please input id"]
        },
        totalPrice: {
            type: String,
            required: true,
            default: 0
        }
    }
)

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;