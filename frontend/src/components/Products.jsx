import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl, productsAPI } from "../services/api";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString() + ' ETB';
    }
    return price;
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="products-header">
          <p>OUR COLLECTION</p>
          <h2>Featured Fragrances</h2>
          <div className="line"></div>
        </div>
        <p style={{ textAlign: 'center', color: '#666' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <p>OUR COLLECTION</p>
        <h2>Featured Fragrances</h2>
        <div className="line"></div>
      </div>

      {error && <p style={{ textAlign: 'center', color: '#d4af37' }}>⚠ {error}</p>}

      <div className="products-grid">
        {(products || []).slice(0, 5).map((item) => {
          const productId = item._id || item.id;

          return (
          <div key={productId} className="product-card">
            <div className="product-image-box">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getImageUrl();
                }}
              />
              <span className="category-badge">{item.category}</span>
            </div>

            <div className="product-details">
              <span className="brand-name">{item.brand}</span>
              <h3 className="product-title">{item.name}</h3>
              <p className="product-desc">{item.description}</p>

              <div className="product-footer">
                <span className="product-price">{formatPrice(item.price)}</span>
                <Link to={`/product/${productId}`} className="add-cart-btn">
                  Add to Cart 🛒
                </Link>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <div className="view-all-container">
        <Link to="/products" className="view-all-btn">View All Products →</Link>
      </div>
    </div>
  );
}
