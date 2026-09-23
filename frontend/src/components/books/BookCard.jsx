import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getMediaUrl } from '../../services/api';
import { BookOpen, Palette, ArrowRight, Sparkles } from 'lucide-react';

export const BookCard = ({ book }) => {
  const { lang, t } = useLanguage();
  const { currentTheme, setTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  if (!book) return null;

  const isCurrentTheme = currentTheme === book.theme_id;

  const handleApplyTheme = (e) => {
    e.stopPropagation();
    if (book.theme_id) {
      setTheme(book.theme_id);
    }
  };

  return (
    <div className="card-literary p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
      <div>
        {/* 3D Realistic Book Display */}
        <div 
          className="book-card-3d-wrap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="book-card-3d">
            <img
              src={getMediaUrl(book.cover_image)}
              alt={book.title_en || 'Book Cover'}
              className="book-cover-image"
            />
            {/* 3D Spine and Page Depth Highlights */}
            <div className="book-spine-depth" />
            <div className="book-page-thickness" />
          </div>
        </div>

        {/* Book Title & Subtitle */}
        <div className="text-center mt-3">
          <span
            className="badge rounded-pill mb-2 px-3 py-1 font-monospace"
            style={{
              background: 'var(--theme-badge-bg)',
              color: 'var(--theme-badge-text)',
              fontSize: '0.78rem'
            }}
          >
            {book.genre} • {book.published_year}
          </span>

          <h3 className="font-editorial fw-bold fs-3 mb-1" style={{ color: 'var(--color-primary)' }}>
            {lang === 'si' ? book.title_si : book.title_en}
          </h3>

          <p className="font-sinhala-title text-muted small mb-3">
            {lang === 'si' ? book.title_en : book.title_si}
          </p>

          <p className="font-cormorant fs-6 fst-italic mb-3" style={{ color: 'var(--color-secondary)' }}>
            "{lang === 'si' ? book.subtitle_si : book.subtitle_en}"
          </p>

          <p className="small text-muted mb-4" style={{ lineHeight: '1.75' }}>
            {lang === 'si' ? book.description_si : book.description_en}
          </p>
        </div>
      </div>

      {/* Action Controls & Interactive Theme Switcher */}
      <div className="d-flex flex-column gap-2 pt-3 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
        {/* Real-time Theme Switcher Pill */}
        <button
          onClick={handleApplyTheme}
          className={`book-theme-trigger-pill justify-content-center ${isCurrentTheme ? 'active' : ''}`}
          style={{
            borderColor: isCurrentTheme ? 'var(--color-primary)' : 'var(--color-card-border)',
            background: isCurrentTheme ? 'var(--color-primary)' : 'var(--color-card-bg)',
            color: isCurrentTheme ? '#FFFFFF' : 'var(--color-primary)'
          }}
          title={`Switch site theme to ${book.title_en}`}
        >
          <Palette size={15} />
          <span>
            {isCurrentTheme
              ? `Active: ${book.title_en} Palette`
              : `Experience in ${book.title_en} Palette`}
          </span>
          {isCurrentTheme && <Sparkles size={14} />}
        </button>

        {/* Link to Book Detail Page */}
        <Link
          to={`/books/${book.slug}`}
          className="btn btn-literary-outline w-100 justify-content-center py-2"
        >
          <BookOpen size={16} />
          <span>{t('books.explore_book')}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};
