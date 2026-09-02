import React, { useEffect, useState } from 'react';
import './AdminReports.css';
import api from '../services/api';

const AdminReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const [salesRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/reports/sales', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/reports/top-products', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/admin/reports/categories', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setSalesData(salesRes.data);
      setTopProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="reports-loading">Loading reports...</div>;

  return (
    <div className="admin-reports">
      <div className="reports-header">
        <h1>Analytics & Reports</h1>
        <button className="refresh-btn" onClick={fetchReports}>
          🔄 Refresh
        </button>
      </div>

      <div className="reports-grid">
        {/* Sales Report */}
        <section className="report-section">
          <h2>Sales by Date</h2>
          <div className="sales-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesData.slice(0, 10).map((sale, idx) => (
                  <tr key={idx}>
                    <td>{sale._id}</td>
                    <td>{sale.orderCount}</td>
                    <td>{Number(sale.totalSales || 0).toLocaleString()} ETB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Products */}
        <section className="report-section">
          <h2>Top Selling Products</h2>
          <div className="products-list">
            {topProducts.slice(0, 10).map((prod, idx) => (
              <div key={idx} className="product-item">
                <span className="rank">#{idx + 1}</span>
                <div className="prod-details">
                  <span className="prod-name">{prod.product?.name || 'Product'}</span>
                  <span className="prod-stats">Sold: {prod.totalSold} | Revenue: {Number(prod.totalRevenue || 0).toLocaleString()} ETB</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Stats */}
        <section className="report-section">
          <h2>Category Statistics</h2>
          <div className="categories-stats">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-item">
                <div className="cat-name">{cat._id}</div>
                <div className="cat-data">
                  <span className="count">Products: {cat.count}</span>
                  <span className="price">Avg Price: {Number(cat.avgPrice || 0).toLocaleString()} ETB</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminReports;
