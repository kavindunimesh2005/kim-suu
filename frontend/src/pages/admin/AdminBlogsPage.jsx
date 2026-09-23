import React, { useState, useEffect } from 'react';
import { api, getMediaUrl } from '../../services/api';
import { Plus, Edit, Trash2, X, FileText, CheckCircle, Upload, ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';

export const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [draggedGalleryIdx, setDraggedGalleryIdx] = useState(null);

  const fetchBlogs = async () => {
    try {
      const data = await api.admin.getBlogs();
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
      gallery: [],
      seo_title: '',
      seo_description: ''
    });
    setGalleryUrlInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog({
      ...b,
      gallery: Array.isArray(b.gallery) ? [...b.gallery] : []
    });
    setGalleryUrlInput('');
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
      setAlert({ type: 'danger', text: err.message || 'Failed to save blog' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.admin.deleteBlog(id);
      setAlert({ type: 'success', text: 'Blog post deleted' });
      fetchBlogs();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to delete blog post' });
    }
  };

  // Gallery Management Handlers
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const res = await api.admin.uploadFile(file);
        if (res && res.success && res.url) {
          uploadedUrls.push(res.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setEditingBlog(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...uploadedUrls]
        }));
        setAlert({ type: 'success', text: `${uploadedUrls.length} image(s) added to blog gallery` });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to upload gallery images' });
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim();
    if (!trimmed) return;
    setEditingBlog(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), trimmed]
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setEditingBlog(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleMoveGalleryImage = (fromIdx, toIdx) => {
    setEditingBlog(prev => {
      const list = [...(prev.gallery || [])];
      if (toIdx < 0 || toIdx >= list.length) return prev;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return { ...prev, gallery: list };
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Blog & Essays Management</h2>
          <p className="text-muted small mb-0">Publish bilingual essays, writing reflections, and photo galleries</p>
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
            <thead className="table-light font-sans-ui small text-muted">
              <tr>
                <th className="ps-4">Article</th>
                <th>Category</th>
                <th>Gallery</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 overflow-hidden bg-light border" style={{ width: '48px', height: '48px', minWidth: '48px' }}>
                        {b.featured_image ? (
                          <img src={getMediaUrl(b.featured_image)} alt="" className="w-100 h-100 object-fit-cover" />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                            <FileText size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="fw-bold d-block text-dark font-sinhala-title">{b.title_si || b.title_en}</span>
                        <span className="text-muted small d-block">{b.title_en}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border small">{b.category}</span>
                  </td>
                  <td>
                    <span className="badge bg-light text-muted border small font-monospace">
                      {Array.isArray(b.gallery) ? `${b.gallery.length} photos` : '0 photos'}
                    </span>
                  </td>
                  <td className="text-muted small font-monospace">{b.date}</td>
                  <td>
                    <span className={`badge ${b.status === 'published' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                      {b.status || 'published'}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => handleOpenEdit(b)}
                      className="btn btn-sm btn-outline-primary rounded-circle p-2 me-2"
                      title="Edit Article"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(b.id)}
                      className="btn btn-sm btn-outline-danger rounded-circle p-2"
                      title="Delete Article"
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
            style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <h4 className="fw-bold mb-4">
              {editingBlog.id ? 'Edit Blog Article' : 'Create New Article'}
            </h4>

            <form onSubmit={handleSave}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Sinhala Title *</label>
                  <input 
                    type="text" 
                    value={editingBlog.title_si}
                    onChange={e => setEditingBlog({ ...editingBlog, title_si: e.target.value })}
                    className="form-control font-sinhala-title"
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
                <label className="form-label small fw-bold">Featured Cover Image URL</label>
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
                  rows="4"
                  value={editingBlog.content_si}
                  onChange={e => setEditingBlog({ ...editingBlog, content_si: e.target.value })}
                  className="form-control font-sinhala-title"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">English Content *</label>
                <textarea 
                  rows="4"
                  value={editingBlog.content_en}
                  onChange={e => setEditingBlog({ ...editingBlog, content_en: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              {/* ============================================================== */}
              {/* BLOG DETAILS MINI GALLERY MANAGER                              */}
              {/* ============================================================== */}
              <div className="p-3 rounded-3 bg-light border mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                      <ImageIcon size={16} className="text-primary" />
                      <span>Blog Mini Gallery</span>
                    </h6>
                    <small className="text-muted">
                      Add and reorder photo memories displayed inside this blog article ({editingBlog.gallery?.length || 0} images)
                    </small>
                  </div>
                </div>

                {/* Gallery Thumbnails List with Reordering */}
                {editingBlog.gallery && editingBlog.gallery.length > 0 && (
                  <div className="row g-2 mb-3 mt-1">
                    {editingBlog.gallery.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="col-4 col-sm-3 position-relative"
                        draggable
                        onDragStart={() => setDraggedGalleryIdx(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedGalleryIdx !== null && draggedGalleryIdx !== idx) {
                            handleMoveGalleryImage(draggedGalleryIdx, idx);
                            setDraggedGalleryIdx(null);
                          }
                        }}
                      >
                        <div
                          className="rounded-3 overflow-hidden border shadow-sm position-relative"
                          style={{ height: '80px', background: '#e9ecef', cursor: 'grab' }}
                        >
                          <img
                            src={getMediaUrl(imgUrl)}
                            alt={`Gallery ${idx + 1}`}
                            className="w-100 h-100 object-fit-cover"
                          />
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center shadow"
                            style={{ width: '20px', height: '20px' }}
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                          {/* Order Indicator */}
                          <span
                            className="position-absolute bottom-0 start-0 m-1 badge bg-dark bg-opacity-75 font-monospace"
                            style={{ fontSize: '0.65rem' }}
                          >
                            #{idx + 1}
                          </span>
                        </div>
                        {/* Move Left / Right buttons */}
                        <div className="d-flex justify-content-center gap-1 mt-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveGalleryImage(idx, idx - 1)}
                            className="btn btn-sm btn-outline-secondary p-0 px-1"
                            style={{ fontSize: '0.65rem' }}
                            title="Move Earlier"
                          >
                            <ArrowLeft size={10} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === editingBlog.gallery.length - 1}
                            onClick={() => handleMoveGalleryImage(idx, idx + 1)}
                            className="btn btn-sm btn-outline-secondary p-0 px-1"
                            style={{ fontSize: '0.65rem' }}
                            title="Move Later"
                          >
                            <ArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload & Add Controls */}
                <div className="row g-2 align-items-center">
                  <div className="col-sm-6">
                    <label className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mb-0">
                      <Upload size={14} />
                      <span>{isUploadingGallery ? 'Uploading...' : 'Upload Local Photos'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="d-none"
                        disabled={isUploadingGallery}
                      />
                    </label>
                  </div>
                  <div className="col-sm-6">
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        placeholder="Or paste /assets/... URL"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="btn btn-primary"
                        disabled={!galleryUrlInput.trim()}
                      >
                        Add URL
                      </button>
                    </div>
                  </div>
                </div>
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
