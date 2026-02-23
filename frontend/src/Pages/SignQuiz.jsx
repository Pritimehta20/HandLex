// src/components/SignQuiz.jsx - COMPLETE FILE (RECENT HISTORY FIXED!)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthContext';
import { baseUrl } from '../Common/SummaryApi';
import './SignQuiz.css';
import { FaWhatsapp } from 'react-icons/fa';

const SignQuiz = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]);
  
  const [tooltip, setTooltip] = useState({ show: false, lesson: '', percentage: 0, correct: 0, total: 0, x: 0, y: 0 });
  const svgRef = useRef(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [noLessonsCompleted, setNoLessonsCompleted] = useState(false);
  const [userName, setUserName] = useState('Student');

  const IMAGE_BASE_URL = 'http://localhost:8080';

  // ✅ FIXED: Save BOTH Global + Personal History
  const saveQuizResult = (analysisData) => {
    try {
      // GLOBAL LEADERBOARD - 1 result per user only
      const globalKey = 'globalQuizLeaderboard';
      const existingGlobal = JSON.parse(localStorage.getItem(globalKey) || '[]');
      
      const userId = user?.userId || user?.email || 'guest_' + Date.now();
      const userNameFinal = user?.name || user?.displayName || 'Student';
      
      const globalResult = {
        id: Date.now(),
        userId,
        userName: userNameFinal,
        score: analysisData.score,
        percentage: analysisData.percentage,
        grade: analysisData.grade,
        date: new Date().toLocaleString('en-IN'),
        completedLessons: completedLessons,
        timestamp: Date.now()
      };
      
      // ✅ NEW: SAVE PERSONAL HISTORY (FIXED!)
      const historyKey = `quizHistory_${userId}`;
      const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      const historyResult = {
        id: Date.now(),
        score: analysisData.score,
        percentage: analysisData.percentage,
        grade: analysisData.grade,
        total: 15,
        completedAt: new Date().toLocaleString('en-IN', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        lessons: completedLessons.length,
        timestamp: Date.now()
      };
      
      // Add to personal history (keep last 10, newest first)
      existingHistory.unshift(historyResult);
      const recentHistory = existingHistory.slice(0, 10);
      localStorage.setItem(historyKey, JSON.stringify(recentHistory));
      
      // Global leaderboard (REPLACE old result)
      const userIndex = existingGlobal.findIndex(entry => entry.userId === userId);
      if (userIndex > -1) {
        existingGlobal[userIndex] = globalResult;
      } else {
        existingGlobal.push(globalResult);
      }
      
      const updatedGlobal = existingGlobal
        .sort((a, b) => b.percentage - a.percentage || b.timestamp - a.timestamp)
        .slice(0, 100);
      
      localStorage.setItem(globalKey, JSON.stringify(updatedGlobal));
      
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const fetchLeaderboard = () => {
    try {
      const data = JSON.parse(localStorage.getItem('globalQuizLeaderboard') || '[]');
      setLeaderboard(data);
      
      const userId = user?.userId || user?.email || 'guest';
      const userEntryIndex = data.findIndex(entry => entry.userId === userId);
      if (userEntryIndex !== -1) {
        setUserRank(userEntryIndex + 1);
      }
    } catch (error) {
      console.error('Leaderboard fetch failed');
    }
  };

  // ✅ FIXED: Sort by newest first
  const getRecentHistory = (limit = 3) => {
    try {
      const userId = user?.userId || user?.email || user?._id || 'guest';
      const historyKey = `quizHistory_${userId}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      return history.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
    } catch {
      return [];
    }
  };

  // NEW HELPER FUNCTIONS FOR RICH RESULTS
  const getTopStrength = () => {
    if (!analysis?.breakdown?.length) return 'Alphabet';
    const top = analysis.breakdown.reduce((best, curr) => 
      curr.percentage > best.percentage ? curr : best
    );
    return `${top.lesson}`;
  };

  const getStrengthMessage = () => {
    return analysis?.percentage >= 80 
      ? "🎉 Excellent retention - you're crushing it!" 
      : "✅ Solid foundation established!";
  };

  const getImprovementMessage = () => {
    if (!analysis?.breakdown?.length) return 'Practice more signs!';
    const weak = analysis.breakdown.reduce((worst, curr) => 
      curr.percentage < worst.percentage ? curr : worst
    );
    return `Focus on ${weak.lesson.toLowerCase()} next!`;
  };

  useEffect(() => {
    if (!user?.userId) return;
    try {
      const STORAGE_KEY = 'lessonProgress';
      const userSpecificKey = `${STORAGE_KEY}_${user.userId}`;
      const raw = localStorage.getItem(userSpecificKey);
      const completed = raw ? JSON.parse(raw) : [];
      
      setCompletedLessons(completed);
      setUserName(user?.name || user?.displayName || 'Student');
      
      if (completed.length === 0) {
        setNoLessonsCompleted(true);
      }
    } catch (e) {
      setCompletedLessons([]);
      setNoLessonsCompleted(true);
      setUserName('Student');
    }
  }, [user]);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setShowResults(false);
      const response = await fetch(`${baseUrl}/api/quiz/generate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completedLessons, maxQuestions: 15 })
      });
      
      const quizData = await response.json();
      if (!quizData.questions || quizData.questions.length === 0) {
        setNoLessonsCompleted(true);
        setQuiz(null);
        setLoading(false);
        return;
      }

      setQuiz(quizData);
      setCurrentQuestion(0);
      setScore(0);
      setAnsweredCorrectly([]);
      setSelectedAnswer(null);
      setFeedback('');
    } catch (err) {
      setQuiz(demoData());
    } finally {
      setLoading(false);
    }
  };

  const demoData = () => ({
    questions: Array(15).fill(0).map((_, i) => ({
      mediaUrl: `/lessons/alphabets/a.png`,
      mediaType: 'image',
      correctAnswer: 'A',
      options: ['A','B','C','D'],
      lesson: i % 2 === 0 ? 'alphabet' : 'numbers'
    }))
  });

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || isAnimating) return;
    setIsAnimating(true);
    setSelectedAnswer(answer);
    const isCorrect = answer === quiz.questions[currentQuestion].correctAnswer;
    
    setAnsweredCorrectly(prev => {
      const newArray = [...prev];
      newArray[currentQuestion] = isCorrect;
      return newArray;
    });
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Correct answer: ${quiz.questions[currentQuestion].correctAnswer}`);
    }
    setTimeout(() => setIsAnimating(false), 800);
  };

  const nextQuestion = () => {
    setFeedback('');
    setSelectedAnswer(null);
    if (currentQuestion < 14) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
      calculateAnalysis();
    }
  };

  const calculateAnalysis = () => {
    const percentage = Math.round((score / 15) * 100);
    const breakdown = {};

    quiz.questions.forEach((q, i) => {
      if (!breakdown[q.lesson]) breakdown[q.lesson] = { correct: 0, total: 0 };
      breakdown[q.lesson].total += 1;
      if (answeredCorrectly[i]) breakdown[q.lesson].correct += 1;
    });

    const analysisData = {
      percentage, score, total: 15,
      grade: getGrade(percentage),
      message: getMessage(percentage),
      breakdown: Object.entries(breakdown).map(([lesson, stats]) => ({
        lesson: lesson.charAt(0).toUpperCase() + lesson.slice(1),
        correct: stats.correct,
        total: stats.total,
        percentage: Math.round((stats.correct / stats.total) * 100)
      }))
    };

    const colors = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0'];
    analysisData.pieData = analysisData.breakdown.map((item, idx) => ({
      ...item,
      color: colors[idx % colors.length],
      degrees: Math.max(15, (item.percentage / 100) * 360)
    }));

    setAnalysis(analysisData);
    saveQuizResult(analysisData); // ✅ NOW SAVES HISTORY TOO!
    fetchLeaderboard(); 
  };

  const handleWhatsAppShare = () => {
    const shareMessage = `🖐️ *Sign Language Quiz Results* 📱

