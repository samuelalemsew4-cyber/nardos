import React from 'react';
import './AdminNavbar.css';

const AdminNavbar = ({ toggleSidebar, adminInfo }) => {
  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <h2>Admin Dashboard</h2>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-user">
          <span className="user-greeting">Welcome, {adminInfo?.firstName || 'Admin'}!</span>
          <div className="user-avatar">
            {adminInfo?.firstName?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
