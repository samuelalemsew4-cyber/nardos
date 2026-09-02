# 🔔 Notification System Implementation Guide

## Quick Start

### 1. Import Components

In your Admin dashboard or main component:

```javascript
import AdminNotifications from '../components/AdminNotifications';
import { useNotifications } from '../hooks/useNotifications';
```

### 2. Add Notification Component

```javascript
function AdminDashboard() {
  const { notify } = useNotifications();

  return (
    <div>
      <AdminNotifications />
      {/* Rest of your component */}
    </div>
  );
}
```

### 3. Trigger Notifications

```javascript
// Handle new order
const handleNewOrder = (order) => {
  notify('newOrder', {
    orderNumber: order.id,
    customer: order.customerName,
    total: order.total
  });
};

// Handle low stock
const checkInventory = () => {
  products.forEach(product => {
    if (product.stock < 10) {
      notify('lowStock', {
        name: product.name,
        stock: product.stock
      });
    }
  });
};
```

---

## 📊 Notification Types & Examples

### Order Notifications

```javascript
import { useOrderNotifications } from '../hooks/useNotifications';

function OrdersPage() {
  const { 
    notifyNewOrder, 
    notifyOrderShipped, 
    notifyOrderDelivered 
  } = useOrderNotifications();

  // When order is placed
  const handleOrderPlaced = async (orderData) => {
    const order = await api.createOrder(orderData);
    notifyNewOrder(order);
  };

  // When order is shipped
  const handleShip = async (orderId, trackingNumber) => {
    await api.updateOrder(orderId, { status: 'shipped' });
    notifyOrderShipped(orderId, trackingNumber);
  };

  // When order is delivered
  const handleDelivery = async (orderId) => {
    await api.updateOrder(orderId, { status: 'delivered' });
    notifyOrderDelivered(orderId);
  };

  return (
    <div>
      {/* Order management UI */}
    </div>
  );
}
```

### Product Notifications

```javascript
import { useProductNotifications } from '../hooks/useNotifications';

function ProductsPage() {
  const { 
    notifyLowStock, 
    notifyProductAdded,
    notifyProductDeleted 
  } = useProductNotifications();

  // Check stock levels
  const monitorStock = (products) => {
    products.forEach(product => {
      if (product.stock < 10) {
        notifyLowStock(product);
      }
      if (product.stock === 0) {
        notifyOutOfStock(product);
      }
    });
  };

  // Add product
  const handleAddProduct = async (productData) => {
    const product = await api.createProduct(productData);
    notifyProductAdded(product);
  };

  // Delete product
  const handleDeleteProduct = async (productId, productName) => {
    await api.deleteProduct(productId);
    notifyProductDeleted(productName);
  };

  return (
    <div>
      {/* Product management UI */}
    </div>
  );
}
```

### Customer Notifications

```javascript
import { useCustomerNotifications } from '../hooks/useNotifications';

function CustomersPage() {
  const { notifyNewCustomer } = useCustomerNotifications();

  // Listen for new customer registrations
  useEffect(() => {
    const interval = setInterval(async () => {
      const newCustomers = await api.getNewCustomers();
      newCustomers.forEach(customer => {
        notifyNewCustomer(customer);
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Customer management UI */}
    </div>
  );
}
```

### Payment Notifications

```javascript
import { usePaymentNotifications } from '../hooks/useNotifications';

function PaymentsPage() {
  const { notifyPaymentReceived, notifyPaymentFailed } = usePaymentNotifications();

  // Process payment
  const handlePayment = async (orderData) => {
    try {
      const payment = await api.processPayment(orderData);
      notifyPaymentReceived({
        orderNumber: payment.orderNumber,
        total: payment.amount
      });
    } catch (error) {
      notifyPaymentFailed({
        orderNumber: orderData.orderNumber,
        error: error.message
      });
    }
  };

  return (
    <div>
      {/* Payment management UI */}
    </div>
  );
}
```

---

## 🔌 Integration with API

### Polling for Updates

```javascript
import { useOrderNotifications } from '../hooks/useNotifications';

function AdminDashboard() {
  const { notifyNewOrder } = useOrderNotifications();
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());

  // Poll for new orders
  useEffect(() => {
    const checkNewOrders = async () => {
      const orders = await api.getOrdersSince(lastCheckedTime);
      orders.forEach(order => {
        if (order.status === 'pending') {
          notifyNewOrder(order);
        }
      });
      setLastCheckedTime(new Date());
    };

    const interval = setInterval(checkNewOrders, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [lastCheckedTime]);

  return (
    <div>
      <AdminNotifications />
      {/* Dashboard content */}
    </div>
  );
}
```

### WebSocket Integration (Real-time)

```javascript
import { useOrderNotifications } from '../hooks/useNotifications';

function AdminDashboard() {
  const { notifyNewOrder } = useOrderNotifications();

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('ws://localhost:5000/admin/notifications');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'newOrder') {
        notifyNewOrder(data.order);
      } else if (data.type === 'lowStock') {
        notifyLowStock(data.product);
      }
      // Handle other notification types
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <AdminNotifications />
      {/* Dashboard content */}
    </div>
  );
}
```

---

## 🎯 Real-world Workflow Example

### Complete Order Notification Flow

