import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export const BookCard3D = ({ book }) => {
  const { setTheme, currentTheme } = useTheme();
  const { lang, t } = useLanguage();

  const isCurrentTheme = currentTheme === book.theme_id;

  const handleApplyTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(book.theme_id);
  };

  return (
    <div className="card-literary h-100 p-4 d-flex flex-column justify-content-between position-relative">
      
      {/* Active Theme Indicator Pill */}
      {isCurrentTheme && (
        <div 
          className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill small fw-bold d-flex align-items-center gap-1 shadow-sm"
          style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.75rem', zIndex: 10 }}
        >
          <Sparkles size={13} />
          <span>Active World</span>
        </div>
      )}

      {/* Book Cover 3D Wrap */}
      <div className="text-center my-3">
        <Link to={`/books/${book.slug}`} className="book-3d-wrap text-decoration-none">
          <div className="book-3d">
            <img 
              src={book.cover_image} 
              alt={book.title_en} 
              className="book-3d-cover"
            />
            <div className="book-3d-spine" />
          </div>
        </Link>
      </div>

      {/* Book Information */}
      <div className="text-center mt-3">
        <span 
          className="badge px-3 py-1 rounded-pill small mb-2"
          style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}
        >
          {book.genre}
        </span>

        <h3 className="font-sinhala-title fs-3 fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
          {lang === 'si' ? book.title_si : book.title_en}
        </h3>
        
        <p className="font-editorial fst-italic text-muted small mb-2">
          {lang === 'si' ? book.title_en : book.title_si} • {book.author}
        </p>

        <p className="small text-muted mb-4" style={{ lineHeight: '1.6', minHeight: '60px' }}>
          {lang === 'si' ? book.description_si : book.description_en}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-column gap-2 mt-auto">
        
        {/* Switch Theme Button */}
        <button
          onClick={handleApplyTheme}
          className="btn btn-sm py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
          style={{
            border: `1.5px solid ${book.theme.primary}`,
            color: book.theme.primary,
            background: isCurrentTheme ? 'rgba(var(--color-primary-rgb), 0.08)' : 'transparent',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          <span 
            className="rounded-circle d-inline-block" 
            style={{ width: '10px', height: '10px', backgroundColor: book.theme.primary }} 
          />
          <span>{lang === 'si' ? `${book.title_si} තේමාවට මාරු වන්න` : `Switch to ${book.title_en} World`}</span>
        </button>

        {/* View Details Link */}
        <Link
          to={`/books/${book.slug}`}
          className="btn btn-literary btn-sm py-2 rounded-pill justify-content-center"
        >
          <BookOpen size={16} />
          <span>{t('books.explore_book')}</span>
          <ArrowRight size={16} />
        </Link>
      </div>

    </div>
  );
};
