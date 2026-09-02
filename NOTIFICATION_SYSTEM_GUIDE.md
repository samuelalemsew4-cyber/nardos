# 🔔 Admin Notification System Guide

## Overview

The Nardos Admin Notification System provides real-time alerts for:
- ✅ New orders
- ✅ Payment confirmations
- ✅ Low stock warnings
- ✅ New customer registrations
- ✅ Order status changes
- ✅ Product updates
- ✅ System events

---

## 📁 Files Structure

```
frontend/src/
├── components/
│   ├── AdminNotifications.jsx      # Notification UI component
│   └── AdminNotifications.css      # Notification styling
├── services/
│   └── notificationService.js      # Notification business logic
└── pages/
    └── Admin.jsx                   # Admin dashboard
```

---

## 🚀 Usage

### 1. Import Notification Service

```javascript
import notificationService, { 
  triggerNotification, 
  notificationGenerators,
  requestNotificationPermission 
} from '../services/notificationService';
```

### 2. Trigger Notifications

#### New Order Notification
```javascript
triggerNotification('newOrder', {
  orderNumber: 'ORD-20260817-001',
  customer: 'John Doe',
  total: 299.99
});
```

#### Low Stock Alert
```javascript
triggerNotification('lowStock', {
  name: 'Lavender Dream',
  stock: 5
});
```

#### New Customer
```javascript
triggerNotification('newCustomer', {
  name: 'Jane Smith',
  email: 'jane@example.com'
});
```

#### Payment Received
```javascript
triggerNotification('paymentReceived', {
  orderNumber: 'ORD-20260817-001',
  total: 299.99
});
```

#### Order Shipped
```javascript
triggerNotification('orderShipped', {
  orderNumber: 'ORD-20260817-001',
  trackingNumber: 'TRACK123456'
});
```

---

## 🎨 Notification Types

| Type | Icon | Priority | Trigger |
|------|------|----------|---------|
| Order | 🛒 | High | New order received |
| Stock | ⚠️ | High | Low/out of stock |
| Customer | 👤 | Low | New registration |
| Payment | 💰 | High | Payment received |
| Product | 📦 | Low | Product added/removed |
| System | ⚙️ | Medium | System events |
| Review | ⭐ | Medium | New review posted |
| Error | ❌ | High | Error occurred |
| Success | ✅ | Low | Action successful |

---

## 💻 Frontend Integration

### In Admin.jsx

```javascript
import AdminNotifications from '../components/AdminNotifications';
import notificationService, { triggerNotification } from '../services/notificationService';

function AdminPage() {
  useEffect(() => {
    // Listen for notifications
    const unsubscribe = notificationService.subscribe((notification) => {
      console.log('New notification:', notification);
    });

    return unsubscribe;
  }, []);

  const handleNewOrder = (order) => {
    triggerNotification('newOrder', {
      orderNumber: order.id,
      customer: order.customerName,
      total: order.total
    });
  };

  return (
    <div>
      <AdminNotifications />
      {/* Rest of admin dashboard */}
    </div>
  );
}
```

### Listen to Notification Events

```javascript
import notificationService from '../services/notificationService';

// Subscribe to all notifications
notificationService.subscribe((notification) => {
  console.log('Notification received:', notification.type);
  console.log('Title:', notification.title);
  console.log('Message:', notification.message);
  
  // Perform actions based on notification type
  if (notification.type === 'order') {
    // Refresh orders list
    fetchOrders();
  }
});
```

---

## 🔗 Backend Integration

### Trigger Notifications from Backend

When API calls are made, emit notifications:

```javascript
// In your API endpoint
const order = await Order.create(orderData);

// Trigger notification via event emitter or socket
notificationService.notify({
  type: 'order',
  title: 'New Order',
  message: `Order #${order._id} received`,
  data: order
});
```

### Example: Express Route with Notification

```javascript
router.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    
    // Trigger admin notification
    triggerNotification('newOrder', {
      orderNumber: order.orderNumber,
      customer: order.customerName,
      total: order.total
    });
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

---

## 🔔 Browser Notifications

### Request Permission

```javascript
import { requestNotificationPermission } from '../services/notificationService';

// Request permission from user
requestNotificationPermission();
```

