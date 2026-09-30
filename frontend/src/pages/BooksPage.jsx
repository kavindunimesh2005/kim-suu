import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookCard3D } from '../components/books/BookCard3D';
import { useLanguage } from '../context/LanguageContext';
import { BookMarked, Sparkles } from 'lucide-react';

export const BooksPage = () => {
  const { t, lang } = useLanguage();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.getBooks();
        setBooks(data || []);
      } catch (err) {
        console.error("Error loading books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="books-page-wrapper py-5">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            Bibliothèque
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('books.section_title')}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('books.section_subtitle')}
          </p>
        </div>

        {/* 3D Book Grid */}
        <div className="row g-5 justify-content-center">
          {books.map((book) => (
            <div key={book.id} className="col-lg-5 col-md-6">
              <BookCard3D book={book} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
