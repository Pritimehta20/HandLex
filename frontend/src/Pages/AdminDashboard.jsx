import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Provider/AuthContext';
import { baseUrl } from '../Common/SummaryApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [signs, setSigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryCover, setNewCategoryCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    gloss: '',
    category: '',
    description: '',
    difficulty: 'easy',
    tags: '',
    media: null
  });
  const [categoryObjects, setCategoryObjects] = useState([]);

  const formRef = useRef(null);

  // Check for edit from category page
  useEffect(() => {
    const editId = searchParams.get('edit');
    const category = searchParams.get('category');
    if (editId && signs.length > 0) {
      const signToEdit = signs.find(sign => sign._id === editId);
      if (signToEdit) {
        setEditingId(editId);
        setFormData({
          gloss: signToEdit.gloss,
          category: signToEdit.category || category || '',
          description: signToEdit.description || '',
          difficulty: signToEdit.difficulty || 'easy',
          tags: Array.isArray(signToEdit.tags) ? signToEdit.tags.join(', ') : '',
          media: null
        });
        setShowForm(true);
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [searchParams, signs]);

  // Protect admin route
  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/admin/login');
    }
  }, [token, isAdmin, navigate]);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/signs/categories/all`);
      const data = await response.json();
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        const mapped = data.categories.map(c => (typeof c === 'string' ? { name: c } : c));
        setCategories(mapped.map(x => x.name));
        setCategoryObjects(mapped);
      } else {
        setCategories([]);
        setCategoryObjects([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch all signs
  const fetchSigns = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/signs`);
      const data = await response.json();
      setSigns(data.signs || []);
    } catch (err) {
      console.error('Error fetching signs:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSigns();
  }, []);

  // Navigate to category page
  const handleCategoryClick = (categoryName) => {
    navigate(`/admin/category/${encodeURIComponent(categoryName)}`);
  };

  // Navigate to all signs page
  const handleViewAllSigns = () => {
    navigate('/admin/all-signs');
  };

  const handleDeleteCategory = async (catName, catId) => {
    if (!window.confirm(`Delete category "${catName}"? Signs will be moved to 'Common'. Continue?`)) return;
    try {
      const res = await fetch(`${baseUrl}/api/admin/categories/${catId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }
      setMessage(data.message || 'Category deleted');
      await fetchCategories();
      await fetchSigns();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Delete category error', err);
      setMessage('Failed to delete category');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, media: e.target.files[0] }));
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('gloss', formData.gloss);
      formDataObj.append('category', formData.category);
      formDataObj.append('description', formData.description);
      formDataObj.append('difficulty', formData.difficulty);
      formDataObj.append('tags', formData.tags);
      if (formData.media) {
        formDataObj.append('media', formData.media);
      }

      const url = editingId
        ? `${baseUrl}/api/admin/signs/${editingId}`
        : `${baseUrl}/api/admin/signs`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }

      setMessage(editingId ? 'Sign updated successfully!' : 'Sign created successfully!');
      resetForm();
      fetchSigns();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving sign.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sign) => {
    setEditingId(sign._id);
    setFormData({
      gloss: sign.gloss,
      category: sign.category || '',
      description: sign.description || '',
      difficulty: sign.difficulty || 'easy',
      tags: Array.isArray(sign.tags) ? sign.tags.join(', ') : '',
      media: null
    });
    setShowForm(true);
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
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
      fetchSigns();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error deleting sign.');
      console.error('Error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      gloss: '',
      category: '',
      description: '',
      difficulty: 'easy',
      tags: '',
      media: null
    });
    setEditingId(null);
    setShowForm(false);
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    const name = newCategoryName.trim();
    if (categories.includes(name)) {
      setFormData(prev => ({ ...prev, category: name }));
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      setNewCategoryCover(null);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', name);
      if (newCategoryCover) fd.append('cover', newCategoryCover);

      const res = await fetch(`${baseUrl}/api/admin/categories`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error creating category: ${data.error}`);
        return;
      }
      await fetchCategories();
      setFormData(prev => ({ ...prev, category: name }));
      setNewCategoryName('');
      setNewCategoryCover(null);
      setShowNewCategoryInput(false);
      setMessage('Category created successfully!');
    } catch (err) {
      console.error('Error creating category:', err);
      setMessage('Failed to create category');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-controls">
          <button
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }}
            className={`btn btn-primary ${showForm ? 'btn-cancel' : ''}`}
          >
            {showForm ? 'Cancel' : '+ Add New Sign'}
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div ref={formRef} className="sign-form-container">
            <h2>{editingId ? 'Edit Sign' : 'Create New Sign'}</h2>
            <form onSubmit={handleCreateOrUpdate} className="sign-form">
              <div className="form-group">
                <label>Sign Name (Gloss) *</label>
                <input
                  type="text"
                  name="gloss"
                  value={formData.gloss}
                  onChange={handleInputChange}
                  placeholder="e.g., HELLO"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty *</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                {!showNewCategoryInput ? (
                  <div className="category-select-wrapper">
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select or Create Category --</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(true)}
                      className="btn-new-category"
                    >
                      + New
                    </button>
                  </div>
                ) : (
                  <div className="new-category-wrapper">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      autoFocus
                    />
                    <div style={{ marginTop: 8 }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6 }}>
                        Category Cover (optional)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setNewCategoryCover(e.target.files[0] || null)} 
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="btn btn-success"
                        style={{ flex: 1 }}
                      >
                        Add Category
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setNewCategoryName('');
                          setNewCategoryCover(null);
                        }}
                        className="btn btn-cancel-cat"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the sign..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Tags (comma-separated) *</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., greeting, common, hello"
                  required
                />
              </div>

              <div className="form-group">
                <label>Media File (Video/Image) {!editingId && '*'}</label>
                <input
                  type="file"
                  name="media"
                  onChange={handleFileChange}
                  accept="video/*,image/*"
                  required={!editingId}
                />
                <small>Video: MP4, WebM, etc. | Image: JPG, PNG, GIF</small>
              </div>

              <button type="submit" disabled={loading} className="btn btn-success">
                {loading ? 'Saving...' : editingId ? 'Update Sign' : 'Create Sign'}
              </button>
            </form>
          </div>
        )}

        {/* CATEGORY SECTION - FULLY CLICKABLE */}
        <div className="category-manage">
          <h3>Manage Categories</h3>
          {categoryObjects.length === 0 ? (
            <div className="no-signs" style={{ maxWidth: '500px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏷️</div>
              <p>No categories yet. Create your first category!</p>
            </div>
          ) : (
            <div className="category-list">
              {categoryObjects.map((c) => {
                const catSignsCount = signs.filter(sign => sign.category === c.name).length;
                
                return (
                  <div 
                    key={c._id || c.name} 
                    className="category-item"
                    onClick={() => handleCategoryClick(c.name)}
                    title={`Click to view ${catSignsCount} signs in ${c.name}`}
                  >
                    {c.coverUrl ? (
                      <img 
                        src={`${baseUrl}${c.coverUrl}`} 
                        alt={c.name} 
                        className="category-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="category-cover placeholder">
                      <span style={{ fontSize: '2rem' }}>✨</span>
                      <span style={{ fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>
                        {c.name[0]}
                      </span>
                    </div>
                    <div className="category-meta">
                      <div className="category-name">
                        <div style={{ fontSize: '1.1rem', fontWeight: '800' }}>{c.name}</div>
                        <div className="category-sign-count" style={{ 
                          fontSize: '0.85rem', 
                          opacity: 0.8, 
                          fontWeight: '600',
                          marginTop: '4px'
                        }}>
                          ({catSignsCount} signs)
                        </div>
                      </div>
                      <div className="category-actions">
                        {c._id ? (
                          <button 
                            className="btn btn-delete" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(c.name, c._id);
                            }}
                            title="Delete Category"
                          >
                            Delete
                          </button>
                        ) : (
                          <button 
                            className="btn" 
                            disabled 
                            title="Category created from signs cannot be deleted"
                            style={{ opacity: 0.5 }}
                          >
                            Protected
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ✅ RECENT SIGNS SECTION - SHOWS ONLY 8 SIGNS */}
        <div className="signs-list">
          <h2>Recent Signs ({signs.length})</h2>
          {signs.length === 0 ? (
            <div className="no-signs">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
              <h3>No signs yet</h3>
              <p>Create your first sign above!</p>
            </div>
          ) : (
            <>
              <div className="signs-grid">
                {signs.slice(0, 8).map(sign => (
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
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '2rem', color: '#cbd5e1', textAlign: 'center'
                        }}>
                          ✨
                          <div style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.7 }}>
                            No media
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="sign-details">
                      <h3>{sign.gloss}</h3>
                      {sign.category && (
                        <p className="sign-language" style={{ textTransform: 'uppercase' }}>
                          {sign.category}
                        </p>
                      )}
                      {sign.language && (
                        <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#64748b' }}>
                          Language: {sign.language}
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
              
              {/* ✅ BEAUTIFUL "VIEW ALL" BUTTON */}
              {signs.length > 8 && (
                <div style={{ textAlign: 'center', marginTop: '40px', padding: '40px 20px' }}>
                  <button 
                    onClick={handleViewAllSigns}
                    className="load-more-btn"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '18px 40px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      fontSize: '1.2rem',
                      boxShadow: '0 12px 32px rgba(59,130,246,0.4)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 20px 40px rgba(59,130,246,0.6)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 12px 32px rgba(59,130,246,0.4)';
                    }}
                  >
                    ✨ View All {signs.length} Signs
                    <span style={{ marginLeft: '12px' }}>→</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
