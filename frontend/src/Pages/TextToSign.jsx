import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TextToSign = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [mainVideo, setMainVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [noVideo, setNoVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]); // YouTube results

  const mainVideoRef = useRef(null);

  const fetchYoutubeVideos = async (text) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/youtube-search?q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setYoutubeVideos((data.items || []).slice(0, 6));
    } catch (err) {
      console.error('YouTube fetch error', err);
      setYoutubeVideos([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMainVideo(null);
    setRelatedVideos([]);
    setNoVideo(false);
    setYoutubeVideos([]);

    try {
      const response = await fetch('http://localhost:5001/api/text-to-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      const apiMain = data.main_video || (data.videos && data.videos[0]);
      const apiRelated =
        data.related_videos ||
        (data.videos && data.videos.length > 1 ? data.videos.slice(1) : []);

      if (apiMain) {
        setMainVideo(apiMain);
        setRelatedVideos(apiRelated || []);
        setTimeout(() => {
          mainVideoRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      } else {
        setNoVideo(true);
        fetchYoutubeVideos(inputText);
      }
    } catch (error) {
      console.error('Error:', error);
      setNoVideo(true);
      fetchYoutubeVideos(inputText);
    }

    setLoading(false);
  };

  const handleRecommendedClick = (clickedVideo) => {
    if (!mainVideo || clickedVideo === mainVideo) return;

    setRelatedVideos((prev) => {
      const withoutClicked = prev.filter((v) => v !== clickedVideo);
      return [mainVideo, ...withoutClicked];
    });
    setMainVideo(clickedVideo);

    setTimeout(() => {
      mainVideoRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at top left, #e0f2fe 0%, #fef9c3 40%, #fee2e2 80%)',
        color: '#0f172a',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        padding: '24px 12px 40px',
        minHeight: '100vh',
      }}
    >
      <div
        className="tts-container"
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="tts-back-btn"
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.95)',
            color: '#374151',
            border: 'none',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
          }}
        >
          ← Back to Dashboard
        </button>

        {/* Hero + Input card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: '28px 22px 30px',
            boxShadow: '0 24px 60px rgba(148,163,184,0.3)',
            border: '1px solid rgba(255,255,255,0.95)',
            margin: '70px auto 32px',
            maxWidth: '900px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: '800',
                margin: '0 0 8px 0',
                background:
                  'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🎬 Text to Sign Magic
            </h1>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#64748b',
                fontWeight: '500',
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              Type anything and watch it transform into American Sign Language
              videos! ✨
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                ✍️ Type your phrase here
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Try 'Hello friend', 'Thank you', or 'Good morning' ✨"
                style={{
                  width: '100%',
                  padding: '16px 12px',
                  fontSize: '1.05rem',
                  borderRadius: '18px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#1e293b',
                  outline: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  transition: 'all 0.25s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow =
                    '0 0 0 3px rgba(59,130,246,0.15), 0 18px 36px rgba(0,0,0,0.18)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow =
                    '0 8px 24px rgba(0,0,0,0.08)';
                  e.target.style.transform = 'translateY(0)';
                }}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputText}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '1.05rem',
                fontWeight: '700',
                border: 'none',
                borderRadius: '18px',
                background: loading
                  ? '#cbd5e1'
                  : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                cursor:
                  loading || !inputText ? 'not-allowed' : 'pointer',
                boxShadow: loading
                  ? '0 8px 20px rgba(0,0,0,0.12)'
                  : '0 18px 40px rgba(59,130,246,0.35)',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                if (!loading && inputText) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 26px 60px rgba(59,130,246,0.45)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && inputText) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 18px 40px rgba(59,130,246,0.35)';
                }
              }}
            >
              {loading ? <>🔄 Finding your signs...</> : '🎬 Show Sign Language Videos'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {mainVideo && (
          <>
            <div
              ref={mainVideoRef}
              style={{
                textAlign: 'center',
                background: 'rgba(255,255,255,0.97)',
                borderRadius: '24px',
                padding: '24px 16px 22px',
                boxShadow: '0 22px 55px rgba(148,163,184,0.28)',
                backdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.9)',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background:
                    'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  marginBottom: '14px',
                  boxShadow: '0 10px 26px rgba(16,185,129,0.35)',
                  animation: 'pulse 2s infinite',
                }}
              >
                ✅ Found {1 + relatedVideos.length} video
                {1 + relatedVideos.length > 1 ? 's' : ''}!
              </div>
              <h3
                style={{
                  fontSize: '1.3rem',
                  color: '#1e293b',
                  marginBottom: '14px',
                  fontWeight: '700',
                }}
              >
                Sign language for: "{inputText}"
              </h3>

              <div
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 18px 45px rgba(15,23,42,0.35)',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.95)',
                  padding: '6px',
                  maxWidth: '960px',
                  margin: '0 auto',
                }}
              >
                <img
                  src={`http://localhost:5001/video/${mainVideo}`}
                  alt="ASL Sign Video"
                  style={{
                    width: '100%',
                    maxHeight: '380px',
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: '#000',
                  }}
                />
              </div>
            </div>

            {relatedVideos.length > 0 && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  borderRadius: '24px',
                  padding: '22px 16px 26px',
                  boxShadow: '0 22px 55px rgba(148,163,184,0.3)',
                  border: '1px solid rgba(255,255,255,0.9)',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    ⭐ More signs from this set
                  </h4>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                    }}
                  >
                    Click a card to bring it to the main screen.
                  </span>
                </div>

                <div
                  className="tts-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                  }}
                >
                  {relatedVideos.map((video, index) => (
                    <div
                      key={`suggest-${index}`}
                      style={{
                        background: '#f9fafb',
                        borderRadius: '16px',
                        padding: '10px',
                        boxShadow:
                          '0 10px 26px rgba(15,23,42,0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => handleRecommendedClick(video)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 18px 36px rgba(15,23,42,0.22)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 10px 26px rgba(15,23,42,0.15)';
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '14px',
                          overflow: 'hidden',
                          background: '#000',
                          marginBottom: '8px',
                        }}
                      >
                        <img
                          src={`http://localhost:5001/video/${video}`}
                          alt="Recommended sign"
                          style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'contain',
                            display: 'block',
                            backgroundColor: '#000',
                          }}
                        />
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        Recommended sign #{index + 2}
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: '0.82rem',
                          color: '#6b7280',
                        }}
                      >
                        From the same topic folder as your search.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Video Section + YouTube thumbnail cards */}
        {noVideo && (
          <div
            style={{
              background: 'rgba(254,247,224,0.97)',
              border: '2px solid #fcd34d',
              borderRadius: '24px',
              padding: '24px 16px',
              textAlign: 'center',
              marginTop: '24px',
              boxShadow: '0 18px 45px rgba(252,211,77,0.28)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <div
              style={{
                fontSize: '2.6rem',
                marginBottom: '12px',
              }}
            >
              🔍
            </div>
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#92400e',
                marginBottom: '10px',
              }}
            >
              No GIF available for "{inputText}"
            </h3>
            <p
              style={{
                fontSize: '1rem',
                color: '#a16207',
                marginBottom: '14px',
                lineHeight: '1.6',
              }}
            >
              Try a shorter phrase, or explore these video lessons from other
              sources.
            </p>

            {/* YouTube cards */}
            <div
              style={{
                marginTop: '6px',
                textAlign: 'left',
              }}
            >
              <h4
                style={{
                  margin: '0 0 8px 4px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                🎥 Helpful videos from YouTube for "{inputText}"
              </h4>

              <div
                className="tts-youtube-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '12px',
                }}
              >
                {youtubeVideos.slice(0, 6).map((vid) => (
                  <a
                    key={vid.videoId}
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: '#0f172a',
                      boxShadow: '0 14px 30px rgba(15,23,42,0.45)',
                      color: 'white',
                      transition:
                        'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 18px 40px rgba(15,23,42,0.6)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 14px 30px rgba(15,23,42,0.45)';
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        style={{
                          width: '100%',
                          height: '140px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '50px',
                          height: '50px',
                          borderRadius: '999px',
                          background: 'rgba(0,0,0,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            marginLeft: '4px',
                            fontSize: '24px',
                          }}
                        >
                          ▶
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '8px 10px 10px' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          lineHeight: 1.35,
                        }}
                      >
                        {vid.title}
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: '0.78rem',
                          color: '#e5e7eb',
                        }}
                      >
                        {vid.channel}
                      </p>
                    </div>
                  </a>
                ))}

                {youtubeVideos.length === 0 && (
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#78350f',
                      textAlign: 'center',
                      gridColumn: '1 / -1',
                    }}
                  >
                    No external videos available right now. Please try another
                    phrase.
                  </p>
                )}
              </div>

              {/* quick example phrases */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '18px',
                }}
              >
                <div
                  style={{
                    padding: '10px 18px',
                    background:
                      'linear-gradient(135deg, #fef3c7, #fde68a)',
                    color: '#92400e',
                    borderRadius: '999px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: '2px solid #f59e0b',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.2)',
                    fontSize: '0.9rem',
                  }}
                  onClick={() => setInputText('hello')}
                >
                  Hello
                </div>
                <div
                  style={{
                    padding: '10px 18px',
                    background:
                      'linear-gradient(135deg, #fef3c7, #fde68a)',
                    color: '#92400e',
                    borderRadius: '999px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: '2px solid #f59e0b',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 8px 20px rgba(245,158,11,0.2)',
                    fontSize: '0.9rem',
                  }}
                  onClick={() => setInputText('thank you')}
                >
                  Thank you
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive helpers */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Tablets & small laptops */
        @media (max-width: 1024px) {
          .tts-container {
            padding: 0 4px;
          }
          .tts-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .tts-youtube-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        /* Phones */
        @media (max-width: 768px) {
          .tts-container {
            margin-top: 40px;
          }
          .tts-back-btn {
            top: 10px !important;
            left: 10px !important;
            padding: 7px 12px !important;
            font-size: 11px !important;
          }
          .tts-grid {
            grid-template-columns: repeat(1, 1fr) !important;
          }
          .tts-youtube-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
        }

        /* Very small phones */
        @media (max-width: 480px) {
          .tts-container {
            padding: 0 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default TextToSign;
