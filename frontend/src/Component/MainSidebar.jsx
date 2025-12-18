// src/components/MainSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const MainSidebar = ({ user, onSignToText, onPractice }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar toggle

  const handleSignClick = (e) => {
    if (onSignToText) {
      e.preventDefault();
      onSignToText();
      setIsOpen(false);
    }
  };

  const handlePracticeClick = (e) => {
    e.preventDefault();
    if (onPractice) {
      onPractice();
    } else {
      navigate("/practice");
    }
    setIsOpen(false);
  };

  const closeAndNavigate = (to) => {
    navigate(to);
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        .ms-shell {
          display: flex;
        }

        .ms-shell-content {
          margin-left: 230px;
          width: calc(100% - 230px);
        }

        /* DESKTOP SIDEBAR */
        .ms-root {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 230px;
          background:
            radial-gradient(circle at top left, #e0f2fe, #fef3c7 45%, #fee2e2 85%);
          color: #0f172a;
          display: flex;
          flex-direction: column;
          padding: 16px 14px;
          border-right: 1px solid rgba(148,163,184,0.6);
          z-index: 1000;
          transform: translateX(0);
          transition: transform 0.2s ease-out;
        }

        .ms-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .ms-avatar {
          width: 60px;
          height: 60px;
          border-radius: 999px;
          background: linear-gradient(135deg,#6366f1,#ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          box-shadow: 0 12px 26px rgba(148,163,184,0.9);
        }

        .ms-name {
          font-size: 0.96rem;
          font-weight: 600;
          max-width: 170px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ms-project {
          font-size: 0.8rem;
          opacity: 0.75;
        }

        .ms-nav {
          flex: 1;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ms-section-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.65;
          margin: 6px 4px 2px;
        }

        .ms-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 11px;
          border-radius: 12px;
          color: #1f2937;
          text-decoration: none;
          font-size: 0.92rem;
          background: rgba(255,255,255,0.7);
          box-shadow: 0 6px 16px rgba(148,163,184,0.55);
          transition:
            transform .12s ease,
            box-shadow .12s ease,
            background .12s ease,
            color .12s ease;
        }

        .ms-link + .ms-link {
          margin-top: 4px;
        }

        .ms-link span.ms-icon {
          width: 22px;
          text-align: center;
        }

        .ms-link:hover {
          transform: translateX(3px);
          box-shadow: 0 10px 22px rgba(148,163,184,0.85);
          background: #eff6ff;
          color: #111827;
        }

        .ms-link-active {
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          color: #f9fafb;
          box-shadow: 0 12px 26px rgba(37,99,235,0.8);
        }

        .ms-footer {
          margin-top: 14px;
          border-top: 1px dashed rgba(148,163,184,0.8);
          padding-top: 10px;
        }

        .ms-logout {
          width: 100%;
          padding: 9px 10px;
          border-radius: 999px;
          border: none;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          font-weight: 500;
          box-shadow: 0 8px 18px rgba(248,113,113,0.65);
          transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
        }

        .ms-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(248,113,113,0.9);
          background: #fecaca;
        }

        /* MOBILE TOP BAR + DRAWER */
        .ms-topbar {
          display: none;
        }

        .ms-backdrop {
          display: none;
        }

        @media (max-width: 768px) {
          .ms-shell-content {
            margin-left: 0;
            width: 100%;
          }

          /* Top bar with hamburger */
          .ms-topbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            padding: 0 14px;
            background:
              radial-gradient(circle at top left, #e0f2fe, #fef3c7 45%, #fee2e2 85%);
            border-bottom: 1px solid rgba(148,163,184,0.6);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
          }

          .ms-topbar-title {
            font-size: 0.95rem;
            font-weight: 600;
            color: #0f172a;
          }

          .ms-menu-btn {
            width: 34px;
            height: 34px;
            border-radius: 999px;
            border: none;
            background: rgba(255,255,255,0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(148,163,184,0.7);
          }

          .ms-menu-lines {
            width: 18px;
            height: 2px;
            background: #111827;
            position: relative;
          }
          .ms-menu-lines::before,
          .ms-menu-lines::after {
            content: "";
            position: absolute;
            left: 0;
            width: 18px;
            height: 2px;
            background: #111827;
          }
          .ms-menu-lines::before {
            top: -6px;
          }
          .ms-menu-lines::after {
            top: 6px;
          }

          /* Sidebar becomes off-canvas drawer */
          .ms-root {
            top: 56px;
            height: calc(100vh - 56px);
            width: 260px;
            transform: translateX(-100%);
            padding: 14px 14px 16px;
          }

          .ms-root.ms-root-open {
            transform: translateX(0);
          }

          .ms-shell-content {
            margin-top: 56px;
          }

          .ms-header {
            flex-direction: row;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
          }

          .ms-nav {
            margin-top: 4px;
          }

          /* backdrop behind drawer */
          .ms-backdrop {
            position: fixed;
            inset: 56px 0 0 0;
            background: rgba(15,23,42,0.35);
            z-index: 900;
            display: none;
          }

          .ms-backdrop.ms-backdrop-show {
            display: block;
          }
        }
      `}</style>

      {/* Mobile top bar */}
      <div className="ms-topbar">
        <button
          type="button"
          className="ms-menu-btn"
          aria-label="Open navigation"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="ms-menu-lines" />
        </button>
        <div className="ms-topbar-title">
          {user?.name ? `Hi, ${user.name.split(" ")[0]}` : "HandLex"}
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      <div
        className={
          "ms-backdrop" + (isOpen ? " ms-backdrop-show" : "")
        }
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={
          "ms-root" + (isOpen ? " ms-root-open" : "")
        }
        aria-label="Main sidebar"
      >
        <div
          className="ms-header"
          onClick={() => {
            closeAndNavigate("/dashboard");
          }}
        >
          <div className="ms-avatar">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : (user?.email || "?").charAt(0).toUpperCase()}
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="ms-name">
              {user?.name || user?.email || "Guest"}
            </div>
            <div className="ms-project">HandLex</div>
          </div>
        </div>

        <nav className="ms-nav">
          <div className="ms-section-label">Main</div>

          <NavLink
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              "ms-link" + (isActive ? " ms-link-active" : "")
            }
          >
            <span className="ms-icon">🏠</span>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/sign-to-text"
            onClick={handleSignClick}
            className={({ isActive }) =>
              "ms-link" + (isActive ? " ms-link-active" : "")
            }
          >
            <span className="ms-icon">✋</span>
            <span>Sign → Text</span>
          </NavLink>

          <NavLink
            to="/text-to-sign"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              "ms-link" + (isActive ? " ms-link-active" : "")
            }
          >
            <span className="ms-icon">📝</span>
            <span>Text → Sign</span>
          </NavLink>

          <NavLink
            to="/lesson"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              "ms-link" + (isActive ? " ms-link-active" : "")
            }
          >
            <span className="ms-icon">📚</span>
            <span>Lessons</span>
          </NavLink>

          <NavLink
            to="/practice"
            onClick={handlePracticeClick}
            className={({ isActive }) =>
              "ms-link" + (isActive ? " ms-link-active" : "")
            }
          >
            <span className="ms-icon">🎯</span>
            <span>Practice</span>
          </NavLink>

          <NavLink
            to="/friends"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              "ms-link" + (isActive ? " ms-link-active" : "")
            }
          >
            <span className="ms-icon">👥</span>
            <span>Friends</span>
          </NavLink>
        </nav>

        <div className="ms-footer">
          <button
            className="ms-logout"
            type="button"
            onClick={() => closeAndNavigate("/logout")}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MainSidebar;
