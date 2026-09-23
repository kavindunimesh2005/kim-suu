import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getBooks } from '../../services/api';
import { BookCard } from '../books/BookCard';
import { BookThemeSwitcher } from '../books/BookThemeSwitcher';

export const BookShowcase = () => {
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error('Failed to load books in BookShowcase:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="book-showcase" className="book-showcase-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-editorial-header">
          <p className="section-label">
            {t('books.section_label')}
          </p>
          <h2 className="section-title">
            {t('books.section_title')}
          </h2>
          <p className="section-description">
            {t('books.section_subtitle')}
          </p>
        </div>

        {/* Real-time Atmospheric Theme Palette Switcher */}
        <BookThemeSwitcher />

        {/* 3D Realistic Book Cards Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading books...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4 g-lg-5 justify-content-center">
            {books.map((book) => (
              <div key={book.id} className="col-md-6 col-lg-5">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
