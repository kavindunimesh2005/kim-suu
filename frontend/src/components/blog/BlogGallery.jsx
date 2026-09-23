import React, { useState } from 'react';
import { getMediaUrl } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbox } from '../gallery/Lightbox';
import { Sparkles, Eye } from 'lucide-react';

export const BlogGallery = ({ images = [] }) => {
  const { t, lang } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }

  // Normalize image items for Lightbox (handling either string URLs or objects)
  const galleryItems = images.map((img, idx) => {
    if (typeof img === 'string') {
      return {
        id: `blog-gallery-${idx}`,
        image: img,
        title_en: `${t('blog.gallery_heading') || 'Gallery'} • Image ${idx + 1}`,
        title_si: `${t('blog.gallery_heading') || 'සේයා රූ'} • ඡායාරූපය ${idx + 1}`
      };
    }
    return img;
  });

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
  };

  const headingText = t('blog.gallery_heading') || (lang === 'si' ? 'සේයා රූ' : 'Gallery');
  const subheadingText = t('blog.gallery_subheading') || (
    lang === 'si'
      ? 'මෙම සටහනට අදාළ ඡායාරූප සහ මතක සටහන්'
      : 'Visual impressions and memories related to this reflection'
  );

  return (
    <div className="blog-detail-gallery-container animate-fade-in" aria-label="Blog Photo Gallery">
      <div className="blog-detail-gallery-header">
        <h4 className="blog-detail-gallery-title">
          <Sparkles size={16} className="text-accent" />
          <span>{headingText}</span>
          <Sparkles size={16} className="text-accent" />
        </h4>
        <p className="blog-detail-gallery-subtitle mb-0">
          {subheadingText}
        </p>
      </div>

      <div className="blog-detail-gallery-grid">
        {galleryItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="blog-detail-gallery-item"
            onClick={() => setSelectedIndex(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedIndex(idx)}
            aria-label={`View full image ${idx + 1}`}
          >
            <img
              src={getMediaUrl(item.image)}
              alt={item.title_en || `Blog image ${idx + 1}`}
              loading="lazy"
            />
            <div className="blog-detail-gallery-overlay">
              <span className="d-flex align-items-center gap-1 font-sans-ui small fw-bold">
                <Eye size={16} />
                <span>{lang === 'si' ? 'විශාල කර බලන්න' : 'View Image'}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex >= 0 && (
        <Lightbox
          items={galleryItems}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(-1)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};
