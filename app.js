
// INITIALIZATIONS
const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/products', ordersRoutes);


// EXPORTING
module.exports = app;
