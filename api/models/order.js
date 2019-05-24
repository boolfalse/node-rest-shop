
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);

module.exports.model_name = 'order';
module.exports.model_docs = 'orders';
