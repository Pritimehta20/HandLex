// src/pages/Register.jsx
import React, { useState } from "react";
import SummaryApi, { baseUrl } from "../Common/SummaryApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    preferredLanguage: "en",
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
    setMessage("");
    setError("");

    if (!validateEmail(formData.email)) {
      setEmailError("❌ Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}${SummaryApi.register.url}`, {
        method: SummaryApi.register.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        setMessage(data.message || "Registration successful");
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      setError("Network error, please try again");
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
  justify-content: center;
}

.auth-shell {
  width: 100%;
  max-width: 980px;
  background: rgba(255,255,255,0.98);
  border-radius: 28px;
  box-shadow:
    0 28px 70px rgba(15,23,42,0.4),
    0 0 0 1px rgba(148,163,184,0.16);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
  overflow: hidden;
}

/* LEFT PANEL */

.auth-left {
  padding: 26px 28px 24px;
  background: linear-gradient(135deg,#f9fafb,#eef2ff);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.auth-left-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.8rem;
  box-shadow: 0 12px 28px rgba(148,163,184,0.5);
  margin-bottom: 18px;
}

.auth-left-title {
  margin: 0 0 8px;
  font-size: 2rem;
  line-height: 1.15;
  font-weight: 700;
  color: #111827;
}

.auth-left-sub {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  max-width: 280px;
}

/* RIGHT PANEL (FORM) */

.auth-right {
  padding: 26px 28px 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: radial-gradient(circle at top left,#ffffff,#f9fafb);
}

.auth-right h2 {
  margin: 0 0 4px;
  font-size: 1.3rem;
  color: #0f172a;
}

.auth-right-subtitle {
  margin: 0 0 12px;
  font-size: 0.86rem;
  color: #6b7280;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-form label {
  font-size: 0.84rem;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.auth-form input,
.auth-form select {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 9px 12px;
  font-size: 0.9rem;
  outline: none;
  background: rgba(255,255,255,0.96);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.auth-form input:focus,
.auth-form select:focus {
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
  margin-top: 6px;
  padding: 10px 0;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg,#4f46e5,#6366f1);
  color: #eef2ff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(79,70,229,0.4);
  transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
}

.auth-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.auth-submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(79,70,229,0.5);
}

.auth-note {
  margin-top: 8px;
  font-size: 0.78rem;
  color: #6b7280;
  text-align: left;
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

/* MOBILE: only right side, smaller UI */

@media (max-width: 768px) {
  .auth-page {
    align-items: flex-start;
  }

  .auth-shell {
    grid-template-columns: minmax(0, 1fr); /* only one column */
    margin-top: 16px;
    margin-bottom: 24px;
    border-radius: 18px;
    box-shadow:
      0 16px 32px rgba(15,23,42,0.28),
      0 0 0 1px rgba(148,163,184,0.12);
  }

  .auth-left {
    display: none;                     /* hide left side */
  }

  .auth-right {
    padding: 18px 14px 18px;           /* tighter padding */
  }

  .auth-right h2 {
    font-size: 1.15rem;
  }

  .auth-right-subtitle {
    font-size: 0.8rem;
  }

  .auth-form input,
  .auth-form select {
  width:250px;
    padding: 7px 10px;
    font-size: 0.8rem;  
    border-radius: 999px;              /* smaller controls */
  }
    .auth-form label {
    font-size: 0.8rem;
  }

  .auth-submit-btn {
  width:250px;
    padding: 8px 0;
    font-size: 0.8rem;
    box-shadow: 0 8px 17px rgba(79,70,229,0.35);
  }
    .auth-note {
    font-size: 0.75rem;
  }

  .switch-auth {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .auth-shell {
    border-radius: 14px;
  }
}

      `}</style>

      <div className="auth-shell">
        {/* LEFT HERO (desktop only) */}
        <div className="auth-left">
          <div className="auth-left-pill">
            📚 Sign language learning space
          </div>
          <h1 className="auth-left-title">Create your account</h1>
          <p className="auth-left-sub">
            Join a visual‑first platform designed for Deaf and mute learners.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="auth-right">
          <h2>Welcome</h2>
          <p className="auth-right-subtitle">
            Fill in your details to get started.
          </p>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Name
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </label>

            <label>
              Email
              <input
                type="text"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Choose a password"
              />
            </label>

            <label>
              Preferred Language
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="en">English</option>
              </select>
            </label>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !!emailError}
            >
              {loading ? "Registering..." : "Create account"}
            </button>

            <p className="auth-note">
              This app is designed for Deaf and mute learners. All feedback will
              be visual (text & icons).
            </p>

            <p className="switch-auth">
              Already have an account?{" "}
              <span className="login-link" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
