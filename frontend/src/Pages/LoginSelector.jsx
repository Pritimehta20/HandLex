import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginSelector.css';

const LoginSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="login-selector-wrapper">
      <div className="login-selector-container">
        <div className="login-selector-card">
          <h1>Welcome to Handlex</h1>
          <p className="subtitle">Choose your login type</p>

          <div className="login-options">
            <button
              onClick={() => navigate('/login/user')}
              className="login-option user-option"
            >
              <div className="option-icon">👤</div>
              <h2>User Login</h2>
              <p>Sign in as a regular user to learn and practice signs</p>
              <span className="arrow">→</span>
            </button>

            <div className="divider">OR</div>

            <button
              onClick={() => navigate('/admin/login')}
              className="login-option admin-option"
            >
              <div className="option-icon">🔐</div>
              <h2>Admin Login</h2>
              <p>Sign in as admin to manage signs and content</p>
              <span className="arrow">→</span>
            </button>
          </div>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelector;
