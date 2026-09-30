import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, Star, BookOpen, Quote, Sparkles, ShoppingBag, 
  Calendar, Layers, FileText, CheckCircle2, Send, X 
} from 'lucide-react';

export const BookDetailPage = () => {
  const { slug } = useParams();
  const { setTheme } = useTheme();
  const { t, lang } = useLanguage();

  const [book, setBook] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryAddress, setInquiryAddress] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await api.getBook(slug);
        setBook(bookData);
        
        // CRITICAL REQUIREMENT: Inherit the book's specific color theme!
        if (bookData?.theme_id) {
          setTheme(bookData.theme_id);
        }

        // Fetch related blogs
        const allBlogs = await api.getBlogs();
        const related = (allBlogs || []).filter(b => 
          b.tags?.some(tag => tag.toLowerCase().includes(slug.replace('-', ' '))) ||
          b.tags?.some(tag => tag.toLowerCase().includes(bookData?.title_en?.toLowerCase()))
        );
        setBlogs(related.length ? related : (allBlogs || []).slice(0, 2));

      } catch (err) {
        console.error("Error fetching book detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [slug]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.sendContactMessage({
        name: inquiryName,
        email: inquiryEmail,
        subject: `Book Order Inquiry: ${book?.title_en} (${inquiryPhone})`,
        message: `Book: ${book?.title_en} (${book?.title_si})\nAddress: ${inquiryAddress}\nPhone: ${inquiryPhone}`
      });
      setOrderSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
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
              <div className="book-3d-wrap my-3">
                <div className="book-3d" style={{ width: '280px', height: '410px' }}>
                  <img 
                    src={book.cover_image} 
                    alt={book.title_en} 
                    className="book-3d-cover"
                  />
                  <div className="book-3d-spine" />
                </div>
              </div>

              {/* Order / Inquiry Button */}
              <div className="mt-4">
                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="btn btn-literary w-100 py-3 rounded-pill fs-6 justify-content-center shadow"
                >
                  <ShoppingBag size={18} />
                  <span>{t('books.order_inquiry')} • LKR {book.price_lkr}</span>
                </button>
              </div>
            </div>

            {/* Right: Title, Metadata, Synopsis */}
            <div className="col-lg-7">
              
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span 
                  className="badge px-3 py-1 rounded-pill small"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  {book.genre}
                </span>
                <span className="badge px-3 py-1 rounded-pill small border text-muted">
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
                <div className="col-6 col-sm-6">
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
                {book.highlights?.map((hl, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2 small font-sinhala-title mb-2 text-muted">
                    <CheckCircle2 size={16} style={{ color: 'var(--color-primary)' }} />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Quotes Section */}
        {book.quotes && book.quotes.length > 0 && (
          <div className="my-5 py-4">
            <div className="text-center mb-4">
              <h3 className="font-editorial fw-bold fs-2" style={{ color: 'var(--color-primary)' }}>
                {t('books.quotes_heading')}
              </h3>
            </div>
            <div className="row g-4 justify-content-center">
              {book.quotes.map((q, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="card-literary p-4 h-100">
                    <Quote size={28} className="opacity-25 mb-2" style={{ color: 'var(--color-primary)' }} />
                    <p className="font-sinhala-title fs-5 fst-italic mb-3" style={{ lineHeight: '1.8' }}>
                      "{lang === 'si' ? q.quote_si : q.quote_en}"
                    </p>
                    <span className="small text-muted font-monospace">{q.context}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book Visual Gallery Assets */}
        {book.gallery_assets && book.gallery_assets.length > 0 && (
          <div className="my-5 py-4 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
            <div className="text-center mb-4">
              <h3 className="font-editorial fw-bold fs-2" style={{ color: 'var(--color-primary)' }}>
                {t('books.gallery_heading')}
              </h3>
            </div>
            <div className="row g-4 justify-content-center">
              {book.gallery_assets.map((asset, idx) => (
                <div key={idx} className="col-md-4 col-sm-6 text-center">
                  <div className="card-literary p-3 h-100 d-flex flex-column align-items-center justify-content-between">
                    <img 
                      src={asset.image} 
                      alt={asset.caption_en} 
                      className="img-fluid rounded-3 mb-2"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                    <p className="font-sinhala-title small text-muted mb-0 mt-2">
                      {lang === 'si' ? asset.caption_si : asset.caption_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reader Reviews */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="my-5 py-4 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
            <div className="text-center mb-4">
              <h3 className="font-editorial fw-bold fs-2" style={{ color: 'var(--color-primary)' }}>
                {t('books.reader_reviews')}
              </h3>
            </div>
            <div className="row g-4 justify-content-center">
              {book.reviews.map((rev, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="card-literary p-4 h-100">
                    <div className="d-flex align-items-center gap-1 mb-2 text-warning">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="font-sinhala-title fst-italic mb-3" style={{ lineHeight: '1.7' }}>
                      "{lang === 'si' ? rev.comment_si : rev.comment_en}"
                    </p>
                    <span className="fw-bold small text-muted font-sinhala-title">
                      — {rev.reviewer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Blog Posts */}
        {blogs && blogs.length > 0 && (
          <div className="my-5 py-4 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
            <h3 className="font-editorial fw-bold fs-3 mb-4" style={{ color: 'var(--color-primary)' }}>
              Related Reflections & Essays
            </h3>
            <div className="row g-4">
              {blogs.map((b) => (
                <div key={b.id} className="col-md-6">
                  <div className="card-literary p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge px-2 py-1 rounded small mb-2" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
                        {b.category}
                      </span>
                      <h5 className="font-sinhala-title fw-bold mb-2">
                        {lang === 'si' ? b.title_si : b.title_en}
                      </h5>
                      <p className="small text-muted mb-3">
                        {lang === 'si' ? b.content_si.slice(0, 120) + '...' : b.content_en.slice(0, 120) + '...'}
                      </p>
                    </div>
                    <Link to={`/blog/${b.slug}`} className="btn btn-literary-outline btn-sm rounded-pill w-fit">
                      Read Essay &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* PURCHASE / INQUIRY MODAL                                       */}
      {/* ============================================================== */}
      {orderModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(0,0,0,0.65)', zIndex: 9999, backdropFilter: 'blur(5px)' }}
        >
          <div 
            className="card-literary p-4 p-md-5 max-w-lg w-100 position-relative animate-fade-in"
            style={{ maxWidth: '520px', background: '#fff' }}
          >
            <button
              onClick={() => {
                setOrderModalOpen(false);
                setOrderSubmitted(false);
              }}
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-light rounded-circle"
            >
              <X size={18} />
            </button>

            {!orderSubmitted ? (
              <>
                <div className="text-center mb-4">
                  <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '40px', height: '40px' }} />
                  <h4 className="font-editorial fw-bold mt-2 mb-1" style={{ color: 'var(--color-primary)' }}>
                    Book Order / Inquiry
                  </h4>
                  <p className="font-sinhala-title text-muted small mb-0">
                    {book.title_si} ({book.title_en}) • LKR {book.price_lkr}
                  </p>
                </div>

                <form onSubmit={handleOrderSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={inquiryName} 
                      onChange={e => setInquiryName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={inquiryEmail} 
                      onChange={e => setInquiryEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Contact Phone (WhatsApp)</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={inquiryPhone} 
                      onChange={e => setInquiryPhone(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Delivery Address / Notes</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={inquiryAddress} 
                      onChange={e => setInquiryAddress(e.target.value)} 
                      required 
                    />
                  </div>

                  <button type="submit" className="btn btn-literary w-100 py-3 rounded-pill justify-content-center">
                    <Send size={16} />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="text-success mb-3" />
                <h4 className="font-editorial fw-bold mb-2">Inquiry Received</h4>
                <p className="font-sinhala-title text-muted mb-4 small">
                  {lang === 'si'
                    ? "ඔබගේ පොත් ඇණවුම් විමසීම සාර්ථකව ලැබිණි. අපගේ කණ්ඩායම ඔබ හා සම්බන්ධ වනු ඇත."
                    : "Thank you! Your order inquiry has been received. Our distribution team will contact you shortly."}
                </p>
                <button 
                  onClick={() => setOrderModalOpen(false)} 
                  className="btn btn-literary rounded-pill px-4"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
