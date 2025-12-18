// src/Component/CommonInteractionsPosters.jsx
import React from 'react';

const interactionItems = [
  { id: 'hello',        name: 'Hello',          src: '/lessons/Common_interaction/HELLO.png',         tag: 'friendly greeting',       hex: '#bfdbfe', emoji: '👋' },
  { id: 'ok',           name: 'OK',            src: '/lessons/Common_interaction/ok.png',            tag: 'all good',                hex: '#bbf7d0', emoji: '👌' },
  { id: 'sorry',        name: 'Sorry',         src: '/lessons/Common_interaction/Sorry.png',         tag: 'apologizing politely',    hex: '#fecaca', emoji: '😔' },
  { id: 'thankyou',     name: 'Thank You',     src: '/lessons/Common_interaction/Thankyou.png',      tag: 'showing gratitude',       hex: '#fde68a', emoji: '🙏' },
  { id: 'yourewelcome', name: 'You’re Welcome',src: '/lessons/Common_interaction/YouareWelcome.png', tag: 'kind response',           hex: '#f9a8d4', emoji: '🙂' },
  { id: 'done',         name: 'Done',          src: '/lessons/Common_interaction/Done.png',          tag: 'all finished',            hex: '#d1fae5', emoji: '✅' },
  { id: 'friend',       name: 'Friend',        src: '/lessons/Common_interaction/Friend.png',        tag: 'good friend',             hex: '#a5b4fc', emoji: '🧑‍🤝‍🧑' },
  { id: 'more',         name: 'More',          src: '/lessons/Common_interaction/More.png',          tag: 'want more',               hex: '#fed7aa', emoji: '➕' },
  { id: 'iloveyou',     name: 'I Love You',    src: '/lessons/Common_interaction/ILoveYou.png',      tag: 'showing love',            hex: '#fecaca', emoji: '❤️' },
  { id: 'help',         name: 'Help',          src: '/lessons/Common_interaction/Help.png',          tag: 'asking for help',         hex: '#bfdbfe', emoji: '🆘' },
  { id: 'please',       name: 'Please',        src: '/lessons/Common_interaction/Please.png',        tag: 'polite asking',           hex: '#e5e7eb', emoji: '😊' },
  { id: 'stop',         name: 'Stop',          src: '/lessons/Common_interaction/Stop.png',          tag: 'telling to pause',        hex: '#fecaca', emoji: '✋' },
  { id: 'water',        name: 'Water',         src: '/lessons/Common_interaction/Water.png',         tag: 'asking for water',        hex: '#bfdbfe', emoji: '💧' },
];

