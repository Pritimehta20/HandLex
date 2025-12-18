// src/Component/EmotionsPosters.jsx
import React from 'react';

const emotionItems = [
  { id: 'happy',       name: 'Happy',       src: '/lessons/Emotions/happy.gif',       tag: 'joyful smile',     hex: '#fef08a', emoji: '😊' },
  { id: 'sad',         name: 'Sad',         src: '/lessons/Emotions/sad.gif',         tag: 'teary eyes',       hex: '#a5b4fc', emoji: '😢' },
  { id: 'excited',     name: 'Excited',     src: '/lessons/Emotions/excited.gif',     tag: 'big energy',       hex: '#facc15', emoji: '🤩' },
  { id: 'mad',         name: 'Mad',         src: '/lessons/Emotions/mad.gif',         tag: 'angry face',       hex: '#fca5a5', emoji: '😠' },
  { id: 'shocked',     name: 'Shocked',     src: '/lessons/Emotions/shocked.gif',     tag: 'wide eyes',        hex: '#e0f2fe', emoji: '😱' },
  { id: 'proud',       name: 'Proud',       src: '/lessons/Emotions/proud.gif',       tag: 'chest out',        hex: '#f9a8d4', emoji: '🥇' },
  { id: 'hurt',        name: 'Hurt',        src: '/lessons/Emotions/hurt.gif',        tag: 'heart pain',       hex: '#d1fae5', emoji: '💔' },
  { id: 'kind',        name: 'Kind',        src: '/lessons/Emotions/kind.gif',        tag: 'gentle touch',     hex: '#a7f3d0', emoji: '🤗' },
  { id: 'hate',        name: 'Hate',        src: '/lessons/Emotions/hate.gif',        tag: 'dark anger',       hex: '#6b7280', emoji: '😡' },
  { id: 'annoyed',     name: 'Annoyed',     src: '/lessons/Emotions/annoyed.gif',     tag: 'eye roll',         hex: '#fed7aa', emoji: '🙄' },
  { id: 'panick',      name: 'Panick',      src: '/lessons/Emotions/panick.gif',      tag: 'hands up',         hex: '#dbeafe', emoji: '😰' },
  { id: 'greedy',      name: 'Greedy',      src: '/lessons/Emotions/greedy.gif',      tag: 'want more',        hex: '#fde68a', emoji: '🤲' },
  { id: 'obsessed',    name: 'Obsessed',    src: '/lessons/Emotions/obsessed.gif',    tag: 'heart eyes',       hex: '#f9a8d4', emoji: '😍' },
  { id: 'overwhelmed', name: 'Overwhelmed', src: '/lessons/Emotions/overwhelmed.gif', tag: 'too much',         hex: '#e0f2fe', emoji: '😵‍💫' },
  { id: 'brokenheart', name: 'Brokenheart', src: '/lessons/Emotions/brokenheart.gif', tag: 'deep sadness',     hex: '#a5b4fc', emoji: '😭' },
  { id: 'touched',     name: 'Touched',     src: '/lessons/Emotions/touched.gif',     tag: 'warm heart',       hex: '#f4f4f8', emoji: '🥺' },
];

const EmotionsPosters = ({ onZoom }) => {
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

        /* LEFT: Emoji Column */
        .lp-emotion-emoji-column {
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

        .lp-main-emoji {
          font-size: 5.8rem;
          line-height: 1;
          margin-bottom: 12px;
        }

        .lp-emotion-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          text-align: center;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          background: rgba(0,0,0,0.2);
          padding: 8px 12px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
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
        .lp-emotion-tagline {
          text-align: center;
          font-size: 1.2rem;
          color: #1e293b;
          font-weight: 700;
          font-style: italic;
          padding: 16px 24px;
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

        .lp-sign-column:hover .lp-emotion-tagline {
          transform: translateY(-4px);
          box-shadow: 
            0 16px 40px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,1),
            0 -6px 20px rgba(255,255,255,0.4);
        }

        .lp-emotion-tagline::before {
          content: '';
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 200%;
          background: linear-gradient(white, transparent);
          border-radius: 50%;
          opacity: 0.3;
          z-index: -1;
        }

        /* Accent color per emotion */
        ${emotionItems.map((item) => `
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
          .lp-emotion-emoji-column {
            flex: 0 0 120px;
            padding: 14px 10px;
          }
          .lp-main-emoji {
            font-size: 4.8rem;
            margin-bottom: 8px;
          }
          .lp-emotion-name {
            font-size: 1.05rem;
            padding: 6px 10px;
          }
          .lp-sign-column {
            padding: 10px;
          }
          .lp-sign-gif {
            width: 250px;
            height: 250px;
          }
          .lp-emotion-tagline {
            font-size: 1.05rem;
            padding: 12px 20px;
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
          .lp-poster-top {
            /* keep side-by-side, but tighter */
          }
          .lp-emotion-emoji-column {
            flex: 0 0 105px;
            padding: 10px 8px;
          }
          .lp-main-emoji {
            font-size: 4rem;
            margin-bottom: 6px;
          }
          .lp-emotion-name {
            font-size: 0.95rem;
            padding: 5px 8px;
          }
          .lp-sign-column {
            padding: 8px;
          }
          .lp-sign-gif {
            width: 210px;
            height: 210px;
          }
          .lp-emotion-tagline {
            font-size: 0.95rem;
            padding: 10px 14px;
            margin-top: -4px;
          }
        }
      `}</style>

      <div className="lp-grid-poster">
        {emotionItems.map((item) => (
          <article
            key={item.id}
            className={`lp-poster lp-poster-${item.id}`}
          >
            <div className="lp-poster-top">
              {/* LEFT: Emoji column */}
              <div 
                className="lp-emotion-emoji-column"
                style={{ '--accent-color': item.hex }}
              >
                <div className="lp-main-emoji">{item.emoji}</div>
                <div className="lp-emotion-name">{item.name}</div>
              </div>

              {/* RIGHT: GIF column */}
              <div 
                className="lp-sign-column"
                onClick={() => onZoom(item.src, `${item.name} emotion sign`)}
              >
                <img 
                  src={item.src} 
                  alt={`${item.name} emotion sign`} 
                  className="lp-sign-gif"
                />
                <div className="lp-emotion-tagline">
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

export default EmotionsPosters;
