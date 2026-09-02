const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'nardos_perfume_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Please provide username, first name, last name, email, and password' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, username, password, identifier } = req.body;
    const loginIdentifier = (identifier || email || username || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Please provide username or email and password' });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, country } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, phone, address, city, country, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
