const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalItemsSold = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: null, total: { $sum: '$items.quantity' } } }
    ]);
    const recentOrders = await Order.find()
      .populate('user', 'username email firstName lastName phone address city country')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber user total status createdAt');

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalItemsSold: totalItemsSold.length > 0 ? totalItemsSold[0].total : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update User Role (Admin Only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Sales Report
exports.getSalesReport = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Top Products
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Populate product details
    const topProductsWithDetails = await Product.populate(
      topProducts.map(p => ({ product: p._id, ...p })),
      { path: 'product' }
    );

    res.json(topProductsWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Category Stats
exports.getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(categoryStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
