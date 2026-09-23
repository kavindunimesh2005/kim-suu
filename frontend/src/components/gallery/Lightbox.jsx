import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../../services/api';

export const Lightbox = ({
  item,
  items = [],
  currentIndex = -1,
  onClose,
  onPrev,
  onNext
}) => {
  // Allow passing either a single item or an items list with currentIndex
  const activeItem = item || (currentIndex >= 0 && items[currentIndex] ? items[currentIndex] : null);
  const hasMultiple = items.length > 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!activeItem) return null;

  return (
    <div
      className="lightbox-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
    >
      <div
        className="lightbox-content-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-light rounded-circle position-absolute top-0 end-0 m-2 m-sm-3 shadow d-flex align-items-center justify-content-center"
          style={{ width: '44px', height: '44px', zIndex: 20 }}
          aria-label="Close lightbox (Esc)"
        >
          <X size={22} />
        </button>

        {/* Previous Button */}
        {hasMultiple && onPrev && (
          <button
            onClick={onPrev}
            className="lightbox-nav-btn lightbox-prev-btn"
            aria-label="Previous image (Left arrow)"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Next Button */}
        {hasMultiple && onNext && (
          <button
            onClick={onNext}
            className="lightbox-nav-btn lightbox-next-btn"
            aria-label="Next image (Right arrow)"
            title="Next (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        )}

        <img
          src={getMediaUrl(activeItem.image)}
          alt={activeItem.title_en || 'Gallery Image'}
        />

        <div className="lightbox-caption-text">
          <p className="fw-bold mb-1 fs-5">
            {activeItem.title_en} {activeItem.title_si && <span className="opacity-75">({activeItem.title_si})</span>}
          </p>
          <p className="small text-white-50 mb-0">
            {activeItem.caption_en || activeItem.caption_si}
          </p>
          {hasMultiple && currentIndex >= 0 && (
            <p className="text-white-50 font-monospace small mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
              {currentIndex + 1} / {items.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
