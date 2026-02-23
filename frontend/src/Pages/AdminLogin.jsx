import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthContext';
import { baseUrl } from '../Common/SummaryApi';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      login(data.token, {
        userId: data.userId,
        name: data.name,
        email: data.email,
        isAdmin: true
      });

      navigate('/admin/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1>Admin Portal</h1>
          <p className="subtitle">Manage Signs & Content</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          <div className="login-footer">
            <p>Not an admin? <a href="/login">User Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
