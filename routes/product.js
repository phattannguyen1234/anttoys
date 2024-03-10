const express = require('express');
const router = express.Router();
const Product = require('./../models/productModel');



router.post('/', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
    }catch(error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/', async(req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findOne({id: id});
        if(!product){
            return res.status(404).json({message: `can not find product with ID: ${id}`})
        }
        res.status(200).json(product)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

router.put('/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findOneAndUpdate({id: id}, req.body)
        if(!product){
            return res.status(404).json({message: `There is no product with ID: ${id}`})
        }
        res.status(200).json(product)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

router.delete('/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const product = await Product.findOneAndDelete({id: id})
        if(!product){
            return res.status(404).json({message: `There is no product with ID: ${id}`})
        }
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;