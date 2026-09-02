/**
 * Notification Service for Admin Dashboard
 * Handles all notifications for orders, products, customers, etc.
 */

class NotificationService {
  constructor() {
    this.listeners = [];
    this.notificationHistory = [];
    this.maxHistorySize = 100;
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Trigger notification to all listeners
  notify(notification) {
    // Add to history
    this.addToHistory(notification);
    
    // Notify all listeners
    this.listeners.forEach(callback => {
      callback(notification);
    });

    // Show desktop notification if enabled
    this.showDesktopNotification(notification);
  }

  // Add to notification history
  addToHistory(notification) {
    this.notificationHistory.unshift({
      ...notification,
      timestamp: new Date(),
      id: Date.now()
    });

    // Keep history size manageable
    if (this.notificationHistory.length > this.maxHistorySize) {
      this.notificationHistory.pop();
    }
  }

  // Show desktop notification
  showDesktopNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Nardos Admin: ${notification.title}`, {
        body: notification.message,
        icon: '/nardos-logo.png',
        badge: '🔔',
        tag: notification.type,
        requireInteraction: notification.priority === 'high'
      });
    }
  }

  // Request notification permission
  requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  // Get notification history
  getHistory() {
    return this.notificationHistory;
  }

  // Clear history
  clearHistory() {
    this.notificationHistory = [];
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Notification Generators
export const notificationGenerators = {
  // Order Notifications
  newOrder: (order) => ({
    type: 'order',
    priority: 'high',
    title: '🛒 New Order Received!',
    message: `Order #${order.orderNumber} from ${order.customer} - ${order.total} ETB`,
    data: order,
    actionUrl: '/admin/orders'
  }),

  orderConfirmed: (orderNumber) => ({
    type: 'order',
    priority: 'medium',
    title: '✅ Order Confirmed',
    message: `Order #${orderNumber} has been confirmed`,
    actionUrl: '/admin/orders'
  }),

  orderShipped: (orderNumber, trackingNumber) => ({
    type: 'order',
    priority: 'medium',
    title: '📦 Order Shipped',
    message: `Order #${orderNumber} shipped - Tracking: ${trackingNumber}`,
    actionUrl: '/admin/orders'
  }),

  orderDelivered: (orderNumber) => ({
    type: 'order',
    priority: 'low',
    title: '✨ Order Delivered',
    message: `Order #${orderNumber} has been delivered`,
    actionUrl: '/admin/orders'
  }),

  orderCancelled: (orderNumber) => ({
    type: 'order',
    priority: 'medium',
    title: '❌ Order Cancelled',
    message: `Order #${orderNumber} has been cancelled`,
    actionUrl: '/admin/orders'
  }),

  // Product Notifications
  lowStock: (product) => ({
    type: 'stock',
    priority: 'high',
    title: '⚠️ Low Stock Alert',
    message: `${product.name} - Only ${product.stock} units remaining`,
    data: product,
    actionUrl: '/admin/products'
  }),

  outOfStock: (product) => ({
    type: 'stock',
    priority: 'high',
    title: '❌ Out of Stock',
    message: `${product.name} is now out of stock`,
    data: product,
    actionUrl: '/admin/products'
  }),

  productAdded: (product) => ({
    type: 'product',
    priority: 'low',
    title: '📦 Product Added',
    message: `${product.name} added to inventory`,
    data: product,
    actionUrl: '/admin/products'
  }),

  productDeleted: (productName) => ({
    type: 'product',
    priority: 'medium',
    title: '🗑️ Product Removed',
    message: `${productName} has been removed from inventory`,
    actionUrl: '/admin/products'
  }),

  // Customer Notifications
  newCustomer: (customer) => ({
    type: 'customer',
    priority: 'low',
    title: '👤 New Customer!',
    message: `${customer.name} (${customer.email}) just registered`,
    data: customer,
    actionUrl: '/admin/users'
  }),

  customerRegistered: (customerName) => ({
    type: 'customer',
    priority: 'low',
    title: '🎉 Welcome!',
    message: `${customerName} created their account`,
    actionUrl: '/admin/users'
  }),

  // Payment Notifications
  paymentReceived: (order) => ({
    type: 'payment',
    priority: 'high',
    title: '💰 Payment Received',
    message: `Payment of ${order.total} ETB received for Order #${order.orderNumber}`,
    data: order,
    actionUrl: '/admin/orders'
  }),

  paymentFailed: (order) => ({
    type: 'payment',
    priority: 'high',
    title: '⚠️ Payment Failed',
    message: `Payment failed for Order #${order.orderNumber}`,
    data: order,
    actionUrl: '/admin/orders'
  }),

  // Review/Rating Notifications
  newReview: (review) => ({
    type: 'review',
    priority: 'medium',
    title: '⭐ New Review',
    message: `${review.customerName} reviewed "${review.productName}" - ${review.rating} stars`,
    data: review,
    actionUrl: '/admin/products'
  }),

  // System Notifications
  systemUpdate: (message) => ({
    type: 'system',
    priority: 'medium',
    title: '⚙️ System Update',
    message: message,
    actionUrl: '/admin'
  }),

  error: (errorMessage) => ({
    type: 'error',
    priority: 'high',
    title: '❌ Error Occurred',
    message: errorMessage,
    actionUrl: '/admin'
  }),

  success: (message) => ({
    type: 'success',
    priority: 'low',
    title: '✅ Success',
    message: message,
    actionUrl: '/admin'
  })
};

// Export service and utilities
export default notificationService;

export const triggerNotification = (notificationType, data = {}) => {
  if (notificationGenerators[notificationType]) {
    const notification = notificationGenerators[notificationType](data);
    notificationService.notify(notification);
    return notification;
  } else {
    console.warn(`Unknown notification type: ${notificationType}`);
  }
};

export const getNotificationHistory = () => {
  return notificationService.getHistory();
};

export const requestNotificationPermission = () => {
  notificationService.requestPermission();
};