```javascript
import { useOrderNotifications } from '../hooks/useNotifications';
import { useSystemNotifications } from '../hooks/useNotifications';

function OrderManagementPage() {
  const { 
    notifyNewOrder,
    notifyOrderConfirmed,
    notifyOrderShipped,
    notifyOrderDelivered
  } = useOrderNotifications();

  const { notifySuccess, notifyError } = useSystemNotifications();

  // Step 1: Customer places order
  const handleOrderPlaced = async (orderData) => {
    try {
      const order = await api.createOrder(orderData);
      notifyNewOrder(order);
      notifySuccess('Order created successfully');
    } catch (error) {
      notifyError(`Failed to create order: ${error.message}`);
    }
  };

  // Step 2: Admin confirms order
  const confirmOrder = async (orderId) => {
    try {
      await api.updateOrder(orderId, { status: 'confirmed' });
      notifyOrderConfirmed(orderId);
      notifySuccess('Order confirmed');
    } catch (error) {
      notifyError(`Failed to confirm order: ${error.message}`);
    }
  };

  // Step 3: Order ships
  const shipOrder = async (orderId, trackingNumber) => {
    try {
      await api.updateOrder(orderId, { 
        status: 'shipped', 
        trackingNumber 
      });
      notifyOrderShipped(orderId, trackingNumber);
      notifySuccess('Order shipped');
    } catch (error) {
      notifyError(`Failed to ship order: ${error.message}`);
    }
  };

  // Step 4: Order delivered
  const markDelivered = async (orderId) => {
    try {
      await api.updateOrder(orderId, { status: 'delivered' });
      notifyOrderDelivered(orderId);
      notifySuccess('Order marked as delivered');
    } catch (error) {
      notifyError(`Failed to update order: ${error.message}`);
    }
  };

  return (
    <div>
      <AdminNotifications />
      {/* Order management UI with buttons calling above functions */}
    </div>
  );
}
```

---

## 📱 Mobile Compatibility

The notification system is fully responsive:

```css
/* Mobile-optimized notification dropdown */
@media (max-width: 768px) {
  .notification-dropdown {
    width: calc(100vw - 32px);
    max-height: 50vh;
  }
}
```

---

## ⚙️ Advanced Customization

### Create Custom Notification Hook

```javascript
import { useNotifications } from '../hooks/useNotifications';

export const useCustomNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifyInventoryUpdate: (update) => notify('success', {
      message: `Inventory updated: ${update.product} (${update.quantity} units)`
    }),
    notifyPriceChange: (change) => notify('success', {
      message: `Price updated: ${change.product} - ${change.oldPrice} → ${change.newPrice}`
    })
  };
};
```

### Custom Notification Styling

```css
/* Create notification skin variations */
.notification-item.urgent {
  border-left-width: 6px;
  background-color: #ffe6e6;
}

.notification-item.urgent .notification-icon {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

---

## 🚀 Performance Optimization

### Debounce Notifications

```javascript
import { useNotifications } from '../hooks/useNotifications';
import { debounce } from 'lodash';

function OptimizedNotifications() {
  const { notify } = useNotifications();

  const debouncedNotify = debounce((type, data) => {
    notify(type, data);
  }, 1000);

  // This won't spam notifications if called multiple times
  const checkStock = () => {
    debouncedNotify('lowStock', product);
  };

  return <div>{/* Component */}</div>;
}
```

### Batch Notifications

```javascript
import { useNotifications } from '../hooks/useNotifications';

function BatchNotifications() {
  const { notify } = useNotifications();

  const batchNotifyLowStock = (products) => {
    const groupedByCategory = groupBy(products, 'category');
    
    Object.entries(groupedByCategory).forEach(([category, items]) => {
      notify('success', {
        message: `${category}: ${items.length} products have low stock`
      });
    });
  };

  return <div>{/* Component */}</div>;
}
```

---

## ✅ Notification Checklist

When implementing notifications in a new feature:

- [ ] Import appropriate notification hook
- [ ] Import AdminNotifications component
- [ ] Add notification triggers to event handlers
- [ ] Test desktop notifications work
- [ ] Test notification history saves
- [ ] Test mark as read functionality
- [ ] Test clear notifications works
- [ ] Test responsive design on mobile
- [ ] Verify accessibility (ARIA labels)
- [ ] Check browser console for errors

---

## 🆘 Debugging

### Enable Logging

```javascript
import notificationService from '../services/notificationService';

// Override notify to add logging
const originalNotify = notificationService.notify;
notificationService.notify = function(notification) {
  console.log('Notification triggered:', notification);
  return originalNotify.call(this, notification);
};
```

### Check Notification History

```javascript
import { getNotificationHistory } from '../services/notificationService';

// In browser console
const history = getNotificationHistory();
console.table(history);
```

---

## 📚 API Reference

### useNotifications Hook
- `notify(type, data)` - Trigger a notification
- `notifications` - Array of all notifications
- `clearAll()` - Clear all notifications
- `markAsRead(id)` - Mark notification as read
- `unreadCount` - Count of unread notifications

### Specialized Hooks
- `useOrderNotifications()` - Order-related notifications
- `useProductNotifications()` - Product-related notifications
- `useCustomerNotifications()` - Customer-related notifications
- `usePaymentNotifications()` - Payment-related notifications
- `useSystemNotifications()` - System-related notifications

---

**Notification system fully integrated and ready! 🎉**
