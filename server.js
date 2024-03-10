const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require('mongoose');

const productRoute = require("./routes/product");
const cartItemRoute = require("./routes/cart_item");
const cartRoute = require("./routes/cart")

var router = express();
router.use(cors());
router.use(express.json());

var CONNECTION_STRING = 'mongodb+srv://phatnginlight2406:admin123456@phatdb123.fjvihyy.mongodb.net/?retryWrites=true&w=majority&appName=phatdb123';

router.use("/product", productRoute);
router.use("/cartItem", cartItemRoute);
router.use("/cart", cartRoute);

mongoose.connect(CONNECTION_STRING).then(() => {
    console.log('THE DATABASE IS CONNECTED')
    router.listen(3001, () => {
            console.log(`CONNECT AT PORT 3001`)
    });
}).catch((error) => {
    console.log(error)
})