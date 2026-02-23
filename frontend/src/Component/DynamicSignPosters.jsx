// src/components/DynamicSignPosters.jsx
import React, { useState, useEffect } from 'react';
import { baseUrl } from '../Common/SummaryApi';

const DynamicSignPosters = ({ category, onZoom }) => {
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${baseUrl}/api/signs/category/${encodeURIComponent(category)}`
        );
        if (!response.ok) throw new Error('Failed to fetch signs');
        const data = await response.json();
        setSigns(data.signs || []);
      } catch (err) {
        console.error('Error fetching signs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSigns();
  }, [category]);

  if (loading) {
    return <div className="lp-loading">Loading signs...</div>;
  }

  if (error) {
    return (
      <div className="lp-error">
        Error: {error}
      </div>
    );
  }

  if (signs.length === 0) {
    return (
      <div className="lp-empty">
        No signs found for this category yet.
      </div>
    );
  }

  const gradients = [
    'linear-gradient(135deg, #f97373, #fde68a)',
    'linear-gradient(135deg, #38bdf8, #a5b4fc)',
    'linear-gradient(135deg, #4ade80, #facc15)',
    'linear-gradient(135deg, #f9a8d4, #bfdbfe)',
  ];

  return (
    <>
      <style>{`
        .lp-grid-poster {
          display: grid;
          /* Desktop: exactly 3 columns */
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          max-width: 1180px;
          margin: 0 auto;
        }

        .lp-poster {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(148, 163, 184, 0.5);
          transition: all 0.3s ease;
        }

        .lp-poster:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(148, 163, 184, 0.8);
        }

        .lp-poster-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          gap: 12px;
          background: linear-gradient(135deg, #f97373, #fde68a);
          min-height: 140px;
          position: relative;
        }

        .lp-poster-letter-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 110px;
          background: rgba(255,255,255,0.95);
          border-radius: 18px;
          box-shadow: 0 6px 14px rgba(0,0,0,0.1);
        }

        .lp-poster-letter-big {
          font-size: 2.4rem;
          font-weight: 700;
          color: #0f172a;
        }

        .lp-poster-letter-small {
          font-size: 1.1rem;
          color: #64748b;
          margin-top: 2px;
        }

        .lp-poster-sign {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          padding: 8px;
        }

        .lp-poster-sign img {
          max-width: 100%;
          max-height: 130px;
          object-fit: contain;
          transition: transform 0.2s ease;
        }

        .lp-poster-sign:hover img {
          transform: scale(1.05);
        }

        .lp-poster-bottom {
          padding: 12px;
          border-top: 1px solid #e2e8f0;
          min-height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .lp-sign-gloss {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .lp-sign-desc {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
        }

        .lp-loading,
        .lp-error,
        .lp-empty {
          text-align: center;
          padding: 40px 20px;
          font-size: 1.1rem;
          color: #64748b;
        }

        .lp-error {
          color: #dc2626;
          background: #fee2e2;
          border-radius: 12px;
          margin: 20px;
        }

        @media (max-width: 1024px) {
          .lp-grid-poster {
            /* Tablet / small desktop: 2 columns */
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 768px) {
          .lp-grid-poster {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .lp-poster-top {
            padding: 10px;
            gap: 10px;
            min-height: 120px;
          }

          .lp-poster-letter-block {
            width: 80px;
            height: 100px;
          }

          .lp-poster-letter-big {
            font-size: 2rem;
          }

          .lp-poster-sign img {
            max-height: 110px;
          }
        }

        @media (max-width: 480px) {
          .lp-grid-poster {
            /* Small phones: 1 column or 2 depending on available width */
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .lp-poster-top {
            padding: 8px;
            gap: 8px;
            min-height: 100px;
          }

          .lp-poster-letter-block {
            width: 70px;
            height: 90px;
          }

          .lp-poster-letter-big {
            font-size: 1.8rem;
          }

          .lp-poster-sign img {
            max-height: 90px;
          }

          .lp-sign-gloss {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="lp-grid-poster">
        {signs.map((sign, index) => (
          <article key={sign._id} className="lp-poster">
            <div
              className="lp-poster-top"
              style={{ background: gradients[index % gradients.length] }}
            >
              <div className="lp-poster-letter-block">
                <div className="lp-poster-letter-big">
                  {sign.gloss.charAt(0).toUpperCase()}
                </div>
                <div className="lp-poster-letter-small">
                  {sign.gloss.slice(1, 3).toLowerCase()}
                </div>
              </div>
              <div
                className="lp-poster-sign"
                onClick={() => {
                  const m = sign.mediaUrl && sign.mediaUrl.startsWith('http') ? sign.mediaUrl : `${baseUrl}${sign.mediaUrl}`;
                  onZoom(m, sign.gloss);
                }}
              >
                <img
                  src={sign.mediaUrl && sign.mediaUrl.startsWith('http') ? sign.mediaUrl : `${baseUrl}${sign.mediaUrl}`}
                  alt={sign.gloss}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </div>
            </div>
            <div className="lp-poster-bottom">
              <div className="lp-sign-gloss">{sign.gloss}</div>
              {sign.description && (
                <div className="lp-sign-desc">{sign.description}</div>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default DynamicSignPosters;
