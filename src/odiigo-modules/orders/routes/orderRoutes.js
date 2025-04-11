const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

// Get all orders
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Create a new order
router.post('/', createOrder);

// Update an order by ID
router.put('/:id', updateOrder);

// Delete an order by ID
router.delete('/:id', deleteOrder);

module.exports = router;
