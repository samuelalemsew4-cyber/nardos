import React from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminOrders from '../components/AdminOrders';

const AdminOrdersPage = () => {
  return (
    <AdminLayout>
      <AdminOrders />
    </AdminLayout>
  );
};

export default AdminOrdersPage;
