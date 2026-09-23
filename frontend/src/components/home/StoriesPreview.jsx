import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getStories, getMediaUrl } from '../../services/api';
import { BookOpen, X, ArrowRight, Feather } from 'lucide-react';

export const StoriesPreview = () => {
  const { t, lang } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getStories()
      .then((data) => {
        if (isMounted) {
          setStories(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load stories in StoriesPreview:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-6 position-relative">
      <div className="container">
        {/* Section Header */}
        <div className="section-editorial-header">
          <p className="section-label">{t('stories.section_label')}</p>
          <h2 className="section-title">{t('stories.title')}</h2>
          <p className="section-description">{t('stories.subtitle')}</p>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading stories...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {stories.slice(0, 3).map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div className="story-card-item">
                  <div>
                    {/* Category and Date Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span
                        className="badge px-3 py-1 rounded-pill small font-monospace"
                        style={{
                          background: 'var(--theme-badge-bg)',
                          color: 'var(--theme-badge-text)'
                        }}
                      >
                        {lang === 'si' ? item.category_si : item.category}
                      </span>
                      <span className="small text-muted font-monospace">{item.date}</span>
                    </div>

                    {/* Artwork Thumbnail */}
                    {item.cover_image && (
                      <div className="mb-3 rounded-3 overflow-hidden text-center p-2" style={{ background: 'var(--color-bg-alt)' }}>
                        <img
                          src={getMediaUrl(item.cover_image)}
                          alt={item.title_en}
                          style={{ height: '90px', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                  <h4 className="font-editorial fw-bold fs-4 mb-2" style={{ color: 'var(--color-primary)' }}>
                    {lang === 'si' ? item.title_si : item.title_en}
                  </h4>

                  <p className="font-sinhala-title text-muted small mb-3">
                    {lang === 'si' ? item.title_en : item.title_si}
                  </p>

                  <p className="small text-muted mb-4" style={{ lineHeight: '1.8' }}>
                    "{lang === 'si' ? item.excerpt_si : item.excerpt_en}"
                  </p>
                </div>

                {/* Read Piece Button */}
                <button
                  onClick={() => setSelectedStory(item)}
                  className="btn btn-literary-outline w-100 justify-content-center py-2"
                >
                  <BookOpen size={16} />
                  <span>{t('stories.read_piece')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

        <div className="text-center">
          <Link to="/stories" className="btn btn-literary">
            <span>Explore All Notebook Writings</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PHYSICAL BOOK-PAGE READING MODAL                              */}
      {/* ============================================================== */}
      {selectedStory && (
        <div
          className="book-reading-backdrop animate-fade-in"
          onClick={() => setSelectedStory(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="book-reading-page position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              className="book-reading-close-btn"
              title="Close book page"
              aria-label="Close"
            >
              <X size={26} />
            </button>

            {/* Physical Book Header / Running Folio */}
            <div className="book-page-foliolabel d-flex justify-content-between align-items-center">
              <span>Suchetha Kapuarachchi • {selectedStory.category}</span>
              <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '22px', height: '22px' }} />
              <span>Page 42</span>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <span className="badge px-3 py-1 rounded-pill small font-monospace mb-2" style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}>
                {selectedStory.category}
              </span>
              <h2 className="font-editorial display-6 fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                {lang === 'si' ? selectedStory.title_si : selectedStory.title_en}
              </h2>
              <p className="font-sinhala-title text-muted small">
                {lang === 'si' ? selectedStory.title_en : selectedStory.title_si}
              </p>
            </div>

            {/* Prose Content */}
            <div className="book-page-prose mb-5">
              {lang === 'si' ? selectedStory.content_si : selectedStory.content_en}
            </div>

            {/* Book Page Footer / Signature */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'rgba(200, 162, 122, 0.4)' }}>
              <div>
                <span className="font-cormorant fst-italic small text-muted">From the author's diary</span>
                <p className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  Suchetha Kapuarachchi
                </p>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="btn btn-sm btn-literary-outline py-1 px-3"
              >
                {t('stories.close_modal')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
