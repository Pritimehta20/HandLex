// src/Pages/PracticeSign.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionProgressBar from '../Component/SessionProgressBar';
import PracticeSummary from '../Component/PracticeSummary';

const SESSION_SIZE = 5;
const PASS_THRESHOLD = 70;

// 🔹 build weak‑areas summary for dashboard
const buildWeakAreasSummary = (scores, skippedIds) => {
  if (!scores || scores.length === 0) return null;

  const enriched = scores.map((s) => ({
    ...s,
    passed: s.score >= PASS_THRESHOLD && !skippedIds.includes(s.id),
    skipped: skippedIds.includes(s.id),
  }));

  const weakByAccuracy = [...enriched]
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .slice(0, 3);

  const skipped = enriched.filter((s) => s.skipped);

  const avgScore =
    enriched.reduce((sum, s) => sum + (s.score || 0), 0) / enriched.length;

  return {
    lastUpdated: new Date().toISOString(),
    avgScore: Math.round(avgScore || 0),
    weakSigns: weakByAccuracy.map((s) => ({
      id: s.id,
      label: s.label,
      score: Math.round(s.score || 0),
    })),
    skippedSigns: skipped.map((s) => ({
      id: s.id,
      label: s.label,
    })),
  };
};

// Fisher–Yates shuffle so each visit gets a different order
const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const PracticeSign = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [sessionTargets, setSessionTargets] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionScores, setSessionScores] = useState([]);

  const [currentTask, setCurrentTask] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const [score, setScore] = useState(0);
  const [avgConf, setAvgConf] = useState(0);
  const [angleIndex, setAngleIndex] = useState(0);
  const [handshape, setHandshape] = useState('');
  const [hint, setHint] = useState('');

  const [unlockedLessonIds, setUnlockedLessonIds] = useState([]);
  const [skippedIds, setSkippedIds] = useState([]);

  const socketRef = useRef(null);

  // Attach video feed in PRACTICE mode
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src =
        'http://localhost:5000/video_feed?mode=practice&' + Date.now();
    }
  }, []);

  // Read completed lessons from localStorage ("alphabet","greetings", etc.)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('lessonProgress');
      const completed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(completed)) {
        setUnlockedLessonIds(completed);
      } else {
        setUnlockedLessonIds([]);
      }
    } catch (e) {
      console.error('Failed to read lessonProgress', e);
      setUnlockedLessonIds([]);
    }
  }, []);

  // Load practice tasks and build a shuffled 5-sign session only from unlocked lessons
  useEffect(() => {
    if (unlockedLessonIds.length === 0) {
      setSessionTargets([]);
      setSessionScores([]);
      setCurrentTask(null);
      return;
    }

    const loadTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/practice/tasks');
        const data = await res.json();
        const list = data.tasks || [];
        setTasks(list);

        const unlocked = list.filter(
          (t) => t.lessonId && unlockedLessonIds.includes(t.lessonId)
        );

        const shuffled = shuffleArray(unlocked);
        const session = shuffled.slice(0, SESSION_SIZE);

        setSessionTargets(session);
        setSessionScores(
          session.map((t) => ({
            id: t.id,
            label: t.label,
            score: 0,
            handScore: 0,
            stabilityScore: 0,
            angleScore: 0,
          }))
        );
        setSkippedIds([]);

        if (session.length > 0) {
          setSessionIndex(0);
          selectTask(session[0]);
        } else {
          setCurrentTask(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadTasks();
  }, [unlockedLessonIds]);

  // Socket.IO for practice_feedback + hint
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
    document.head.appendChild(script);

    script.onload = () => {
      const io = window.io;
      socketRef.current = io('http://localhost:5000');

      socketRef.current.on('connect', () => setSocketConnected(true));
      socketRef.current.on('disconnect', () => setSocketConnected(false));

      socketRef.current.on('practice_feedback', (data) => {
        if (!data || !data.details) return;
        const d = data.details;

        setScore(d.score || 0);
        setAvgConf(d.avg_conf || 0);
        setAngleIndex(d.angle_index || 0);
        setHandshape(d.handshape || '');

        const handScore = d.handshape === 'Good' ? 100 : 40;
        const stabilityScore = d.score;
        const angleScore = Math.max(0, 100 - Math.abs(d.angle_index - 90));

        setSessionScores((prev) =>
          prev.map((s) =>
            s.id === data.taskId
              ? {
                  ...s,
                  score: d.score,
                  handScore,
                  stabilityScore,
                  angleScore,
                }
              : s
          )
        );
      });

      socketRef.current.on('hint', (data) => {
        if (data && data.message) setHint(data.message);
      });
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.off('practice_feedback');
        socketRef.current.off('hint');
        socketRef.current.disconnect();
      }
      const el = document.querySelector('script[src*="socket.io"]');
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, []);

  // Auto-advance in session when current sign reaches PASS_THRESHOLD
  useEffect(() => {
    if (!currentTask || sessionTargets.length === 0) return;

    if (score >= PASS_THRESHOLD) {
      const idx = sessionTargets.findIndex((t) => t.id === currentTask.id);
      if (idx === -1) return;

      const next = sessionTargets[idx + 1];

      if (next) {
        const timeout = setTimeout(() => {
          setSessionIndex(idx + 1);
          selectTask(next);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [score, currentTask, sessionTargets]);

  const selectTask = (task) => {
    setCurrentTask(task);
    setScore(0);
    setAvgConf(0);
    setAngleIndex(0);
    setHandshape('');
    setHint('');

    fetch(`http://localhost:5000/api/practice/select/${task.id}`, {
      method: 'POST',
    }).catch(console.error);
  };

  const skipCurrentSign = () => {
    if (!currentTask || sessionTargets.length === 0) return;

    setSkippedIds((prev) =>
      prev.includes(currentTask.id) ? prev : [...prev, currentTask.id]
    );

    const idx = sessionTargets.findIndex((t) => t.id === currentTask.id);
    if (idx === -1) return;

    const next = sessionTargets[idx + 1];
    if (next) {
      setSessionIndex(idx + 1);
      selectTask(next);
    }
  };

  const currentSessionEntry = sessionScores.find(
    (s) => s.id === currentTask?.id
  );

  const isSessionFinished =
    sessionTargets.length > 0 &&
    sessionIndex === sessionTargets.length - 1 &&
    (score >= PASS_THRESHOLD || skippedIds.includes(currentTask?.id));

  // store weak‑areas summary for dashboard
  useEffect(() => {
    if (!isSessionFinished) return;
    const summary = buildWeakAreasSummary(sessionScores, skippedIds);
    if (!summary) return;

    try {
      localStorage.setItem('practiceWeakSummary', JSON.stringify(summary));
    } catch (e) {
      console.error('Failed to save practiceWeakSummary', e);
    }
  }, [isSessionFinished, sessionScores, skippedIds]);

  return (
    <>
      <style>{`
        .ps-root {
          min-height: 100vh;
          padding: 24px 12px 32px;
          background:
            radial-gradient(circle at top left, #bfdbfe, #fef3c7 40%, #fee2e2 80%);
          display: flex;
          justify-content: center;
          align-items: stretch;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .ps-shell {
          width: 100%;
          max-width: 1120px;
          background: rgba(255,255,255,0.95);
          border-radius: 24px;
          padding: 18px 16px 22px;
          box-shadow: 0 20px 40px rgba(15,23,42,0.25);
        }
        .ps-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .ps-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ps-subtitle {
          font-size: 0.9rem;
          color: #475569;
        }
        .ps-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .ps-shell {
            padding: 16px 12px 20px;
          }
          .ps-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .ps-video-card {
          background: #020617;
          border-radius: 20px;
          padding: 12px;
        }
        .ps-video-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.85rem;
          color: #e5e7eb;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ps-video-frame {
          border-radius: 16px;
          border: 3px solid rgba(56, 189, 248, 0.5);
          background: #0b1120;
          width: 100%;
          height: 340px;
          object-fit: cover;
        }
        .ps-video-footer {
          margin-top: 6px;
          font-size: 0.78rem;
          color: #9ca3af;
          display: flex;
          justify-content: space-between;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ps-right {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ps-task-card {
          background: #eff6ff;
          border-radius: 18px;
          padding: 10px 12px;
        }
        .ps-task-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
        }
        .ps-task-body {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ps-task-img {
          width: 100px;
          height: 100px;
          border-radius: 18px;
          object-fit: contain;
          background: white;
          border: 2px solid #93c5fd;
          flex-shrink: 0;
        }
        .ps-task-desc {
          font-size: 0.82rem;
          color: #4b5563;
        }
        .ps-task-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .ps-task-chip {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.8rem;
          border: 1px solid #bfdbfe;
          cursor: pointer;
          background: white;
        }
        .ps-task-chip.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .ps-progress-card {
          background: #f9fafb;
          border-radius: 18px;
          padding: 10px 12px;
        }
        .ps-progress-bar-wrap {
          width: 100%;
          height: 12px;
          border-radius: 999px;
          background: #e5e7eb;
          overflow: hidden;
          margin-top: 6px;
        }
        .ps-progress-bar-inner {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg,#22c55e,#4ade80);
          transition: width 0.2s ease;
        }
        .ps-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          margin-top: 4px;
          color: #4b5563;
        }
        .ps-feedback-row {
          margin-top: 4px;
          font-size: 0.83rem;
          color: #374151;
        }
        .ps-hint {
          margin-top: 8px;
          padding: 8px 10px;
          border-radius: 12px;
          font-size: 0.83rem;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(251, 191, 36, 0.14);
          color: #92400e;
        }
        .ps-hint-icon {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #78350f;
        }
        .ps-footer {
          margin-top: 6px;
          font-size: 0.78rem;
          color: #6b7280;
        }
        .ps-back-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          padding: 9px 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 6px 12px rgba(37, 99, 235, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Tablets & small laptops */
        @media (max-width: 1024px) {
          .ps-video-frame {
            height: 300px;
          }
        }

        /* Phones */
        @media (max-width: 768px) {
          .ps-root {
            padding: 18px 8px 24px;
          }
          .ps-shell {
            border-radius: 18px;
            padding: 14px 10px 18px;
          }
          .ps-header {
            align-items: flex-start;
          }
          .ps-title {
            font-size: 1.3rem;
          }
          .ps-video-card {
            padding: 10px;
          }
          .ps-video-frame {
            height: 240px;
          }
          .ps-task-body {
            align-items: flex-start;
          }
          .ps-task-img {
            width: 90px;
            height: 90px;
          }
          .ps-progress-bar-wrap {
            height: 10px;
          }
          .ps-back-btn {
            top: 10px;
            left: 10px;
            padding: 7px 12px;
            font-size: 0.78rem;
          }
        }

        /* Very small phones */
        @media (max-width: 480px) {
          .ps-root {
            padding: 16px 6px 20px;
          }
          .ps-video-frame {
            height: 210px;
          }
          .ps-video-header {
            font-size: 0.8rem;
          }
          .ps-video-footer {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <button
        className="ps-back-btn"
        onClick={() => {
          fetch('http://localhost:5000/api/stop-camera', { method: 'POST' }).catch(
            console.error
          );
          navigate('/dashboard');
        }}
      >
        ← Dashboard
      </button>

      <div className="ps-root">
        <div className="ps-shell">
          <div className="ps-header">
            <div>
              <div className="ps-title">🖐 Practice Signs</div>
              <div className="ps-subtitle">
                Complete this 5-sign session with signs from your unlocked lessons.
              </div>
            </div>
            <div style={{ fontSize: '0.83rem', color: '#4b5563' }}>
              Socket: {socketConnected ? '🟢 Connected' : '🔴 Connecting...'}
            </div>
          </div>

          <div className="ps-grid">
            {/* Left: camera */}
            <div className="ps-video-card">
              <div className="ps-video-header">
                <span>Practice camera</span>
                <span>Try to match the shape you see.</span>
              </div>
              <img
                ref={videoRef}
                className="ps-video-frame"
                alt="Practice video feed"
              />
              <div className="ps-video-footer">
                <span>Hold your hand in the center. Sign slowly.</span>
                <span>Score updates from the model.</span>
              </div>
            </div>

            {/* Right: either practice UI or final summary */}
            <div className="ps-right">
              {!isSessionFinished ? (
                <>
                  <SessionProgressBar
                    currentIndex={sessionIndex}
                    total={SESSION_SIZE}
                    scores={sessionScores}
                  />

                  {unlockedLessonIds.length === 0 && (
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: '#b45309',
                        background: '#fffbeb',
                        border: '1px solid #fed7aa',
                        padding: '8px 10px',
                        borderRadius: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      To start Practice, complete at least one lesson chapter in the
                      Lessons section.
                    </div>
                  )}

                  <div className="ps-task-card">
                    <div className="ps-task-title">
                      {currentTask ? currentTask.title : 'No unlocked signs yet'}
                    </div>

                    {currentTask && (
                      <div className="ps-task-body">
                        <img
                          src={currentTask.image}
                          alt={currentTask.label}
                          className="ps-task-img"
                        />
                        <div className="ps-task-desc">
                          Target sign: <b>{currentTask.label}</b>
                          <br />
                          Look at the fingers and hand angle. Try to match it as closely
                          as you can.
                        </div>
                      </div>
                    )}

                    <div className="ps-task-list">
                      {sessionTargets.map((t, idx) => (
                        <button
                          key={t.id}
                          className={
                            'ps-task-chip ' +
                            (currentTask && currentTask.id === t.id ? 'active' : '')
                          }
                          onClick={() => {
                            setSessionIndex(idx);
                            selectTask(t);
                          }}
                        >
                          {idx + 1}. {t.label}
                        </button>
                      ))}
                    </div>

                    {currentTask && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                        <button
                          onClick={skipCurrentSign}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 999,
                            border: '1px solid #f97316',
                            background: '#fffbeb',
                            color: '#b45309',
                            fontSize: '0.83rem',
                            cursor: 'pointer',
                          }}
                        >
                          Skip this sign →
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="ps-progress-card">
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: '#111827',
                      }}
                    >
                      Progress for this sign
                    </div>
                    <div className="ps-progress-bar-wrap">
                      <div
                        className="ps-progress-bar-inner"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <div className="ps-progress-meta">
                      <span>Accuracy: {score}%</span>
                      <span>Avg confidence: {(avgConf * 100).toFixed(0)}%</span>
                    </div>
                    <div className="ps-feedback-row">
                      Handshape: <b>{handshape || '—'}</b>
                    </div>
                    <div className="ps-feedback-row">
                      Example angle (index finger): <b>{angleIndex.toFixed(1)}°</b>
                    </div>
                    {currentSessionEntry && (
                      <>
                        <div className="ps-feedback-row">
                          Stability score:{' '}
                          <b>{currentSessionEntry.stabilityScore.toFixed(0)}%</b>
                        </div>
                        <div className="ps-feedback-row">
                          Angle score:{' '}
                          <b>{currentSessionEntry.angleScore.toFixed(0)}%</b>
                        </div>
                      </>
                    )}

                    {hint && (
                      <div className="ps-hint">
                        <div className="ps-hint-icon">💡</div>
                        <span>{hint}</span>
                      </div>
                    )}
                  </div>

                  <div className="ps-footer">
                    When a sign reaches {PASS_THRESHOLD}% accuracy, or you skip it, the
                    next sign in this 5-sign session will load automatically.
                  </div>
                </>
              ) : (
                <PracticeSummary scores={sessionScores} skippedIds={skippedIds} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PracticeSign;
