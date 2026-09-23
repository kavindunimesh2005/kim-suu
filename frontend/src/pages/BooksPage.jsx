import React, { useState, useEffect } from 'react';
import { getBooks } from '../services/api';
import { BookCard } from '../components/books/BookCard';
import { BookThemeSwitcher } from '../components/books/BookThemeSwitcher';
import { useLanguage } from '../context/LanguageContext';
import { BookMarked, Sparkles } from 'lucide-react';

export const BooksPage = () => {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getBooks()
      .then((data) => {
        if (isMounted) {
          setBooks(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load books:', err);
        if (isMounted) {
          setError(err.message || 'Unable to load books');
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="books-page-wrapper py-5">
      <div className="container">
        {/* Header */}
        <div className="section-editorial-header">
          <p className="section-label">
            {t('books.section_label')}
          </p>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('books.section_title')}
          </h1>
          <p className="section-description">
            {t('books.section_subtitle')}
          </p>
        </div>

        {/* Dynamic Theme Atmospheric Switcher */}
        <BookThemeSwitcher />

        {/* 3D Realistic Books Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading books...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-muted">
            <p>Unable to load books. Please try refreshing.</p>
          </div>
        ) : (
          <div className="row g-5 justify-content-center">
            {books.map((book) => (
              <div key={book.id} className="col-lg-5 col-md-6">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
