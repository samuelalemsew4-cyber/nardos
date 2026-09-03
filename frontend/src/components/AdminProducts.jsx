import React, { useEffect, useState } from 'react';
import './AdminProducts.css';
import api, { getImageUrl } from '../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Men',
    description: '',
    price: '',
    stock: '',
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Men', 'Women', 'Unisex', 'Luxury / Men', 'Luxury / Women', 'Luxury / Unisex'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.brand.trim() || !formData.description.trim() || Number(formData.price) <= 0) {
      alert('Please enter a valid product name, brand, description, and price.');
      return;
    }

    try {
      setSavingProduct(true);
      const token = localStorage.getItem('token');
      const productData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') productData.append(key, value);
      });
      if (imageFile) productData.append('image', imageFile);

      const response = editingProductId
        ? await api.put(`/products/${editingProductId}`, productData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          })
        : await api.post('/products', productData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });

      if (editingProductId) {
        setProducts(currentProducts => currentProducts.map(product =>
          product._id === editingProductId ? response.data.product : product
        ));
      } else {
        setProducts(currentProducts => [...currentProducts, response.data.product]);
      }

      setFormData({
        name: '',
        brand: '',
        category: 'Men',
        description: '',
        price: '',
        stock: '',
        image: ''
      });
      setImageFile(null);
      setEditingProductId(null);
      setShowForm(false);
    } catch (err) {
      const message = err.response?.data?.message ||
        (err.request ? 'Cannot connect to the server. Check the API URL and backend.' : err.message);
      alert(message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || 'Men',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock ?? '',
      image: product.image || ''
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="products-loading">Loading products...</div>;

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Product Management</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            type="button"
            className="add-product-btn"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingProductId(null);
              } else {
                setFormData({
                  name: '',
                  brand: '',
                  category: 'Men',
                  description: '',
                  price: '',
                  stock: '',
                  image: ''
                });
                setImageFile(null);
                setEditingProductId(null);
                setShowForm(true);
              }
            }}
          >
            {showForm ? '✕ Cancel' : '➕ Add Product'}
          </button>
        </div>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleAddProduct}>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) setFormData({ ...formData, image: '' });
              }}
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          <button type="submit" className="submit-btn">
            {savingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="product-image"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getImageUrl();
              }}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="brand">{product.brand}</p>
              <p className="category">{product.category}</p>
              <div className="product-meta">
                <span className="price">${product.price}</span>
                <span className="stock">Stock: {product.stock}</span>
              </div>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => handleEditProduct(product)}>✏️</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-data">No products found</div>
      )}
    </div>
  );
};

export default AdminProducts;
