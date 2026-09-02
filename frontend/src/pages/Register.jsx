import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create Buyer Account</h1>
        <p>Register to shop and view your order history.</p>
        <label htmlFor="register-username">Username</label>
        <input id="register-username" value={formData.username} onChange={(event) => setFormData({ ...formData, username: event.target.value })} required />
        <label htmlFor="register-first-name">First name</label>
        <input id="register-first-name" value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} required />
        <label htmlFor="register-last-name">Last name</label>
        <input id="register-last-name" value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} required />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required />
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" minLength="6" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} required />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
