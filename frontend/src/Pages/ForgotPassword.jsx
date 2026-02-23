import React, { useState } from "react";
import SummaryApi, { baseUrl } from "../Common/SummaryApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
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

    if (name === "newPassword") {
      if (!validatePassword(value)) {
        setPasswordError("❌ Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
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
      const res = await fetch(`${baseUrl}${SummaryApi.forgotPassword.url}`, {
        method: SummaryApi.forgotPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
      } else {
        setMessage(data.message || "OTP sent successfully!");
        setTimeout(() => {
          setStep(2);
          setMessage("");
        }, 1500);
      }
    } catch (err) {
      setError("Network error — please check server connection");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!formData.otp || formData.otp.length !== 6) {
      setError("❌ Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}${SummaryApi.verifyOTP.url}`, {
        method: SummaryApi.verifyOTP.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to verify OTP");
      } else {
        setMessage(data.message || "OTP verified successfully!");
        setTimeout(() => {
          setStep(3);
          setMessage("");
        }, 1500);
      }
    } catch (err) {
      setError("Network error — please check server connection");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!validatePassword(formData.newPassword)) {
      setPasswordError("❌ Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}${SummaryApi.resetPassword.url}`, {
        method: SummaryApi.resetPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setMessage(data.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
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

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .step-indicator {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          justify-content: center;
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d1d5db;
          transition: background 0.2s ease;
        }

        .step-dot.active {
          background: #4f46e5;
          width: 24px;
          border-radius: 999px;
        }

        .otp-input-container {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 12px;
        }

        .otp-input {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          text-align: center;
          font-size: 1.2rem;
          font-weight: 600;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .otp-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px rgba(59,130,246,0.18);
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
          .auth-form {
            width: 250px;
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
        <div onClick={() => navigate("/login")} className="back-button">
          ← Back to Login
        </div>

        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? "active" : ""}`}></div>
          <div className={`step-dot ${step >= 2 ? "active" : ""}`}></div>
          <div className={`step-dot ${step >= 3 ? "active" : ""}`}></div>
        </div>

        <div className="auth-pill">
          🔐 <span>Reset Password</span>
        </div>
        <h2 className="auth-title">Forgot Password</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* STEP 1: Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="auth-form">
            <p className="auth-subtitle">
              Enter your email to receive an OTP for password reset.
            </p>

            <label>
              Email Address
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !!emailError}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <p className="auth-subtitle">
              Enter the 6-digit OTP sent to your email.
            </p>

            <label>
              One-Time Password (OTP)
              <input
                type="text"
                name="otp"
                required
                maxLength="6"
                value={formData.otp}
                onChange={handleChange}
                placeholder="000000"
                autoComplete="off"
              />
            </label>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || formData.otp.length !== 6}
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                padding: "8px 0",
                marginTop: "4px",
              }}
            >
              Didn't receive OTP? Send again
            </button>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <p className="auth-subtitle">Create a new password for your account.</p>

            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Create a new password"
                autoComplete="new-password"
                className={passwordError ? "input-error" : ""}
              />
            </label>

            {passwordError && <p className="error-text">{passwordError}</p>}

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </label>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={
                loading ||
                !!passwordError ||
                !formData.newPassword ||
                !formData.confirmPassword
              }
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
