
// INITIALIZATIONS
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PASSWORD + '@cluster0-mzcsh.mongodb.net/test?retryWrites=true', {
    // useMongoClient: true // under the hood it'll use Mongo DB client for connecting with MongoDB
    useNewUrlParser: true // DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect
});
// mongoose.Promise = global.Promise; // For disabling terminal 'deprecated' warnings. NodeJS Promise implementation instead of the mongoose model

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false // true allows to parse extended body with rich data in it
}));
app.use(bodyParser.json());

// Disallowing CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

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
