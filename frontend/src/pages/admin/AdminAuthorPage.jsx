import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, User, Award, CheckCircle } from 'lucide-react';

export const AdminAuthorPage = () => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await api.getAuthor();
        setAuthor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', text: '' });
    try {
      await api.admin.updateAuthor(author);
      setAlert({ type: 'success', text: 'Author profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'danger', text: 'Failed to update author profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-editorial fw-bold fs-2 mb-1">Author Profile & Biography</h2>
          <p className="text-muted small mb-0">Edit Suchetha Kapuarachchi's bio, literary vision, and contact details</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-literary rounded-pill px-4"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      <form onSubmit={handleSave} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        
        {/* Basic Info */}
        <h5 className="fw-bold mb-3 border-bottom pb-2">Author Identity</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label small fw-bold">Full Name (English)</label>
            <input 
              type="text" 
              value={author.name}
              onChange={e => setAuthor({ ...author, name: e.target.value })}
              className="form-control"
              required 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Full Name (Sinhala)</label>
            <input 
              type="text" 
              value={author.name_si}
              onChange={e => setAuthor({ ...author, name_si: e.target.value })}
              className="form-control"
              required 
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Pen Name</label>
            <input 
              type="text" 
              value={author.pen_name}
              onChange={e => setAuthor({ ...author, pen_name: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold">Portrait Image Path</label>
          <input 
            type="text" 
            value={author.portrait_image}
            onChange={e => setAuthor({ ...author, portrait_image: e.target.value })}
            className="form-control"
          />
        </div>

        {/* Biographies */}
        <h5 className="fw-bold mb-3 border-bottom pb-2">Biographies</h5>
        <div className="mb-3">
          <label className="form-label small fw-bold">Full Biography (Sinhala) *</label>
          <textarea 
            rows="5"
            value={author.full_bio_si}
            onChange={e => setAuthor({ ...author, full_bio_si: e.target.value })}
            className="form-control font-sinhala-title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold">Full Biography (English) *</label>
          <textarea 
            rows="5"
            value={author.full_bio_en}
            onChange={e => setAuthor({ ...author, full_bio_en: e.target.value })}
            className="form-control"
            required
          />
        </div>

        {/* Philosophy */}
        <h5 className="fw-bold mb-3 border-bottom pb-2">Literary Philosophy</h5>
        <div className="mb-3">
          <label className="form-label small fw-bold">Philosophy Quote (Sinhala)</label>
          <input 
            type="text" 
            value={author.philosophy_si}
            onChange={e => setAuthor({ ...author, philosophy_si: e.target.value })}
            className="form-control font-sinhala-title"
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold">Philosophy Quote (English)</label>
          <input 
            type="text" 
            value={author.philosophy_en}
            onChange={e => setAuthor({ ...author, philosophy_en: e.target.value })}
            className="form-control"
          />
        </div>

        {/* Contact info */}
        <h5 className="fw-bold mb-3 border-bottom pb-2">Contact & Socials</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Public Email</label>
            <input 
              type="email" 
              value={author.contact?.email || ''}
              onChange={e => setAuthor({ ...author, contact: { ...author.contact, email: e.target.value } })}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Instagram URL</label>
            <input 
              type="text" 
              value={author.contact?.instagram || ''}
              onChange={e => setAuthor({ ...author, contact: { ...author.contact, instagram: e.target.value } })}
              className="form-control"
            />
          </div>
        </div>

      </form>
    </div>
  );
};
