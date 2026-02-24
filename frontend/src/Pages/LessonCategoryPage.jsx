// src/pages/LessonCategoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/AuthContext';
import { baseUrl } from '../Common/SummaryApi';
import AlphabetPosters from '../Component/AlphabetPosters';
import NumberPosters from '../Component/NumberPosters';
import ColorsPosters from '../Component/ColorsPosters';
import FruitsPosters from '../Component/FruitsPosters';
import EmotionsPosters from '../Component/EmotionsPosters';
import GreetingsPosters from '../Component/GreetingsPosters';
import BodySensationsPosters from '../Component/BodySensationsPosters';
import FamilyPosters from '../Component/FamilyPosters';
import CommonInteractionsPosters from '../Component/CommonInteractionsPosters';
import DynamicSignPosters from '../Component/DynamicSignPosters';

const STORAGE_KEY = 'lessonProgress';
const ZOOM_TRACK_KEY = 'lessonZooms';
const SYNC_KEY = 'lessonSync_v2'; 

const LessonCategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const categoryName = query.get('category') || null; // original category label from LessonsPage
const { user, token } = useAuth();  // 🔥 CHANGE: Add token
  const [zoomSrc, setZoomSrc] = useState(null);
  const [zoomLabel, setZoomLabel] = useState('');
  const [zoomCount, setZoomCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); 

  // current user comes from AuthContext

  // Helper function to mark lesson complete (now inside component with access to userId)
// 🔥 REPLACE ENTIRE FUNCTION WITH THIS:
const markLessonComplete = useCallback(async (catId, userId) => {
  if (!userId) return false;
  
  try {
    // 1. IMMEDIATE local save
    const userSpecificKey = `${STORAGE_KEY}_${userId}`;
    const raw = localStorage.getItem(userSpecificKey);
    const list = raw ? JSON.parse(raw) : [];
    const safeList = Array.isArray(list) ? list : [];
    
    if (!safeList.includes(catId)) {
      const updated = [...safeList, catId];
      localStorage.setItem(userSpecificKey, JSON.stringify(updated));
      localStorage.setItem(`${SYNC_KEY}_${userId}`, Date.now().toString());
    }

    // 2. SERVER BACKUP (optional - works without backend)
    if (token) {
      try {
        await fetch(`${baseUrl}/api/lesson/progress`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            userId, 
            completedLessons: safeList.includes(catId) ? safeList : [...safeList, catId]
          })
        }).catch(e => console.warn('Server sync failed:', e));
      } catch (e) {}
    }

    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}, [token, baseUrl]);


  // Helper function to check and complete lesson
  const checkAndCompleteLesson = (catId, zoomCnt, userId) => {
    const expectedItems = {
      alphabet: 26,
      numbers: 10,
      common_interactions: 11,
      colors: 11,
      fruits: 12,
      emotions: 8,
      greetings: 7,
      sensations: 13,
      family: 9,
    };

    const expected = expectedItems[catId] || 5; // Default to 5 for dynamic categories
    const threshold = Math.ceil(expected * 0.7);

    if (zoomCnt >= threshold) {
      markLessonComplete(catId, userId);
      return true;
    }
    return false;
  };

  // 🔥 NEW: Load + Sync Progress
const loadProgress = useCallback(async () => {
  if (!categoryId || !user?.userId) return;

  try {
    let completed = false;
    let zooms = 0;

    // 1. LOCAL STORAGE (main source)
    const userSpecificZoomKey = `${ZOOM_TRACK_KEY}_${user.userId}_${categoryId}`;
    const zoomsRaw = localStorage.getItem(userSpecificZoomKey);
    const zoomList = zoomsRaw ? JSON.parse(zoomsRaw) : [];
    zooms = Array.isArray(zoomList) ? zoomList.length : 0;
    
    const userSpecificKey = `${STORAGE_KEY}_${user.userId}`;
    const progressRaw = localStorage.getItem(userSpecificKey);
    const progressList = progressRaw ? JSON.parse(progressRaw) : [];
    completed = Array.isArray(progressList) ? progressList.includes(categoryId) : false;

    setIsCompleted(completed);
    setZoomCount(zooms);

    // 2. AUTO-COMPLETE CHECK
    if (zooms > 0 && !completed) {
      const autoComplete = checkAndCompleteLesson(categoryId, zooms, user.userId);
      if (autoComplete) {
        setIsCompleted(true);
        setTimeout(() => alert(`🎉 Completed "${categoryId}" automatically!`), 100);
      }
    }

    setSyncStatus('synced');
  } catch (e) {
    console.error('Load failed:', e);
  }
}, [categoryId, user]);

