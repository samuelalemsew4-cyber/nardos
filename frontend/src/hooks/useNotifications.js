import { useEffect, useState, useCallback } from 'react';
import notificationService, { triggerNotification as trigger } from '../services/notificationService';

/**
 * Custom React Hook for managing admin notifications
 * 
 * Usage:
 * const { notify, notifications, clearAll, markAsRead } = useNotifications();
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Subscribe to notification service
    const unsubscribe = notificationService.subscribe((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return unsubscribe;
  }, []);

  const notify = useCallback((notificationType, data = {}) => {
    trigger(notificationType, data);
  }, []);

  const clearAll = useCallback(() => {
    notificationService.clearHistory();
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id) => {
    // Implementation for marking specific notification as read
    // This would be handled by AdminNotifications component
  }, []);

  return {
    notifications,
    notify,
    clearAll,
    markAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

/**
 * Hook for order notifications
 */
export const useOrderNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifyNewOrder: (order) => notify('newOrder', order),
    notifyOrderConfirmed: (orderNumber) => notify('orderConfirmed', { orderNumber }),
    notifyOrderShipped: (orderNumber, trackingNumber) => 
      notify('orderShipped', { orderNumber, trackingNumber }),
    notifyOrderDelivered: (orderNumber) => notify('orderDelivered', { orderNumber }),
    notifyOrderCancelled: (orderNumber) => notify('orderCancelled', { orderNumber })
  };
};

/**
 * Hook for product notifications
 */
export const useProductNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifyLowStock: (product) => notify('lowStock', product),
    notifyOutOfStock: (product) => notify('outOfStock', product),
    notifyProductAdded: (product) => notify('productAdded', product),
    notifyProductDeleted: (productName) => notify('productDeleted', productName)
  };
};

/**
 * Hook for customer notifications
 */
export const useCustomerNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifyNewCustomer: (customer) => notify('newCustomer', customer),
    notifyCustomerRegistered: (customerName) => 
      notify('customerRegistered', { customerName })
  };
};

/**
 * Hook for payment notifications
 */
export const usePaymentNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifyPaymentReceived: (order) => notify('paymentReceived', order),
    notifyPaymentFailed: (order) => notify('paymentFailed', order)
  };
};

/**
 * Hook for review notifications
 */
export const useReviewNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifyNewReview: (review) => notify('newReview', review)
  };
};

/**
 * Hook for system notifications
 */
export const useSystemNotifications = () => {
  const { notify } = useNotifications();

  return {
    notifySuccess: (message) => notify('success', { message }),
    notifyError: (message) => notify('error', message),
    notifySystemUpdate: (message) => notify('systemUpdate', { message })
  };
};

export default useNotifications;
