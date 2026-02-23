import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { useAuth } from '../Provider/AuthContext';
import './Leaderboard.css';

const LeaderboardPage = () => {
  const navigate = useNavigate(); // ✅ BACK BUTTON
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    try {
      setLoading(true);
      const data = JSON.parse(localStorage.getItem('globalQuizLeaderboard') || '[]');
      // ✅ SORT BY PERCENTAGE DESCENDING (top players first)
      const sortedData = data.sort((a, b) => b.percentage - a.percentage || b.timestamp - a.timestamp);
      const rankedData = sortedData.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
      setLeaderboard(rankedData);
      
      // ✅ Scroll after render
      setTimeout(() => scrollToUser(), 300);
    } catch (error) {
      console.error('Leaderboard load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToUser = () => {
    if (!listRef.current) return;
    const userId = user?.userId || user?.email || user?._id;
    const userRow = listRef.current.querySelector(`[data-userid="${userId}"]`);
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
          {leaderboard.some(entry => (user?.userId || user?.email || user?._id) === entry.userId) ? (
            leaderboard.map(entry => {
              if ((user?.userId || user?.email || user?._id) === entry.userId) {
                return (
                  <div key={entry.id} className="your-rank-card">
                    <div className="rank-medal">{getMedal(entry.rank)}</div>
                    <div className="rank-info">
                      <span>{entry.userName}</span>
                      <span>{entry.percentage}% • {entry.grade}</span>
                    </div>
                  </div>
                );
              }
              return null;
            })
          ) : (
            <div className="no-rank">
              Take a quiz to join! <button className="quiz-link" onClick={() => navigate('/quiz')}>🧠 Play Quiz</button>
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
              const isYou = (user?.userId || user?.email || user?._id) === entry.userId;
              return (
                <div key={entry.id} data-userid={entry.userId} className={`leaderboard-row ${isYou ? 'current-user' : ''}`}>
                  <div className="rank-cell">{getMedal(entry.rank)}</div>
                  <div className="player-cell">
                    <div className="player-name">{entry.userName}</div>
                  </div>
                  <div className="score-cell">
                    <span className="percentage">{entry.percentage}%</span>
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
