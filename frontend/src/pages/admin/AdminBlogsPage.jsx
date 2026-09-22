import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, X, FileText, CheckCircle } from 'lucide-react';

export const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlog({
      title_si: '',
      title_en: '',
      slug: '',
      content_si: '',
      content_en: '',
      featured_image: '/assets/lake-boat-watercolor.png',
      author: 'Suchetha Kapuarachchi',
      date: new Date().toISOString().split('T')[0],
      category: 'Literary Reflections',
      tags: ['Literature', 'Writing'],
      reading_time: '4 min',
      is_featured: false,
      status: 'published',
      seo_title: '',
      seo_description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog({ ...b });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog.id) {
        await api.admin.updateBlog(editingBlog.id, editingBlog);
        setAlert({ type: 'success', text: 'Blog updated successfully!' });
      } else {
        await api.admin.createBlog(editingBlog);
        setAlert({ type: 'success', text: 'Blog created successfully!' });
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to save blog' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.admin.deleteBlog(id);
      setAlert({ type: 'success', text: 'Blog post deleted' });
      fetchBlogs();
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to delete blog post' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Blog & Essays Management</h2>
          <p className="text-muted small mb-0">Publish bilingual essays, writing reflections, and literary notes</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-literary rounded-pill">
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      {/* Blogs Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th className="ps-4">Image</th>
                <th>Title (SI / EN)</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td className="ps-4">
                    <img 
                      src={b.featured_image} 
                      alt="" 
                      style={{ width: '50px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td>
                    <span className="fw-bold d-block font-sinhala-title">{b.title_si}</span>
                    <span className="small text-muted">{b.title_en}</span>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border small">{b.category}</span>
                  </td>
                  <td className="small font-monospace">{b.date}</td>
                  <td>
                    <span className={`badge ${b.status === 'published' ? 'bg-success' : 'bg-warning'} small text-uppercase`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => handleOpenEdit(b)} 
                      className="btn btn-sm btn-outline-primary rounded-circle p-2 me-2"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)} 
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
      {isModalOpen && editingBlog && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        >
          <div 
            className="bg-white rounded-4 p-4 p-md-5 max-w-2xl w-100 position-relative shadow-2xl"
            style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <h4 className="fw-bold mb-4">{editingBlog.id ? 'Edit Article' : 'Write New Article'}</h4>

            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Sinhala Title *</label>
                  <input 
                    type="text" 
                    value={editingBlog.title_si}
                    onChange={e => setEditingBlog({ ...editingBlog, title_si: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">English Title *</label>
                  <input 
                    type="text" 
                    value={editingBlog.title_en}
                    onChange={e => setEditingBlog({ ...editingBlog, title_en: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Category</label>
                  <input 
                    type="text" 
                    value={editingBlog.category}
                    onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Reading Time</label>
                  <input 
                    type="text" 
                    value={editingBlog.reading_time}
                    onChange={e => setEditingBlog({ ...editingBlog, reading_time: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Status</label>
                  <select 
                    value={editingBlog.status}
                    onChange={e => setEditingBlog({ ...editingBlog, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Featured Image URL</label>
                <input 
                  type="text" 
                  value={editingBlog.featured_image}
                  onChange={e => setEditingBlog({ ...editingBlog, featured_image: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Sinhala Content *</label>
                <textarea 
                  rows="5"
                  value={editingBlog.content_si}
                  onChange={e => setEditingBlog({ ...editingBlog, content_si: e.target.value })}
                  className="form-control font-sinhala-title"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">English Content *</label>
                <textarea 
                  rows="5"
                  value={editingBlog.content_en}
                  onChange={e => setEditingBlog({ ...editingBlog, content_en: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary rounded-pill px-4">
                  Cancel
                </button>
                <button type="submit" className="btn btn-literary rounded-pill px-4">
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
