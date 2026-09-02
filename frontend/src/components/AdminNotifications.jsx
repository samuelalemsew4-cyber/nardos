import React, { useState, useEffect } from 'react';
import './AdminNotifications.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch notifications from localStorage or API
    const savedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    setNotifications(savedNotifications);
    updateUnreadCount(savedNotifications);
  }, []);

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter(n => !n.read).length;
    setUnreadCount(unread);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      read: false,
      ...notification
    };
    
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    updateUnreadCount(updated);
    
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(`Nardos Admin: ${notification.title}`, {
        body: notification.message,
        icon: '🔔'
      });
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    updateUnreadCount(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    updateUnreadCount(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('adminNotifications', JSON.stringify(updated));
    updateUnreadCount(updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('adminNotifications');
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '🛒',
      product: '📦',
      customer: '👤',
      stock: '⚠️',
      status: '📊',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      order: '#667eea',
      product: '#f093fb',
      customer: '#4facfe',
      stock: '#fa709a',
      status: '#30cfd0',
      system: '#a8edea'
    };
    return colors[type] || '#667eea';
  };

  return (
    <div className="admin-notifications">
      <div className="notification-bell">
        <button 
          className="notification-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          🔔
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </button>

        {showDropdown && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className="mark-all-btn"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              <>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      style={{
                        borderLeftColor: getNotificationColor(notif.type)
                      }}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="notification-content">
                        <h4>{notif.title}</h4>
                        <p>{notif.message}</p>
                        <small>{notif.timestamp}</small>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="notification-footer">
                  <button 
                    className="clear-all-btn"
                    onClick={clearAllNotifications}
                  >
                    Clear all
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export notification trigger function
export const triggerNotification = (type, title, message) => {
  const event = new CustomEvent('adminNotification', {
    detail: { type, title, message }
  });
  window.dispatchEvent(event);
};

// Notification templates
export const notificationTemplates = {
  newOrder: (orderNumber, customerName, total) => ({
    type: 'order',
    title: '🛒 New Order Received',
    message: `Order #${orderNumber} from ${customerName} - ${total} ETB`
  }),

  lowStock: (productName, currentStock) => ({
    type: 'stock',
    title: '⚠️ Low Stock Alert',
    message: `${productName} is running low (${currentStock} units remaining)`
  }),

  newCustomer: (customerName, email) => ({
    type: 'customer',
    title: '👤 New Customer Registered',
    message: `${customerName} (${email}) just registered`
  }),

  orderStatusChange: (orderNumber, oldStatus, newStatus) => ({
    type: 'status',
    title: '📊 Order Status Updated',
    message: `Order #${orderNumber}: ${oldStatus} → ${newStatus}`
  }),

  productAdded: (productName) => ({
    type: 'product',
    title: '📦 Product Added',
    message: `${productName} has been added to inventory`
  }),

  paymentReceived: (orderNumber, amount) => ({
    type: 'order',
    title: '💰 Payment Received',
    message: `Payment confirmed for Order #${orderNumber} - ${amount} ETB`
  })
};

export default AdminNotifications;
