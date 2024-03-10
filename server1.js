const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');
const CartDetail = require('./models/cartItemModel');

var app = Express();
app.use(cors());
app.use(Express.json());
// dotenv.config();

// const PORT = process.env.PORT || 7000;
// const MONGOURL = process.env.MONGO_URL;

// mongoose.connect(MONGOURL).then(() => {
//     console.log("db connected");
//     app.listen(PORT, () => {

//     })
// })

var CONNECTION_STRING = 'mongodb+srv://phatnginlight2406:admin123456@phatdb123.fjvihyy.mongodb.net/?retryWrites=true&w=majority&appName=phatdb123';


var DATABASENAME = "ANTtoys";
var database;

// app.get('/products', async(req, res) => {
//     try {
//         const products = await Product.find({})
//         res.status(200).json(products)
//     } catch (error) {
//         res.status(200).json({message: error.message})
//     }
// })

let data;
let totalPrice;

app.post('/addProduct', async(req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
    }catch(error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/viewProduct', async(req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json(products)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/viewCartItem', async(req, res) => {
    try{
        const cartItems = await CartDetail.find({});
        res.status(200).json(cartItems)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/findProduct/:id', async(req, res) => {
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

app.get('/findProduct/:id/:quantity', async(req, res) => {
    try{
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

        res.status(200).json(product)
    } catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/viewTotal', async (req, res) => {
    try{
        const cart = await Cart.findOne({id: 1});
        if(!cart){
            return res.status(404).json({message: `can not find specified cart`})
        }
        res.status(200).json(cart)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})

app.put('/updateProduct/:id', async(req, res) => {
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

app.post('/addToCart', async(req, res) => {
    try{
        const cartItem = await CartDetail.create(data)
        res.status(200).json(cartItem);
        await calTotal();
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

const calTotal = async () => {
    try {
        const result = await CartDetail.aggregate([
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

app.post('/createCart', async(req, res) => {
    try {
        const cart = await Cart.create(req.body)
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.put('/setCart/:id', async(req, res) => {
    try {
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

app.delete('/deleteProduct/:id', async(req, res) => {
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

mongoose.connect(CONNECTION_STRING).then(() => {
    console.log('db is connected')
    app.listen(3001, () => {
            console.log(`Connect to 3000`)
    });
}).catch((error) => {
    console.log(error)
})

// app.listen(3000, () => {
//     MongoClient.connect(CONNECTION_STRING, (error, client) => {
//         database = client.db(DATABASENAME);
//         console.log(`Connect to 3000`)
//     });
// });

// app.get('/api/ANTtoys/GetProducts', (request, response) => {
//     database.collection("product").find({}).toArray((error, result) => {
//         response.send(result);
//     })
// })

// app.get('/api/ANTtoys/GetProducts', (request, response) => {
//     database = mongoose.model('product')
// })

// mongoose.connect(CONNECTION_STRING, (error, client) => {
//     database = client.db(DATABASENAME)
// }).then(() => {
//     console.log('db is connected')
//     app.listen(3000, () => {
//             console.log(`Connect to 3000`)
//     });
// }).catch((error) => {
//     console.log(error)
// })