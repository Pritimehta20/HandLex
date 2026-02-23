// src/Pages/PracticeSign.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionProgressBar from '../Component/SessionProgressBar';
import PracticeSummary from '../Component/PracticeSummary';

const SESSION_SIZE = 5;
const PASS_THRESHOLD = 70;

// 🔹 Only these IDs will ever appear in Practice
const STATIC_LESSON_IDS = [
  'alphabet', 'numbers', 'common_interactions', 'colors', 
  'fruits', 'emotions', 'greetings', 'sensations', 'family'
];

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

  const avgScore = enriched.reduce((sum, s) => sum + (s.score || 0), 0) / enriched.length;

  return {
    lastUpdated: new Date().toISOString(),
    avgScore: Math.round(avgScore || 0),
    weakSigns: weakByAccuracy.map((s) => ({
      id: s.id,
      label: s.label,
      score: Math.round(s.score || 0),
    })),
    skippedSigns: enriched.filter(s => s.skipped).map(s => ({ id: s.id, label: s.label })),
  };
};

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
  const socketRef = useRef(null);

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
  const [skippedIds, setSkippedIds] = useState([]);
  const [user, setUser] = useState(null);

  // 1. Get User Context
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 2. Video Feed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = 'http://localhost:5000/video_feed?mode=practice&' + Date.now();
    }
  }, []);

  // 3. Load & Filter Tasks (Static Only)
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/practice/tasks');
        const data = await res.json();
        const allTasks = data.tasks || [];

        const userKey = user ? `lessonProgress_${user.userId}` : 'lessonProgress_guest';
        const rawProgress = localStorage.getItem(userKey);
        const unlockedIds = rawProgress ? JSON.parse(rawProgress) : [];

        // Filter: Must be in STATIC_LESSON_IDS
        let filtered = allTasks.filter(t => STATIC_LESSON_IDS.includes(t.lessonId));
        
        // If user has progress, show only their unlocked static signs
        // If no progress yet, show all static signs (Prevents blocking the user)
        if (unlockedIds.length > 0) {
          const unlockedOnly = filtered.filter(t => unlockedIds.includes(t.lessonId));
          if (unlockedOnly.length > 0) filtered = unlockedOnly;
        }

        const shuffled = shuffleArray(filtered).slice(0, SESSION_SIZE);
        setSessionTargets(shuffled);
        setSessionScores(shuffled.map(t => ({
          id: t.id, label: t.label, score: 0, handScore: 0, stabilityScore: 0, angleScore: 0
        })));
        
        if (shuffled.length > 0) selectTask(shuffled[0]);
      } catch (err) { console.error("Error loading tasks:", err); }
    };
    loadTasks();
  }, [user]);

  // 4. Socket Connection
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
    document.head.appendChild(script);

    script.onload = () => {
      socketRef.current = window.io('http://localhost:5000');
      socketRef.current.on('connect', () => setSocketConnected(true));
      socketRef.current.on('practice_feedback', (data) => {
        if (!data || !data.details) return;
        const d = data.details;
        setScore(d.score || 0);
        setAvgConf(d.avg_conf || 0);
        setAngleIndex(d.angle_index || 0);
        setHandshape(d.handshape || '');

        setSessionScores(prev => prev.map(s => 
          s.id === data.taskId ? { 
            ...s, 
            score: d.score, 
            stabilityScore: d.score, 
            angleScore: Math.max(0, 100 - Math.abs(d.angle_index - 90)) 
          } : s
        ));
      });
      socketRef.current.on('hint', (data) => data?.message && setHint(data.message));
    };

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 5. Auto-Advance Logic
  useEffect(() => {
    if (score >= PASS_THRESHOLD && currentTask) {
      const idx = sessionTargets.findIndex(t => t.id === currentTask.id);
      if (idx !== -1 && sessionTargets[idx + 1]) {
        const timer = setTimeout(() => {
          setSessionIndex(idx + 1);
          selectTask(sessionTargets[idx + 1]);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [score, currentTask, sessionTargets]);

  const selectTask = (task) => {
    setCurrentTask(task);
    setScore(0); setAvgConf(0); setHandshape(''); setHint('');
    fetch(`http://localhost:5000/api/practice/select/${task.id}`, { method: 'POST' }).catch(console.error);
  };

  const skipCurrentSign = () => {
    if (!currentTask) return;
    setSkippedIds(prev => [...prev, currentTask.id]);
    const idx = sessionTargets.findIndex(t => t.id === currentTask.id);
    if (sessionTargets[idx + 1]) {
      setSessionIndex(idx + 1);
      selectTask(sessionTargets[idx + 1]);
    }
  };

  const isSessionFinished = sessionTargets.length > 0 && 
    sessionIndex === sessionTargets.length - 1 && 
    (score >= PASS_THRESHOLD || skippedIds.includes(currentTask?.id));

  // Save Summary on finish
  // Around line 315-325, update the save summary effect:

  // Save Summary on finish
  useEffect(() => {
    if (isSessionFinished && user) {
      const summary = buildWeakAreasSummary(sessionScores, skippedIds);
      const userKey = `practiceWeakSummary_${user.userId}`;
      localStorage.setItem(userKey, JSON.stringify(summary));

      // Also save to history
      const historyKey = `practiceSummaryHistory_${user.userId}`;
      const historyRaw = localStorage.getItem(historyKey);
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      
      const updated = [summary, ...history].slice(0, 10); // Keep last 10
      localStorage.setItem(historyKey, JSON.stringify(updated));
    }
  }, [isSessionFinished, user]);
  return (
    <>
      <style>{`
        .ps-root { min-height: 100vh; padding: 24px 12px; background: radial-gradient(circle at top left, #bfdbfe, #fef3c7 40%, #fee2e2 80%); display: flex; justify-content: center; font-family: system-ui, sans-serif; }
        .ps-shell { width: 100%; max-width: 1100px; background: rgba(255,255,255,0.95); border-radius: 24px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
        .ps-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .ps-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }
        @media (max-width: 960px) { .ps-grid { grid-template-columns: 1fr; } }
        .ps-video-frame { width: 100%; height: 350px; background: #000; border-radius: 16px; border: 4px solid #38bdf8; object-fit: cover; }
        .ps-task-card { background: #eff6ff; padding: 16px; border-radius: 18px; margin-bottom: 12px; }
        .ps-task-img { width: 100px; height: 100px; background: white; border-radius: 12px; object-fit: contain; border: 1px solid #bfdbfe; }
        .ps-task-chip { padding: 6px 12px; border-radius: 20px; border: 1px solid #bfdbfe; background: white; cursor: pointer; margin: 3px; font-size: 0.85rem; }
        .ps-task-chip.active { background: #3b82f6; color: white; border-color: #3b82f6; }
        .ps-progress-bar-wrap { width: 100%; height: 12px; background: #e5e7eb; border-radius: 10px; margin: 10px 0; overflow: hidden; }
        .ps-progress-bar-inner { height: 100%; background: linear-gradient(90deg,#22c55e,#4ade80); transition: width 0.4s ease; }
        .ps-back-btn { position: fixed; top: 15px; left: 15px; padding: 10px 20px; background: #2563eb; color: white; border-radius: 30px; border: none; cursor: pointer; z-index: 100; font-weight: 600; box-shadow: 0 4px 10px rgba(37,99,235,0.3); }
        .ps-hint { margin-top: 10px; padding: 10px; background: #fffbeb; color: #92400e; border-radius: 10px; font-size: 0.85rem; border-left: 4px solid #fbbf24; }
      `}</style>

      <button className="ps-back-btn" onClick={() => { fetch('http://localhost:5000/api/stop-camera', { method: 'POST' }); navigate('/dashboard'); }}>
        ← Dashboard
      </button>

      <div className="ps-root">
        <div className="ps-shell">
          <div className="ps-header">
             <div>
                <h2 style={{margin: 0, fontSize: '1.5rem'}}>🖐 Practice Static Signs</h2>
                <p style={{margin: 0, color: '#64748b', fontSize: '0.9rem'}}>Session Progress: {sessionIndex + 1} / {SESSION_SIZE}</p>
             </div>
             <div style={{fontSize: '0.8rem', textAlign: 'right'}}>
                <div style={{color: socketConnected ? '#16a34a' : '#dc2626'}}>● {socketConnected ? 'Socket Live' : 'Connecting...'}</div>
             </div>
          </div>

          <div className="ps-grid">
            <div className="ps-video-section">
              <div style={{background: '#020617', padding: '10px', borderRadius: '20px'}}>
                <img ref={videoRef} className="ps-video-frame" alt="Practice Feed" />
              </div>
              <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '8px', textAlign: 'center'}}>
                Keep your hand steady in the frame. Sign slowly for better accuracy.
              </p>
            </div>

            <div className="ps-ui-section">
              {!isSessionFinished ? (
                <>
                  <SessionProgressBar currentIndex={sessionIndex} total={SESSION_SIZE} scores={sessionScores} />
                  
                  <div className="ps-task-card">
                    <div style={{fontWeight: '700', marginBottom: '10px', fontSize: '1.1rem'}}>{currentTask?.label || 'Loading sign...'}</div>
                    <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                        <img src={currentTask?.image} className="ps-task-img" alt="Target Sign" />
                        <p style={{fontSize: '0.85rem', color: '#334155', margin: 0}}>
                          Match the hand shape and angle. Reach <b>{PASS_THRESHOLD}%</b> to auto-advance.
                        </p>
                    </div>
                    <div style={{marginTop: '15px', display: 'flex', flexWrap: 'wrap'}}>
                        {sessionTargets.map((t, idx) => (
                            <button key={t.id} className={`ps-task-chip ${currentTask?.id === t.id ? 'active' : ''}`} onClick={() => { setSessionIndex(idx); selectTask(t); }}>
                                {idx + 1}. {t.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={skipCurrentSign} style={{marginTop: '12px', background: 'none', border: '1px solid #f97316', color: '#f97316', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem'}}>
                      Skip this sign →
                    </button>
                  </div>

                  <div className="ps-task-card" style={{background: '#f8fafc', border: '1px solid #e2e8f0'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600'}}>
                        <span>Current Accuracy</span>
                        <span style={{color: score >= PASS_THRESHOLD ? '#16a34a' : '#3b82f6'}}>{score}%</span>
                    </div>
                    <div className="ps-progress-bar-wrap">
                      <div className="ps-progress-bar-inner" style={{ width: `${score}%` }} />
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem', color: '#475569'}}>
                        <div>Handshape: <b style={{color: '#1e293b'}}>{handshape || '—'}</b></div>
                        <div>Confidence: <b>{(avgConf * 100).toFixed(0)}%</b></div>
                    </div>
                    {hint && <div className="ps-hint">💡 {hint}</div>}
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