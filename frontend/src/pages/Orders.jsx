import React, { useEffect, useState } from 'react';
import { getImageUrl, ordersAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!localStorage.getItem('token')) {
        setError('Please log in to view your order history.');
        setLoading(false);
        return;
      }

      try {
        setBuyer(JSON.parse(localStorage.getItem('user') || 'null'));
      } catch {
        setBuyer(null);
      }

      try {
        const response = await ordersAPI.getAll();
        setOrders(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your order history.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <div className="orders-page"><h1>Loading order history...</h1></div>;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>{buyer?.firstName || buyer?.username || 'My'} Order History</h1>
        <p>Orders for {buyer?.username || buyer?.email || 'this account'}.</p>
      </div>

      <div className="orders-list">
        {error && <p className="orders-message">{error}</p>}
        {!error && orders.length === 0 && <p className="orders-message">No orders yet.</p>}
        {orders.map((order) => (
          <article className="order-card" key={order._id}>
            <div className="order-card-header">
              <div>
                <h2>{order.orderNumber || 'Order'}</h2>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`order-status ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div className="order-item" key={item._id || `${order._id}-${index}`}>
                  <img
                    src={getImageUrl(item.product?.image || item.image)}
                    alt={item.name || item.product?.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getImageUrl();
                    }}
                  />
                  <div>
                    <h3>{item.name || item.product?.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <strong>{Number(item.price * item.quantity).toLocaleString()} ETB</strong>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Total</span>
              <strong>{Number(order.total).toLocaleString()} ETB</strong>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Orders;
