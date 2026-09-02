const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get Profile
router.get('/profile', authMiddleware, getProfile);

// Update Profile
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
