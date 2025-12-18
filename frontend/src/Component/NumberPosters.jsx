// src/components/NumberPosters.jsx
import React from 'react';

const numberNames = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

const buildNumberItems = () =>
  numberNames.map((name, idx) => ({
    id: idx + 1,
    value: idx + 1,
    name,
    src: `/lessons/numbers/${name}.png`,
    gradientIndex: idx % 4,
  }));

const gradients = [
  'linear-gradient(135deg, #38bdf8, #a5b4fc)',
  'linear-gradient(135deg, #4ade80, #facc15)',
  'linear-gradient(135deg, #f97373, #fde68a)',
  'linear-gradient(135deg, #f9a8d4, #bfdbfe)',
];

const NumberPosters = ({ onZoom }) => {
  const items = buildNumberItems();

  return (
    <>
      {/* Responsive tweaks specific to number posters */}
      <style>{`
        /* Tablet */
        @media (max-width: 768px) {
          .lp-poster-top {
            padding: 12px 14px 8px;
            gap: 10px;
          }
          .lp-poster-letter-block {
            width: 90px;
            height: 110px;
            border-radius: 18px;
          }
          .lp-poster-letter-big {
            font-size: 2.5rem;
          }
          .lp-poster-letter-small {
            font-size: 1.05rem;
          }
          .lp-poster-sign {
            padding: 6px;
          }
          .lp-poster-sign img {
            max-height: 120px;
          }
          .lp-poster-bottom {
            padding: 8px 14px 12px;
          }
          .lp-word-row {
            padding: 6px 10px;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .lp-poster-top {
            padding: 8px 10px 6px;
            gap: 8px;
          }
          .lp-poster-letter-block {
            width: 80px;
            height: 100px;
            border-radius: 16px;
          }
          .lp-poster-letter-big {
            font-size: 2.2rem;
          }
          .lp-poster-letter-small {
            font-size: 0.98rem;
          }
          .lp-poster-sign img {
            max-height: 100px;
          }
          .lp-poster-bottom {
            padding: 8px 10px 10px;
          }
          .lp-word-row {
            padding: 6px 8px;
          }
        }
      `}</style>

      <div className="lp-grid-poster">
        {items.map((item) => (
          <article key={item.id} className="lp-poster">
            <div className="lp-poster-top">
              <div
                className="lp-poster-top-bg"
                style={{ background: gradients[item.gradientIndex] }}
              />
              {/* big digit + word */}
              <div className="lp-poster-letter-block">
                <div className="lp-poster-letter-big">{item.value}</div>
                <div
                  className="lp-poster-letter-small"
                  style={{ fontSize: '1.2rem', fontWeight: 700 }}
                >
                  {item.name}
                </div>
              </div>
              {/* sign image */}
              <div
                className="lp-poster-sign"
                onClick={() => onZoom(item.src, `Number ${item.value} sign`)}
              >
                <img src={item.src} alt={`Number ${item.value} sign`} />
              </div>
            </div>

            <div className="lp-poster-bottom">
              {/* dots row only */}
              <div
                className="lp-word-row"
                style={{
                  justifyContent: 'center',
                  gap: 10,
                  padding: '10px 12px',
                }}
              >
                {Array.from({ length: item.value }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '999px',
                      background: '#0f172a',
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default NumberPosters;
