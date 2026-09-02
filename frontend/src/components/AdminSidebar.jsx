import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, adminInfo }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">💎</span>
          <span className="logo-text">Nardos Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">
            {adminInfo?.firstName?.charAt(0) || 'A'}
          </div>
          <div className="admin-details">
            <div className="admin-name">{adminInfo?.firstName || 'Admin'}</div>
            <div className="admin-email">{adminInfo?.email}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
