
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Handling GET requests to /orders"
    });
});

router.post('/', (req, res, next) => {
    const createdOrder = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        success: true,
        message: "Order was successfully created!",
        data: createdOrder
    });
});

router.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;

    res.status(200).json({
        success: true,
        message: "You discovered the order with id: " + orderId
    });
});

// EXPORTING
module.exports = router;
