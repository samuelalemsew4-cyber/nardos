import React from 'react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="about-page">
      {/* About Header */}
      <div className="about-header">
        <h1>About Nardos Perfume</h1>
        <p>Bringing elegance and luxury to your everyday life</p>
      </div>

      {/* Main About Section */}
      <div className="about-container">
        <section className="about-story">
          <div className="about-content-grid">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Nardos Perfume is dedicated to bringing the finest fragrances from around the world to discerning customers in Ethiopia. With a passion for quality and authenticity, we curate an exclusive collection of premium perfumes that celebrate elegance, luxury, and individuality.
              </p>
              <p>
                Our name "Nardos" reflects our Ethiopian heritage and commitment to excellence. We believe that fragrance is more than just a scent—it's a statement of personal style and a memory that lasts.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop" alt="Perfume Collection" />
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision">
          <div className="mission">
            <h3>Our Mission</h3>
            <p>
              To provide authentic, premium fragrances that help our customers express their unique personality and style. We are committed to exceptional quality, competitive pricing, and outstanding customer service.
            </p>
          </div>
          <div className="vision">
            <h3>Our Vision</h3>
            <p>
              To become Ethiopia's most trusted premium fragrance retailer, recognized for our curated collection, expertise, and dedication to customer satisfaction.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-us">
          <h2>Why Choose Nardos?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h4>Authentic Products</h4>
              <p>100% genuine fragrances from trusted suppliers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h4>Premium Selection</h4>
              <p>Curated collection of luxury and affordable perfumes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h4>Expert Guidance</h4>
              <p>Personalized recommendations from perfume experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h4>Fast Delivery</h4>
              <p>Quick shipping across Addis Ababa and Ethiopia</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h4>Great Prices</h4>
              <p>Competitive pricing with excellent value</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h4>Customer Support</h4>
              <p>24/7 assistance via phone, email, and social media</p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="about-contact">
          <h2>Get in Touch</h2>
          <div className="contact-details">
            <div className="detail-item">
              <strong>Phone:</strong> +251 98 833 8401
            </div>
            <div className="detail-item">
              <strong>Email:</strong> info@nardosperfume.com
            </div>
            <div className="detail-item">
              <strong>Location:</strong> Zebit, Addis Ababa, Ethiopia
            </div>
            <div className="detail-item">
              <strong>Hours:</strong> Monday - Saturday: 9AM - 6PM
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
