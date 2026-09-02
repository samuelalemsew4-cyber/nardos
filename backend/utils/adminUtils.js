// Admin utilities and constants
const ADMIN_ROLES = ['admin'];
const USER_ROLES = ['user', 'admin'];

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const PRODUCT_CATEGORIES = ['Men', 'Women', 'Unisex', 'Luxury / Men', 'Luxury / Women', 'Luxury / Unisex'];

// Check if user is admin
const isAdmin = (userRole) => ADMIN_ROLES.includes(userRole);

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get date range (last N days)
const getDateRange = (days = 30) => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
  return { startDate, endDate };
};

// Calculate growth percentage
const calculateGrowth = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(2);
};

// Validate admin request
const validateAdminRequest = (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized - No user ID' });
  }
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  return null;
};

module.exports = {
  ADMIN_ROLES,
  USER_ROLES,
  ORDER_STATUSES,
  PRODUCT_CATEGORIES,
  isAdmin,
  formatCurrency,
  formatDate,
  getDateRange,
  calculateGrowth,
  validateAdminRequest
};
