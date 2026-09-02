import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';

const DEMO_ADMIN = {
  email: 'samuel@gmail.com',
  password: 'sami@2124',
  role: 'admin',
  name: 'Samuel (Admin)'
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: 'Club De Nuit Intense Man', brand: 'Armaf', price: '7,500 ETB' },
    { id: 2, name: 'Dior Sauvage Eau de Parfum', brand: 'Christian Dior', price: '24,500 ETB' },
    { id: 3, name: 'Lattafa Khamrah', brand: 'Lattafa Perfumes', price: '5,800 ETB' },
    { id: 4, name: 'Bleu De Chanel Paris', brand: 'Chanel', price: '28,000 ETB' },
    { id: 5, name: 'Lattafa Yara (Pink)', brand: 'Lattafa Perfumes', price: '5,200 ETB' },
  ]);

  const [slips, setSlips] = useState([
    { id: 'SLP-2048', buyerName: 'Samuel Bekele', customerName: 'Samuel Bekele', product: 'Club De Nuit Intense Man', date: '2025-08-12', amount: '8,200 ETB', method: 'Telebirr', status: 'Paid', new: true },
    { id: 'SLP-2047', buyerName: 'Marta Tadesse', customerName: 'Marta Tadesse', product: 'Dior Sauvage Eau de Parfum', date: '2025-08-11', amount: '12,400 ETB', method: 'CBE', status: 'Paid', new: false },
    { id: 'SLP-2046', buyerName: 'Abel Tesfaye', customerName: 'Abel Tesfaye', product: 'Lattafa Khamrah', date: '2025-08-10', amount: '6,750 ETB', method: 'Abay', status: 'Pending', new: true },
    { id: 'SLP-2045', buyerName: 'Selam Haile', customerName: 'Selam Haile', product: 'Bleu De Chanel Paris', date: '2025-08-09', amount: '14,900 ETB', method: 'e-Mpesa', status: 'Paid', new: false },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAuthenticated(Boolean(user?.role === 'admin'));
      } catch {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const getBuyerName = (slip) => slip?.buyerName || slip?.customerName || slip?.name || 'Customer';

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    price: '',
    category: '',
    description: '',
  });

  const loginAdmin = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (trimmedEmail === DEMO_ADMIN.email && trimmedPassword === DEMO_ADMIN.password) {
      const demoUser = {
        name: DEMO_ADMIN.name,
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role,
      };

      localStorage.setItem('token', 'demo-admin-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      return { user: demoUser };
    }

    return authAPI.login({ email: trimmedEmail, password: trimmedPassword });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const response = await loginAdmin(adminEmail, adminPassword);

      if (response.user?.role !== 'admin') {
        setLocalError('This account does not have admin access.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      setAdminEmail('');
      setAdminPassword('');
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Admin login failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    navigate('/');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.brand && newProduct.price) {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { id: newId, ...newProduct }]);
      setNewProduct({ name: '', brand: '', price: '', category: '', description: '' });
      alert('Product added successfully!');
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handlePrintSlip = (slip) => {
    const printWindow = window.open('', '', 'height=500,width=800');
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${slip.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { max-width: 400px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
            .receipt-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .receipt-title { font-size: 24px; font-weight: bold; color: #d4af37; }
            .receipt-content { margin: 20px 0; }
            .receipt-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .receipt-row-label { font-weight: bold; }
            .receipt-footer { border-top: 2px solid #000; text-align: center; padding-top: 10px; margin-top: 20px; }
            .status { padding: 5px 10px; border-radius: 3px; display: inline-block; }
            .status.paid { background-color: #4CAF50; color: white; }
            .status.pending { background-color: #ff9800; color: white; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="receipt-header">
              <div class="receipt-title">NARDOS PERFUME</div>
              <p>Purchase Receipt</p>
            </div>
            <div class="receipt-content">
              <div class="receipt-row">
                <span class="receipt-row-label">Slip ID:</span>
                <span>${slip.id}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-row-label">Customer:</span>
                <span>${getBuyerName(slip)}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-row-label">Product:</span>
                <span>${slip.product}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-row-label">Date:</span>
                <span>${slip.date}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-row-label">Amount:</span>
                <span>${slip.amount}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-row-label">Method:</span>
                <span>${slip.method}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-row-label">Status:</span>
                <span class="status ${slip.status.toLowerCase()}">${slip.status}</span>
              </div>
            </div>
            <div class="receipt-footer">
              <p>Thank you for your purchase!</p>
              <p style="font-size: 12px; color: #666;">Nardos Luxury Perfume | Addis Ababa</p>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <h1>Nardos Admin</h1>
            <p>Sign in to manage products, slips, and store settings.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@nardos.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            {localError && <div className="login-error">{localError}</div>}

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="login-hint">
            <p>Demo admin:</p>
            <p>Email: <code>admin@nardos.com</code></p>
            <p>Password: <code>admin123</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Nardos Admin Dashboard</h1>
          <div className="admin-profile-box">
            <div className="admin-avatar">A</div>
            <div className="admin-profile-meta">
              <span className="admin-profile-name">Nardos Admin</span>
              <span className="admin-profile-role">Administrator</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button
              className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              🛍️ Products
            </button>
            <button
              className={`nav-btn ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              ➕ Add Product
            </button>
            <button
              className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </aside>

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <section className="admin-section">
              <h2>Dashboard</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <div className="stat-label">Total Products</div>
                    <div className="stat-value">{products.length}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">142</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-info">
                    <div className="stat-label">Orders</div>
                    <div className="stat-value">28</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-label">Revenue</div>
                    <div className="stat-value">562,500 ETB</div>
                  </div>
                </div>
              </div>

              <div className="welcome-section">
                <h3>Welcome to Nardos Admin Panel</h3>
                <p>Manage your perfume store efficiently. Use the navigation menu to:</p>
                <ul>
                  <li>View and manage all products</li>
                  <li>Add new fragrances to your collection</li>
                  <li>Update store settings and information</li>
                  <li>Monitor sales and customer activity</li>
                </ul>
              </div>

              <div className="welcome-section">
                <h3>Slip History</h3>
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Slip</th>
                        <th>Buyer Name</th>
                        <th>Perfume</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slips.map((slip) => (
                        <tr key={slip.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {slip.id}
                              {slip.new && <span className="new-badge">New</span>}
                            </div>
                          </td>
                          <td>{getBuyerName(slip)}</td>
                          <td>{slip.product || 'N/A'}</td>
                          <td>{slip.date || 'N/A'}</td>
                          <td>{slip.amount}</td>
                          <td>{slip.method}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={`status-pill ${slip.status.toLowerCase()}`}>
                                {slip.status}
                              </span>
                              <button
                                onClick={() => handlePrintSlip(slip)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#d4af37',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              >
                                🖨️ Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'products' && (
            <section className="admin-section">
              <h2>Product Management</h2>
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.price}</td>
                        <td>
                          <button className="edit-btn">Edit</button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'add-product' && (
            <section className="admin-section">
              <h2>Add New Product</h2>
              <form onSubmit={handleAddProduct} className="add-product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand *</label>
                    <input
                      type="text"
                      placeholder="Enter brand name"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="text"
                      placeholder="e.g., 7,500 ETB"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter product description"
                    rows="5"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className="add-product-btn">Add Product</button>
              </form>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="admin-section">
              <h2>Store Settings</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <h3>Store Information</h3>
                  <div className="setting-content">
                    <p><strong>Store Name:</strong> Nardos Perfume</p>
                    <p><strong>Location:</strong> Zebit, Addis Ababa, Ethiopia</p>
                    <p><strong>Phone:</strong> +251 988 338 401</p>
                    <p><strong>Email:</strong> info@nardosperfume.com</p>
                    <p><strong>Telegram:</strong> @nati909091</p>
                  </div>
                </div>

                <div className="setting-item">
                  <h3>Business Hours</h3>
                  <div className="setting-content">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>

                <div className="setting-item">
                  <h3>Store Status</h3>
                  <div className="setting-content">
                    <label>
                      <input type="checkbox" defaultChecked /> Store is Open
                    </label>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
