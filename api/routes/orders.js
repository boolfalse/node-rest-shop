
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const Order = require('../models/order');
const Product = require('../models/product');

const model_name = Order.model_name;
const model_docs = Order.model_docs;

// GET ALL ITEMS
router.get('/', (req, res, next) => {
    Order.find()
        .select('product_id quantity _id')
        .populate('product_id', 'name price image')
        // .exec()
        .then(docs => {
            console.log(docs);

            const response = {
                count: docs.length,
                items: docs.map(doc => {
                    return {
                        product_id: doc.product_id,
                        quantity: doc.quantity,
                        _id: doc._id,
                        request: {
                            description: 'get_' + model_name,
                            type: 'GET',
                            url: 'http://localhost:' + port + '/' + model_docs + '/' + doc._id,
                            body: {}
                        },
                    }
                })
            };

            // if(docs.length >= 0) {
            res.status(200).json({
                success: true,
                message: 'Got ' + model_docs,
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

    let product_id = req.body.product_id;
    Product.findById(product_id)
        .then(product => {
            if(product) {
                const createdItem = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    product_id: product_id, // product._id
                    quantity: req.body.quantity
                });

                return createdItem.save();
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found!'
                });
            }
        })
        .then(result => {
            console.log(result);

            res.status(201).json({
                success: true,
                message: "Item was successfully created!",
                data: {
                    product_id: product_id, // result.product_id,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        description: 'delete_' + model_name,
                        type: 'DELETE',
                        url: 'http://localhost:' + port + '/' + model_docs + '/' + result._id,
                        body: {}
                    }
                }
            });
        })
        .catch(err => {
            console.log(123);
            res.status(500).json({
                success: false,
                message: 'Product not found!'
            });
        });

});

// GET ITEM BY ID
router.get('/:itemId', (req, res, next) => {
    const itemId = req.params.itemId;
    Order.findById(itemId)
        .select('product_id quantity _id')
        .populate('product_id', 'name price image')
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
                        description: 'update_' + model_name,
                        type: 'PATCH',
                        url: 'http://localhost:' + port + '/' + model_docs + '/' + itemId,
                        body: {
                            product_id: 'String',
                            quantity: 'Number'
                        }
                    }
                });
            } else {
                return res.status(403).json({
                    success: false,
                    message: model_name + ' not found!',
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
router.delete('/:itemId', (req, res, next) => {
    const itemId = req.params.itemId;
    Order.remove({
        _id: itemId
    })
    // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully deleted.",
                data: result,
                request: {
                    description: 'create_' + model_name,
                    type: 'POST',
                    url: 'http://localhost:' + port + '/' + model_docs,
                    body: {
                        product_id: 'String',
                        quantity: 'Number'
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
router.patch('/:itemId', (req, res, next) => {
    const itemId = req.params.itemId;
    const updateOps = {};

    for(let key in req.body){
        updateOps[key] = req.body[key];
    }

    Order.update({ _id: itemId }, { $set: updateOps })
    // .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                message: "Item successfully updated.",
                data: result,
                request: {
                    description: 'create_' + model_name,
                    type: 'POST',
                    url: 'http://localhost:' + port + '/' + model_docs,
                    body: {
                        product_id: 'String',
                        quantity: 'Number'
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
