
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const Product = require('../models/product');

// GET ALL ITEMS
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        // .exec()
        .then(docs => {
            console.log(docs);

            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            description: 'get_product',
                            type: 'GET',
                            url: 'http://localhost:' + port + '/products/' + doc._id,
                            body: {}
                        },
                    }
                })
            };

            // if(docs.length >= 0) {
                res.status(200).json({
                    success: true,
                    message: "Got products.",
                    data: response
                });
            // } else {
            //     res.status(403).json({
            //         success: true,
            //         message: "Have not any item there.",
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: err
            });
        });
});

// CREATE ITEM
router.post('/', (req, res, next) => {

    const createdProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    createdProduct.save()
        .then(result => {
            console.log(result);

            res.status(201).json({
                success: true,
                message: "Product was successfully created!",
                data: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        description: 'delete_product',
                        type: 'DELETE',
                        url: 'http://localhost:' + port + '/products/' + result._id,
                        body: {}
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: err
            });
        });
});

// GET ITEM BY ID
router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .select('name price _id')
        // .exec()
        .then(doc => {
            console.log(doc);

            if(doc) {
                // res.status(200).json(doc);
                res.status(200).json({
                    success: true,
                    message: "Found Data.",
                    data: doc,
                    request: {
                        description: 'update_product',
                        type: 'PATCH',
                        url: 'http://localhost:' + port + '/products/' + productId,
                        body: {
                            name: 'String',
                            price: 'Number'
                        }
                    }
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: "No valid entry found for provided ID!",
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: err
            });
        });
});

// DELETE ITEM
router.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.remove({
        _id: productId
    })
        // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully deleted.",
                data: result,
                request: {
                    description: 'create_product',
                    type: 'POST',
                    url: 'http://localhost:' + port + '/products',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: err
            });
        });
});

// UPDATE ITEM
router.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    const updateOps = {};

    for(let key in req.body){
        updateOps[key] = req.body[key];
    }

    Product.update({ _id: productId }, { $set: updateOps })
        // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully updated.",
                data: result,
                request: {
                    description: 'create_product',
                    type: 'POST',
                    url: 'http://localhost:' + port + '/products',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: err
            });
        });
});

// EXPORTING
module.exports = router;
