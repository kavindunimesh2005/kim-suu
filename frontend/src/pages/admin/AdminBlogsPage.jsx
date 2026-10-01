import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, Edit, Trash2, X, FileText, CheckCircle, Upload, 
  Image as ImageIcon, Sparkles, AlertCircle 
} from 'lucide-react';

export const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState(null);

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
      seo_description: '',
      gallery: [
        {
          image: '/assets/lake-boat-watercolor.png',
          caption_si: 'ජලාශය මැද නිහඬ ඔරු පැදීම',
          caption_en: 'Tranquil boat drifting on misty waters'
        },
        {
          image: '/assets/arungal-calligraphy.png',
          caption_si: 'කාව්‍යමය අකුරු මෝස්තරය',
          caption_en: 'Lyrical Sinhala calligraphy art'
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog({
      ...b,
      gallery: b.gallery && Array.isArray(b.gallery) ? [...b.gallery] : []
    });
    setIsModalOpen(true);
  };

  // Upload Featured Image
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const res = await api.admin.uploadFile(file);
      if (res.url) {
        setEditingBlog(prev => ({ ...prev, featured_image: res.url }));
        setAlert({ type: 'success', text: 'Featured image uploaded!' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to upload featured image' });
    } finally {
      setUploadingFeatured(false);
    }
  };

  // Add new blank item to mini gallery
  const handleAddGalleryItem = () => {
    setEditingBlog(prev => ({
      ...prev,
      gallery: [
        ...(prev.gallery || []),
        {
          image: '/assets/pink-lotus.png',
          caption_si: '',
          caption_en: ''
        }
      ]
    }));
  };

  // Upload photo directly to a mini gallery item
  const handleGalleryImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingGalleryIndex(index);
    try {
      const res = await api.admin.uploadFile(file);
      if (res.url) {
        setEditingBlog(prev => {
          const newGallery = [...(prev.gallery || [])];
          newGallery[index] = { ...newGallery[index], image: res.url };
          return { ...prev, gallery: newGallery };
        });
        setAlert({ type: 'success', text: 'Gallery photo uploaded!' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to upload gallery image' });
    } finally {
      setUploadingGalleryIndex(null);
    }
  };

  // Update gallery caption or image url
  const handleUpdateGalleryField = (index, field, value) => {
    setEditingBlog(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery[index] = { ...newGallery[index], [field]: value };
      return { ...prev, gallery: newGallery };
    });
  };

  // Remove photo from mini gallery
  const handleRemoveGalleryItem = (index) => {
    setEditingBlog(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
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
      await fetchBlogs();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to save blog' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.admin.deleteBlog(id);
      setAlert({ type: 'success', text: 'Blog post deleted' });
      await fetchBlogs();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to delete blog post' });
    }
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
        <div className={`alert alert-${alert.type} py-2 mb-4 d-flex align-items-center justify-content-between`}>
          <span>{alert.text}</span>
          <button onClick={() => setAlert({ type: '', text: '' })} className="btn-close btn-sm" />
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
                <th>Mini Gallery</th>
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
                  <td>
                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 small">
                      <ImageIcon size={12} className="me-1" />
                      {b.gallery?.length || 0} Photos
                    </span>
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

      {/* Modal for Edit / Add Article */}
      {isModalOpen && editingBlog && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        >
          <div 
            className="bg-white rounded-4 p-4 p-md-5 max-w-3xl w-100 position-relative shadow-2xl"
            style={{ maxWidth: '840px', maxHeight: '92vh', overflowY: 'auto' }}
          >
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <h4 className="fw-bold mb-4 font-editorial" style={{ color: 'var(--color-primary)' }}>
              {editingBlog.id ? 'Edit Article & Gallery' : 'Write New Article & Gallery'}
            </h4>

            <form onSubmit={handleSave}>
              
              {/* Titles */}
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

              {/* Category, Reading Time, Status */}
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

              {/* Featured Main Image with File Upload + URL + Preview */}
              <div className="card p-3 mb-4 bg-light border-0 rounded-3">
                <label className="form-label small fw-bold d-flex align-items-center gap-2 mb-2">
                  <ImageIcon size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>Main Featured Cover Photo</span>
                </label>
                <div className="row g-3 align-items-center">
                  <div className="col-sm-3 col-md-2 text-center">
                    <img 
                      src={editingBlog.featured_image || '/assets/lake-boat-watercolor.png'} 
                      alt="Preview" 
                      className="rounded shadow-sm border"
                      style={{ width: '100%', height: '70px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/lake-boat-watercolor.png';
                      }}
                    />
                  </div>
                  <div className="col-sm-9 col-md-10">
                    <div className="input-group mb-2">
                      <input 
                        type="text" 
                        value={editingBlog.featured_image}
                        onChange={e => setEditingBlog({ ...editingBlog, featured_image: e.target.value })}
                        placeholder="Image URL or upload a file..."
                        className="form-control form-control-sm"
                      />
                      <label className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 cursor-pointer m-0">
                        <Upload size={14} />
                        <span>{uploadingFeatured ? 'Uploading...' : 'Upload Photo'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="d-none" 
                          onChange={handleFeaturedImageUpload}
                          disabled={uploadingFeatured}
                        />
                      </label>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Upload an image file directly from your computer or enter an asset path.
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* MINI GALLERY MANAGEMENT                                   */}
              {/* ========================================================= */}
              <div className="card p-3 mb-4 border rounded-3" style={{ background: '#fdfbf7', borderColor: 'var(--color-card-border)' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                      <Sparkles size={16} />
                      <span>Article Mini Gallery Photos (දෘශ්‍ය සිතුවම් සහ ඡායාරූප)</span>
                    </h6>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      Add extra photos, sketches, and visual artwork displayed inside this article's mini gallery.
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddGalleryItem}
                    className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Plus size={14} />
                    <span>Add Photo</span>
                  </button>
                </div>

                {(!editingBlog.gallery || editingBlog.gallery.length === 0) ? (
                  <div className="text-center py-4 bg-white rounded-3 border border-dashed text-muted small">
                    <ImageIcon size={24} className="mb-2 opacity-50 d-block mx-auto" />
                    <span>No mini gallery photos added yet. Click "+ Add Photo" to attach gallery images to this article.</span>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {editingBlog.gallery.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-3 border d-flex flex-column flex-sm-row gap-3 align-items-start align-items-sm-center">
                        
                        {/* Thumbnail & Upload */}
                        <div className="position-relative flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                          <img 
                            src={item.image || '/assets/pink-lotus.png'} 
                            alt={`Photo ${idx + 1}`} 
                            className="w-100 h-100 rounded object-fit-cover border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/pink-lotus.png';
                            }}
                          />
                          <label 
                            className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-1 cursor-pointer m-1 shadow-sm"
                            title="Upload new image"
                          >
                            <Upload size={12} />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="d-none" 
                              onChange={(e) => handleGalleryImageUpload(idx, e)}
                              disabled={uploadingGalleryIndex === idx}
                            />
                          </label>
                        </div>

                        {/* Image URL & Captions */}
                        <div className="flex-grow-1 w-100">
                          <div className="mb-2">
                            <input 
                              type="text" 
                              placeholder="Image URL..." 
                              value={item.image}
                              onChange={(e) => handleUpdateGalleryField(idx, 'image', e.target.value)}
                              className="form-control form-control-sm font-monospace"
                              style={{ fontSize: '0.78rem' }}
                            />
                          </div>
                          <div className="row g-2">
                            <div className="col-sm-6">
                              <input 
                                type="text" 
                                placeholder="සිංහල Caption (විස්තරය)..." 
                                value={item.caption_si || ''}
                                onChange={(e) => handleUpdateGalleryField(idx, 'caption_si', e.target.value)}
                                className="form-control form-control-sm font-sinhala-title"
                                style={{ fontSize: '0.8rem' }}
                              />
                            </div>
                            <div className="col-sm-6">
                              <input 
                                type="text" 
                                placeholder="English Caption..." 
                                value={item.caption_en || ''}
                                onChange={(e) => handleUpdateGalleryField(idx, 'caption_en', e.target.value)}
                                className="form-control form-control-sm"
                                style={{ fontSize: '0.8rem' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveGalleryItem(idx)}
                          className="btn btn-sm btn-outline-danger rounded-circle p-2 align-self-end align-self-sm-center"
                          title="Remove photo"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sinhala Content */}
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

              {/* English Content */}
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

              {/* Form Action Buttons */}
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
