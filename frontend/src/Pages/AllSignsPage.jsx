// src/pages/AllSignsPage.jsx (NEW FILE - Save in your pages folder)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Provider/AuthContext';
import { baseUrl } from '../Common/SummaryApi';
import './AdminDashboard.css';

const AllSignsPage = () => {
  const { token, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [allSigns, setAllSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Protect admin route
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/admin/login');
      return;
    }
  }, [token, isAdmin, navigate]);

  // Fetch ALL signs
  useEffect(() => {
    const fetchAllSigns = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/signs`);
        const data = await response.json();
        setAllSigns(data.signs || []);
      } catch (err) {
        console.error('Error fetching all signs:', err);
        setMessage('Error loading signs');
      } finally {
        setLoading(false);
      }
    };

    fetchAllSigns();
  }, []);

  const handleEdit = (sign) => {
    navigate(`/admin/dashboard?edit=${sign._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sign?')) return;

    try {
      const response = await fetch(`${baseUrl}/api/admin/signs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
        return;
      }

      setMessage('Sign deleted successfully!');
      // Refresh signs
      const signsRes = await fetch(`${baseUrl}/api/signs`);
      const signsData = await signsRes.json();
      setAllSigns(signsData.signs || []);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error deleting sign.');
      console.error('Error:', err);
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <header className="admin-header">
          <div className="admin-header-content">
            <h1>Loading...</h1>
          </div>
        </header>
        <main className="admin-main">
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✨</div>
            Loading all signs...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={handleBack}
              className="btn btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.9rem', minHeight: '44px' }}
            >
              ← Back to Dashboard
            </button>
            <h1>All Signs</h1>
          </div>
          <div className="admin-user-info">
            <span style={{ fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>
              ({allSigns.length} total signs)
            </span>
            <span style={{ fontSize: '0.95rem' }}>Welcome, {user?.name}</span>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {allSigns.length === 0 ? (
          <div className="no-signs" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>📚</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>No signs yet</h3>
            <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '32px' }}>
              Create your first sign from the dashboard!
            </p>
            <button 
              onClick={handleBack} 
              className="btn btn-primary" 
              style={{ padding: '14px 28px', fontSize: '1rem', minHeight: '52px' }}
            >
              ← Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="signs-list">
            <h2 style={{ marginBottom: '32px' }}>
              Complete Sign Library ({allSigns.length} signs)
            </h2>
            <div className="signs-grid">
              {allSigns.map(sign => (
                <div key={sign._id} className="sign-card">
                  <div className="sign-media">
                    {sign.mediaType === 'video' ? (
                      <video controls width="100%" style={{ height: '100%', objectFit: 'cover' }}>
                        <source src={`${baseUrl}${sign.mediaUrl}`} />
                        Your browser does not support the video tag.
                      </video>
                    ) : sign.mediaUrl ? (
                      <img 
                        src={`${baseUrl}${sign.mediaUrl}`} 
                        alt={sign.gloss}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', height: '100%', 
                        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', color: '#cbd5e1'
                      }}>
                        ✨
                      </div>
                    )}
                  </div>
                  <div className="sign-details">
                    <h3>{sign.gloss}</h3>
                    {sign.category && (
                      <p className="sign-language" style={{ textTransform: 'uppercase', fontWeight: '600' }}>
                        {sign.category}
                      </p>
                    )}
                    {sign.difficulty && (
                      <p className="sign-difficulty">
                        Difficulty: <span className={`level-${sign.difficulty}`}>
                          {sign.difficulty.toUpperCase()}
                        </span>
                      </p>
                    )}
                    {sign.description && (
                      <p className="sign-description">{sign.description}</p>
                    )}
                    {sign.tags && sign.tags.length > 0 && (
                      <div className="sign-tags">
                        {sign.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="sign-actions">
                    <button 
                      onClick={() => handleEdit(sign)} 
                      className="btn btn-edit"
                      style={{ flex: 1 }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(sign._id)} 
                      className="btn btn-delete"
                      style={{ flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllSignsPage;
