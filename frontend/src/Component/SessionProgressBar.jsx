// src/Components/SessionProgressBar.jsx
import React from 'react';

const SessionProgressBar = ({ currentIndex, total, scores }) => {
  const completedCount = scores.filter(s => s.score >= 70).length;
  const overall = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : 0;

  const percent = total ? ((currentIndex + 1) / total) * 100 : 0;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: '0.9rem', color: '#111827', marginBottom: 4 }}>
        Session: {currentIndex + 1}/{total} · Done: {completedCount}/{total} · Avg: {overall}%
      </div>
      <div
        style={{
          width: '100%',
          height: 10,
          borderRadius: 999,
          background: '#e5e7eb',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg,#6366f1,#22c55e)',
            transition: 'width 0.2s ease',
          }}
        />
      </div>
    </div>
  );
};

export default SessionProgressBar;
