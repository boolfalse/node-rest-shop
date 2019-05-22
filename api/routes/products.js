
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Handling GET requests to /products"
    });
});

router.post('/', (req, res, next) => {
    const createdProduct = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        success: true,
        message: "Product was successfully created!",
        data: createdProduct
    });
});

router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId;

    res.status(200).json({
        success: true,
        message: "You discovered the product with id: " + productId
    });
});

// EXPORTING
module.exports = router;