const CommonInteractionsPosters = ({ onZoom }) => {
  return (
    <>
      <style>{`
        .lp-section {
          padding: 18px 0 4px;
          background:
            radial-gradient(circle at top left, #e0f2fe, transparent 55%),
            radial-gradient(circle at top right, #fee2e2, transparent 55%);
        }

        .lp-section-title {
          max-width: 1200px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 0 4px;
        }

        .lp-section-title-main {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lp-section-title-chip {
          font-size: 0.8rem;
          padding: 4px 9px;
          border-radius: 999px;
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 500;
        }

        .lp-section-sub {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 4px;
        }

        .lp-grid-poster {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 8px;
        }

        @media (max-width: 900px) {
          .lp-section-title {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .lp-grid-poster {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .lp-poster {
          border-radius: 24px;
          overflow: hidden;
          background: radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(248,250,252,0.95));
          backdrop-filter: blur(14px);
          border: 1px solid rgba(148,163,184,0.25);
          box-shadow:
            0 18px 40px rgba(15,23,42,0.18),
            inset 0 1px 0 rgba(255,255,255,0.7);
          transform: translateY(0) scale(1);
          transition:
            transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1),
            box-shadow 0.35s ease,
            border-color 0.35s ease,
            background 0.35s ease;
          position: relative;
          height: 320px;
          animation: lp-card-pop 0.6s ease both;
        }

        .lp-poster::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.35), transparent 55%),
            radial-gradient(circle at bottom right, rgba(15,23,42,0.08), transparent 60%);
          opacity: 0.7;
          pointer-events: none;
        }

        .lp-poster::after {
          content: '';
          position: absolute;
          top: 0;
          left: 16px;
          right: 16px;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--accent-color), transparent);
          opacity: 0.9;
          box-shadow: 0 0 18px var(--accent-soft);
        }

        .lp-poster:hover {
          transform: translateY(-10px) scale(1.01);
          box-shadow:
            0 30px 70px rgba(15,23,42,0.28),
            inset 0 1px 0 rgba(255,255,255,0.9);
          border-color: rgba(96,165,250,0.7);
          background: radial-gradient(circle at top, rgba(255,255,255,0.97), rgba(239,246,255,0.98));
        }

        .lp-poster-top {
          display: flex;
          height: 100%;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .lp-interaction-left {
          flex: 0 0 170px;
          background: linear-gradient(160deg, var(--accent-color), #ffffff);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 18px 12px;
          position: relative;
          box-shadow: inset -3px 0 10px rgba(15,23,42,0.12);
          color: #0f172a;
        }

        .lp-interaction-left::after {
          content: '';
          position: absolute;
          bottom: 14px;
          width: 70%;
          height: 6px;
          border-radius: 999px;
          background: rgba(15,23,42,0.14);
          filter: blur(6px);
          opacity: 0.8;
        }

        .lp-interaction-emoji {
          font-size: 3.8rem;
          line-height: 1;
          margin-bottom: 8px;
          animation: lp-emoji-bounce 2.1s infinite ease-in-out;
        }

        .lp-interaction-name {
          font-size: 1.35rem;
          font-weight: 800;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-shadow: 0 1px 0 rgba(255,255,255,0.9);
        }

        .lp-interaction-sign {
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
          position: relative;
          background: linear-gradient(135deg, rgba(248,250,252,0.95), rgba(239,246,255,0.96));
          transition: background 0.35s ease;
        }

        .lp-interaction-sign::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(191,219,254,0.25), transparent 60%);
          opacity: 0.0;
          transition: opacity 0.35s ease;
        }

        .lp-poster:hover .lp-interaction-sign::before {
          opacity: 1;
        }

        .lp-interaction-gif {
          width: 250px;
          height: 210px;
          object-fit: contain;
          transition:
            transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1),
            filter 0.35s ease;
          filter: drop-shadow(0 10px 24px rgba(15,23,42,0.35));
        }

        .lp-interaction-sign:hover .lp-interaction-gif {
          transform: scale(1.05) translateY(-3px) rotate(-1deg);
          filter: drop-shadow(0 16px 40px rgba(15,23,42,0.4));
        }

        .lp-interaction-tagline {
          margin-top: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          font-style: italic;
          padding: 7px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.95);
          color: #1e293b;
          box-shadow:
            0 10px 24px rgba(15,23,42,0.18),
            inset 0 1px 0 rgba(255,255,255,0.9);
          max-width: 270px;
          text-align: center;
          animation: lp-tag-pulse 3s infinite ease-in-out;
        }

        ${interactionItems
          .map(
            (item, index) => `
          .lp-poster-${item.id} {
            --accent-color: ${item.hex};
            --accent-soft: ${item.hex}cc;
            animation-delay: ${0.03 * index}s;
          }
        `
          )
          .join('\n')}

        @keyframes lp-emoji-bounce {
          0%, 100% { transform: translateY(0); }
          30%      { transform: translateY(-4px); }
          60%      { transform: translateY(1px); }
        }

        @keyframes lp-card-pop {
          0%   { opacity: 0; transform: translateY(16px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes lp-tag-pulse {
          0%, 100% { transform: translateY(0); box-shadow: 0 8px 18px rgba(15,23,42,0.18); }
          50%      { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(59,130,246,0.42); }
        }

        /* Tablet / small laptops */
        @media (max-width: 768px) {
          .lp-poster {
            height: 290px;
          }
          .lp-interaction-left {
            flex: 0 0 150px;
            padding: 14px 10px;
          }
          .lp-interaction-emoji {
            font-size: 3.2rem;
          }
          .lp-interaction-name {
            font-size: 1.15rem;
          }
          .lp-interaction-gif {
            width: 220px;
            height: 190px;
          }
          .lp-interaction-tagline {
            font-size: 0.9rem;
            padding: 6px 14px;
          }
        }

        /* Small phones */
        @media (max-width: 480px) {
          .lp-section {
            padding-top: 12px;
          }
          .lp-poster {
            height: 260px;
          }
          .lp-interaction-left {
            flex: 0 0 135px;
            padding: 12px 8px;
          }
          .lp-interaction-emoji {
            font-size: 2.9rem;
          }
          .lp-interaction-name {
            font-size: 1.05rem;
            letter-spacing: 0.06em;
          }
          .lp-interaction-gif {
            width: 190px;
            height: 170px;
          }
          .lp-interaction-tagline {
            font-size: 0.82rem;
            max-width: 230px;
          }
        }
      `}</style>

      <section className="lp-section">
        <header className="lp-section-title">
          <div>
            <div className="lp-section-title-main">
              🧡 Everyday feelings & phrases
            </div>
            <div className="lp-section-sub">
              Tap a card to zoom in, copy the sign, and practice how to say kind words with your hands.
            </div>
          </div>
          <div className="lp-section-title-chip">
            Kid‑friendly posters · Learn by looking
          </div>
        </header>

        <div className="lp-grid-poster">
          {interactionItems.map((item, index) => (
            <article
              key={item.id}
              className={`lp-poster lp-poster-${item.id}`}
            >
              <div className="lp-poster-top">
                <div
                  className="lp-interaction-left"
                  style={{ '--accent-color': item.hex }}
                >
                  <div className="lp-interaction-emoji">{item.emoji}</div>
                  <div className="lp-interaction-name">{item.name}</div>
                </div>

                <div
                  className="lp-interaction-sign"
                  onClick={() => onZoom(item.src, `${item.name} sign`)}
                >
                  <img
                    src={item.src}
                    alt={`${item.name} sign`}
                    className="lp-interaction-gif"
                  />
                  <div className="lp-interaction-tagline">
                    "{item.tag}"
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default CommonInteractionsPosters;
