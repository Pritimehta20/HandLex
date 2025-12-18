// src/Component/BodySensationsPosters.jsx
import React from 'react';

const bodySensationItems = [
  { id: 'cold',        name: 'Cold',         src: '/lessons/Sensation/cold.gif',         tag: 'shivering hands',     hex: '#dbeafe', emoji: '🥶' },
  { id: 'cool',        name: 'Cool',         src: '/lessons/Sensation/cool.gif',         tag: 'comfortable chill',   hex: '#e0f2fe', emoji: '❄️' },
  { id: 'hot',         name: 'Hot',          src: '/lessons/Sensation/hot.gif',          tag: 'sweaty forehead',     hex: '#fed7aa', emoji: '🥵' },
  { id: 'hungry',      name: 'Hungry',       src: '/lessons/Sensation/hungry.gif',       tag: 'empty stomach',       hex: '#fde68a', emoji: '🍽️' },
  { id: 'thirsty',     name: 'Thirsty',      src: '/lessons/Sensation/thirsty.gif',      tag: 'dry mouth',           hex: '#facc15', emoji: '💧' },
  { id: 'fever',       name: 'Fever',        src: '/lessons/Sensation/fever.gif',        tag: 'hot forehead',        hex: '#fca5a5', emoji: '🌡️' },
  { id: 'sick',        name: 'Sick',         src: '/lessons/Sensation/sick.gif',         tag: 'feeling ill',         hex: '#d1fae5', emoji: '🤒' },
  { id: 'cough',       name: 'Cough',        src: '/lessons/Sensation/cough.gif',        tag: 'throat clearing',     hex: '#a7f3d0', emoji: '🤧' },
  { id: 'sorethroat',  name: 'Sore Throat',  src: '/lessons/Sensation/sorethrought.gif', tag: 'scratchy throat',     hex: '#f9a8d4', emoji: '😖' },
  { id: 'bloodynose',  name: 'Bloody Nose',  src: '/lessons/Sensation/bloodynose.gif',   tag: 'nose bleeding',       hex: '#ef4444', emoji: '🩸' },
  { id: 'earinfection',name: 'Ear Infection',src: '/lessons/Sensation/earinfection.gif', tag: 'ear pain',            hex: '#f97316', emoji: '👂' },
  { id: 'swollen',     name: 'Swollen',      src: '/lessons/Sensation/swollen.gif',      tag: 'puffy swelling',      hex: '#ec4899', emoji: '💧' },
  { id: 'strongwind',  name: 'Strong Wind',  src: '/lessons/Sensation/strongwind.gif',   tag: 'windy weather',       hex: '#06b6d4', emoji: '🌪️' },
];

