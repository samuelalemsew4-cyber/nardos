import React, { useEffect, useState } from 'react';
import './AdminLayout.css';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    // Get admin info from localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user && user.role === 'admin') {
      setAdminInfo(user);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} adminInfo={adminInfo} />
      <div className="admin-content">
        <AdminNavbar toggleSidebar={toggleSidebar} adminInfo={adminInfo} />
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
