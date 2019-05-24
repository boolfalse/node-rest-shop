
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // this will make more optimized DB, but it'll not validate email existing, so we must have email existence checking logic
        //ss https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript#answer-1373724
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);

module.exports.model_name = 'user';
module.exports.model_docs = 'users';
