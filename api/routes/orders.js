
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Handling GET requests to /orders"
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Handling POST requests to /orders"
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
