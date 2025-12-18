// src/Component/PracticeSummary.jsx
import React, { useEffect, useState } from 'react';

const PracticeSummary = ({ scores, skippedIds }) => {
  if (!scores || scores.length === 0) return null;

  const strong = scores.filter(
    (s) => s.score >= 70 && !skippedIds.includes(s.id)
  );
  const weak = scores.filter(
    (s) => s.score < 70 || skippedIds.includes(s.id)
  );

  const strongPct = Math.round((strong.length / scores.length) * 100);
  const weakPct = 100 - strongPct;

  const [animStrong, setAnimStrong] = useState(0);
  const [animWeak, setAnimWeak] = useState(0);

  useEffect(() => {
    let frame;
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setAnimStrong(strongPct * t);
      setAnimWeak(weakPct * t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [strongPct, weakPct]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strongLength = (animStrong / 100) * circumference;
  const weakLength = (animWeak / 100) * circumference;

  // result status based on weak signs
  let statusLabel = 'Result: Satisfied';
  let statusColor = '#16a34a';
  if (weak.length > 2 && weak.length <= 4) {
    statusLabel = 'Result: Needs more practice';
    statusColor = '#eab308';
  } else if (weak.length > 4) {
    statusLabel = 'Result: Poor – practice again';
    statusColor = '#b91c1c';
  }

  const manyWeak = weak.length > 2;

  return (
    <div
      style={{
        marginTop: 16,
        padding: '18px 20px 20px',
        borderRadius: 24,
        background: '#ffffff',
        boxShadow: '0 10px 25px rgba(15,23,42,0.12)',
        border: '1px solid #e5e7eb',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* header */}
      <div
        style={{
          alignSelf: 'stretch',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: '#111827',
          }}
        >
          Session summary
        </div>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#6b7280',
          }}
        >
          {scores.length} signs in this round
        </div>
      </div>

      {/* big circle */}
      <div style={{ position: 'relative', width: 230, height: 230 }}>
        <svg
          width="230"
          height="230"
          viewBox="0 0 230 230"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="115"
            cy="115"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="18"
            fill="none"
          />

          <circle
            cx="115"
            cy="115"
            r={radius}
            stroke="#22c55e"
            strokeWidth="18"
            fill="none"
            strokeDasharray={`${strongLength} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.1s linear',
              filter: 'drop-shadow(0 0 5px rgba(22,163,74,0.55))',
            }}
          />

          <circle
            cx="115"
            cy="115"
            r={radius}
            stroke="#fb7185"
            strokeWidth="18"
            fill="none"
            strokeDasharray={`${weakLength} ${circumference}`}
            strokeDashoffset={circumference * 0.25 - strongLength}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.1s linear',
              filter: 'drop-shadow(0 0 5px rgba(248,113,113,0.6))',
            }}
          />
        </svg>

        {/* center value */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(0deg)',
          }}
        >
          <div
            style={{
              fontSize: '2.6rem',
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1,
            }}
          >
            {Math.round(animStrong)}%
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#6b7280',
              marginTop: 2,
            }}
          >
            of signs are strong
          </div>
        </div>
      </div>

      {/* centered result + suggestion */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: 540,
        }}
      >
        <div
          style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: statusColor,
            marginBottom: 6,
          }}
        >
          {statusLabel}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 999,
            background: manyWeak ? '#fef2f2' : '#ecfdf5',
            border: manyWeak
              ? '1px solid rgba(248,113,113,0.8)'
              : '1px solid rgba(34,197,94,0.4)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: manyWeak ? '#b91c1c' : '#047857',
          }}
        >
          <span>{manyWeak ? 'Suggestion:' : 'Great job:'}</span>
          <span>
            {manyWeak
              ? 'Focus on the red signs below and replay their lessons.'
              : 'Keep going – try to turn every slice of the circle green.'}
          </span>
        </div>
      </div>

      {/* legend + lists */}
      <div style={{ width: '100%', maxWidth: 540 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.78rem',
            color: '#4b5563',
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '999px',
                background: '#22c55e',
              }}
            />
            <span>Green = strong sign</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '999px',
                background: '#fb7185',
              }}
            />
            <span>Red = weak or skipped sign</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 14,
              background: '#ecfdf3',
              color: '#166534',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              ✅ Strong signs ({strong.length}/{scores.length})
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              {strong.length > 0
                ? strong.map((s) => s.label).join(', ')
                : 'No strong signs yet – try another round.'}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 14,
              background: '#fef2f2',
              color: '#b91c1c',
              fontSize: manyWeak ? '0.85rem' : '0.8rem',
              fontWeight: manyWeak ? 700 : 600,
              boxShadow: manyWeak
                ? '0 0 0 1px rgba(248,113,113,0.8)'
                : 'none',
            }}
          >
            <div style={{ marginBottom: 2 }}>
              ⚠️ Weak / skipped ({weak.length}/{scores.length})
            </div>
            <div style={{ fontSize: manyWeak ? '0.83rem' : '0.78rem' }}>
              {weak.length > 0
                ? weak.map((w) => w.label).join(', ')
                : 'Nothing in red – you nailed this set!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSummary;
