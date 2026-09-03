import React, { useState } from 'react';
import { contactAPI } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      await contactAPI.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Nardos</h1>
        <p>We'd love to hear from you. Get in touch with us today!</p>
      </div>

      <div className="container">
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form">
            <h2>Send us a Message</h2>
            {submitted && <div className="success-message">✓ Message sent successfully!</div>}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="info-item">
              <h3>📍 Address</h3>
              <p>Zebit, Addis Ababa<br/>Ethiopia</p>
            </div>
            <div className="info-item">
              <h3>📞 Phone</h3>
              <p><a href="tel:+251988338401">+251 988 338 401</a></p>
            </div>
            <div className="info-item">
              <h3>✉️ Email</h3>
              <p><a href="mailto:samuelalemsew4@gmail.com">samuelalemsew4@gmail.com</a></p>
            </div>
            <div className="info-item">
              <h3>🕐 Business Hours</h3>
              <p>
                Monday - Friday: 9:00 AM - 6:00 PM<br/>
                Saturday: 10:00 AM - 4:00 PM<br/>
                Sunday: Closed
              </p>
            </div>
            
            {/* Social Media */}
            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a 
                  href="https://facebook.com/nardosperfume" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon facebook" 
                  aria-label="Facebook"
                  title="Facebook"
                >
                  fh
                </a>
                <a 
                  href="https://t.me/nati909091" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon telegram" 
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M21.15 4.49c.39-.97-.8-1.59-1.53-1.11L2.7 10.93c-.63.31-.7 1.12-.12 1.5l3.89 1.82 1.5 4.64c.16.5.82.69 1.22.35l2.18-2.24 4.14 3.01c.47.34 1.04.13 1.18-.46l2.24-10.57Zm-12.7 8.22l7.46-4.68c.34-.2.66.17.39.44l-6.24 5.87-.61.64v-.05l-.98-2.82Z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/nardosperfume" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-icon instagram" 
                  aria-label="Instagram"
                  title="Instagram"
                >
                  📷
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
