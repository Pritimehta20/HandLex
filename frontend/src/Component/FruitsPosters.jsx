// src/Component/FruitsPosters.jsx
import React from 'react';

const fruitItems = [
  { id: 'apple',      name: 'Apple',      cute: '/lessons/Fruits/cute_apple.png',      src: '/lessons/Fruits/apple.gif',      emoji: '🍎', tag: 'Crunchy & sweet',      hex: '#fecaca' },
  { id: 'mango',      name: 'Mango',      cute: '/lessons/Fruits/cute-mango.png',      src: '/lessons/Fruits/mango.gif',      emoji: '🥭', tag: 'Juicy summer king',   hex: '#fed7aa' },
  { id: 'banana',     name: 'Banana',     cute: '/lessons/Fruits/cute-banana.png',     src: '/lessons/Fruits/banana.gif',     emoji: '🍌', tag: 'Soft & energy-rich',  hex: '#fef08a' },
  { id: 'cherry',     name: 'Cherry',     cute: '/lessons/Fruits/cute-cherry.png',     src: '/lessons/Fruits/cherry.gif',     emoji: '🍒', tag: 'Tiny red pops',       hex: '#fecaca' },
  { id: 'watermelon', name: 'Watermelon', cute: '/lessons/Fruits/cute-watermelon.png', src: '/lessons/Fruits/watermelon.gif', emoji: '🍉', tag: 'Cool & super juicy',  hex: '#bbf7d0' },
  { id: 'grapes',     name: 'Grapes',     cute: '/lessons/Fruits/cute-grapes.png',     src: '/lessons/Fruits/grapes.gif',     emoji: '🍇', tag: 'Little sweet balls',  hex: '#e9d5ff' },
  { id: 'raspberry',  name: 'Raspberry',  cute: '/lessons/Fruits/cute-raspberry.png',  src: '/lessons/Fruits/raspberry.gif',  emoji: '🫐', tag: 'Soft berry bites',    hex: '#f9a8d4' },
  { id: 'kiwi',       name: 'Kiwi',       cute: '/lessons/Fruits/cute-kiwi.png',       src: '/lessons/Fruits/kiwi.gif',       emoji: '🥝', tag: 'Green & tangy',       hex: '#bbf7d0' },
  { id: 'blueberry',  name: 'Blueberry',  cute: '/lessons/Fruits/cute-blueberry.png',  src: '/lessons/Fruits/blueberry.gif',  emoji: '🫐', tag: 'Tiny purple power',   hex: '#bfdbfe' },
  { id: 'guava',      name: 'Guava',      cute: '/lessons/Fruits/cute-gauava.png',     src: '/lessons/Fruits/gauava.gif',     emoji: '🍈', tag: 'Full of Vitamin C',  hex: '#bbf7d0' },
  { id: 'orange',     name: 'Orange',     cute: '/lessons/Fruits/cute-orange.png',     src: '/lessons/Fruits/orangee.gif',    emoji: '🍊', tag: 'Peel & squeeze fun', hex: '#fed7aa' },
  { id: 'pear',       name: 'Pear',       cute: '/lessons/Fruits/cute-pear.png',       src: '/lessons/Fruits/pear.gif',       emoji: '🍐', tag: 'Soft & grainy',       hex: '#fde68a' },
  { id: 'pineapple',  name: 'Pineapple',  cute: '/lessons/Fruits/cute-pineapple.png',  src: '/lessons/Fruits/pineapple.gif',  emoji: '🍍', tag: 'Spiky but sweet',     hex: '#fef3c7' },
  { id: 'strawberry', name: 'Strawberry', cute: '/lessons/Fruits/cute-strawberry.png', src: '/lessons/Fruits/strawberry.gif', emoji: '🍓', tag: 'Heart-shaped treat', hex: '#fecaca' },
];

