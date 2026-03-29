// src/pages/LessonsPage.jsx
import React, { useEffect, useState , useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../Common/SummaryApi';
import { useAuth } from '../Provider/AuthContext';

const STORAGE_KEY = 'lessonProgress';
const SYNC_KEY = 'lessonSync_v2';

const categoryConfig = [
  {
    id: 'alphabet',
    label: 'Alphabet A–Z',
    desc: 'Learn each letter in sign language, from A to Z.',
    cover: '/lessons/covers/alphabet-cover.png',
    accent: '#6366F1',
    icon: '🔤',
  },
  {
    id: 'numbers',
    label: 'Numbers 1–10',
    desc: 'Count with your hands from one to ten.',
    cover: '/lessons/covers/numbers-cover.png',
    accent: '#F97316',
    icon: '🔢',
  },
  {
    id: 'common_interactions',
    label: 'Common Interactions',
    desc: 'Hello, thank you, please, and everyday signs.',
    cover: '/lessons/covers/common_interaction.png',
    accent: '#0EA5E9',
    icon: '💬',
  },
  {
    id: 'colors',
    label: 'Colors',
    desc: 'Bright color signs to talk about the world.',
    cover: '/lessons/covers/colors-cover.png',
    accent: '#22C55E',
    icon: '🎨',
  },
  {
    id: 'fruits',
    label: 'Fruits',
    desc: 'Tasty fruit signs for everyday conversations.',
    cover: '/lessons/covers/fruits-cover.png',
    accent: '#EC4899',
    icon: '🍎',
  },
  {
    id: 'emotions',
    label: 'Emotions',
    desc: 'Show how you feel using expressive hand shapes.',
    cover: '/lessons/covers/emotions-cover.png',
    accent: '#06B6D4',
    icon: '😊',
  },
  {
    id: 'greetings',
    label: 'Greetings & Phrases',
    desc: 'Say hello, thank you, and more with your hands.',
    cover: '/lessons/covers/greetings-cover.png',
    accent: '#EAB308',
    icon: '👋',
  },
  {
    id: 'sensations',
    label: 'Body & Sensations',
    desc: 'Talk about hot, cold, pain, hunger, and more.',
    cover: '/lessons/covers/sensations-cover.png',
    accent: '#8B5CF6',
    icon: '🧠',
  },
  {
    id: 'family',
    label: 'Family',
    desc: 'Sign for mom, dad, brother, sister, and more.',
    cover: '/lessons/covers/family-cover.png',
    accent: '#10B981',
    icon: '👨‍👩‍👧‍👦',
  },
];

const LessonsPage = () => {
  const navigate = useNavigate();
  const [completedIds, setCompletedIds] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle'); 
const { user, token } = useAuth();  // 🔥 CHANGE: Add token


  // derive unified categories list (static + dynamic) so unlock sequence is consistent
  const staticIds = categoryConfig.map(c => c.id);
  const newDynamic = dynamicCategories.filter(d => !staticIds.includes(d.id));
  const allCategories = [...categoryConfig, ...newDynamic];

  // Fetch categories from API
 // 🔥 NEW: Server + LocalStorage Hybrid Load
useEffect(() => {
  const syncProgress = async () => {
    if (!user?.userId) {
      console.log('⏭️ No user - skip sync');
      return;
    }

    setSyncStatus('syncing');

    try {
      let progress = [];

      // 1️⃣ SERVER FIRST (true source of truth)
      if (token) {
        const serverRes = await fetch(
          `${baseUrl}/api/lesson/progress?userId=${user.userId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (serverRes.ok) {
          const serverData = await serverRes.json();
          if (Array.isArray(serverData.completedLessons)) {
            progress = serverData.completedLessons;
            setCompletedIds(progress);

            // Cache to localStorage
            const userKey = `${STORAGE_KEY}_${user.userId}`;
            localStorage.setItem(userKey, JSON.stringify(progress));
            localStorage.setItem(`${SYNC_KEY}_${user.userId}`, Date.now().toString());
            setSyncStatus('synced');
            return; // exit here; server wins
          }
        }
      }

      // 2️⃣ ONLY if server failed / no token, use localStorage
      const userKey = `${STORAGE_KEY}_${user.userId}`;
      const raw = localStorage.getItem(userKey);

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const validIds = parsed.filter(id =>
              categoryConfig.some(c => c.id === id) ||
              dynamicCategories.some(c => c.id === id)
            );
            progress = validIds;
            setCompletedIds(progress);
          }
        } catch (e) {
          console.error('Corrupted localStorage - clearing:', e);
          localStorage.removeItem(userKey);
        }
      }

      setSyncStatus(token ? 'error' : 'synced');
    } catch (e) {
      console.error('Sync failed:', e);
      setSyncStatus('error');
    }
  };

  syncProgress();
}, [user, token, baseUrl]);


  // current user comes from AuthContext
// Fetch categories from API (your original code)
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/signs/categories/all`);
      const data = await response.json();
      if (data.categories && data.categories.length > 0) {
        const mapped = data.categories.map((cat, idx) => {
          const colors = ['#6366F1', '#F97316', '#0EA5E9', '#22C55E', '#EC4899', '#06B6D4', '#EAB308', '#8B5CF6', '#10B981'];
          const color = colors[idx % colors.length];
          const name = typeof cat === 'string' ? cat : (cat.name || '');
          const coverUrl = typeof cat === 'string' ? null : (cat.coverUrl || null);

          return {
            id: name.toLowerCase().replace(/\s+/g, '_'),
            label: name,
            category: name,
            desc: `Learn ${name} in sign language`,
            cover: coverUrl ? `${baseUrl}${coverUrl}` : '/lessons/covers/alphabet-cover.png',
            accent: color,
            icon: '🎓'
          };
        });
        setDynamicCategories(mapped);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  fetchCategories();
}, []);


  // Load user-specific lesson progress



  const handleOpenCategory = (cat, index, unlocked) => {
    const categoryName = cat.category || cat.label || cat.id;
    navigate(`/lesson/${cat.id}?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="lp-root">
      <style>{`
        .lp-root {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, #e0f2fe, #fef9c3 40%, #fee2e2 80%);
          color: #0f172a;
          padding-bottom: 40px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .lp-hero {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:24px 32px 8px;
          gap:16px;
          flex-wrap:wrap;
        }

        .lp-back {
          border:none;
          background:rgba(255,255,255,0.9);
          color:#0f172a;
          padding:10px 18px;
          border-radius:999px;
          cursor:pointer;
          font-size:0.9rem;
          display:flex;
          align-items:center;
          gap:6px;
          box-shadow:0 8px 18px rgba(148,163,184,0.6);
          white-space:nowrap;
        }

        .lp-hero-text h1 {
          font-size:2.1rem;
          margin:0 0 4px;
        }

        .lp-hero-text p {
          margin:0;
          opacity:0.85;
          font-size:0.95rem;
        }

        .lp-grid-categories {
          max-width:1120px;
          margin:20px auto 0;
          padding:0 20px 40px;
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:22px;
        }

        /* tablet: 2–3 columns depending on width */
        @media (max-width: 900px) {
          .lp-hero {
            padding:18px 16px 4px;
          }
          .lp-grid-categories {
            padding:0 16px 32px;
            gap:18px;
          }
        }

        /* small devices: exactly 2 cards per row */
        @media (max-width: 640px) {
          .lp-grid-categories {
            grid-template-columns:repeat(2, minmax(0,1fr));
            gap:14px;
          }
          .lp-hero-text h1 {
            font-size:1.6rem;
          }
          .lp-hero-text p {
            font-size:0.88rem;
          }
        }

        /* very small phones: tighten padding but keep 2 per row */
        @media (max-width: 420px) {
          .lp-grid-categories {
            padding:0 12px 28px;
            gap:12px;
          }
          .lp-back {
            padding:8px 14px;
            font-size:0.82rem;
          }
        }

        .lp-cat-card {
          position:relative;
          overflow:hidden;
          border-radius:22px;
          background:#ffffff;
          cursor:pointer;
          box-shadow:0 14px 30px rgba(148,163,184,0.6);
          transform:translateY(0) translateZ(0);
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            filter .18s ease;
        }

        .lp-cat-card::before {
          content:'';
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at -10% -10%, rgba(255,255,255,0.9) 0, transparent 40%),
            radial-gradient(circle at 110% 110%, rgba(255,255,255,0.7) 0, transparent 45%);
          pointer-events:none;
        }

        .lp-cat-card:hover {
          transform:translateY(-8px) scale(1.02);
          box-shadow:0 22px 50px rgba(148,163,184,0.9);
        }

        .lp-cat-card.locked {
          cursor:default;
          filter: grayscale(0.45) opacity(0.7);
          box-shadow:0 10px 24px rgba(148,163,184,0.4);
        }

        .lp-cat-lock-badge {
          position:absolute;
          top:10px;
          right:10px;
          padding:4px 9px;
          border-radius:999px;
          background:rgba(15,23,42,0.9);
          color:#e5e7eb;
          font-size:0.72rem;
          display:flex;
          align-items:center;
          gap:4px;
          z-index:5;
        }

        .lp-cat-lock-badge.done {
          background:#16a34a;
        }

        .lp-cat-cover {
          height:150px;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .lp-cat-cover img {
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .lp-cat-body {
          padding:16px 18px 18px;
          position:relative;
        }

        .lp-cat-pill {
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:5px 11px;
          border-radius:999px;
          font-size:0.78rem;
          background:rgba(248,250,252,0.95);
          color:#0f172a;
          box-shadow:0 4px 10px rgba(148,163,184,0.6);
          margin-bottom:8px;
        }

        .lp-cat-title {
          font-size:1.2rem;
          font-weight:650;
          margin-bottom:6px;
        }

        .lp-cat-desc {
          font-size:0.9rem;
          opacity:0.9;
        }

        .lp-cat-footer {
          margin-top:12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          font-size:0.82rem;
          opacity:0.75;
          gap:4px;
        }

        @media (max-width: 640px) {
          .lp-cat-cover {
            height:130px;
          }
          .lp-cat-body {
            padding:12px 12px 14px;
          }
          .lp-cat-title {
            font-size:1.05rem;
          }
          .lp-cat-desc {
            font-size:0.84rem;
          }
          .lp-cat-footer {
            font-size:0.76rem;
          }
        }
      `}</style>

      <header className="lp-hero">
        <button
          className="lp-back"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        <div className="lp-hero-text">
          <h1>Sign Lessons Library</h1>
           <p style={{ margin: 0 }}>
  {syncStatus === 'syncing' && '🔄 Syncing progress...'}
  {syncStatus === 'synced' && '✅ Progress loaded'}
  {syncStatus === 'error' && '📱 Using local progress'}
  {syncStatus === 'idle' && 'Tap a colorful card to explore fun sign lessons.'}
</p>
        </div>
      </header>

      <main className="lp-grid-categories">
        {(() => {
          // Combine static and dynamic categories
          const staticIds = categoryConfig.map(c => c.id);
          const newDynamic = dynamicCategories.filter(
            d => !staticIds.includes(d.id)
          );
          const allCategories = [...categoryConfig, ...newDynamic];
          
          return allCategories.map((cat, index) => {
            const isDone = completedIds.includes(cat.id);

            return (
              <article
                key={cat.id}
                className='lp-cat-card'
                onClick={() => handleOpenCategory(cat, index, true)}
              >
                {isDone && (
                  <div className="lp-cat-lock-badge done">
                    <span>✅</span>
                    <span>Finished</span>
                  </div>
                )}

                <div
                  className="lp-cat-cover"
                  style={{
                    background: `linear-gradient(135deg, ${cat.accent}22, ${cat.accent}55)`,
                  }}
                >
                  <img src={cat.cover} alt={`${cat.label} cover`} />
                </div>
                <div className="lp-cat-body">
                  <div className="lp-cat-pill">
                    <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                    <span>Sign chapter</span>
                  </div>
                  <div className="lp-cat-title">{cat.label}</div>
                  <div className="lp-cat-desc">{cat.desc}</div>
                  <div className="lp-cat-footer">
                    <span>
                      {isDone
                          ? 'Replay chapter →'
                          : 'Tap to start →'}
                    </span>
                    <span>Made for kids</span>
                  </div>
                </div>
              </article>
            );
          });
        })()}
      </main>
    </div>
  );
};

export default LessonsPage;
