import React, { useEffect, useState } from 'react';
import './AdminOrders.css';
import api from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(orders.map(o => o._id === orderId ? response.data.order : o));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const search = customerSearch.trim().toLowerCase();
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const customer = order.user || {};
    const values = [customer.username, customer.email, customer.firstName, customer.lastName,
      `${customer.firstName || ''} ${customer.lastName || ''}`,
      order.shippingAddress?.firstName,
      order.shippingAddress?.lastName,
      `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`,
      order.shippingAddress?.phone,
      order.shippingAddress?.address,
      order.shippingAddress?.city,
      order.shippingAddress?.country,
      customer.phone,
      customer.address,
      customer.city,
      customer.country];
    return matchesStatus && (!search || values.some(value => value?.toLowerCase().includes(search)));
  });

  const printSlip = () => {
    if (!selectedOrder) return;
    const customer = selectedOrder.user || {};
    const customerName = getBuyerName(selectedOrder);
    const shippingAddress = selectedOrder.shippingAddress || {};
    const buyerLocation = [shippingAddress.address || customer.address, shippingAddress.city || customer.city, shippingAddress.country || customer.country]
      .filter(Boolean).join(', ');
    const items = selectedOrder.items?.map(item => `${item.name} x${item.quantity}`).join(', ') || 'No items';
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    printWindow.document.write(`<h1>NARDOS PERFUME</h1><h2>Order Slip</h2><p>Order: ${selectedOrder.orderNumber}</p><p>Buyer: ${customerName}</p><p>Phone: ${shippingAddress.phone || customer.phone || ''}</p><p>Email: ${customer.email || shippingAddress.email || ''}</p><p>Delivery location: ${buyerLocation}</p><p>Items: ${items}</p><p>Status: ${selectedOrder.status}</p><p>Total: ${Number(selectedOrder.total).toLocaleString()} ETB</p>`);
    printWindow.document.close();
    printWindow.print();
  };

  const getBuyerName = (order) => {
    const customer = order.user || {};
    const profileName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
    const orderName = `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim();
    return orderName || profileName || customer.username || customer.email || 'Buyer';
  };

  if (loading) return <div className="orders-loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Order Management</h1>
        <input
          type="search"
          className="customer-search"
          placeholder="Search buyer name or email"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
        />
        <div className="filter-buttons">
          {statuses.map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Username</th>
              <th>Email</th>
              <th>Total</th>
              <th>Items</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td className="order-id">{order.orderNumber}</td>
                <td>
                  {getBuyerName(order)}
                </td>
                <td>{order.user?.username || 'Unknown'}</td>
                <td>{order.user?.email || order.shippingAddress?.email || 'Unknown'}</td>
                <td className="amount">{Number(order.total || 0).toLocaleString()} ETB</td>
                <td>{order.items?.length || 0}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`status-select ${order.status}`}
                  >
                    {statuses.filter(s => s !== 'all').map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedOrder(order)}>👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-data">No orders found</div>
      )}

      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(event) => event.stopPropagation()}>
            <h2>Order Slip</h2>
            <p><strong>Order:</strong> {selectedOrder.orderNumber}</p>
            <p><strong>Buyer:</strong> {getBuyerName(selectedOrder)}</p>
            <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'Unknown'}</p>
            <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email || selectedOrder.user?.email || 'Unknown'}</p>
            <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address || selectedOrder.user?.address || 'Unknown'}</p>
            <p><strong>City:</strong> {selectedOrder.shippingAddress?.city || selectedOrder.user?.city || 'Unknown'}</p>
            <p><strong>Country:</strong> {selectedOrder.shippingAddress?.country || selectedOrder.user?.country || 'Unknown'}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            {selectedOrder.items?.map((item) => (
              <p key={item._id}><strong>{item.name}</strong> x {item.quantity} = {Number(item.price * item.quantity).toLocaleString()} ETB</p>
            ))}
            <p><strong>Total:</strong> {Number(selectedOrder.total).toLocaleString()} ETB</p>
            <button onClick={printSlip}>Print Slip</button>
            <button onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
