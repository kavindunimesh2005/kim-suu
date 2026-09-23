import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { KeyRound, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const InvitationForm = ({ onSubmit, errorMsg }) => {
  const { t } = useLanguage();
  const [username, setUsername] = useState('Kim Suu Ah');
  const [password, setPassword] = useState('20-09-2026');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  const handleFillCredentials = () => {
    setUsername('Kim Suu Ah');
    setPassword('20-09-2026');
  };

  return (
    <form onSubmit={handleSubmit} className="text-start w-100">
      {/* Clearly Visible Credentials Box */}
      <div className="credentials-box">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2 small fw-bold" style={{ color: '#4B2633' }}>
            <KeyRound size={15} />
            <span>{t('invitation.credentials_hint')}</span>
          </div>
          <button
            type="button"
            onClick={handleFillCredentials}
            className="btn btn-sm btn-link p-0 text-decoration-none small"
            style={{ color: '#7A4A56', fontSize: '0.78rem' }}
          >
            Auto-fill
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="small text-muted">{t('invitation.username_label')}:</span>
          <span className="credential-pill">Kim Suu Ah</span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span className="small text-muted">{t('invitation.password_label')}:</span>
          <span className="credential-pill">20-09-2026</span>
        </div>
      </div>

      {/* Username Field */}
      <div className="mb-3">
        <label className="form-label small fw-semibold text-muted mb-1">
          {t('invitation.username_label')}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control invitation-input"
          placeholder="e.g. Kim Suu Ah"
          required
        />
      </div>

      {/* Password Field */}
      <div className="mb-3">
        <label className="form-label small fw-semibold text-muted mb-1">
          {t('invitation.password_label')}
        </label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control invitation-input"
          placeholder="e.g. 20-09-2026"
          required
        />
      </div>

      {/* Custom Animated Error Banner (NO alert boxes) */}
      {errorMsg && (
        <div className="invitation-error-banner" role="alert">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Enter Button with Hover Glow & Smooth Arrow */}
      <button
        type="submit"
        className="btn btn-enter-invitation btn-glow mt-2"
        id="enter-invitation-btn"
      >
        <Sparkles size={18} />
        <span>{t('invitation.open_button')}</span>
        <ArrowRight size={18} className="arrow-icon" />
      </button>

      <p className="text-center text-muted small mt-3 mb-0" style={{ fontSize: '0.78rem' }}>
        {t('invitation.enter_world')}
      </p>
    </form>
  );
};
