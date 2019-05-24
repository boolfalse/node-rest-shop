
const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/order');
const checkAuth = require('../middlewares/check-auth');

router.get('/', checkAuth, OrderController.get_orders);
router.get('/:itemId', checkAuth, OrderController.get_order);
router.post('/', checkAuth, OrderController.create_order);
router.delete('/:itemId', checkAuth, OrderController.delete_order);
router.patch('/:itemId', checkAuth, OrderController.update_order);

// EXPORTING
module.exports = router;
