const express = require('express');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart,
  clearCart 
} = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get Cart
router.get('/', authMiddleware, getCart);

// Add to Cart
router.post('/add', authMiddleware, addToCart);

// Update Cart Item
router.put('/update/:productId', authMiddleware, updateCartItem);

// Remove from Cart
router.delete('/remove/:productId', authMiddleware, removeFromCart);

// Clear Cart
router.delete('/clear', authMiddleware, clearCart);

module.exports = router;
