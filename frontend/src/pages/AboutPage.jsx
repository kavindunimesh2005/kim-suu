import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getAuthor, getBooks, getMediaUrl } from '../services/api';
import { Award, Feather, BookOpen, Heart, Sparkles, Mail, Send, Compass } from 'lucide-react';

export const AboutPage = () => {
  const { t, lang } = useLanguage();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getAuthor(), getBooks()])
      .then(([authorData, booksData]) => {
        if (isMounted) {
          setAuthor(authorData);
          setBooks(Array.isArray(booksData) ? booksData : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load about page data:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const authorName = author?.name || 'Suchetha Kapuarachchi';
  const authorPenName = author?.pen_name || 'Kim Suu Ah';
  const authorTitle = lang === 'si' ? (author?.title_si || 'කතුවරිය • ලේඛිකාව') : (author?.title_en || 'Author • Writer • Storyteller');
  const bio = lang === 'si'
    ? (author?.writing_journey_si || author?.full_bio_si || author?.bio_si || '')
    : (author?.writing_journey_en || author?.full_bio_en || author?.bio_en || '');
  const philosophy = lang === 'si'
    ? (author?.philosophy_si || 'සෑම පොතක්ම කියවන්නාගේ හදවතට විවර වන නිහඬ කවුළුවකි.')
    : (author?.philosophy_en || 'Every book is a quiet window opened to the reader\'s heart.');
  const portraitImg = getMediaUrl(author?.portrait || author?.portrait_image) || '/assets/author-suchetha.jpg';
  const achievements = Array.isArray(author?.achievements) ? author.achievements : [];
  const contactLocation = author?.contact?.location || 'Colombo, Sri Lanka';
  const contactEmail = author?.contact?.email || 'contact@suchethakapuarachchi.com';

  return (
    <div className="about-page-wrapper py-5">
      <div className="container">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-5">
          <span
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase font-monospace"
            style={{
              background: 'rgba(var(--color-primary-rgb), 0.1)',
              color: 'var(--color-primary)',
              letterSpacing: '0.15em'
            }}
          >
            {t('about.section_label')}
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {authorName}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('about.tagline')}
          </p>
        </div>

        {/* Hero Editorial Profile Block */}
        <div className="row g-5 align-items-center mb-6">
          {/* Portrait with layered decorative framing */}
          <div className="col-lg-5 text-center">
            <div className="author-portrait-composition">
              <div className="author-paper-layer-back" />
              <div className="author-paper-layer-mid" />
              <div className="author-image-wrapper">
                <img
                  src={portraitImg}
                  alt={authorName}
                  className="author-portrait-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/author-suchetha.jpg';
                  }}
                />
              </div>

              <img
                src="/assets/pink-lotus.png"
                alt="Lotus"
                className="portrait-botanical-cutout portrait-botanical-lotus"
              />
              <img
                src="/assets/green-butterfly.png"
                alt="Butterfly"
                className="portrait-botanical-cutout portrait-botanical-butterfly"
              />
            </div>
          </div>

          {/* Biography Highlights */}
          <div className="col-lg-7">
            <div className="card-literary p-4 p-md-5">
              <span className="badge rounded-pill mb-3 px-3 py-1 font-monospace" style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}>
                {authorTitle}
              </span>

              <h2 className="font-editorial fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                {t('about.biography_title')}
              </h2>

              <p className="font-sinhala-title fs-5 mb-4 text-muted" style={{ lineHeight: '1.9' }}>
                {bio}
              </p>

              {/* Decorative Quote */}
              <div className="literary-quote mb-4">
                <p className="mb-0">
                  "{philosophy}"
                </p>
                <footer className="small text-muted mt-2 fst-normal">
                  — {authorName} ({authorPenName})
                </footer>
              </div>

              {/* Key Books Quick Links */}
              <div className="d-flex flex-wrap gap-2 pt-2">
                {books.map((b) => (
                  <Link
                    key={b.id}
                    to={`/books/${b.slug}`}
                    className="btn btn-sm btn-literary-outline py-2 px-3"
                  >
                    <BookOpen size={15} />
                    <span>{lang === 'si' ? b.title_si : b.title_en}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Philosophy & Creative Journey */}
        <div className="row g-4 mb-6">
          <div className="col-md-6">
            <div className="card-literary p-4 p-md-5 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Compass size={22} style={{ color: 'var(--color-primary)' }} />
                <h3 className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {t('about.philosophy_title')}
                </h3>
              </div>
              <p className="small text-muted mb-0" style={{ lineHeight: '1.9' }}>
                {lang === 'si'
                  ? (author?.philosophy_si || "සාහිත්‍යය යනු හුදු වචන ගැලපීමක් නොව, මිනිස් ආත්මයේ නොපෙනෙන තැන් ආලෝකවත් කිරීමකි. සොබාදහමේ නිහඬ බව තුළ ජීවිතයේ ගැඹුරුම ප්‍රශ්න වලට පිළිතුරු සැඟව ඇතැයි මම විශ්වාස කරමි.")
                  : (author?.philosophy_en || "Literature is not the mere assembly of sentences, but the gentle illumination of unseen corners of the human heart. I believe the profoundest answers to worldly turmoil rest within the silence of nature.")}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card-literary p-4 p-md-5 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Award size={22} style={{ color: 'var(--color-primary)' }} />
                <h3 className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  {t('about.achievements_title')}
                </h3>
              </div>
              <div className="d-flex flex-column gap-3">
                {achievements.map((ach, i) => (
                  <div key={i} className="border-bottom pb-3">
                    <span className="badge rounded-pill font-monospace mb-1" style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}>
                      {ach.year}
                    </span>
                    <h5 className="font-editorial fw-bold fs-6 mb-1" style={{ color: 'var(--color-primary)' }}>
                      {lang === 'si' ? ach.title_si : ach.title_en}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Connect with Suchetha */}
        <div className="card-literary p-5 text-center">
          <img
            src="/assets/daisy-flower.png"
            alt="Daisy"
            style={{ width: '48px', height: '48px', marginBottom: '16px' }}
          />
          <h3 className="font-editorial display-6 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('about.connect_title')}
          </h3>
          <p className="font-sinhala-title fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: '580px' }}>
            {contactLocation} • {contactEmail}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/contact" className="btn btn-literary">
              <Send size={18} />
              <span>{t('contact.send_btn')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
