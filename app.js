
// INITIALIZATIONS
const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');

// RUNS
app.use('/products', productRoutes);


// EXPORTING
module.exports = app;
