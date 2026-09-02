import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalItemsSold: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <button className="refresh-btn" onClick={fetchDashboardStats}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{Number(stats.totalRevenue || 0).toLocaleString()} ETB</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedOrders}</div>
            <div className="stat-label">Completed Orders</div>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">🧴</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalItemsSold}</div>
            <div className="stat-label">Perfumes Sold</div>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingOrders}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="recent-orders">
          <h2>Recent Orders</h2>
          {stats.recentOrders.length === 0 ? <p>No orders yet.</p> : (
            <div className="recent-orders-list">
              {stats.recentOrders.map(order => (
                <div className="recent-order" key={order._id}>
                  <span>{order.orderNumber}</span>
                  <span>{order.user?.firstName || order.user?.username || 'Buyer'}</span>
                  <span>{Number(order.total).toLocaleString()} ETB</span>
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">➕ Add Product</button>
            <button className="action-btn">👤 Add User</button>
            <button className="action-btn">📊 View Reports</button>
            <button className="action-btn">⚙️ Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
