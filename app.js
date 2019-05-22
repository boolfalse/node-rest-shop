
// INITIALIZATIONS
const express = require('express');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/products', ordersRoutes);

// Error Handling for 404 Not Founds
app.use((req, res, next) => {
    const error = new Error("Not found!");
    error.status = 404;
    next(error);
});

// Error Handling for any other cases from whole application
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message
    });
});


// EXPORTING
module.exports = app;
