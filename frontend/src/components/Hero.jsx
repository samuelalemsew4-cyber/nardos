import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" aria-label="Nardos Perfume collection">
      <div className="hero-content">
        <p className="hero-kicker">NARDOS LUXURY COLLECTION</p>
        <h1 className="hero-title">NARDOS<br />PERFUME</h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-subtitle">Discover your signature scent<br />Luxury that speaks for you</p>
        <Link to="/perfumes" className="hero-button">SHOP NOW <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
