import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook, getBlogs, sendContactMessage, getMediaUrl } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft, Star, BookOpen, Quote, Sparkles, ShoppingBag,
  Calendar, Layers, FileText, CheckCircle2, Send, X, Palette
} from 'lucide-react';

export const BookDetailPage = () => {
  const { slug } = useParams();
  const { setTheme, currentTheme } = useTheme();
  const { t, lang } = useLanguage();

  const [book, setBook] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryAddress, setInquiryAddress] = useState('');

  // Fetch book and related blogs
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([getBook(slug), getBlogs()])
      .then(([bookData, blogsData]) => {
        if (isMounted) {
          setBook(bookData);
          setBlogs(Array.isArray(blogsData) ? blogsData : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load book detail:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Inherit the book's specific color theme!
  useEffect(() => {
    if (book?.theme_id) {
      setTheme(book.theme_id);
    }
  }, [book, setTheme]);

  // Find related blog entries
  const relatedBlogs = blogs.filter((b) =>
    b.tags?.some((tag) => tag.toLowerCase().includes(slug?.replace('-', ' ') || '')) ||
    b.tags?.some((tag) => tag.toLowerCase().includes(book?.title_en?.toLowerCase() || ''))
  );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmittingOrder(true);
    setOrderError(null);
    try {
      await sendContactMessage({
        name: inquiryName,
        email: inquiryEmail,
        subject: `Book Order Inquiry: ${book?.title_en || 'Book Order'}`,
        message: `Phone: ${inquiryPhone}\nDelivery Address: ${inquiryAddress}\nItem: ${book?.title_en} (LKR ${book?.price_lkr || 0})`
      });
      setOrderSubmitted(true);
    } catch (err) {
      console.error('Failed to submit book order inquiry:', err);
      setOrderError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading book details...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="py-5 text-center container">
        <h2 className="font-editorial">Book Not Found</h2>
        <Link to="/books" className="btn btn-literary mt-3">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="book-detail-wrapper py-5">
      <div className="container">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/books"
            className="text-decoration-none d-inline-flex align-items-center gap-2 small fw-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} />
            <span>{t('books.back_to_books')}</span>
          </Link>
        </div>

        {/* Hero Book Showcase Block */}
        <div className="card-literary p-4 p-md-5 mb-5">
          <div className="row g-5 align-items-center">
            {/* Left: 3D Book Cover & Purchase Action */}
            <div className="col-lg-5 text-center">
              <div className="book-card-3d-wrap my-3">
                <div className="book-card-3d" style={{ width: 'min(280px, 68vw)', height: 'auto', aspectRatio: '2 / 3' }}>
                  <img
                    src={getMediaUrl(book.cover_image)}
                    alt={book.title_en}
                    className="book-cover-image"
                  />
                  <div className="book-spine-depth" />
                  <div className="book-page-thickness" />
                </div>
              </div>



            </div>

            {/* Right: Title, Metadata, Synopsis */}
            <div className="col-lg-7">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span
                  className="badge px-3 py-1 rounded-pill small font-monospace"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  {book.genre}
                </span>
                <span className="badge px-3 py-1 rounded-pill small border text-muted font-monospace">
                  ISBN {book.isbn}
                </span>
              </div>

              <h1 className="font-sinhala-title display-4 fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                {lang === 'si' ? book.title_si : book.title_en}
              </h1>

              <h2 className="font-editorial fs-3 fst-italic text-muted mb-3">
                {lang === 'si' ? book.title_en : book.title_si}
              </h2>

              <p className="font-sinhala-title fs-5 mb-4 text-muted" style={{ lineHeight: '1.8' }}>
                {lang === 'si' ? book.subtitle_si : book.subtitle_en}
              </p>

              {/* Synopsis Prose */}
              <div className="mb-4">
                <h5 className="font-editorial fw-bold small text-uppercase text-muted" style={{ letterSpacing: '0.08em' }}>
                  {t('books.synopsis')}
                </h5>
                <p className="font-sinhala-title fs-6" style={{ lineHeight: '1.9', color: 'var(--color-text)' }}>
                  {lang === 'si' ? book.full_description_si : book.full_description_en}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="row g-3 py-3 border-top border-bottom mb-4" style={{ borderColor: 'var(--color-card-border)' }}>
                <div className="col-6 col-sm-3">
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <span className="small text-muted d-block">{t('books.pages')}</span>
                      <span className="fw-bold">{book.pages}</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <span className="small text-muted d-block">{t('books.year')}</span>
                      <span className="fw-bold">{book.published_year}</span>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <span className="small text-muted d-block">{t('books.publisher')}</span>
                      <span className="fw-bold small">{book.publisher}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h6 className="font-editorial fw-bold small text-uppercase text-muted mb-2">
                  Key Literary Aspects
                </h6>
                <div className="d-flex flex-column gap-2">
                  {book.highlights?.map((h, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 small">
                      <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Section */}
        {book.quotes?.length > 0 && (
          <div className="mb-5">
            <h3 className="font-editorial fs-4 fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('books.quotes_heading')}
            </h3>
            <div className="row g-4">
              {book.quotes.map((q, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="card-literary p-4 h-100">
                    <Quote size={28} className="opacity-25 mb-2" style={{ color: 'var(--color-primary)' }} />
                    <p className="font-sinhala-title fs-5 mb-2" style={{ lineHeight: '1.8' }}>
                      "{lang === 'si' ? q.quote_si : q.quote_en}"
                    </p>
                    <span className="small text-muted font-monospace">{q.context}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reader Reviews */}
        {book.reviews?.length > 0 && (
          <div className="mb-5">
            <h3 className="font-editorial fs-4 fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('books.reader_reviews')}
            </h3>
            <div className="row g-4">
              {book.reviews.map((rev, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="card-literary p-4 h-100">
                    <div className="d-flex gap-1 mb-2 text-warning">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="small text-muted mb-3" style={{ lineHeight: '1.8' }}>
                      "{lang === 'si' ? rev.comment_si : rev.comment_en}"
                    </p>
                    <span className="fw-bold small font-editorial" style={{ color: 'var(--color-primary)' }}>
                      — {rev.reviewer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ORDER / INQUIRY MODAL                                         */}
      {/* ============================================================== */}
      {orderModalOpen && (
        <div
          className="book-reading-backdrop animate-fade-in"
          onClick={() => { setOrderModalOpen(false); setOrderSubmitted(false); }}
        >
          <div
            className="book-reading-page position-relative p-4 p-md-5"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { setOrderModalOpen(false); setOrderSubmitted(false); }}
              className="book-reading-close-btn"
            >
              <X size={24} />
            </button>

            {orderSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle2 size={54} className="text-success mb-3" />
                <h3 className="font-editorial fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                  Inquiry Received
                </h3>
                <p className="small text-muted mb-4">
                  Thank you! Your order inquiry for <strong>{book.title_en}</strong> has been noted. We will contact you soon.
                </p>
                <button
                  onClick={() => { setOrderModalOpen(false); setOrderSubmitted(false); }}
                  className="btn btn-literary w-100 py-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-editorial fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                  {t('books.order_inquiry')}
                </h3>
                <p className="small text-muted mb-4">
                  Reserve a copy of <strong>{book.title_en}</strong> (LKR {book.price_lkr})
                </p>

                <form onSubmit={handleOrderSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Your Name</label>
                    <input
                      type="text"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input
                      type="email"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <input
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="form-control"
                      placeholder="+94 7X XXX XXXX"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted">Delivery Address</label>
                    <textarea
                      rows={2}
                      value={inquiryAddress}
                      onChange={(e) => setInquiryAddress(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>

                  {orderError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {orderError}
                    </div>
                  )}

                  <button type="submit" className="btn btn-literary w-100 py-3" disabled={submittingOrder}>
                    <Send size={18} />
                    <span>{submittingOrder ? 'Submitting...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
