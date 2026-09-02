import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          <span className="banner-item"> Welcome to NARDOS PERFUME</span>
          <span className="banner-item banner-center">debre zebit</span>
          <span className="banner-item"> Addis Ababa, Ethiopia |  +251988338401</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="navbar">
        {/* NARDOS IMAGE LOGO */}
        <Link to="/" className="brand">
          <div className="logo-circle">
            <div className="logo-text">
              <div className="logo-main">NARDOS</div>
              <div className="logo-sub">PERFUME</div>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className={menuOpen ? "nav-links active" : "nav-links"}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            HOME
          </Link>
          <Link to="/perfumes" onClick={() => setMenuOpen(false)}>
            PERFUMES
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            CART
          </Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            ADMIN
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            ABOUT
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            CONTACT
          </Link>
        </nav>

        {/* Right Side */}
        <div className="nav-actions">
          <Link to="/search" className="nav-icon">
            🔍
          </Link>
          <Link to="/cart" className="nav-icon cart">
            🛒 <span className="cart-count">0</span>
          </Link>
          <Link to="/admin" className="admin-link" title="Admin Panel">
            ⚙️
          </Link>
          
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </header>
    </>
  );
}

export default Navbar;
