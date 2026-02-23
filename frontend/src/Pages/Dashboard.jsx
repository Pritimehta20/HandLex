// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import MainSidebar from "../Component/MainSidebar";

// simple hook to animate numbers (for the practice ring)
const useAnimatedValue = (target, duration = 600) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target == null) return;
    let frameId;
    const start = performance.now();

    const animate = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      setValue(Math.round(eased * target));
      if (t < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return value;
};

const getQuizGradeStyle = (percentage) => {
  if (percentage >= 90) return { bg: '#dcfce7', color: '#166534', emoji: '🥇' };
  if (percentage >= 70) return { bg: '#fef3c7', color: '#92400e', emoji: '🥈' };
  if (percentage >= 50) return { bg: '#dbeafe', color: '#1e40af', emoji: '🥉' };
  return { bg: '#fecaca', color: '#b91c1c', emoji: '📚' };
};

const heroSlides = [
  {
    id: 1,
    title: "Learning in every gesture",
    text: "Sign language helps children see, feel, and remember every word.",
    color: "#38bdf8",
    emoji: "🤟",
    image: "/lessons/covers/banner.png",
  },
  {
    id: 2,
    title: "Counting with hands",
    text: "Numbers become fun when you can show them on your fingers.",
    color: "#f97316",
    emoji: "✋",
    image: "/lessons/covers/banner2.png",
  },
  {
    id: 3,
    title: "Many hands, one language",
    text: "Different people, different hands – one beautiful way to communicate.",
    color: "#22c55e",
    emoji: "🌈",
    image: "/lessons/covers/banner3.png",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [signStatus, setSignStatus] = useState("checking...");
  const [textStatus, setTextStatus] = useState("checking...");
  const [cameraActive, setCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  const [heroIndex, setHeroIndex] = useState(0);

  // practice insights summary from PracticeSign
  const [practiceSummary, setPracticeSummary] = useState(null);
  const animatedAvg = useAnimatedValue(practiceSummary?.avgScore || 0, 800);

  // ✅ QUIZ HISTORY - NEW STATE
  const [quizHistoryData, setQuizHistoryData] = useState([]);

// ✅ NEWEST QUIZ FIRST
const lastQuizResult = quizHistoryData.length > 0 ? quizHistoryData[0] : null;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");

    if (token || storedUser) {
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Invalid user data JSON", e);
        }
      }
      setIsAuthenticating(false);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ✅ QUIZ HISTORY LOADING
  // ✅ FIXED: QUIZ HISTORY with SORTING + REAL-TIME UPDATES
useEffect(() => {
  if (!user) return;

  const userId = user?.userId || user?._id || user?.id || 'guest';
  const quizHistoryKey = `quizHistory_${userId}`;
  
  const loadQuizHistory = () => {
    try {
      console.log('🔍 Loading quiz history for:', userId);
      const raw = localStorage.getItem(quizHistoryKey);
      const history = raw ? JSON.parse(raw) : [];
      
      // ✅ SORT NEWEST FIRST
      const sortedHistory = Array.isArray(history) 
        ? history.sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
        
      console.log('📊 Loaded & sorted:', sortedHistory.length, 'quizzes');
      setQuizHistoryData(sortedHistory);
    } catch (e) {
      console.error("❌ Quiz history error:", e);
      setQuizHistoryData([]);
    }
  };

  loadQuizHistory();
  
  // ✅ RELOAD ON NEW QUIZ RESULT (real-time sync)
  const handleQuizSaved = () => loadQuizHistory();
  window.addEventListener('quizResultSaved', handleQuizSaved);
  window.addEventListener('storage', loadQuizHistory);
  
  return () => {
    window.removeEventListener('quizResultSaved', handleQuizSaved);
    window.removeEventListener('storage', loadQuizHistory);
  };
}, [user?.userId]);


  useEffect(() => {
    const checkServices = async () => {
      try {
        const signRes = await fetch("http://localhost:5000/api/status");
        const signData = await signRes.json();
        setSignStatus(signData.status === "online" ? "🟢 Online" : "🔴 Offline");

        const cameraRes = await fetch("http://localhost:5000/api/camera-status");
        const cameraData = await cameraRes.json();
        setCameraActive(cameraData.camera_active);

        const textRes = await fetch("http://localhost:5001/api/status");
        const textData = await textRes.json();
        setTextStatus(textData.status === "online" ? "🟢 Online" : "🔴 Offline");
      } catch (error) {
        setSignStatus("🔴 Offline");
        setTextStatus("🔴 Offline");
        setCameraActive(false);
      }
    };

    checkServices();
    const interval = setInterval(checkServices, 3000);
    return () => clearInterval(interval);
  }, []);

  // auto‑slide hero carousel
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // load practice weak‑areas summary once (user-specific)
  useEffect(() => {
    const userId = user?.userId || user?._id || user?.id;
    
    if (!userId) {
      console.warn("Dashboard: No User ID found yet, waiting...");
      return;
    }
    
    try {
      const userSpecificKey = `practiceWeakSummary_${userId}`;
      const raw = localStorage.getItem(userSpecificKey);
      
      if (!raw) {
        console.log("Dashboard: No practice data found for key:", userSpecificKey);
        return;
      }
      
      const data = JSON.parse(raw);
      setPracticeSummary(data);
      console.log("Dashboard: Successfully loaded practice summary", data);
    } catch (e) {
      console.error("Dashboard: Failed to read practiceWeakSummary", e);
    }
  }, [user]);

  const handleSignToText = async () => {
    if (signStatus !== "🟢 Online") {
      alert("Sign→Text service is offline!");
      return;
    }

    setIsStartingCamera(true);

    try {
      const res = await fetch("http://localhost:5000/api/start-camera", {
        method: "POST",
      });
      await res.json();
      navigate("/sign-to-text");
    } catch (error) {
      console.error("Camera start failed:", error);
      alert("Failed to start camera. Please check Python service.");
      setIsStartingCamera(false);
    }
  };

  const handlePractice = async () => {
    if (signStatus !== "🟢 Online") {
      alert("Sign→Text service is offline!");
      return;
    }

    setIsStartingCamera(true);

    try {
      const res = await fetch("http://localhost:5000/api/start-camera", {
        method: "POST",
      });
      await res.json();
      navigate("/practice");
    } catch (error) {
      console.error("Camera start failed:", error);
      alert("Failed to start camera. Please check Python service.");
      setIsStartingCamera(false);
    }
  };

  const handleTextToSign = () => {
    if (textStatus !== "🟢 Online") {
      alert("Text→Sign service is offline!");
      return;
    }
    navigate("/text-to-sign");
  };

  // ✅ QUIZ CALCULATIONS
  // ✅ FIXED QUIZ STATS
const bestQuizScore = quizHistoryData.length > 0 
  ? Math.max(...quizHistoryData.map(h => h.percentage || 0))
  : 0;
const avgQuizScore = quizHistoryData.length > 0 
  ? Math.round(quizHistoryData.reduce((sum, h) => sum + (h.percentage || 0), 0) / quizHistoryData.length)
  : 0;
const totalQuizzes = quizHistoryData.length;

  if (isAuthenticating) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, #e0f2fe, #fef9c3 40%, #fee2e2 80%)",
          color: "#0f172a",
          fontSize: "1.5rem",
        }}
      >
        🔄 Authenticating...
      </div>
    );
  }

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="ms-shell">
      <style>{`
        .dash-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, #e0f2fe, #f8fafc 40%, #e5e7eb 80%);
          color: #0f172a;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .dash-main {
          padding: 28px 18px 36px;
        }

        /* HERO */
        .dash-hero {
          max-width: 1040px;
          margin: 0 auto 28px;
          position: relative;
        }
        .dash-hero-card {
          border-radius: 26px;
          padding: 20px 20px;
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.1fr);
          gap: 18px;
          align-items: stretch;
          background: #ffffff;
          box-shadow: 0 20px 50px rgba(148,163,184,0.6);
          overflow: hidden;
          transform: translateY(0) scale(1);
          opacity: 1;
          animation: dash-fade-in 0.35s ease-out;
        }
        .dash-hero-left h1 {
          margin: 0 0 6px;
          font-size: 1.9rem;
          font-weight: 800;
          background: linear-gradient(135deg,#2563eb,#a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dash-hero-left p {
          margin: 0 0 8px;
          font-size: 0.96rem;
          opacity: 0.9;
        }
        .dash-hero-chip {
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:4px 11px;
          border-radius:999px;
          background:#e0f2fe;
          border:1px solid #bae6fd;
          font-size:0.78rem;
          margin-bottom:8px;
          color:#075985;
          font-weight:600;
        }

        .dash-hero-right {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          min-height: 200px;
          max-height: 260px;
          background:#020617;
        }
        .dash-hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.02);
          transition: transform 3s ease-out;
        }
        .dash-hero-card:hover .dash-hero-image {
          transform: scale(1.06);
        }
        .dash-hero-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            130deg,
            rgba(15,23,42,0.15),
            rgba(15,23,42,0.5)
          );
        }
        .dash-hero-emoji-tag {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255,255,255,0.95);
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 1.05rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 10px 22px rgba(15,23,42,0.45);
        }

        .dash-hero-dots {
          position:absolute;
          bottom:8px;
          left:24px;
          display:flex;
          gap:6px;
        }
        .dash-hero-dot {
          width:8px;
          height:8px;
          border-radius:999px;
          background:rgba(148,163,184,0.6);
        }
        .dash-hero-dot-active {
          width:18px;
          background:#0f172a;
        }

        /* BUTTON GRID */
        .dash-buttons-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
          gap:20px;
          max-width:1040px;
          margin:0 auto 22px;
        }
        .dash-btn {
          padding:20px 22px;
          font-size:1.05rem;
          border:none;
          border-radius:20px;
          color:#0f172a;
          cursor:pointer;
          font-weight:600;
          box-shadow:0 12px 26px rgba(148,163,184,0.55);
          transition:transform .15s ease, box-shadow .15s ease, filter .15s ease;
          text-align:left;
        }
        .dash-btn:disabled {
          cursor:not-allowed;
          filter:grayscale(0.35);
        }
        .dash-btn:not(:disabled):hover {
          transform:translateY(-3px);
          box-shadow:0 16px 32px rgba(148,163,184,0.7);
        }

        /* STATUS PANEL */
        .dash-status-panel {
          margin-top:20px;
          padding:16px 18px;
          background:rgba(255,255,255,0.96);
          border-radius:16px;
          max-width:760px;
          margin-left:auto;
          margin-right:auto;
          box-shadow:0 10px 26px rgba(148,163,184,0.7);
          font-size:0.9rem;
          border:1px solid #e5e7eb;
        }
        .dash-status-row {
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          justify-content:center;
        }

        /* Practice insights card */
        .dash-practice-card {
          max-width: 1040px;
          margin: 0 auto 22px;
          background: radial-gradient(circle at top left,#e0f2fe,#eef2ff 40%,#fee2e2);
          border-radius: 22px;
          padding: 14px 14px 12px;
          box-shadow: 0 18px 40px rgba(15,23,42,0.45);
          font-size: 0.9rem;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr);
          gap: 14px;
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .dash-practice-card {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .dash-practice-left {
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding:4px 4px 8px;
        }
        .dash-practice-right {
          padding:4px 4px 8px;
        }
        .dash-practice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }
        .dash-practice-title {
          font-weight: 600;
          font-size: 1rem;
          color: #0f172a;
          display:flex;
          align-items:center;
          gap:6px;
        }
        .dash-practice-ring {
          position: relative;
          width: 130px;
          height: 130px;
        }
        .dash-practice-ring svg {
          transform: rotate(-90deg);
        }
        .dash-practice-ring-bg {
          stroke: rgba(15,23,42,0.12);
          stroke-width: 10;
        }
        .dash-practice-ring-fg {
          stroke: url(#gradPractice);
          stroke-width: 10;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.4s ease-out;
        }
        .dash-practice-ring-center {
          position:absolute;
          inset:0;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          pointer-events:none;
        }
        .dash-practice-ring-score {
          font-size:1.4rem;
          font-weight:700;
          color:#0f172a;
        }
        .dash-practice-ring-label {
          font-size:0.75rem;
          text-transform:uppercase;
          letter-spacing:0.08em;
          color:#4b5563;
        }
        .dash-practice-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 4px;
        }
        .dash-practice-chip {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #fecaca;
          background: rgba(248, 113, 113, 0.1);
          font-size: 0.8rem;
          color: #b91c1c;
        }
        .dash-practice-chip-weak {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #c7d2fe;
          background: rgba(59,130,246,0.08);
          font-size: 0.8rem;
          color: #1d4ed8;
        }
        .dash-practice-tag {
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:3px 9px;
          border-radius:999px;
          background:rgba(34,197,94,0.12);
          font-size:0.75rem;
          color:#166534;
        }

        /* ✅ QUIZ HISTORY CARD */
        .dash-quiz-card {
          max-width: 1040px;
          margin: 28px auto 22px;
          background: linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%);
          border-radius: 22px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(34,197,94,0.25);
          border: 2px solid rgba(34,197,94,0.2);
          scrollbar-width: thin;
          scrollbar-color: rgba(34,197,94,0.3) transparent;
        }
        .dash-quiz-card::-webkit-scrollbar {
          width: 6px;
        }
        .dash-quiz-card::-webkit-scrollbar-track {
          background: transparent;
        }
        .dash-quiz-card::-webkit-scrollbar-thumb {
          background: rgba(34,197,94,0.3);
          border-radius: 3px;
        }

        @keyframes dash-fade-in {
          from { opacity:0; transform:translateY(10px) scale(0.98); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) {
          .dash-main {
            padding: 24px 14px 30px;
          }
          .dash-hero-card {
            grid-template-columns: minmax(0, 1fr);
          }
          .dash-hero-right {
            min-height: 200px;
            max-height: 260px;
          }
        }

        @media (max-width: 768px) {
          .dash-main {
            padding: 20px 10px 26px;
          }
          .dash-hero {
            margin-bottom: 22px;
          }
          .dash-hero-card {
            padding: 18px 12px;
          }
          .dash-hero-left h1 {
            font-size: 1.5rem;
          }
          .dash-hero-right {
            min-height: 190px;
            max-height: 230px;
          }
          .dash-buttons-grid {
            gap: 16px;
          }
          .dash-btn {
            padding: 18px 18px;
            font-size: 1rem;
          }
          .dash-status-panel {
            padding: 14px 12px;
          }
        }

        @media (max-width: 480px) {
          .dash-main {
            padding: 16px 8px 22px;
          }
          .dash-hero-right {
            min-height: 170px;
            max-height: 210px;
          }
          .dash-hero-emoji-tag {
            font-size: 0.95rem;
            padding: 4px 9px;
          }
          .dash-practice-ring {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>

      <MainSidebar
        user={user}
        onSignToText={handleSignToText}
        onPractice={handlePractice}
      />

      {isStartingCamera && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              border: "6px solid rgba(148,163,184,0.4)",
              borderTopColor: "#38bdf8",
              animation: "dash-spin 0.8s linear infinite",
            }}
          />
          <p style={{ marginTop: 18, fontSize: "1.1rem" }}>
            Starting camera, please wait...
          </p>
          <style>{`
            @keyframes dash-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <div className="ms-shell-content dash-root">
        <div className="dash-main">
          {/* Hero carousel */}
          <div className="dash-hero">
            <div className="dash-hero-card">
              <div className="dash-hero-left">
                <div className="dash-hero-chip">
                  <span>⭐ Deaf-friendly learning space</span>
                </div>
                <h1>{currentSlide.title}</h1>
                <p>{currentSlide.text}</p>
                {user && (
                  <p style={{ marginTop: 6, fontSize: "0.9rem", opacity: 0.85 }}>
                    👋 Hello, <strong>{user.name || user.email}</strong>
                  </p>
                )}
              </div>
              <div className="dash-hero-right">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="dash-hero-image"
                />
                <div className="dash-hero-image-overlay" />
                <div
                  className="dash-hero-emoji-tag"
                  style={{ border: `2px solid ${currentSlide.color}` }}
                >
                  <span>{currentSlide.emoji}</span>
                  <span style={{ fontSize: "0.8rem", color: "#0f172a" }}>
                    Sign & learn
                  </span>
                </div>
              </div>
            </div>
            <div className="dash-hero-dots">
              {heroSlides.map((s, idx) => (
                <div
                  key={s.id}
                  className={
                    "dash-hero-dot " +
                    (idx === heroIndex ? "dash-hero-dot-active" : "")
                  }
                />
              ))}
            </div>
          </div>

          {/* Service status chips */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              marginBottom: "22px",
              flexWrap: "wrap",
              fontSize: "0.95rem",
            }}
          >
            <div
              style={{
                padding: "9px 16px",
                background: "rgba(255,255,255,0.96)",
                borderRadius: "999px",
                boxShadow: "0 8px 18px rgba(148,163,184,0.6)",
              }}
            >
              <strong>✋ Sign→Text:</strong> {signStatus} · 📹 Camera:{" "}
              {cameraActive ? "🟢 ON" : "🟠 OFF"}
            </div>
            <div
              style={{
                padding: "9px 16px",
                background: "rgba(255,255,255,0.96)",
                borderRadius: "999px",
                boxShadow: "0 8px 18px rgba(148,163,184,0.6)",
              }}
            >
              <strong>📝 Text→Sign:</strong> {textStatus}
            </div>
          </div>

          {/* Big action buttons */}
          <div className="dash-buttons-grid">
            <button
              onClick={handleSignToText}
              className="dash-btn"
              style={{
                background:
                  signStatus === "🟢 Online"
                    ? cameraActive
                      ? "#bbf7d0" // soft green
                      : "#fed7aa" // soft orange
                    : "#e5e7eb", // disabled grey
              }}
              disabled={signStatus !== "🟢 Online"}
            >
              {signStatus === "🟢 Online"
                ? `✋ Sign → Text ${
                    cameraActive ? "(🟢 LIVE)" : "(🔴 START CAMERA)"
                  }`
                : "✋ Sign → Text (Offline)"}
            </button>

            <button
              onClick={handleTextToSign}
              className="dash-btn"
              style={{
                background:
                  textStatus === "🟢 Online" ? "#bfdbfe" : "#e5e7eb", // soft blue
              }}
              disabled={textStatus !== "🟢 Online"}
            >
              {textStatus === "🟢 Online"
                ? "📝 Text → Sign (Videos)"
                : "📝 Text → Sign (Offline)"}
            </button>

            <button
              onClick={() => navigate("/lesson")}
              className="dash-btn"
              style={{ background: "#e9d5ff" }} // soft purple
            >
              📚 Lessons (A–Z, Numbers, Colors…)
            </button>

            <button
              onClick={handlePractice}
              className="dash-btn"
              style={{ background: "#bbf7d0" }} // soft green
              disabled={signStatus !== "🟢 Online"}
            >
              🎯 Practice Signs
            </button>

            {/* ✅ NEW QUIZ BUTTON */}
            <button
              onClick={() => navigate("/quiz")}
              className="dash-btn"
              style={{ 
                background: "linear-gradient(135deg, #22c55e, #4ade80)",
                color: "white",
                fontWeight: "700"
              }}
            >
              📊 Take Quiz (15 Questions)
            </button>
          </div>

          {/* ✅ COMPLETE QUIZ HISTORY SECTION */}
         {/* ✅ ONLY LAST QUIZ RESULT - FULLY RESPONSIVE FOR ALL DEVICES */}
{user && lastQuizResult && (
  <div className="dash-quiz-card" style={{ 
    maxWidth: '1040px', 
    margin: '20px auto 18px',
    background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 12px 30px rgba(34,197,94,0.15)',
    border: '2px solid rgba(34,197,94,0.15)'
  }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '16px', 
      flexWrap: 'wrap', 
      gap: '12px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          fontSize: 'clamp(1.4rem, 4vw, 1.6rem)', 
          padding: '8px', 
          background: 'linear-gradient(135deg, #22c55e, #4ade80)', 
          borderRadius: '14px', 
          color: 'white' 
        }}>
          📊
        </div>
        <div>
          <div style={{ 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 3vw, 1.1rem)', 
            color: '#166534',
            lineHeight: '1.3'
          }}>Last Quiz</div>
          <div style={{ 
            fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', 
            color: '#6b7280' 
          }}>
            {lastQuizResult.completedAt}
          </div>
        </div>
      </div>
      
      {/* Score Badge */}
      {(() => {
        const percentage = lastQuizResult.percentage || 0;
        const getColor = (p) => p >= 80 ? { bg: '#dcfce7', color: '#166534', emoji: '🥇' } : 
                               p >= 60 ? { bg: '#fef3c7', color: '#92400e', emoji: '🥈' } : 
                               { bg: '#fecaca', color: '#b91c1c', emoji: '🥉' };
        const scoreStyle = getColor(percentage);
        return (
          <div style={{
            padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 20px)', 
            background: scoreStyle.bg, 
            borderRadius: '20px',
            color: scoreStyle.color, 
            fontWeight: '700', 
            fontSize: 'clamp(1rem, 3.5vw, 1.15rem)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            lineHeight: '1.2'
          }}>
            {scoreStyle.emoji} {percentage}%
          </div>
        );
      })()}
    </div>

    <div style={{
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(220px, 45vw, 240px), 1fr))',
      gap: 'clamp(12px, 4vw, 18px)', 
      marginBottom: '20px', 
      padding: 'clamp(14px, 4vw, 18px)',
      background: 'rgba(255,255,255,0.85)', 
      borderRadius: '16px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: 'clamp(1.8rem, 8vw, 2.2rem)', 
          fontWeight: '800', 
          color: '#1e293b',
          lineHeight: '1.1',
          marginBottom: '4px'
        }}>
          {lastQuizResult.score}/{lastQuizResult.total}
        </div>
        <div style={{ 
          fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', 
          color: '#6b7280', 
          fontWeight: '500' 
        }}>
          Correct Answers
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: 'clamp(1rem, 3.5vw, 1.1rem)', 
          fontWeight: '700', 
          color: '#374151', 
          padding: 'clamp(6px, 2vw, 8px) clamp(14px, 4vw, 18px)', 
          background: 'rgba(34,197,94,0.08)', 
          borderRadius: '14px',
          lineHeight: '1.2'
        }}>
          {lastQuizResult.grade}
        </div>
        <div style={{ 
          fontSize: 'clamp(0.75rem, 2.5vw, 0.85rem)', 
          color: '#6b7280', 
          marginTop: '6px' 
        }}>
          Performance Grade
        </div>
      </div>
    </div>

    <div style={{ 
      display: 'flex', 
      gap: 'clamp(12px, 3vw, 16px)', 
      justifyContent: 'center', 
      flexWrap: 'wrap' 
    }}>
      <button onClick={() => navigate("/quiz")}
        style={{
          background: 'linear-gradient(135deg, #22c55e, #4ade80)', 
          color: 'white', 
          border: 'none',
          padding: 'clamp(10px, 3vw, 12px) clamp(22px, 5vw, 28px)', 
          borderRadius: '24px', 
          fontWeight: '700', 
          fontSize: 'clamp(0.95rem, 3vw, 1rem)',
          boxShadow: '0 6px 25px rgba(34,197,94,0.3)',
          lineHeight: '1.2',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 10px 30px rgba(34,197,94,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 6px 25px rgba(34,197,94,0.3)';
        }}
      >
        🎯 New Quiz
      </button>
    </div>
  </div>
)}


          {/* Practice insights */}
          {practiceSummary && (
            <div className="dash-practice-card">
              {/* ring */}
              <div className="dash-practice-left">
                <div className="dash-practice-ring">
                  <svg width="130" height="130">
                    <defs>
                      <linearGradient
                        id="gradPractice"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      const radius = 50;
                      const circumference = 2 * Math.PI * radius;
                      const clamped = Math.max(
                        0,
                        Math.min(100, animatedAvg || 0)
                      );
                      const dash =
                        ((100 - clamped) / 100) * circumference;
                      return (
                        <>
                          <circle
                            className="dash-practice-ring-bg"
                            cx="65"
                            cy="65"
                            r={radius}
                            fill="none"
                          />
                          <circle
                            className="dash-practice-ring-fg"
                            cx="65"
                            cy="65"
                            r={radius}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={dash}
                          />
                        </>
                      );
                    })()}
                  </svg>
                  <div className="dash-practice-ring-center">
                    <div className="dash-practice-ring-score">
                      {animatedAvg}%
                    </div>
                    <div className="dash-practice-ring-label">
                      Last session
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 6 }}>
                  <span className="dash-practice-tag">
                    🔁 Practice radar
                    <span
                      style={{
                        fontSize: "0.7rem",
                        opacity: 0.8,
                        marginLeft: 4,
                      }}
                    >
                      {new Date(
                        practiceSummary.lastUpdated
                      ).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>

              {/* weak & skipped chips */}
              <div className="dash-practice-right">
                <div className="dash-practice-header">
                  <div className="dash-practice-title">
                    🎯 Where to focus next
                  </div>
                  <span
                    style={{ fontSize: "0.8rem", color: "#4b5563" }}
                  >
                    Session average:{" "}
                    <strong>{practiceSummary.avgScore}%</strong>
                  </span>
                </div>

                {practiceSummary.weakSigns &&
                practiceSummary.weakSigns.length > 0 ? (
                  <>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "0.86rem",
                        color: "#374151",
                      }}
                    >
                      These signs could use a little extra practice:
                    </p>
                    <div className="dash-practice-badges">
                      {practiceSummary.weakSigns.map((s) => (
                        <div
                          key={s.id}
                          className="dash-practice-chip-weak"
                        >
                          {s.label} · {s.score}%
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: "0.86rem",
                      color: "#16a34a",
                    }}
                  >
                    Amazing work! No weak signs in your last practice
                    session.
                  </p>
                )}

                {practiceSummary.skippedSigns &&
                  practiceSummary.skippedSigns.length > 0 && (
                    <>
                      <p
                        style={{
                          margin: "10px 0 4px",
                          fontSize: "0.84rem",
                          color: "#7f1d1d",
                        }}
                      >
                        You skipped these signs last time:
                      </p>
                      <div className="dash-practice-badges">
                        {practiceSummary.skippedSigns.map((s) => (
                          <div
                            key={s.id}
                            className="dash-practice-chip"
                          >
                            {s.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
              </div>
            </div>
          )}

          {/* Detailed status panel */}
          <div className="dash-status-panel">
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>
              ℹ️ Services status overview
            </h3>
            <div className="dash-status-row">
              <p>
                <strong>Sign→Text:</strong> {signStatus} · Camera:{" "}
                {cameraActive ? "🟢 ON" : "🔴 OFF"}
              </p>
              <p>
                <strong>Text→Sign:</strong> {textStatus}
              </p>
              <p>
                <strong>MERN Backend:</strong> 🟢 Online (Port 8080)
              </p>
              {/* ✅ QUIZ STATS IN STATUS */}
             {quizHistoryData.length > 0 && (
  <p>
    <strong>📊 Quizzes:</strong> {totalQuizzes} total • Best: {bestQuizScore}% • Avg: {avgQuizScore}%
  </p>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
