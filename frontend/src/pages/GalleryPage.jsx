import React, { useState, useEffect } from 'react';
import { getGallery, getMediaUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Lightbox } from '../components/gallery/Lightbox';
import { Eye, Sparkles } from 'lucide-react';

export const GalleryPage = () => {
  const { t, lang } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  const categories = [
    'All',
    'Author Portrait',
    'Book Covers',
    'Literary Art',
    'Artifacts',
    'Illustrations',
    'Writing Moments'
  ];

  useEffect(() => {
    let isMounted = true;
    getGallery()
      .then((data) => {
        if (isMounted) {
          setGallery(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load gallery:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="gallery-page-wrapper py-5">
      <div className="container">
        {/* Header */}
        <div className="section-editorial-header">
          <p className="section-label">{t('gallery.section_label')}</p>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('gallery.title')}
          </h1>
          <p className="section-description">{t('gallery.subtitle')}</p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm px-3 py-2 rounded-pill font-monospace"
                style={{
                  background: isActive ? 'var(--color-primary)' : 'var(--color-card-bg)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text)',
                  border: '1px solid var(--color-card-border)',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                {cat === 'All' ? t('gallery.all') : cat}
              </button>
            );
          })}
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading gallery...</span>
            </div>
          </div>
        ) : (
          <div className="gallery-masonry-grid mb-5">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="gallery-card-brick"
                onClick={() => setLightboxItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxItem(item)}
              >
                <img src={getMediaUrl(item.image)} alt={item.title_en} loading="lazy" />
                <div className="gallery-overlay-caption">
                  <span
                    className="badge align-self-start mb-2 px-2 py-1 rounded font-monospace small"
                    style={{ background: 'var(--color-accent)', color: '#241C1E' }}
                  >
                    {lang === 'si' ? item.category_si : item.category}
                  </span>
                  <h5 className="font-editorial fw-bold mb-1 fs-6">
                    {lang === 'si' ? item.title_si : item.title_en}
                  </h5>
                  <p className="small mb-0 opacity-75 d-flex align-items-center gap-1">
                    <Eye size={13} />
                    <span>{t('gallery.view_full')}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
};
