import React from 'react';
import Products from '../components/Products';
import Footer from '../components/Footer';

export default function ProductsPage() {
  return (
    <div className="products-page">
      <div className="products-page-header">
        <h1>All Fragrances</h1>
        <p>Discover our complete collection of premium perfumes</p>
      </div>
      <Products />
      <Footer />
    </div>
  );
}
