const express = require('express');
const router = express.Router();
const Product = require('./../models/productModel');
const CartItem = require('./../models/cartItemModel');

let data;

router.get('/', async(req, res) => {
    try{
        const cartItems = await CartItem.find({});
        res.status(200).json(cartItems)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/:id/:quantity', async(req, res) => {
    try{
        // GET PRODUCT WANT TO ADD TO CART
        const {id, quantity} = req.params;
        const product = await Product.findOne({id: id});
        if(!product){
            return res.status(404).json({message: `can not find product with ID: ${id}`})
        }
        data = {
            productId: product.id,
            quantity: Number(quantity),
            price: Number(product.price)
        }

        // ADD TO CART
        const cartItem = await CartItem.create(data)
        res.status(200).json(cartItem);
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete()

module.exports = router;