👤 *${userName}*
🥇 *Global Rank*: #${userRank || '?'} of ${leaderboard.length || 0}+ players
📊 ${analysis.score}/${analysis.total} (${analysis.percentage}%)
🎖️ ${analysis.grade}

💪 *Strength*: ${getTopStrength()}
🎯 *Improve*: ${getImprovementMessage()}

📈 *Breakdown*:
${analysis.breakdown.map(b => `• ${b.lesson}: ${b.percentage}%`).join('\n')}

${analysis.message} 🚀 #SignLanguage`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const getGrade = (p) => {
    if (p === 100) return '👑 PERFECT';
    if (p >= 80) return '⭐ EXCELLENT';
    if (p >= 60) return '✅ GOOD';
    return '📚 KEEP LEARNING';
  };

  const getMessage = (p) => {
    if (p >= 80) return "Mastery achieved! 🎉";
    if (p >= 60) return "Good progress! Keep going! 👍";
    return "Keep practicing! You're getting there! 💪";
  };

  const handleSliceHover = (slice, event) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    let x = event.clientX - svgRect.left;
    let y = event.clientY - svgRect.top;
    
    x = Math.max(10, Math.min(x, svgRect.width - 120));
    y = Math.max(10, Math.min(y, svgRect.height - 60));
    
    setTooltip({
      show: true, 
      lesson: slice.lesson, 
      percentage: slice.percentage,
      correct: slice.correct, 
      total: slice.total,
      x, 
      y 
    });
  };

  const handleSliceLeave = () => setTooltip({ ...tooltip, show: false });

  const startNewQuiz = () => { setShowResults(false); generateQuiz(); };
  const goToDashboard = () => navigate('/dashboard');

  useEffect(() => { if (completedLessons.length > 0) generateQuiz(); }, [completedLessons]);

  // ✅ LOCK SCREEN - Before loading check
  if (noLessonsCompleted) {
    return (
      <div className="quiz-container no-lessons-container">
        <div className="no-lessons-card">
          <div className="lock-icon">🔒</div>
          <h1>SignQuiz Locked</h1>
          <p>Complete at least <strong>1 lesson</strong> first!</p>
          <div className="lessons-cta">
            <button className="start-lessons-btn" onClick={() => navigate('/lesson')}>
              📚 Start Lessons
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading-screen"><h2>Loading Quiz...</h2></div>;

  return (
    <div className="quiz-container">
      {!showResults ? (
        <>
          <div className="quiz-header">
            <button className="back-btn" onClick={goToDashboard}>←</button>
            <div className="header-center">
              <h1>🖐️ SignQuiz</h1>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / 15) * 100}%` }} />
                </div>
                <span className="progress-text">{currentQuestion + 1}/15</span>
              </div>
            </div>
            <div className="score-display">{score}/{currentQuestion + 1}</div>
          </div>

          <div className="quiz-content">
            <div className="question-card">
              <div className="question-header">
                <h2>Identify the sign</h2>
                <span className="question-number">Q{currentQuestion + 1}</span>
              </div>
              <div className="sign-image-container">
                <img src={`${IMAGE_BASE_URL}${quiz.questions[currentQuestion].mediaUrl}`} alt="Sign" className="sign-image" />
              </div>
              <div className="options-grid">
                {quiz.questions[currentQuestion].options.map((option, idx) => (
                  <button 
                    key={idx} 
                    className={`option-btn ${selectedAnswer === option ? (answeredCorrectly[currentQuestion] ? 'correct' : 'wrong') : ''}`}
                    onClick={() => handleAnswer(option)} 
                    disabled={selectedAnswer !== null || isAnimating}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + idx)}</span> {option}
                  </button>
                ))}
              </div>
              {selectedAnswer && (
                <div className="feedback-container">
                  <div className={`feedback ${answeredCorrectly[currentQuestion] ? 'success' : 'error'}`}>{feedback}</div>
                  <button className="next-button" onClick={nextQuestion}>
                    {currentQuestion === 14 ? '🎉 Finish Quiz' : 'Next →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="results-container">
          <div className="results-navbar">
            <button className="results-nav-btn dashboard-btn" onClick={goToDashboard}>← Dashboard</button>
            <button className="results-nav-btn new-quiz-btn" onClick={startNewQuiz}>🔄 New Quiz</button>
          </div>

          <div className="results-card">
            {/* 🏆 HERO SECTION - DUAL CIRCLES */}
            <div className="dual-circles-section">
              {/* LEFT: SCORE CIRCLE + TROPHY */}
              <div className="score-circle-container">
                <div className="trophy-section">
                  <div className="trophy">{analysis.percentage >= 80 ? '🏆' : analysis.percentage >= 60 ? '⭐' : '📚'}</div>
                </div>
                <div className="score-circle hero-circle">
                  <div className="score-inner">
                    <span className="score-number">{analysis.score}</span>
                    <span className="score-slash">/</span>
                    <span className="score-total">{analysis.total}</span>
                  </div>
                  <div className="percentage">{analysis.percentage}%</div>
                </div>
                <div className="score-labels">
                  <h1 className="grade">{analysis.grade}</h1>
                  <p className="hero-message">{analysis.message}</p>
                </div>
              </div>

              {/* RIGHT: PIE CHART */}
              <div className="pie-chart-container-wrapper">
                <h3 className="chart-title">📊 Breakdown</h3>
                {tooltip.show && (
                  <div className="pie-tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}>
                    <div className="tooltip-content">
                      <b>{tooltip.lesson}</b><br/>{tooltip.correct}/{tooltip.total} ({tooltip.percentage}%)
                    </div>
                  </div>
                )}
                <div className="pie-chart-container">
                  <svg ref={svgRef} viewBox="0 0 200 200" className="simple-pie" onMouseLeave={handleSliceLeave}>
                    <circle cx="100" cy="100" r="85" fill="none" stroke="#f1f5f9" strokeWidth="12"/>
                    {analysis.pieData.map((slice, idx) => {
                      const prevSlices = analysis.pieData.slice(0, idx);
                      const startAngle = prevSlices.reduce((sum, s) => sum + s.degrees, -90);
                      const endAngle = startAngle + slice.degrees;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const largeArc = slice.degrees > 180 ? 1 : 0;
                      const startX = 100 + 85 * Math.cos(startRad);
                      const startY = 100 + 85 * Math.sin(startRad);
                      const endX = 100 + 85 * Math.cos(endRad);
                      const endY = 100 + 85 * Math.sin(endRad);
                      
                      return (
                        <path 
                          key={idx} 
                          d={`M 100 100 L ${startX} ${startY} A 85 85 0 ${largeArc} 1 ${endX} ${endY} Z`}
                          fill={slice.color} 
                          className="pie-slice"
                          onMouseEnter={(e) => handleSliceHover(slice, e)} 
                          onMouseMove={(e) => handleSliceHover(slice, e)} 
                          onMouseLeave={handleSliceLeave} 
                        />
                      );
                    })}
                    <circle cx="100" cy="100" r="50" fill="white"/>
                    <text x="100" y="95" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1e293b">{analysis.score}/15</text>
                    <text x="100" y="115" textAnchor="middle" fontSize="12" fontWeight="700" fill="#94a3b8">SCORE</text>
                  </svg>
                </div>
                <div className="legend">
                  {analysis.pieData.map((item, idx) => (
                    <div key={idx} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: item.color }} />
                      <span>{item.lesson}: <b>{item.percentage}%</b></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🔥 INSIGHTS */}
            <div className="insights-section">
              <h3>🔥 Quick Insights</h3>
              <div className="insights-grid">
                <div className="insight-card strong">
                  <div className="insight-icon">💪</div>
                  <div className="insight-content">
                    <h4>{getTopStrength()}</h4>
                    <p>{getStrengthMessage()}</p>
                  </div>
                </div>
                <div className="insight-card improve">
                  <div className="insight-icon">🎯</div>
                  <div className="insight-content">
                    <h4>Next Focus</h4>
                    <p>{getImprovementMessage()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🥇 YOUR GLOBAL RANK */}
            <div className="leaderboard-preview">
              <h3>🥇 Global Rank</h3>
              <div className="rank-display">
                <div className="rank-circle">
                  #{userRank || 'Take Quiz!'}
                </div>
                <span>of {leaderboard.length || 0} players worldwide</span>
              </div>
            </div>

            {/* ✅ FIXED HISTORY + STEPS */}
            <div className="compact-section">
              <div className="history-section">
                <h4>📈 Recent Attempts</h4>
                <div className="history-list">
                  {getRecentHistory(3).length > 0 ? (
                    getRecentHistory(3).map((result) => (
                      <div key={result.id} className={`history-item ${result.percentage >= 80 ? 'excellent' : result.percentage >= 60 ? 'good' : 'needs-work'}`}>
                        <span>{result.completedAt}</span>
                        <span><b>{result.score}/{result.total}</b></span>
                      </div>
                    ))
                  ) : (
                    <div className="no-history">No attempts yet. Take a quiz! 🎯</div>
                  )}
                </div>
              </div>

              <div className="next-steps-section">
                <h4>🚀 Next Steps</h4>
                <div className="steps-grid">
                  <button className="step-card practice" onClick={() => navigate('/practice')}>
                    <span className="step-icon">🎯 Practice</span>
                  </button>
                  <button className="step-card lessons" onClick={() => navigate('/lesson')}>
                    <span className="step-icon">📚 Lessons</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 🎯 ACTION BUTTONS */}
            <div className="buttons-section">
              <button className="primary-btn" onClick={startNewQuiz}>🔄 Retake Quiz</button>
              <button className="secondary-btn" onClick={goToDashboard}>🏠 Dashboard</button>
              <button className="whatsapp-share-btn" onClick={handleWhatsAppShare}>
                <FaWhatsapp style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                Share result
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignQuiz;
