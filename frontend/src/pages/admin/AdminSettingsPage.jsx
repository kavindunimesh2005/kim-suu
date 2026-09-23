import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, Settings, Check } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert({ type: '', text: '' });
    try {
      await api.admin.updateSettings(settings);
      setAlert({ type: 'success', text: 'System settings saved successfully!' });
    } catch (err) {
      setAlert({ type: 'danger', text: err.message || 'Failed to update settings' });
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
          <h2 className="font-editorial fw-bold fs-2 mb-1">Global Website Settings</h2>
          <p className="text-muted small mb-0">Manage default themes, invitation copy, and header titles</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-literary rounded-pill px-4"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {alert.text && (
        <div className={`alert alert-${alert.type} py-2 mb-4`}>
          {alert.text}
        </div>
      )}

      <form onSubmit={handleSave} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
        
        <h5 className="fw-bold mb-3 border-bottom pb-2">Website Identity & Theme</h5>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Site Title (Sinhala)</label>
            <input 
              type="text" 
              value={settings.site_title_si || ''}
              onChange={e => setSettings({ ...settings, site_title_si: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Site Title (English)</label>
            <input 
              type="text" 
              value={settings.site_title_en || ''}
              onChange={e => setSettings({ ...settings, site_title_en: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Default Site Theme</label>
            <select 
              value={settings.default_theme || 'default'}
              onChange={e => setSettings({ ...settings, default_theme: e.target.value })}
              className="form-select"
            >
              <option value="default">Default Deep Plum / Burgundy Theme</option>
              <option value="huluAththa">Hulu Aththa Light Green / Forest Theme</option>
              <option value="arungal">Arungal Warm Brown / Earthy Theme</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Author Official Name</label>
            <input 
              type="text" 
              value={settings.author_name || ''}
              onChange={e => setSettings({ ...settings, author_name: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

        <h5 className="fw-bold mb-3 border-bottom pb-2">Hero & Invitation Text</h5>
        <div className="mb-3">
          <label className="form-label small fw-bold">Hero Tagline (Sinhala)</label>
          <input 
            type="text" 
            value={settings.hero_tagline_si || ''}
            onChange={e => setSettings({ ...settings, hero_tagline_si: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Hero Tagline (English)</label>
          <input 
            type="text" 
            value={settings.hero_tagline_en || ''}
            onChange={e => setSettings({ ...settings, hero_tagline_en: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold">Footer Quote (Sinhala)</label>
          <input 
            type="text" 
            value={settings.footer_quote_si || ''}
            onChange={e => setSettings({ ...settings, footer_quote_si: e.target.value })}
            className="form-control"
          />
        </div>

        <h5 className="fw-bold mb-3 border-bottom pb-2">Contact Details</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">Contact Email</label>
            <input 
              type="email" 
              value={settings.contact_email || ''}
              onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Contact Phone</label>
            <input 
              type="text" 
              value={settings.contact_phone || ''}
              onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
              className="form-control"
            />
          </div>
        </div>

      </form>
    </div>
  );
};
