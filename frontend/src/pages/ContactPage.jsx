import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAuthor, sendContactMessage } from '../services/api';
import { Mail, Send, CheckCircle2, MapPin, Phone, Sparkles, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage = () => {
  const { t, lang } = useLanguage();
  const [author, setAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAuthor()
      .then((data) => {
        if (isMounted && data) {
          setAuthor(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load author info on Contact page:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendContactMessage(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#C8A27A', '#4B2633', '#F3E9DD']
        });
      } catch (err) {}
    } catch (err) {
      console.error('Failed to send contact message:', err);
      setSubmitError(err.message || 'Failed to send your letter. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSuccess(false);
    setSubmitError(null);
  };

  const authorName = author?.name || 'Suchetha Kapuarachchi';
  const authorEmail = author?.contact?.email || 'contact@suchethakapuarachchi.com';
  const authorPhone = author?.contact?.phone || '+94 77 123 4567';
  const authorLocation = author?.contact?.location || 'Colombo, Sri Lanka';
  const instagramUrl = author?.socials?.instagram || 'https://instagram.com';
  const facebookUrl = author?.socials?.facebook || 'https://facebook.com';

  return (
    <div className="contact-page-wrapper py-5">
      <div className="container">
        {/* Editorial Header */}
        <div className="section-editorial-header">
          <p className="section-label">{t('contact.section_label')}</p>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('contact.title')}
          </h1>
          <p className="section-description">{t('contact.subtitle')}</p>
        </div>

        <div className="row g-5 justify-content-center">
          {/* Left Column: Letter Submission Form */}
          <div className="col-lg-7">
            <div className="card-literary p-4 p-md-5">
              {isSuccess ? (
                <div className="contact-envelope-success-box">
                  <div className="contact-envelope-icon-wrap">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="font-editorial fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                    {t('contact.success_message')}
                  </h3>
                  <p className="font-sinhala-title fs-5 text-muted mb-4">
                    {t('contact.success_sub')}
                  </p>
                  <p className="small text-muted mb-4 font-cormorant fst-italic">
                    "Your words are treasured and will reach Suchetha's writing desk."
                  </p>
                  <button
                    onClick={handleReset}
                    className="btn btn-literary-outline py-2 px-4"
                  >
                    <span>Send Another Letter</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--color-card-border)' }}>
                    <Feather size={20} style={{ color: 'var(--color-primary)' }} />
                    <h4 className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                      Personal Correspondence
                    </h4>
                  </div>

                  {submitError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {submitError}
                    </div>
                  )}

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">
                        {t('contact.name_label')}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-control invitation-input"
                        placeholder="e.g. Nirmala Wijesinghe"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-muted mb-1">
                        {t('contact.email_label')}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-control invitation-input"
                        placeholder="nirmala@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      {t('contact.subject_label')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-control invitation-input"
                      placeholder="e.g. Reflections on Hulu Aththa"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      {t('contact.message_label')}
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-control invitation-input"
                      placeholder="Write your personal thoughts to Suchetha..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-enter-invitation btn-glow w-100 py-3 fs-6"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span>{t('contact.sending')}</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>{t('contact.send_btn')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Author Correspondence Info */}
          <div className="col-lg-5">
            <div className="card-literary p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <span className="badge rounded-pill mb-3 px-3 py-1 font-monospace" style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}>
                  Author Desk
                </span>

                <h3 className="font-editorial fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                  {authorName}
                </h3>

                <p className="font-sinhala-title text-muted mb-4 small" style={{ lineHeight: '1.8' }}>
                  "සෑම පාඨක ලිපියක්ම මගේ හදවතට ලැබෙන මලක් බඳුය. ඔබේ හැඟීම්, විවේචන සහ සිතුවිලි නිහඬව බෙදාගන්න."
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(var(--color-primary-rgb), 0.08)', color: 'var(--color-primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="small text-muted d-block font-sans-ui">Email</span>
                      <span className="fw-semibold small">{authorEmail}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(var(--color-primary-rgb), 0.08)', color: 'var(--color-primary)' }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="small text-muted d-block font-sans-ui">Phone</span>
                      <span className="fw-semibold small">{authorPhone}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(var(--color-primary-rgb), 0.08)', color: 'var(--color-primary)' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="small text-muted d-block font-sans-ui">Sanctuary</span>
                      <span className="fw-semibold small">{authorLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Link Badges */}
              <div className="pt-3 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
                <span className="small text-muted font-sans-ui d-block mb-2">Connect online:</span>
                <div className="d-flex gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-instagram" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-facebook" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
