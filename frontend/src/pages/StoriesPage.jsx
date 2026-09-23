import React, { useState, useEffect } from 'react';
import { getStories, getMediaUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, X, Sparkles, Feather } from 'lucide-react';

export const StoriesPage = () => {
  const { t, lang } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeStoryModal, setActiveStoryModal] = useState(null);

  const categories = ['All', 'Poems', 'Stories', 'Excerpts', 'Literary Notes', 'Quotes'];

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
        console.error('Failed to load stories:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStories = selectedCategory === 'All'
    ? stories
    : stories.filter((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="stories-page-wrapper py-5">
      <div className="container">
        {/* Editorial Header */}
        <div className="section-editorial-header">
          <p className="section-label">{t('stories.section_label')}</p>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('stories.title')}
          </h1>
          <p className="section-description">{t('stories.subtitle')}</p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm px-4 py-2 rounded-pill font-monospace"
                style={{
                  background: isActive ? 'var(--color-primary)' : 'var(--color-card-bg)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text)',
                  border: '1px solid var(--color-card-border)',
                  fontWeight: 600,
                  fontSize: '0.84rem'
                }}
              >
                {cat === 'All' ? t('stories.all') : cat}
              </button>
            );
          })}
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
            {filteredStories.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <div className="story-card-item">
                  <div>
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

                    {item.cover_image && (
                      <div className="mb-3 rounded-3 overflow-hidden text-center p-3" style={{ background: 'var(--color-bg-alt)' }}>
                        <img
                          src={getMediaUrl(item.cover_image)}
                          alt={item.title_en}
                          style={{ height: '90px', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    <h3 className="font-editorial fw-bold fs-4 mb-2" style={{ color: 'var(--color-primary)' }}>
                      {lang === 'si' ? item.title_si : item.title_en}
                    </h3>

                    <p className="font-sinhala-title text-muted small mb-3">
                      {lang === 'si' ? item.title_en : item.title_si}
                    </p>

                    <p className="small text-muted mb-4" style={{ lineHeight: '1.8' }}>
                      "{lang === 'si' ? item.excerpt_si : item.excerpt_en}"
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveStoryModal(item)}
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
      </div>

      {/* ============================================================== */}
      {/* PHYSICAL BOOK-PAGE READING MODAL                              */}
      {/* ============================================================== */}
      {activeStoryModal && (
        <div
          className="book-reading-backdrop animate-fade-in"
          onClick={() => setActiveStoryModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="book-reading-page position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveStoryModal(null)}
              className="book-reading-close-btn"
              aria-label="Close"
            >
              <X size={26} />
            </button>

            {/* Book Running Header */}
            <div className="book-page-foliolabel d-flex justify-content-between align-items-center">
              <span>Suchetha Kapuarachchi • {activeStoryModal.category}</span>
              <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '22px', height: '22px' }} />
              <span>Folio 18</span>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <span className="badge px-3 py-1 rounded-pill small font-monospace mb-2" style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}>
                {activeStoryModal.category}
              </span>
              <h2 className="font-editorial display-6 fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                {lang === 'si' ? activeStoryModal.title_si : activeStoryModal.title_en}
              </h2>
              <p className="font-sinhala-title text-muted small">
                {lang === 'si' ? activeStoryModal.title_en : activeStoryModal.title_si}
              </p>
            </div>

            {/* Prose Content */}
            <div className="book-page-prose mb-5">
              {lang === 'si' ? activeStoryModal.content_si : activeStoryModal.content_en}
            </div>

            {/* Book Page Footer */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: 'rgba(200, 162, 122, 0.4)' }}>
              <div>
                <span className="font-cormorant fst-italic small text-muted">Personal Notebook of</span>
                <p className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  Suchetha Kapuarachchi
                </p>
              </div>
              <button
                onClick={() => setActiveStoryModal(null)}
                className="btn btn-sm btn-literary-outline py-1 px-3"
              >
                {t('stories.close_modal')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
