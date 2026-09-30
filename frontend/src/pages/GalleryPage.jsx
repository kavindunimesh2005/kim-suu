import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Eye, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const GalleryPage = () => {
  const { t, lang } = useLanguage();
  const [gallery, setGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Author Portrait', 'Book Covers', 'Literary Art', 'Artifacts', 'Illustrations', 'Writing Moments'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery(selectedCategory === 'All' ? '' : selectedCategory);
        setGallery(data || []);
      } catch (err) {
        console.error("Error loading gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [selectedCategory]);

  const openLightbox = (index) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const currentItem = activeImageIndex !== null ? gallery[activeImageIndex] : null;

  return (
    <div className="gallery-page-wrapper py-5">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            Visual Portfolio
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('gallery.title')}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm rounded-pill px-3 py-2"
              style={{
                background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-card-bg)',
                color: selectedCategory === cat ? '#fff' : 'var(--color-text)',
                border: '1px solid var(--color-card-border)',
                fontWeight: '600'
              }}
            >
              {cat === 'All' ? t('gallery.all') : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="row g-4">
            {gallery.map((item, index) => (
              <div key={item.id} className="col-sm-6 col-md-4">
                <div 
                  className="card-literary h-100 overflow-hidden position-relative group"
                  style={{ cursor: 'pointer', minHeight: '280px' }}
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title_en} 
                    loading="lazy"
                    style={{ width: '100%', height: '280px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="gallery-img"
                  />
                  
                  {/* Overlay on hover */}
                  <div 
                    className="position-absolute bottom-0 start-0 w-100 p-3 d-flex flex-column justify-content-end"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                      color: '#fff'
                    }}
                  >
                    <span className="badge bg-warning text-dark px-2 py-1 small rounded-pill w-fit mb-1" style={{ fontSize: '0.7rem' }}>
                      {item.category}
                    </span>
                    <h5 className="font-sinhala-title fs-6 fw-bold mb-1">
                      {lang === 'si' ? item.title_si : item.title_en}
                    </h5>
                    <p className="font-sinhala-title small text-light opacity-75 mb-0" style={{ fontSize: '0.75rem' }}>
                      {lang === 'si' ? item.caption_si : item.caption_en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* LIGHTBOX MODAL                                                 */}
      {/* ============================================================== */}
      {activeImageIndex !== null && currentItem && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(10, 5, 8, 0.95)', zIndex: 10000, backdropFilter: 'blur(8px)' }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button 
            onClick={closeLightbox}
            className="position-absolute top-0 end-0 m-4 btn btn-light rounded-circle p-2"
            style={{ zIndex: 10010 }}
          >
            <X size={22} />
          </button>

          {/* Previous Arrow */}
          <button 
            onClick={prevImage}
            className="position-absolute start-0 ms-3 ms-md-4 btn btn-outline-light rounded-circle p-2"
            style={{ zIndex: 10010 }}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Lightbox Content Container */}
          <div 
            className="text-center max-w-4xl position-relative animate-fade-in"
            style={{ maxWidth: '900px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={currentItem.image} 
              alt={currentItem.title_en} 
              className="img-fluid rounded-4 shadow-2xl mb-3"
              style={{ maxHeight: '72vh', objectFit: 'contain' }}
            />
            
            <div className="text-white">
              <span className="badge px-3 py-1 rounded-pill small mb-2" style={{ background: 'var(--color-primary)' }}>
                {currentItem.category}
              </span>
              <h3 className="font-sinhala-title fs-4 fw-bold mb-1">
                {lang === 'si' ? currentItem.title_si : currentItem.title_en}
              </h3>
              <p className="font-sinhala-title text-light opacity-75 small mb-0">
                {lang === 'si' ? currentItem.caption_si : currentItem.caption_en}
              </p>
            </div>
          </div>

          {/* Next Arrow */}
          <button 
            onClick={nextImage}
            className="position-absolute end-0 me-3 me-md-4 btn btn-outline-light rounded-circle p-2"
            style={{ zIndex: 10010 }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

    </div>
  );
};