const BodySensationsPosters = ({ onZoom }) => {
  return (
    <>
      <style>{`
        .lp-grid-poster {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .lp-grid-poster {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .lp-poster {
          border-radius: 28px;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateY(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          height: 380px;
        }

        .lp-poster::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, var(--accent-color), var(--accent-color) 50%, transparent);
          box-shadow: 0 2px 8px var(--accent-color)20;
        }

        .lp-poster:hover {
          transform: translateY(-16px) scale(1.02);
          box-shadow: 
            0 40px 80px rgba(0,0,0,0.25),
            inset 0 1px 0 rgba(255,255,255,0.5);
        }

        .lp-poster-top {
          display: flex;
          height: 100%;
          overflow: hidden;
        }

        /* LEFT: Body Icon Column */
        .lp-sensation-icon-column {
          flex: 0 0 130px;
          background: var(--accent-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 12px;
          position: relative;
          z-index: 2;
          box-shadow: inset -4px 0 12px rgba(0,0,0,0.1);
        }

        .lp-main-icon {
          font-size: 5.8rem;
          line-height: 1;
          margin-bottom: 12px;
        }

        .lp-sensation-name {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          text-align: center;
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          background: rgba(0,0,0,0.2);
          padding: 8px 12px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          white-space: nowrap;
        }

        /* RIGHT: GIF Column */
        .lp-sign-column {
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
          transition: all 0.4s ease;
          position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
        }

        .lp-sign-column:hover {
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.04));
        }

        .lp-sign-gif {
          width: 280px;
          height: 280px;
          max-width: 100%;
          object-fit: contain;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lp-sign-column:hover .lp-sign-gif {
          transform: scale(1.04);
          filter: drop-shadow(0 12px 32px rgba(0,0,0,0.2));
        }

        /* Tagline */
        .lp-sensation-tagline {
          text-align: center;
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 700;
          font-style: italic;
          padding: 14px 20px;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
          border-radius: 24px;
          border: 2px solid rgba(255,255,255,0.4);
          box-shadow: 
            0 12px 32px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.8),
            0 -4px 16px rgba(255,255,255,0.3);
          width: 100%;
          box-sizing: border-box;
          margin-top: -8px;
          transform: translateY(0);
          transition: all 0.3s ease;
          backdrop-filter: blur(15px);
          position: relative;
          z-index: 3;
        }

        .lp-sign-column:hover .lp-sensation-tagline {
          transform: translateY(-4px);
          box-shadow: 
            0 16px 40px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,1),
            0 -6px 20px rgba(255,255,255,0.4);
        }

        /* Dynamic accent color per sensation */
        ${bodySensationItems.map((item) => `
          .lp-poster-${item.id} {
            --accent-color: ${item.hex};
          }
        `).join('\n')}

        /* Tablet adjustments */
        @media (max-width: 768px) {
          .lp-poster {
            height: 340px;
            border-radius: 24px;
          }
          .lp-sensation-icon-column {
            flex: 0 0 120px;
            padding: 14px 10px;
          }
          .lp-main-icon {
            font-size: 4.8rem;
            margin-bottom: 8px;
          }
          .lp-sensation-name {
            font-size: 0.95rem;
            padding: 6px 10px;
          }
          .lp-sign-column {
            padding: 10px;
          }
          .lp-sign-gif {
            width: 250px;
            height: 250px;
          }
          .lp-sensation-tagline {
            font-size: 1rem;
            padding: 12px 18px;
          }
        }

        /* Small phones: ensure GIF fully visible */
        @media (max-width: 480px) {
          .lp-grid-poster {
            gap: 18px;
          }
          .lp-poster {
            height: 300px;
            border-radius: 20px;
          }
          .lp-sensation-icon-column {
            flex: 0 0 105px;
            padding: 10px 8px;
          }
          .lp-main-icon {
            font-size: 4rem;
            margin-bottom: 6px;
          }
          .lp-sensation-name {
            font-size: 0.85rem;
            padding: 5px 8px;
          }
          .lp-sign-column {
            padding: 8px;
          }
          .lp-sign-gif {
            width: 210px;
            height: 210px;
          }
          .lp-sensation-tagline {
            font-size: 0.95rem;
            padding: 10px 14px;
            margin-top: -4px;
          }
        }
      `}</style>

      <div className="lp-grid-poster">
        {bodySensationItems.map((item) => (
          <article
            key={item.id}
            className={`lp-poster lp-poster-${item.id}`}
          >
            <div className="lp-poster-top">
              {/* LEFT: Body Sensation Icon Column */}
              <div 
                className="lp-sensation-icon-column"
                style={{ '--accent-color': item.hex }}
              >
                <div className="lp-main-icon">{item.emoji}</div>
                <div className="lp-sensation-name">{item.name}</div>
              </div>

              {/* RIGHT: GIF Column */}
              <div 
                className="lp-sign-column"
                onClick={() => onZoom(item.src, `${item.name} sensation sign`)}
              >
                <img 
                  src={item.src} 
                  alt={`${item.name} sensation sign`} 
                  className="lp-sign-gif"
                />
                <div className="lp-sensation-tagline">
                  "{item.tag}"
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default BodySensationsPosters;
