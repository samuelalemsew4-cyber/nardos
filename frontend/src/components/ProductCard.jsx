import React from 'react';
import { getImageUrl } from '../services/api';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
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
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <span className="product-price">${product.price}</span>
        <button className="product-button">Add to Cart</button>
      </div>
    </div>
  );
}
