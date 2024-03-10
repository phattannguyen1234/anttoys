const express = require('express');
const router = express.Router();
const Cart = require('./../models/cartModel');
const CartItem = require('./../models/cartItemModel');

let totalPrice;

router.get('/total/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const cart = await Cart.findOne({id: id});
        if(!cart){
            return res.status(404).json({message: `can not find specified cart`})
        }
        res.status(200).json(cart)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})

router.post('/', async(req, res) => {
    try {
        const cart = await Cart.create(req.body)
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// THEN ASSIGN THE TOTAL-PRICE TO CART INFO
router.put('/total/:id', async(req, res) => {
    try {
        // CALCULATE THE TOTAL PRICE OF ALL ITEMS IN CART
        await calTotal();

        const {id} = req.params;
        const cart = await Cart.findOneAndUpdate({id: id}, totalPrice, {new: true})
        if(!cart){
            return res.status(404).json({message: `There is no cart with ID: ${id}`})
        }
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



const calTotal = async () => {
    try {
        const result = await CartItem.aggregate([
            {
                $project: {
                    totalPerProduct: {
                        $multiply: ['$price', '$quantity']
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$totalPerProduct'
                    }
                }
            }
        ]);
        totalPrice = {
            totalPrice: String(result[0].total)
        }
        console.log('total: ', String(result[0].total))
        
        
    }catch(error){
        console.error('Error calculating: ', error)
    }
};

module.exports = router;