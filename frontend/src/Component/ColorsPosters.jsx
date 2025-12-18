// src/Component/ColorsPosters.jsx
import React from 'react';

const colorItems = [
  { id: 'red',    name: 'Red',    src: '/lessons/Colors/red.gif',    tag: 'warm & bright',      hex: '#fca5a5', emoji: '🍎🍓🍒' },
  { id: 'blue',   name: 'Blue',   src: '/lessons/Colors/blue.gif',   tag: 'cool & calm',        hex: '#93c5fd', emoji: '🌊🐟🫐' },
  { id: 'green',  name: 'Green',  src: '/lessons/Colors/green.gif',  tag: 'leafy & fresh',      hex: '#86efac', emoji: '🍏🥦🍇' },
  { id: 'yellow', name: 'Yellow', src: '/lessons/Colors/yellow.gif', tag: 'sunny & happy',      hex: '#facc15', emoji: '🌞🍌🌻' },
  { id: 'black',  name: 'Black',  src: '/lessons/Colors/black.gif',  tag: 'night & shadows',    hex: '#9ca3af', emoji: '🌙🕶️🎩' },
  { id: 'gray',   name: 'Gray',   src: '/lessons/Colors/gray.gif',   tag: 'soft & cloudy',      hex: '#cbd5f5', emoji: '☁️🌫️' },
  { id: 'orange', name: 'Orange', src: '/lessons/Colors/orange.gif', tag: 'juicy & fun',        hex: '#fed7aa', emoji: '🍊🥕🦊' },
  { id: 'pink',   name: 'Pink',   src: '/lessons/Colors/pink.gif',   tag: 'sweet & gentle',     hex: '#f9a8d4', emoji: '🌸🩷🍭' },
  { id: 'tan',    name: 'Tan',    src: '/lessons/Colors/tan.gif',    tag: 'sand & skin tones',  hex: '#fde68a', emoji: '🏖️🪵' },
  { id: 'white',  name: 'White',  src: '/lessons/Colors/white.gif',  tag: 'light & clean',      hex: '#e5e7eb', emoji: '⛄⬜⭐' },
];

const ColorsPosters = ({ onZoom }) => {
  return (
    <>
      <style>{`
        .lp-grid-poster {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }
        @media (max-width: 768px) {
          .lp-grid-poster {
            grid-template-columns: 1fr;
          }
        }

        .lp-poster {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(148,163,184,0.7);
          transform: translateY(0) translateZ(0);
          transition: transform .18s ease, box-shadow .18s ease;
          position: relative;
        }
        .lp-poster:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 22px 50px rgba(148,163,184,0.9);
        }

        .lp-poster-top {
          padding: 14px 16px 10px;
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 12px;
        }
        .lp-poster-letter-block {
          background: rgba(255,255,255,0.9);
        }

        /* GIF directly on card color – no white bg */
        .lp-color-gif-inline {
          border-radius: 18px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
        }
        .lp-color-gif-inline img {
          width: 100%;
          max-height: 170px;
          object-fit: contain;
        }

        .lp-poster-bottom {
          padding: 8px 14px 14px;
          background: rgba(255,255,255,0.35);
        }

        .lp-color-main-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
        }
        .lp-color-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 3px solid rgba(15,23,42,0.3);
          box-shadow: 0 4px 10px rgba(148,163,184,0.7);
          flex-shrink: 0;
        }
        .lp-color-text {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .lp-color-emoji-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
          padding: 4px 10px 2px;
        }
        .lp-color-emojis {
          font-size: 2.1rem;
        }
        .lp-color-tagline {
          font-size: 0.9rem;
          opacity: 0.9;
        }
      `}</style>

      <div className="lp-grid-poster">
        {colorItems.map((item) => (
          <article
            key={item.id}
            className="lp-poster"
            style={{ background: item.hex }}  // card fully tinted by color
          >
            <div className="lp-poster-top">
              <div className="lp-poster-letter-block">
                <div className="lp-poster-letter-big">
                  {item.name.charAt(0)}
                </div>
                <div className="lp-poster-letter-small">
                  {item.name}
                </div>
              </div>

              <div
                className="lp-color-gif-inline"
                onClick={() => onZoom(item.src, `${item.name} color sign`)}
              >
                <img src={item.src} alt={`${item.name} color sign`} />
              </div>
            </div>

            <div className="lp-poster-bottom">
              <div className="lp-color-main-row">
                <div
                  className="lp-color-circle"
                  style={{ background: item.hex }}
                />
                <div className="lp-color-text">
                  This is the sign for <strong>{item.name}</strong>.
                </div>
              </div>

              <div className="lp-color-emoji-row">
                <div className="lp-color-emojis">{item.emoji}</div>
                <div className="lp-color-tagline">{item.tag}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default ColorsPosters;
