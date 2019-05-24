
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const User = require('../models/user');
const model_name = User.model_name;
const model_docs = User.model_docs;

// REGISTER
router.post('/register', (req, res, next) => {

    // check if user already exists with entered email
    let email = req.body.email;

    User.find({ email: email })
        // .exec() // for getting back a promise
        .then(user => { // don't forget that user is a mongo document
            if (user.length > 0) {
                res.status(409).json({ // 409 - conflict OR 422 - unprocessable entity
                    success: false,
                    message: 'Already have a user with entered email!'
                });
            } else {
                bcrypt.hash(req.body.password, 10, function(err, hashed_password) {
                    if(err) {
                        console.log(err);
                        res.status(500).json({
                            success: false,
                            message: 'Don\'t have a password, we can\'t safely hash and store it!'
                        });
                    } else {
                        // we have a hashed password
                        // Store hash in your password DB.

                        const createdItem = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: email,
                            password: hashed_password
                        });

                        createdItem.save()
                            .then(result => {
                                console.log(result);

                                res.status(201).json({
                                    success: true,
                                    message: "Successfully registered!",
                                    data: {
                                        name: result.name,
                                        email: email, // result.email,
                                        _id: result._id,
                                        // request: {
                                        //     description: 'delete_' + model_name,
                                        //     type: 'DELETE',
                                        //     url: 'http://localhost:' + port + '/' + model_docs + '/' + result._id,
                                        //     body: {}
                                        // }
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
                    }
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

// EXPORTING
module.exports = router;
