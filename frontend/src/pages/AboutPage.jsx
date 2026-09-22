import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Award, Feather, BookOpen, Heart, Sparkles, Mail, Compass } from 'lucide-react';

export const AboutPage = () => {
  const { t, lang } = useLanguage();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await api.getAuthor();
        setAuthor(data);
      } catch (err) {
        console.error("Error fetching author details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthor();
  }, []);

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="about-page-wrapper py-5">
      <div className="container">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-5">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            Biographical Portrait
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('about.title')}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('about.tagline')}
          </p>
        </div>

        {/* Hero Editorial Profile Block */}
        <div className="row g-5 align-items-center mb-6">
          
          {/* Portrait with decorative framing */}
          <div className="col-lg-5 text-center">
            <div className="position-relative d-inline-block">
              <div 
                className="position-absolute top-0 start-0 w-100 h-100 rounded-5"
                style={{ 
                  background: 'var(--color-primary)', 
                  transform: 'rotate(-3deg) scale(0.98)', 
                  opacity: 0.15,
                  zIndex: 0 
                }} 
              />
              <img 
                src={author?.portrait_image || "/assets/author-suchetha.jpg"} 
                alt="Suchetha Kapuarachchi" 
                className="img-fluid rounded-5 shadow-lg position-relative"
                style={{ maxHeight: '480px', width: '100%', objectFit: 'cover', zIndex: 1 }}
              />
              {/* Handwritten signature badge */}
              <div 
                className="position-absolute bottom-0 start-50 translate-middle-x card-literary px-4 py-2 shadow"
                style={{ zIndex: 2, marginBottom: '-16px', whiteSpace: 'nowrap' }}
              >
                <span className="font-editorial fs-5 fw-bold" style={{ color: 'var(--color-primary)' }}>
                  Suchetha Kapuarachchi
                </span>
              </div>
            </div>
          </div>

          {/* Flowing Prose in Sinhala */}
          <div className="col-lg-7">
            <h3 className="font-editorial fw-bold fs-3 mb-3" style={{ color: 'var(--color-primary)' }}>
              {t('about.biography_title')}
            </h3>

            <p className="font-sinhala-title fs-5 mb-4" style={{ lineHeight: '1.9', color: 'var(--color-text)' }}>
              {lang === 'si' ? author?.full_bio_si : author?.full_bio_en}
            </p>

            {/* Author Literary Philosophy Card */}
            <div 
              className="p-4 rounded-4 mb-4"
              style={{
                background: 'rgba(var(--color-primary-rgb), 0.06)',
                borderLeft: '4px solid var(--color-primary)'
              }}
            >
              <h5 className="font-editorial fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                <Feather size={18} />
                <span>{t('about.philosophy_title')}</span>
              </h5>
              <p className="font-sinhala-title fst-italic text-muted mb-0" style={{ lineHeight: '1.8' }}>
                "{lang === 'si' ? author?.philosophy_si : author?.philosophy_en}"
              </p>
            </div>

            {/* Key Milestones */}
            <div className="row g-3 pt-2">
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-3 p-3 card-literary">
                  <BookOpen size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span className="fw-bold d-block small">කෘති ද්විත්වය</span>
                    <span className="text-muted small">හුළු අත්ත සහ අරුංගල්</span>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="d-flex align-items-center gap-3 p-3 card-literary">
                  <Compass size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span className="fw-bold d-block small">සාහිත්‍ය ප්‍රභේදය</span>
                    <span className="text-muted small">ප්‍රේම, ස්වභාවික හා සංස්කෘතික ප්‍රබන්ධ</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Achievements & Honors Section */}
        <div className="my-5 py-5 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
          <div className="text-center mb-5">
            <h2 className="font-editorial display-6 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              {t('about.achievements_title')}
            </h2>
            <p className="font-sinhala-title text-muted small">
              සාහිත්‍ය නිර්මාණ වෙනුවෙන් ලැබූ පාඨක හා විචාරක ඇගයීම්
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {author?.achievements?.map((ach, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card-literary h-100 p-4 text-center">
                  <div className="mb-3 d-inline-flex p-3 rounded-circle" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
                    <Award size={28} />
                  </div>
                  <span className="badge px-3 py-1 rounded-pill small mb-2 font-monospace" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                    {ach.year}
                  </span>
                  <h5 className="font-sinhala-title fw-bold fs-6 mt-2 mb-0" style={{ color: 'var(--color-primary)' }}>
                    {lang === 'si' ? ach.title_si : ach.title_en}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Connect */}
        <div className="card-literary p-5 text-center mt-5" style={{ background: 'var(--color-bg-alt)' }}>
          <h3 className="font-editorial fw-bold fs-2 mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('about.connect_title')}
          </h3>
          <p className="font-sinhala-title text-muted mb-4 small" style={{ maxWidth: '560px', margin: '0 auto' }}>
            {lang === 'si' 
              ? "ඔබගේ අදහස් සහ සාහිත්‍යමය විමසීම් සඳහා කතුවරියගේ විද්‍යුත් තැපෑල හෝ සමාජ මාධ්‍ය හරහා සම්බන්ධ වන්න." 
              : "For book signings, keynote lectures, or reader letters, feel free to reach out directly."}
          </p>
          <Link to="/contact" className="btn btn-literary rounded-pill px-5">
            <Mail size={18} />
            <span>{t('nav.contact')}</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
