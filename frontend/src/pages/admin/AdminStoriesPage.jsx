import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, X, Feather } from 'lucide-react';

export const AdminStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchStories = async () => {
    try {
      const data = await api.getStories();
      setStories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleOpenAdd = () => {
    setEditingStory({
      title_si: '',
      title_en: '',
      category: 'Poems',
      date: new Date().toISOString().split('T')[0],
      cover_image: '/assets/pink-lotus.png',
      status: 'published',
      content_si: '',
      content_en: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story) => {
    setEditingStory({ ...story });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingStory.id) {
        await api.admin.updateStory(editingStory.id, editingStory);
        setAlert({ type: 'success', text: 'Story updated successfully!' });
      } else {
        await api.admin.createStory(editingStory);
        setAlert({ type: 'success', text: 'Story created successfully!' });
      }
      setIsModalOpen(false);
      fetchStories();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to save story' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this piece?')) return;
    try {
      await api.admin.deleteStory(id);
      setAlert({ type: 'success', text: 'Story removed' });
      fetchStories();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to delete story' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Stories, Poems & Excerpts</h2>
          <p className="text-muted small mb-0">Manage poetry, quotes, vignettes, and short literary pieces</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-literary rounded-pill">
          <Plus size={16} />
          <span>New Piece</span>
        </button>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      {/* Stories Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th className="ps-4">Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s.id}>
                  <td className="ps-4">
                    <span className="fw-bold d-block font-sinhala-title">{s.title_si}</span>
                    <span className="small text-muted">{s.title_en}</span>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border small">{s.category}</span>
                  </td>
                  <td className="small font-monospace">{s.date}</td>
                  <td>
                    <span className={`badge ${s.status === 'published' ? 'bg-success' : 'bg-warning'} small text-uppercase`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => handleOpenEdit(s)} 
                      className="btn btn-sm btn-outline-primary rounded-circle p-2 me-2"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(s.id)} 
                      className="btn btn-sm btn-outline-danger rounded-circle p-2"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingStory && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        >
          <div 
            className="bg-white rounded-4 p-4 p-md-5 max-w-2xl w-100 position-relative shadow-2xl"
            style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <h4 className="fw-bold mb-4">{editingStory.id ? 'Edit Story Piece' : 'Add New Story Piece'}</h4>

            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Sinhala Title *</label>
                  <input 
                    type="text" 
                    value={editingStory.title_si}
                    onChange={e => setEditingStory({ ...editingStory, title_si: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">English Title</label>
                  <input 
                    type="text" 
                    value={editingStory.title_en}
                    onChange={e => setEditingStory({ ...editingStory, title_en: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Category</label>
                  <select 
                    value={editingStory.category}
                    onChange={e => setEditingStory({ ...editingStory, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Poems">Poems</option>
                    <option value="Stories">Stories</option>
                    <option value="Quotes">Quotes</option>
                    <option value="Excerpts">Excerpts</option>
                    <option value="Literary Notes">Literary Notes</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Cover Motif Path</label>
                  <input 
                    type="text" 
                    value={editingStory.cover_image}
                    onChange={e => setEditingStory({ ...editingStory, cover_image: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Sinhala Content / Poem *</label>
                <textarea 
                  rows="4"
                  value={editingStory.content_si}
                  onChange={e => setEditingStory({ ...editingStory, content_si: e.target.value })}
                  className="form-control font-sinhala-title"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">English Translation</label>
                <textarea 
                  rows="4"
                  value={editingStory.content_en}
                  onChange={e => setEditingStory({ ...editingStory, content_en: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary rounded-pill px-4">
                  Cancel
                </button>
                <button type="submit" className="btn btn-literary rounded-pill px-4">
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
