// src/pages/Login.jsx
import React, { useState } from "react";
import SummaryApi, { baseUrl } from "../Common/SummaryApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("❌ Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!validateEmail(formData.email)) {
      setEmailError("❌ Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}${SummaryApi.login.url}`, {
        method: SummaryApi.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
      } else {
        setMessage(data.message || "Login successful");

        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        if (data.userId || data.user) {
          const userData =
            data.user || {
              name: data.name,
              email: data.email,
              userId: data.userId,
            };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Network error — please check server connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          min-height: 100vh;
          padding: 24px 12px;
          background:
            radial-gradient(circle at top left, #e0f2fe, #fef9c3 40%, #fee2e2 80%);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 430px;
          background: rgba(255,255,255,0.98);
          border-radius: 24px;
          padding: 24px 24px 22px;
          box-shadow:
            0 22px 60px rgba(15,23,42,0.38),
            0 0 0 1px rgba(148,163,184,0.16);
        }

        .auth-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.78rem;
          margin-bottom: 6px;
        }

        .auth-title {
          margin: 0 0 4px;
          font-size: 1.4rem;
          font-weight: 700;
          color: #111827;
        }

        .auth-subtitle {
          margin: 0 0 14px;
          font-size: 0.86rem;
          color: #6b7280;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .auth-form label {
          font-size: 0.84rem;
          color: #374151;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-form input {
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          font-size: 0.9rem;
          outline: none;
          background: rgba(255,255,255,0.98);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        .auth-form input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px rgba(59,130,246,0.18);
          background: #ffffff;
        }

        .input-error {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 1px rgba(248,113,113,0.45);
        }

        .error-text {
          margin: -4px 0 4px;
          font-size: 0.78rem;
          color: #b91c1c;
        }

        .alert {
          padding: 8px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-bottom: 8px;
        }

        .alert-success {
          background: #ecfdf3;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .alert-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .auth-submit-btn {
          margin-top: 8px;
          padding: 11px 0;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg,#4f46e5,#6366f1);
          color: #eef2ff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 14px 32px rgba(79,70,229,0.55);
          transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 38px rgba(79,70,229,0.65);
        }

        .auth-note {
          margin-top: 10px;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .switch-auth {
          margin-top: 8px;
          font-size: 0.82rem;
          color: #6b7280;
        }

        .login-link {
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        /* responsive tweaks */
        @media (max-width: 768px) {
          .auth-page {
            align-items: flex-start;
          }
          .auth-card {
            max-width: 100%;
            margin-top: 16px;
            border-radius: 20px;
            padding: 22px 16px 20px;
            box-shadow:
              0 16px 32px rgba(15,23,42,0.32),
              0 0 0 1px rgba(148,163,184,0.12);
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 20px 14px 18px;
            border-radius: 18px;
          }
          .auth-form{
          width:250px;
          }
          .auth-form input {
            padding: 8px 12px;
            font-size: 0.85rem;
          }
          .auth-submit-btn {
            padding: 9px 0;
            font-size: 0.9rem;
            box-shadow: 0 10px 24px rgba(79,70,229,0.45);
          }
          .auth-title {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-pill">
          👋 <span>Welcome back, signer</span>
        </div>
        <h2 className="auth-title">Login</h2>
        <p className="auth-subtitle">
          Enter your details to access your learning space.
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              className={emailError ? "input-error" : ""}
            />
          </label>

          {emailError && <p className="error-text">{emailError}</p>}

          <label>
            Password
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || !!emailError}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-note">
            Visual alerts will confirm if login succeeds or fails.
          </p>

          <p className="switch-auth">
            Don't have an account?{" "}
            <span className="login-link" onClick={() => navigate("/")}>
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
