import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Send, CheckCircle2, AlertCircle, Instagram, Facebook, BookMarked, MapPin, Phone } from 'lucide-react';

export const ContactPage = () => {
  const { t, lang } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({ type: 'danger', text: 'කරුණාකර සියලු අනිවාර්ය තොරතුරු පුරවන්න.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendContactMessage({ name, email, subject, message });
      if (res.success) {
        setFeedback({ 
          type: 'success', 
          text: lang === 'si' ? res.message_si : res.message_en 
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setFeedback({ type: 'danger', text: res.error || 'Failed to send message' });
      }
    } catch (err) {
      setFeedback({ type: 'danger', text: 'Error connecting to server. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-wrapper py-5">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            Correspondence
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('contact.title')}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="row g-5">
          
          {/* Left: Contact Information & Socials */}
          <div className="col-lg-5">
            <div className="card-literary p-4 p-md-5 h-100 d-flex flex-column justify-content-between" style={{ background: 'var(--color-bg-alt)' }}>
              <div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '36px', height: '36px' }} />
                  <h3 className="font-editorial fw-bold fs-3 mb-0" style={{ color: 'var(--color-primary)' }}>
                    Suchetha Kapuarachchi
                  </h3>
                </div>
                <p className="font-sinhala-title text-muted mb-4 small">
                  {lang === 'si'
                    ? "පාඨක ඔබගේ සෑම ලිපියක්ම, කෘති පිළිබඳ විචාර හෝ සාහිත්‍යමය ආරාධනයක්ම මා මහත් සේ අගය කරමි."
                    : "Every letter from a reader, book review, or literary invitation is deeply cherished."}
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="small text-muted d-block">Email</span>
                      <span className="fw-bold small">contact@suchethakapuarachchi.com</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="small text-muted d-block">Location</span>
                      <span className="fw-bold small">Colombo, Sri Lanka</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Connect */}
              <div className="pt-4 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
                <span className="small text-muted fw-bold d-block mb-3">Follow the Author</span>
                <div className="d-flex gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary rounded-circle p-2">
                    <Instagram size={18} />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary rounded-circle p-2">
                    <Facebook size={18} />
                  </a>
                  <a href="https://goodreads.com" target="_blank" rel="noreferrer" className="btn btn-outline-secondary rounded-circle p-2">
                    <BookMarked size={18} />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Literary Contact Letter Form */}
          <div className="col-lg-7">
            <div className="card-literary p-4 p-md-5">
              
              <h3 className="font-editorial fw-bold fs-3 mb-1" style={{ color: 'var(--color-primary)' }}>
                Send a Letter to the Author
              </h3>
              <p className="font-sinhala-title text-muted small mb-4">
                කතුවරිය වෙත ඔබේ පණිවිඩය කෙළින්ම යොමු කරන්න
              </p>

              {feedback.text && (
                <div className={`alert alert-${feedback.type} d-flex align-items-center gap-2 py-3 mb-4`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="small font-sinhala-title">{feedback.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      {t('contact.name_label')} *
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="form-control rounded-3 py-2"
                      style={{ border: '1.5px solid var(--color-card-border)' }}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      {t('contact.email_label')} *
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="form-control rounded-3 py-2"
                      style={{ border: '1.5px solid var(--color-card-border)' }}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    {t('contact.subject_label')}
                  </label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="form-control rounded-3 py-2"
                    style={{ border: '1.5px solid var(--color-card-border)' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">
                    {t('contact.message_label')} *
                  </label>
                  <textarea 
                    rows="5"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="form-control rounded-3 py-2"
                    style={{ border: '1.5px solid var(--color-card-border)' }}
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-literary w-100 py-3 rounded-pill justify-content-center"
                >
                  <Send size={18} />
                  <span>{isSubmitting ? t('contact.sending') : t('contact.send_btn')}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
