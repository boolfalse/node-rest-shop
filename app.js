
// INITIALIZATIONS
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const loggingMiddleware = require('./api/middlewares/logging');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PASSWORD + '@cluster0-mzcsh.mongodb.net/test?retryWrites=true', {
    // useMongoClient: true // under the hood it'll use Mongo DB client for connecting with MongoDB
    useNewUrlParser: true // DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect
});
// mongoose.Promise = global.Promise; // For disabling terminal 'deprecated' warnings. NodeJS Promise implementation instead of the mongoose model

// MIDDLEWARES
app.use(helmet()); // Help secure Express apps with various HTTP headers

//ss We can set environment variables via command line like this:
// $ export NODE_ENV=production // Mac
// $ set NODE_ENV=production // Windows
// by default NODE_ENV is 'development'
// const nodeEnv = process.env.NODE_ENV;
const nodeEnv = app.get('env'); // this is another way to get environment NODE_ENV variable
if(nodeEnv === 'development'){
    app.use(morgan('dev')); // 'tiny' // logs in terminal request description
}

// app.use(express.static('uploads')) // This is a simple way. Actually static content are served from the root of the site
app.use('/images', express.static('uploads')); // with this we will have statically/publicly available 'uploads' folder (example: http://localhost:3000/images/1558704580_Chrysanthemum.jpg)

// This is an express built-in middleware, that parses incoming requests with url encoded payloads
// In another words, it's parses requests something like this "key1=value1&key2=value2" as body of request
// app.use(express.urlencoded({ extended: true })); // this is a default way for express
app.use(bodyParser.urlencoded({
    extended: false // true allows to parse extended body with rich data in it
    // with 'true' we can pass arrays and complex objects using this middleware urlencoded format
}));

// This parses the body of a request to the JSON Object
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

app.use(loggingMiddleware);

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

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
