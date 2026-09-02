import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, searchAPI } from '../services/api';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await searchAPI.search({ q: searchQuery });
        setProducts(response.data || []);
        setError('');
      } catch (err) {
        setProducts([]);
        setError('Failed to load products from MongoDB.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchQuery]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Perfumes</h1>
        <p>Find the best fragrance for your mood, style, and occasion.</p>
      </div>

      <div className="container">
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search by perfume name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn">Search</button>
        </form>

        <div className="search-results">
          {loading ? (
            <p className="search-empty">Loading products...</p>
          ) : error ? (
            <p className="search-empty">{error}</p>
          ) : searchQuery && products.length === 0 ? (
            <p className="search-empty">No perfume found for "{searchQuery}"</p>
          ) : (
            <div className="search-grid">
              {products.map((item) => (
                <Link key={item._id} to={`/product/${item._id}`} className="search-card">
                  <img src={getImageUrl(item.image)} alt={item.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = getImageUrl(); }} />
                  <div className="search-card-info">
                    <span className="brand-name">{item.brand}</span>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="search-card-bottom">
                      <span>{Number(item.price).toLocaleString()} ETB</span>
                      <button type="button">View</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!searchQuery && !loading && products.length === 0 && !error && (
            <p className="search-empty">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
