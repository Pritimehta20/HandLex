import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { useAuth } from '../Provider/AuthContext';
import { baseUrl } from '../Common/SummaryApi.js';
import SummaryApi from '../Common/SummaryApi.js';
import './Leaderboard.css';

const LeaderboardPage = () => {
  const navigate = useNavigate(); // ✅ BACK BUTTON
  const { user, token } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);
  const currentUserId = user?.userId || user?.email || user?._id;
const currentUserEntry = leaderboard.find(entry => String(entry.userId) === String(currentUserId));

  useEffect(() => {
     if (token) loadLeaderboard();
     else {
    setLeaderboard([]);
    setLoading(false);
  }
  }, [token]);

  const loadLeaderboard = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${baseUrl}${SummaryApi.getGlobalLeaderboard.url}`, {
      method: SummaryApi.getGlobalLeaderboard.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();

    if (data.success && Array.isArray(data.leaderboard)) {
      setLeaderboard(data.leaderboard);
    } else {
      setLeaderboard([]);
    }

    setTimeout(() => scrollToUser(), 300);
  } catch (error) {
    console.error('Leaderboard load failed:', error);
    setLeaderboard([]);
  } finally {
    setLoading(false);
  }
};

  const scrollToUser = () => {
  if (!listRef.current || !currentUserId) return;
  const userRow = listRef.current.querySelector(`[data-userid="${currentUserId}"]`);
  if (userRow) {
    userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    userRow.classList.add('highlight');
    setTimeout(() => userRow.classList.remove('highlight'), 4000);
  }
};

  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* ✅ HEADER WITH BACK BUTTON */}
        <div className="leaderboard-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </button>
          </div>
          <div className="header-center">
            <h1>🥇 Global Leaderboard</h1>
            <p>Sign Language Quiz - Top {leaderboard.length} Players</p>
          </div>
        </div>

        {/* YOUR POSITION */}
        <div className="your-position">
  {currentUserEntry ? (
    <div className="your-rank-card">
      <div className="rank-medal">{getMedal(currentUserEntry.rank)}</div>
      <div className="rank-info">
        <span>{currentUserEntry.userName}</span>
        <span>{currentUserEntry.percentage}% • {currentUserEntry.grade}</span>
      </div>
    </div>
  ) : (
    <div className="no-rank">
      Take a quiz to join!{' '}
      <button className="quiz-link" onClick={() => navigate('/quiz')}>
        🧠 Play Quiz
      </button>
    </div>
  )}
</div>

        {/* TABLE */}
        <div className="leaderboard-scroll">
          <div className="table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
            <span>Lessons</span>
          </div>
          <div className="leaderboard-list" ref={listRef}>
            {leaderboard.map(entry => {
              const isYou = String(currentUserId) === String(entry.userId);
              return (
                <div key={entry.id} data-userid={entry.userId} className={`leaderboard-row ${isYou ? 'current-user' : ''}`}>
                  <div className="rank-cell">{getMedal(entry.rank)}</div>
                  <div className="player-cell">
                    <div className="player-name">{entry.userName}</div>
                  </div>
                  <div className="score-cell">
                    <span className="percentage">{entry.score}/{entry.total} ({entry.percentage}%)</span>
                  </div>
                  <div className="lessons-cell">
                    📚 {entry.completedLessons?.length || 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ FIXED FOOTER */}
        <div className="leaderboard-footer">
          <button className="refresh-btn" onClick={loadLeaderboard}>
            🔄 Refresh ({leaderboard.length} players)
          </button>
          <button className="quiz-btn" onClick={() => navigate('/quiz')}>
            🧠 Play Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;