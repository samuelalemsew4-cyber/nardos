const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder,
  getAllOrders 
} = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get User Orders
router.get('/', authMiddleware, getUserOrders);

// Get Single Order
router.get('/:id', authMiddleware, getOrderById);

// Create Order from Cart
router.post('/', authMiddleware, createOrder);

// Cancel Order
router.put('/:id/cancel', authMiddleware, cancelOrder);

// Get All Orders (Admin Only)
router.get('/all', authMiddleware, adminMiddleware, getAllOrders);

// Update Order Status (Admin Only)
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