const FruitsPosters = ({ onZoom }) => {
  return (
    <>
      <style>{`
        .lp-fruits-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        @media (max-width: 900px) {
          .lp-fruits-grid {
            gap: 18px;
          }
        }

        /* One card per row on tablets/phones */
        @media (max-width: 768px) {
          .lp-fruits-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        @media (max-width: 480px) {
          .lp-fruits-grid {
            gap: 14px;
          }
        }

        .lp-fruit-card {
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 16px 32px rgba(148,163,184,0.7);
          transform: translateY(0) translateZ(0);
          transition: transform .18s ease, box-shadow .18s ease;
          position: relative;
        }

        .lp-fruit-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 22px 50px rgba(148,163,184,0.9);
        }

        .lp-fruit-top {
          padding: 14px 16px 10px;
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 12px;
          align-items: center;
        }

        /* cute fruit image block */
        .lp-fruit-cute {
          border-radius: 22px;
          padding: 4px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .lp-fruit-cute img {
          width: 100%;
          height: 100%;
          max-height: 160px;
          object-fit: contain;
        }

        .lp-fruit-gif {
          border-radius: 18px;
          padding: 0;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor: zoom-in;
        }

        .lp-fruit-gif img {
          width: 100%;
          max-height: 170px;
          object-fit: contain;
        }

        .lp-fruit-bottom {
          padding: 8px 14px 14px;
          background: rgba(255,255,255,0.35);
        }

        .lp-fruit-main-row {
          display:flex;
          align-items:center;
          gap:10px;
          padding:6px 10px;
          border-radius:999px;
          background: rgba(255,255,255,0.9);
        }

        .lp-fruit-circle {
          width: 34px;
          height: 34px;
          border-radius:50%;
          border:3px solid rgba(15,23,42,0.3);
          box-shadow:0 4px 10px rgba(148,163,184,0.7);
          flex-shrink:0;
        }

        .lp-fruit-text {
          font-size:0.95rem;
          font-weight:700;
        }

        .lp-fruit-emoji-row {
          display:flex;
          align-items:center;
          gap:10px;
          margin-top:6px;
          padding:4px 10px 2px;
        }

        .lp-fruit-emojis {
          font-size:2.1rem;
        }

        .lp-fruit-tagline {
          font-size:0.9rem;
          opacity:0.9;
        }

        /* Tablet adjustments */
        @media (max-width: 768px) {
          .lp-fruit-top {
            padding: 12px 12px 8px;
            grid-template-columns: 110px 1fr;
            gap: 10px;
          }

          .lp-fruit-cute img {
            max-height: 140px;
          }

          .lp-fruit-gif img {
            max-height: 150px;
          }

          .lp-fruit-bottom {
            padding: 8px 12px 12px;
          }

          .lp-fruit-text {
            font-size: 0.9rem;
          }

          .lp-fruit-tagline {
            font-size: 0.86rem;
          }
        }

        /* Small phones: ensure GIF fully visible */
        @media (max-width: 480px) {
          .lp-fruit-top {
            padding: 10px 10px 6px;
            grid-template-columns: 100px 1fr;
            gap: 8px;
          }

          .lp-fruit-cute img {
            max-height: 120px;
          }

          .lp-fruit-gif img {
            max-height: 130px;
          }

          .lp-fruit-bottom {
            padding: 8px 10px 10px;
          }

          .lp-fruit-main-row {
            padding: 5px 8px;
          }

          .lp-fruit-circle {
            width: 30px;
            height: 30px;
          }

          .lp-fruit-text {
            font-size: 0.86rem;
          }

          .lp-fruit-emojis {
            font-size: 1.9rem;
          }

          .lp-fruit-tagline {
            font-size: 0.82rem;
          }
        }
      `}</style>

      <div className="lp-fruits-grid">
        {fruitItems.map((item) => (
          <article
            key={item.id}
            className="lp-fruit-card"
            style={{ background: item.hex }}
          >
            <div className="lp-fruit-top">
              {/* cute fruit illustration */}
              <div className="lp-fruit-cute">
                <img src={item.cute} alt={item.name} />
              </div>

              <div
                className="lp-fruit-gif"
                onClick={() => onZoom(item.src, `${item.name} sign`)}
              >
                <img src={item.src} alt={`${item.name} sign`} />
              </div>
            </div>

            <div className="lp-fruit-bottom">
              <div className="lp-fruit-main-row">
                <div
                  className="lp-fruit-circle"
                  style={{ background: item.hex }}
                />
                <div className="lp-fruit-text">
                  This is the sign for <strong>{item.name}</strong>.
                </div>
              </div>

              <div className="lp-fruit-emoji-row">
                <div className="lp-fruit-emojis">{item.emoji}</div>
                <div className="lp-fruit-tagline">{item.tag}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default FruitsPosters;
