import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login({ identifier, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Buyer Login</h1>
        <p>Sign in to manage your cart and order history.</p>
        <label htmlFor="login-identifier">Email or username</label>
        <input id="login-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <p>New buyer? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
};

export default Login;