useEffect(() => {
  loadProgress();
}, [loadProgress]);


 const trackZoom = (src, label) => {
  setZoomSrc(src);
  setZoomLabel(label);

  if (!categoryId || !user?.userId || isCompleted) return;

  try {
    const userSpecificZoomKey = `${ZOOM_TRACK_KEY}_${user.userId}_${categoryId}`;
    const zoomsRaw = localStorage.getItem(userSpecificZoomKey);
    const zooms = zoomsRaw ? JSON.parse(zoomsRaw) : [];

    if (!zooms.includes(src)) {
      const updatedZooms = [...zooms, src];  // ✅ NEW ARRAY
      localStorage.setItem(userSpecificZoomKey, JSON.stringify(updatedZooms));
      setZoomCount(updatedZooms.length);     // ✅ UPDATED COUNT

      if (checkAndCompleteLesson(categoryId, updatedZooms.length, user.userId)) {
        setIsCompleted(true);
        setTimeout(() => {
          alert(`🎉 Great job! You've viewed enough signs to complete "${categoryId}" automatically!`);
        }, 100);
      }
    }
  } catch (e) {
    console.error('Failed to track zoom', e);
  }
};


  const closeZoom = () => {
    setZoomSrc(null);
    setZoomLabel('');
  };

  let title = '';
  let description = '';
  let mode = '';

  switch (categoryId) {
    case 'alphabet':
      title = 'Alphabet A–Z';
      description =
        'Big, friendly posters with signs, letters, and picture words.';
      mode = 'alphabet';
      break;
    case 'numbers':
      title = 'Numbers 1–10';
      description = 'Count from 1 to 10 using clear hand signs.';
      mode = 'numbers';
      break;
    case 'common_interactions':
      title = 'Common Interactions';
      description = 'Everyday words like hello, ok, thank you, and more.';
      mode = 'common_interactions';
      break;
    case 'colors':
      title = 'Colors in Sign';
      description = 'Watch colorful GIFs that show each color sign.';
      mode = 'colors';
      break;
    case 'fruits':
      title = 'Fruits in Sign';
      description = 'Yummy fruit signs with fun GIFs and emojis.';
      mode = 'fruits';
      break;
    case 'emotions':
      title = 'Emotions in Sign';
      description = 'Express all your feelings with powerful hand signs.';
      mode = 'emotions';
      break;
    case 'greetings':
      title = 'Greetings & Phrases';
      description = 'Start conversations with friendly hand greetings.';
      mode = 'greetings';
      break;
    case 'sensations':
      title = 'Body & Sensations';
      description = 'Talk about feeling cold, hot, sick, hungry and more.';
      mode = 'sensations';
      break;
    case 'family':
      title = 'Family in Sign';
      description = 'Learn signs for all your family members.';
      mode = 'family';
      break;
    default:
      // For dynamic categories, use the original category label if provided
      if (categoryName) {
        title = categoryName;
      } else if (categoryId) {
        title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/_/g, ' ');
      } else {
        title = 'Lessons';
      }
      description = `Learn ${title} signs created by our educators.`;
      mode = '';
  }

  return (
    <div className="lp-root">
      <style>{`
        .lp-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, #e0f2fe, #fef9c3 40%, #fee2e2 80%);
          color: #0f172a;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .lp-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px 8px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .lp-back {
          border: none;
          background: rgba(255,255,255,0.95);
          color: #0f172a;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 8px 18px rgba(148,163,184,0.6);
          white-space: nowrap;
        }

        .lp-hero-text h1 {
          font-size: 2.1rem;
          margin: 0 0 4px;
        }

        .lp-hero-text p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .lp-main {
          max-width: 1180px;
          margin: 10px auto 40px;
          padding: 0 20px 40px;
        }

        /* poster grid: desktop uses auto-fit; smaller breakpoints force 3 / 2 columns */
        .lp-grid-poster {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 26px;
        }

        .lp-poster {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(148,163,184,0.7);
          color: #111827;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          transform: translateY(0) translateZ(0);
          transition: transform .18s ease, box-shadow .18s ease;
          position: relative;
        }

        .lp-poster::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.9) 0, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.7) 0, transparent 45%);
          opacity: 0.8;
          pointer-events: none;
        }

        .lp-poster:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 22px 50px rgba(148,163,184,0.9);
        }

        .lp-poster-top {
          position: relative;
          padding: 18px 18px 10px;
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 14px;
        }

        .lp-poster-top-bg {
          position:absolute;
          inset:0;
          z-index:-1;
          opacity:0.95;
        }

        .lp-poster-letter-block {
          width: 110px;
          height: 140px;
          border-radius: 22px;
          background: rgba(255,255,255,0.82);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-weight: 700;
          box-shadow: inset 0 0 0 3px rgba(148,163,184,0.35);
        }

        .lp-poster-letter-big {
          font-size: 3.1rem;
          line-height: 1;
        }

        .lp-poster-letter-small {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-top: 4px;
        }

        .lp-poster-sign {
          background: #fef9c3;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          cursor: zoom-in;
          box-shadow: inset 0 0 0 3px rgba(254,240,138,0.9);
        }

        .lp-poster-sign.completed {
          cursor: default;
          opacity: 0.7;
          background: #f0f9f4;
        }

        .lp-poster-sign img {
          max-height: 150px;
          max-width: 100%;
          object-fit: contain;
        }

        .lp-poster-bottom {
          background: #fff7ed;
          padding: 10px 18px 16px;
        }

        .lp-word-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(254,249,195,0.98);
          margin-top: 6px;
        }

        .lp-word-emoji {
          font-size: 2.4rem;
          width: 48px;
          text-align: center;
          line-height: 1;
        }

        .lp-word-text {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .lp-word-tagline {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-left: auto;
        }

        /* breakpoints for grid and hero */
        @media (max-width: 1024px) {
          .lp-grid-poster {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px;
          }
        }

        @media (max-width: 900px) {
          .lp-hero {
            padding: 18px 20px 6px;
          }
          .lp-main {
            padding: 0 18px 32px;
          }
        }

        @media (max-width: 768px) {
          .lp-grid-poster {
            grid-template-columns: repeat(2, minmax(0, 1fr)); /* 2 per row */
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .lp-hero {
            flex-direction: column;
            align-items: flex-start;
          }
          .lp-hero-text h1 {
            font-size: 1.7rem;
          }
          .lp-hero-text p {
            font-size: 0.88rem;
          }
          .lp-main {
            padding: 0 14px 28px;
          }
          .lp-grid-poster {
            grid-template-columns: repeat(2, minmax(0, 1fr)); /* keep 2 per row */
            gap: 16px;
          }
          .lp-poster-top {
            grid-template-columns: 1fr;
          }
          .lp-poster-letter-block {
            margin-bottom: 4px;
          }
        }

        @media (max-width: 420px) {
          .lp-grid-poster {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .lp-main {
            padding: 0 10px 24px;
          }
          .lp-back {
            padding: 8px 14px;
            font-size: 0.82rem;
          }
        }

        /* Zoom modal */
        .lp-zoom-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .lp-zoom-box {
          background: #ffffff;
          padding: 16px 18px 18px;
          border-radius: 20px;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: 0 24px 60px rgba(15,23,42,0.4);
        }

        .lp-zoom-img {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
        }

        .lp-zoom-close {
          border: none;
          padding: 6px 14px;
          border-radius: 999px;
          background: #f97316;
          color: white;
          font-size: 0.85rem;
          cursor: pointer;
        }

        /* Progress bar */
        .lp-progress-wrap {
          max-width: 1180px;
          margin: 0 auto 20px;
          padding: 0 20px;
        }

        .lp-progress-bar {
          background: rgba(255,255,255,0.7);
          border-radius: 999px;
          height: 8px;
          overflow: hidden;
          position: relative;
        }

        .lp-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 999px;
          transition: width 0.3s ease;
          position: relative;
        }

        .lp-progress-fill::after {
          content: attr(data-progress);
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.7rem;
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .lp-progress-text {
          font-size: 0.85rem;
          opacity: 0.8;
          margin-top: 4px;
        }

        @media (max-width: 640px) {
          .lp-progress-wrap {
            padding: 0 14px;
          }
          .lp-progress-text {
            font-size: 0.78rem;
          }
        }

        /* Completed message */
        .lp-completed-message {
          max-width: 1180px;
          margin: 0 auto 30px;
          padding: 0 20px;
          text-align: center;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(34,197,94,0.3);
        }

        .lp-completed-message h3 {
          margin: 0 0 8px;
          font-size: 1.4rem;
          color: #166534;
          font-weight: 700;
        }

        .lp-completed-message p {
          margin: 0;
          color: #047857;
          font-size: 0.95rem;
        }

        @media (max-width: 640px) {
          .lp-completed-message {
            padding: 18px 14px;
          }
          .lp-completed-message h3 {
            font-size: 1.25rem;
          }
          .lp-completed-message p {
            font-size: 0.88rem;
          }
        }
      `}</style>

      <header className="lp-hero">
        <button
          className="lp-back"
          onClick={() => navigate('/lesson')}
        >
          ← All Chapters
        </button>
        <div className="lp-hero-text">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {syncStatus === 'syncing' && <p style={{fontSize:'0.85rem', opacity:0.7}}>🔄 Syncing...</p>}
        </div>
      </header>

      {categoryId && !isCompleted && (
        <div className="lp-progress-wrap">
          <div className="lp-progress-bar">
            <div
              className="lp-progress-fill"
              style={{ width: `${Math.min((zoomCount / 20) * 100, 95)}%` }}
              data-progress={`${zoomCount}/20+ viewed`}
            />
          </div>
          <div className="lp-progress-text">
            👆 Tap signs to zoom & learn! Auto-complete at 70%+ viewed ({zoomCount} viewed)
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="lp-completed-message">
          <h3>🎉 Chapter Complete!</h3>
          <p>
            Great job! You've mastered these signs. Next lesson is now unlocked.
            Go back to Lessons to continue.
          </p>
        </div>
      )}

      <main className="lp-main">
        {mode === 'alphabet' && <AlphabetPosters onZoom={trackZoom} />}
        {mode === 'numbers' && <NumberPosters onZoom={trackZoom} />}
        {mode === 'common_interactions' && (
          <CommonInteractionsPosters onZoom={trackZoom} />
        )}
        {mode === 'colors' && <ColorsPosters onZoom={trackZoom} />}
        {mode === 'fruits' && <FruitsPosters onZoom={trackZoom} />}
        {mode === 'emotions' && <EmotionsPosters onZoom={trackZoom} />}
        {mode === 'greetings' && <GreetingsPosters onZoom={trackZoom} />}
        {mode === 'sensations' && (
          <BodySensationsPosters onZoom={trackZoom} />
        )}
        {mode === 'family' && <FamilyPosters onZoom={trackZoom} />}
        {!mode && <DynamicSignPosters category={categoryName || categoryId} onZoom={trackZoom} />}
      </main>

      {zoomSrc && (
        <div className="lp-zoom-backdrop" onClick={closeZoom}>
          <div className="lp-zoom-box" onClick={(e) => e.stopPropagation()}>
            <img src={zoomSrc} alt={zoomLabel} className="lp-zoom-img" />
            <button className="lp-zoom-close" onClick={closeZoom}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCategoryPage;