### Auto-request on Admin Login

```javascript
useEffect(() => {
  if (isAdminLoggedIn) {
    requestNotificationPermission();
  }
}, [isAdminLoggedIn]);
```

---

## 💾 Notification History

### Get All Notifications

```javascript
import { getNotificationHistory } from '../services/notificationService';

const history = getNotificationHistory();
console.log('Total notifications:', history.length);
```

### View in Dashboard

```javascript
useEffect(() => {
  const history = getNotificationHistory();
  console.log('Recent notifications:', history.slice(0, 10));
}, []);
```

---

## 🎯 Notification Priority Levels

- **High**: Orders, payments, errors - Requires immediate attention
- **Medium**: Order updates, reviews - Important but not urgent
- **Low**: New products, customer registrations - Informational

---

## 📊 Example Implementations

### New Order Notification with Auto-Refresh

```javascript
const handleNewOrder = async (order) => {
  // Show notification
  triggerNotification('newOrder', {
    orderNumber: order.id,
    customer: order.customerName,
    total: order.total
  });

  // Auto-refresh orders after a short delay
  setTimeout(() => {
    fetchOrders();
  }, 1000);
};
```

### Low Stock Alert with Action

```javascript
const checkStockLevels = async () => {
  const products = await fetchProducts();
  
  products.forEach(product => {
    if (product.stock < 10) {
      triggerNotification('lowStock', {
        name: product.name,
        stock: product.stock
      });
    }
  });
};

// Run periodically
setInterval(checkStockLevels, 300000); // Every 5 minutes
```

### Payment Processing

```javascript
const processPayment = async (order) => {
  try {
    const payment = await paymentAPI.process(order);
    
    triggerNotification('paymentReceived', {
      orderNumber: order.orderNumber,
      total: order.total
    });
    
    // Update order status
    await updateOrderStatus(order.id, 'paid');
  } catch (error) {
    triggerNotification('error', `Payment failed: ${error.message}`);
  }
};
```

---

## 🎨 Customization

### Create Custom Notification

```javascript
// Add custom notification type to notificationGenerators
notificationGenerators.customAlert = (message) => ({
  type: 'custom',
  priority: 'high',
  title: '📢 Custom Alert',
  message: message,
  actionUrl: '/admin'
});

// Trigger custom notification
triggerNotification('customAlert', 'This is a custom message');
```

### Modify Notification Styling

Edit `AdminNotifications.css`:

```css
/* Change notification badge color */
.notification-btn .badge {
  background: #your-color;
}

/* Change dropdown width */
.notification-dropdown {
  width: 450px; /* was 400px */
}
```

---

## ✨ Features

✅ Real-time notifications
✅ Notification history
✅ Browser desktop notifications
✅ Unread notification counter
✅ Priority-based alerts
✅ Click to mark as read
✅ Delete individual notifications
✅ Clear all notifications
✅ Responsive design
✅ Easy customization

---

## 🔐 Security

- Notifications stored in localStorage (client-side)
- No sensitive data in notifications
- Admin-only notification access
- Permission-based browser notifications

---

## 🚀 Performance Tips

1. **Batch notifications** - Group similar notifications
2. **Debounce alerts** - Avoid notification spam
3. **Clear history** - Periodically clean old notifications
4. **Unsubscribe** - Remove unused listeners

```javascript
// Example: Debounce stock check notifications
const debouncedStockCheck = debounce(() => {
  checkStockLevels();
}, 5000);
```

---

## 📱 Mobile Optimization

- Responsive dropdown on small screens
- Touch-friendly buttons
- Swipe to dismiss (future enhancement)
- Optimized notification display

---

## 🆘 Troubleshooting

### Notifications not showing?
1. Check browser console for errors
2. Verify notification permission granted
3. Check localStorage is enabled
4. Refresh admin dashboard

### Desktop notifications not working?
1. Grant browser notification permission
2. Check browser settings
3. Ensure `Notification.permission === 'granted'`
4. Verify browser supports Notifications API

### Missing notifications?
1. Check notification service is imported
2. Verify `triggerNotification()` is called
3. Check notification type exists
4. Review browser console logs

---

**Notification system ready! 🎉**
