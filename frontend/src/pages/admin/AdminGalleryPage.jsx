import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';

export const AdminGalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  const [newItem, setNewItem] = useState({
    title_si: '',
    title_en: '',
    image: '',
    category: 'Literary Art',
    caption_si: '',
    caption_en: '',
    order: 10,
    status: 'published'
  });

  const fetchGallery = async () => {
    try {
      const data = await api.getGallery();
      setGallery(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await api.admin.uploadFile(file);
      if (res.success) {
        setNewItem(prev => ({ ...prev, image: res.url }));
        setAlert({ type: 'success', text: 'Image uploaded successfully!' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to upload image' });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newItem.image) {
      setAlert({ type: 'danger', text: 'Please upload or provide an image URL' });
      return;
    }
    try {
      await api.admin.createGalleryItem(newItem);
      setAlert({ type: 'success', text: 'Gallery item added successfully!' });
      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to add gallery item' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery image?')) return;
    try {
      await api.admin.deleteGalleryItem(id);
      setAlert({ type: 'success', text: 'Image removed from gallery' });
      fetchGallery();
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to delete item' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Visual Gallery Management</h2>
          <p className="text-muted small mb-0">Manage visual media, artwork, launch photos, and artifacts</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-literary rounded-pill">
          <Plus size={16} />
          <span>Upload / Add Image</span>
        </button>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="row g-4">
        {gallery.map((item) => (
          <div key={item.id} className="col-sm-6 col-md-4 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 d-flex flex-column justify-content-between">
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.image}
                  alt={item.title_en}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="position-absolute top-0 end-0 m-2 btn btn-danger btn-sm rounded-circle p-2 shadow"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-3">
                <span className="badge bg-light text-dark border small mb-1">{item.category}</span>
                <span className="fw-bold d-block small font-sinhala-title">{item.title_si}</span>
                <span className="text-muted small d-block">{item.title_en}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 9999, backdropFilter: 'blur(4px)' }}
        >
          <div
            className="bg-white rounded-4 p-4 p-md-5 max-w-lg w-100 position-relative shadow-2xl"
            style={{ maxWidth: '560px' }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            <h4 className="fw-bold mb-4">Add Image to Gallery</h4>

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Upload Local File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="form-control"
                  accept="image/*"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Or Image Path / URL *</label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="/assets/..."
                  className="form-control"
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Sinhala Title</label>
                  <input
                    type="text"
                    value={newItem.title_si}
                    onChange={e => setNewItem({ ...newItem, title_si: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">English Title</label>
                  <input
                    type="text"
                    value={newItem.title_en}
                    onChange={e => setNewItem({ ...newItem, title_en: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Category</label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                  className="form-select"
                >
                  <option value="Author Portrait">Author Portrait</option>
                  <option value="Book Covers">Book Covers</option>
                  <option value="Literary Art">Literary Art</option>
                  <option value="Artifacts">Artifacts</option>
                  <option value="Illustrations">Illustrations</option>
                  <option value="Writing Moments">Writing Moments</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Sinhala Caption</label>
                <input
                  type="text"
                  value={newItem.caption_si}
                  onChange={e => setNewItem({ ...newItem, caption_si: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary rounded-pill px-4">
                  Cancel
                </button>
                <button type="submit" className="btn btn-literary rounded-pill px-4">
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
