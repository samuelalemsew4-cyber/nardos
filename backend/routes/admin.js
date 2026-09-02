const express = require('express');
const { 
  getDashboardStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  getSalesReport,
  getTopProducts,
  getCategoryStats 
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getAllOrders } = require('../controllers/orderController');

const router = express.Router();

// All admin routes require authentication and admin role

// Dashboard Stats
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);

// Get All Users
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// Update User Role
router.put('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);

// Delete User
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);

// Get Sales Report
router.get('/reports/sales', authMiddleware, adminMiddleware, getSalesReport);

// Get Top Products
router.get('/reports/top-products', authMiddleware, adminMiddleware, getTopProducts);

// Get Category Stats
router.get('/reports/categories', authMiddleware, adminMiddleware, getCategoryStats);

module.exports = router;
