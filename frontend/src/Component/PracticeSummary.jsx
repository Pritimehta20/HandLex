import React, { useEffect, useState, useMemo } from 'react';

const PracticeSummary = ({ scores = [], skippedIds = [] }) => {
  // 1. Memoize calculations to prevent unnecessary effect triggers
  const { strong, weak, strongPct, weakPct } = useMemo(() => {
    if (!scores.length) return { strong: [], weak: [], strongPct: 0, weakPct: 0 };
    
    const s = scores.filter(item => item.score >= 70 && !skippedIds.includes(item.id));
    const w = scores.filter(item => item.score < 70 || skippedIds.includes(item.id));
    const sPct = Math.round((s.length / scores.length) * 100);
    
    return { strong: s, weak: w, strongPct: sPct, weakPct: 100 - sPct };
  }, [scores, skippedIds]);

  const [animStrong, setAnimStrong] = useState(0);
  const [animWeak, setAnimWeak] = useState(0);
useEffect(() => {
    if (scores.length === 0) return;

    // Fixed: Using 'authUser' key as per your console logs
    const storedUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    const userId = storedUser.userId || storedUser._id;

    if (userId) {
      const weakSignsList = scores
        .filter(item => item.score < 70 || skippedIds.includes(item.id))
        .map(s => ({ id: s.id, label: s.label, score: s.score }));

      const skippedSignsList = scores
        .filter(s => skippedIds.includes(s.id))
        .map(s => ({ id: s.id, label: s.label }));
      
      const avgScore = Math.round((scores.reduce((acc, curr) => acc + curr.score, 0)) / scores.length);

      const summaryData = {
        lastUpdated: new Date().toISOString(),
        avgScore: avgScore,
        weakSigns: weakSignsList,
        skippedSigns: skippedSignsList
      };

      localStorage.setItem(`practiceWeakSummary_${userId}`, JSON.stringify(summaryData));
      console.log(`✅ Summary saved to: practiceWeakSummary_${userId}`);
    } else {
      console.warn("⚠️ PracticeSummary: No userId found in authUser. Summary not saved.");
    }
  }, [scores, skippedIds]);

  // Effect to handle animation and AUTOMATIC SAVING
  useEffect(() => {
    if (scores.length === 0) return;

    let frame;
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      
      // Using an ease-out function for a smoother finish
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimStrong(strongPct * easeOut);
      setAnimWeak(weakPct * easeOut);

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [strongPct, weakPct, scores.length]);

  if (!scores.length) return null;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strongLength = (animStrong / 100) * circumference;
  const weakLength = (animWeak / 100) * circumference;

  // Logic for UI feedback
  const isPoor = weak.length > 4;
  const isMediocre = weak.length > 2 && weak.length <= 4;
  
  const statusLabel = isPoor ? 'Result: Poor – practice again' : 
                      isMediocre ? 'Result: Needs more practice' : 'Result: Satisfied';
  const statusColor = isPoor ? '#b91c1c' : isMediocre ? '#eab308' : '#16a34a';

  
  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>Session summary</h2>
        <span style={countStyle}>{scores.length} signs in this round</span>
      </div>

      {/* Progress Circle */}
      <div style={{ position: 'relative', width: 230, height: 230 }}>
        <svg width="230" height="230" viewBox="0 0 230 230" style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
          <circle cx="115" cy="115" r={radius} stroke="#e5e7eb" strokeWidth="18" fill="none" />
          
          {/* Strong Segment */}
          <circle
            cx="115" cy="115" r={radius} stroke="#22c55e" strokeWidth="18" fill="none"
            strokeDasharray={`${strongLength} ${circumference}`}
            strokeDashoffset={0} // Simplified offset logic
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.4))' }}
          />

          {/* Weak Segment */}
          <circle
            cx="115" cy="115" r={radius} stroke="#fb7185" strokeWidth="18" fill="none"
            strokeDasharray={`${weakLength} ${circumference}`}
            strokeDashoffset={-strongLength} // Starts where strong ends
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,0.4))' }}
          />
        </svg>

        <div style={centerLabelStyle}>
          <span style={{ fontSize: '2.6rem', fontWeight: 800 }}>{Math.round(animStrong)}%</span>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>strong proficiency</span>
        </div>
      </div>

      {/* Feedback Banner */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...statusTextStyle, color: statusColor }}>{statusLabel}</div>
        <div style={{ ...bannerStyle, backgroundColor: (isPoor || isMediocre) ? '#fef2f2' : '#ecfdf5' }}>
           <strong>{(isPoor || isMediocre) ? 'Suggestion:' : 'Great job:'}</strong>
           <span> {(isPoor || isMediocre) ? 'Focus on red signs and replay lessons.' : 'Try to turn every slice green!'}</span>
        </div>
      </div>

      {/* Legend / Lists */}
      <div style={{ width: '100%', marginTop: 8 }}>
        <div style={listContainerStyle}>
          <div style={{ ...listStyle, background: '#ecfdf3', color: '#166534' }}>
            <div style={{ fontWeight: 700 }}>✅ Strong ({strong.length})</div>
            <div style={{ opacity: 0.9 }}>{strong.length ? strong.map(s => s.label).join(', ') : 'None yet'}</div>
          </div>
          <div style={{ ...listStyle, background: '#fef2f2', color: '#b91c1c' }}>
            <div style={{ fontWeight: 700 }}>⚠️ Review ({weak.length})</div>
            <div style={{ opacity: 0.9 }}>{weak.length ? weak.map(w => w.label).join(', ') : 'Perfect score!'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles extracted for cleaner JSX
const containerStyle = {
  marginTop: 16, padding: '20px', borderRadius: 24, background: '#fff',
  boxShadow: '0 10px 25px rgba(15,23,42,0.12)', border: '1px solid #e5e7eb',
  fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20
};

const headerStyle = { alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const titleStyle = { margin: 0, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: '#111827' };
const countStyle = { fontSize: '0.8rem', color: '#6b7280' };
const centerLabelStyle = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
const statusTextStyle = { fontSize: '1rem', fontWeight: 800, marginBottom: 8 };
const bannerStyle = { padding: '8px 16px', borderRadius: 999, fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.05)' };
const listContainerStyle = { display: 'flex', gap: 12 };
const listStyle = { flex: 1, padding: '12px', borderRadius: 16, fontSize: '0.8rem' };

export default PracticeSummary;