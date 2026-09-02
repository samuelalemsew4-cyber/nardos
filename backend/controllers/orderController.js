const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Please provide shipping address and payment method' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const buyer = await User.findById(req.userId).select('username email firstName lastName phone address city country');
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    const orderAddress = {
      ...shippingAddress,
      firstName: shippingAddress.firstName || buyer.firstName || buyer.username,
      lastName: shippingAddress.lastName || buyer.lastName,
      email: shippingAddress.email || buyer.email,
      phone: shippingAddress.phone || buyer.phone,
      address: shippingAddress.address || buyer.address,
      city: shippingAddress.city || buyer.city,
      country: shippingAddress.country || buyer.country
    };

    // Calculate subtotal, tax, and total
    const subtotal = cart.total;
    const tax = (subtotal * 0.15).toFixed(2); // 15% tax
    const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

    // Create order
    const order = new Order({
      user: req.userId,
      items: cart.items,
      subtotal,
      tax,
      total,
      shippingAddress: orderAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date()
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Order Status (Admin Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Orders (Admin Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email firstName lastName')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
