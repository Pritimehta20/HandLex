// src/pages/SignToText.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SignToText = () => {
  const navigate = useNavigate();
  const translatedInput = useRef();
  const resetButton = useRef();
  const speakButton = useRef();
  const videoRef = useRef();

  const [isConnected, setIsConnected] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('starting...');
  const [hint, setHint] = useState('');

  const MIN_CONFIDENCE = 0.30;
  const FIRST_DELAY_MS = 800;
  const HOLD_REPEAT_MS = 2500;
  const SPACE_LABEL = 'Space';

  let currentLabel = null;
  let firstSeenTime = null;
  let lastRepeatTime = null;
  let socket = null;

  const appendLabel = useCallback((label) => {
    let text = translatedInput.current?.value || '';
    if (label === SPACE_LABEL) {
      if (text.length > 0 && !text.endsWith(' ')) {
        translatedInput.current.value = text + ' ';
      }
      return;
    }
    if (/^[A-Z]$/.test(label)) {
      translatedInput.current.value = text + label;
    } else {
      if (text.length > 0 && !text.endsWith(' ')) {
        text += ' ';
      }
      translatedInput.current.value = text + label + ' ';
    }
  }, []);

  const resetHandler = useCallback(() => {
    if (translatedInput.current) {
      translatedInput.current.value = '';
    }
    currentLabel = null;
    firstSeenTime = null;
    lastRepeatTime = null;
  }, []);

  const speakHandler = useCallback(() => {
    const text = translatedInput.current?.value.trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.name === 'Google UK English Female') || voices[0];
    utterance.rate = 1.0;
    speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src =
        'http://localhost:5000/video_feed?mode=text&' + Date.now();
    }

    fetch('http://localhost:5000/api/camera-status')
      .then((res) => res.json())
      .then((data) => {
        setCameraStatus(data.camera_active ? '🟢 Active' : '🔴 Inactive');
      })
      .catch(() => setCameraStatus('🔴 Error'));

    const socketScript = document.createElement('script');
    socketScript.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
    document.head.appendChild(socketScript);

    socketScript.onload = () => {
      const io = window.io;
      socket = io('http://localhost:5000');
      window.socket = socket;

      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('prediction', (data) => {
        const label = data.text;
        const conf = data.confidence;

        if (!label || conf < MIN_CONFIDENCE) {
          return;
        }

        const now = Date.now();

        if (label !== currentLabel) {
          currentLabel = label;
          firstSeenTime = now;
          lastRepeatTime = null;
          return;
        }

        const heldFor = now - firstSeenTime;

        if (!lastRepeatTime) {
          if (heldFor >= FIRST_DELAY_MS) {
            appendLabel(label);
            lastRepeatTime = now;
          }
        } else {
          const sinceLastRepeat = now - lastRepeatTime;
          if (sinceLastRepeat >= HOLD_REPEAT_MS) {
            appendLabel(label);
            lastRepeatTime = now;
          }
        }
      });

      socket.on('hint', (data) => {
        if (data && data.message) {
          setHint(data.message);
        }
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });
    };

    const timeoutId = setTimeout(() => {
      if (resetButton.current) resetButton.current.onclick = resetHandler;
      if (speakButton.current) speakButton.current.onclick = speakHandler;
    }, 100);

    return () => {
      clearTimeout(timeoutId);

      if (videoRef.current) {
        videoRef.current.src = '';
      }

      if (socket) {
        socket.off('hint');
        socket.disconnect();
        socket = null;
        window.socket = null;
      }

      const socketScriptEl = document.querySelector('script[src*="socket.io"]');
      if (socketScriptEl && socketScriptEl.parentNode) {
        socketScriptEl.parentNode.removeChild(socketScriptEl);
      }
    };
  }, [appendLabel, resetHandler, speakHandler]);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .stt-root {
          min-height: 100vh;
          padding: 24px 12px 32px;
          background:
            radial-gradient(circle at top left, #e0f2fe, #fef9c3 40%, #fee2e2 80%);
          display: flex;
          justify-content: center;
          align-items: stretch;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .stt-shell {
          width: 100%;
          max-width: 1120px;
          background: rgba(15, 23, 42, 0.06);
          border-radius: 24px;
          padding: 18px 16px 22px;
          box-shadow: 0 20px 40px rgba(15,23,42,0.25);
          backdrop-filter: blur(12px);
        }

        .stt-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .stt-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stt-subtitle {
          font-size: 0.9rem;
          color: #475569;
        }

        .stt-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eef2ff;
          font-size: 0.8rem;
          color: #4f46e5;
          font-weight: 500;
        }

        .stt-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 18px;
        }

        @media (max-width: 1024px) {
          .stt-shell {
            padding: 16px 12px 20px;
          }
          .stt-main-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        .stt-video-card {
          background: #020617;
          border-radius: 20px;
          padding: 12px 12px 14px;
          position: relative;
          overflow: hidden;
        }

        .stt-video-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #e5e7eb;
          font-size: 0.88rem;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stt-video-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.8);
          font-size: 0.75rem;
          color: #e5e7eb;
        }

        .stt-video-frame {
          border-radius: 16px;
          border: 3px solid rgba(56, 189, 248, 0.5);
          background: #0b1120;
          width: 100%;
          height: 360px;
          object-fit: cover;
        }

        .stt-video-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 0.82rem;
          color: #9ca3af;
          gap: 8px;
          flex-wrap: wrap;
        }

        .stt-text-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 14px 14px 16px;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .stt-text-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .stt-text-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stt-textarea {
          width: 100%;
          min-height: 170px;
          max-height: 220px;
          resize: none;
          border-radius: 14px;
          border: 2px solid #bfdbfe;
          padding: 10px 12px;
          font-size: 1rem;
          line-height: 1.4;
          outline: none;
          background: #eff6ff;
          color: #111827;
        }

        .stt-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5);
        }

        .stt-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .stt-btn {
          border: none;
          border-radius: 999px;
          padding: 9px 14px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .stt-btn:active {
          transform: translateY(1px) scale(0.98);
        }

        .stt-btn-reset {
          background: #fee2e2;
          color: #b91c1c;
          box-shadow: 0 4px 10px rgba(248, 113, 113, 0.4);
        }

        .stt-btn-speak {
          background: #3b82f6;
          color: #ffffff;
          box-shadow: 0 4px 11px rgba(59, 130, 246, 0.65);
        }

        .stt-status-pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          background: #f9fafb;
          color: #4b5563;
        }

        .stt-hint {
          margin-top: 10px;
          padding: 8px 10px;
          border-radius: 12px;
          font-size: 0.83rem;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(251, 191, 36, 0.14);
          color: #92400e;
        }

        .stt-hint-icon {
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #78350f;
        }

        .stt-footer-note {
          margin-top: 10px;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .stt-back-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          padding: 9px 16px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 6px 12px rgba(37, 99, 235, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Tablets & small laptops */
        @media (max-width: 1024px) {
          .stt-video-frame {
            height: 300px;
          }
        }

        /* Phones */
        @media (max-width: 768px) {
          .stt-root {
            padding: 18px 8px 24px;
          }
          .stt-shell {
            border-radius: 18px;
            padding: 14px 10px 18px;
          }
          .stt-title {
            font-size: 1.3rem;
          }
          .stt-video-frame {
            height: 250px;
          }
          .stt-textarea {
            min-height: 150px;
          }
          .stt-back-btn {
            top: 10px;
            left: 10px;
            padding: 7px 12px;
            font-size: 0.78rem;
          }
        }

        /* Very small phones */
        @media (max-width: 480px) {
          .stt-root {
            padding: 16px 6px 20px;
          }
          .stt-video-frame {
            height: 220px;
          }
          .stt-video-header {
            font-size: 0.8rem;
          }
          .stt-video-footer {
            font-size: 0.75rem;
          }
          .stt-controls-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <button
        className="stt-back-btn"
        onClick={() => {
          fetch('http://localhost:5000/api/stop-camera', { method: 'POST' });
          navigate('/dashboard');
        }}
      >
        ← Dashboard
      </button>

      <div className="stt-root">
        <div className="stt-shell">
          <div className="stt-header-row">
            <div>
              <div className="stt-title">✋ → 📝 Live Sign to Text</div>
              <div className="stt-subtitle">
                Show your hand signs, watch them become words in real time.
              </div>
            </div>
            <div className="stt-badge">🌟 Friendly learning mode</div>
          </div>

          <div className="stt-main-grid">
            {/* LEFT: Video */}
            <div className="stt-video-card">
              <div className="stt-video-header">
                <span>Live camera</span>
                <span className="stt-video-chip">
                  {cameraStatus === '🟢 Active'
                    ? '🟢 Ready to read your hands'
                    : '🔴 Camera not active'}
                </span>
              </div>
              <img
                ref={videoRef}
                className="stt-video-frame"
                alt="Live Video Feed"
              />
              <div className="stt-video-footer">
                <span>Tip: Hold your hand in the box and sign slowly.</span>
                <span>
                  {isConnected ? '🟢 Model connected' : '🔴 Connecting to model...'}
                </span>
              </div>
            </div>

            {/* RIGHT: Text & controls */}
            <div className="stt-text-card">
              <div className="stt-text-header">
                <div className="stt-text-title">📖 Live text board</div>
                <div className="stt-status-pill">
                  ✋ Signs → words in real time
                </div>
              </div>

              <textarea
                ref={translatedInput}
                className="stt-textarea"
                placeholder="Your sentence will appear here as you sign..."
                readOnly
              />

              <div className="stt-controls-row">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    ref={resetButton}
                    className="stt-btn stt-btn-reset"
                  >
                    🔄 Clear text
                  </button>
                  <button
                    ref={speakButton}
                    className="stt-btn stt-btn-speak"
                  >
                    🔊 Read aloud
                  </button>
                </div>
                <div className="stt-status-pill">
                  Camera: {cameraStatus} · SocketIO:{' '}
                  {isConnected ? '🟢 Connected' : '🔴 Connecting'}
                </div>
              </div>

              {hint && (
                <div className="stt-hint">
                  <div className="stt-hint-icon">💡</div>
                  <span>{hint}</span>
                </div>
              )}

              <div className="stt-footer-note">
                Try practicing letters A–Z, then short words like <b>HELLO</b>,{' '}
                <b>FRIEND</b>, or <b>WATER</b>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignToText;
