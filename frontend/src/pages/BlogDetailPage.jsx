import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, Clock, Calendar, Share2, Tag, Copy, Check, 
  Image as ImageIcon, Maximize2, X, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api.getBlog(slug);
        setBlog(data);

        // Fetch related blogs
        const allBlogs = await api.getBlogs();
        const related = (allBlogs || []).filter(b => b.id !== data?.id && b.category === data?.category);
        setRelatedBlogs(related.length ? related : (allBlogs || []).filter(b => b.id !== data?.id).slice(0, 2));

      } catch (err) {
        console.error("Error loading blog details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null || !blog?.gallery?.length) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % blog.gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + blog.gallery.length) % blog.gallery.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, blog]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog?.title_en || 'Literary Essay');
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-5 text-center container">
        <h2 className="font-editorial">Article Not Found</h2>
        <Link to="/blog" className="btn btn-literary mt-3">Back to Journal</Link>
      </div>
    );
  }

  const galleryItems = blog.gallery && blog.gallery.length > 0 ? blog.gallery : [
    { image: blog.featured_image, caption_si: blog.title_si, caption_en: blog.title_en }
  ];

  return (
    <div className="blog-detail-wrapper py-5">
      <div className="container" style={{ maxWidth: '860px' }}>
        
        {/* Back Link */}
        <div className="mb-4">
          <Link 
            to="/blog" 
            className="text-decoration-none d-inline-flex align-items-center gap-2 small fw-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} />
            <span>{lang === 'si' ? 'සටහන් වෙත ආපසු' : 'Back to Journal'}</span>
          </Link>
        </div>

        {/* Article Meta */}
        <div className="text-center mb-4">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            {blog.category}
          </span>
          <h1 className="font-sinhala-title display-5 fw-bold mb-3" style={{ color: 'var(--color-primary)', lineHeight: '1.4' }}>
            {lang === 'si' ? blog.title_si : blog.title_en}
          </h1>

          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 text-muted small font-monospace">
            <span>By {blog.author}</span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <Calendar size={14} />
              {blog.date}
            </span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <Clock size={14} />
              {blog.reading_time}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="card-literary mb-5 overflow-hidden shadow-sm position-relative">
          <img 
            src={blog.featured_image} 
            alt={blog.title_en} 
            style={{ width: '100%', maxHeight: '440px', objectFit: 'cover' }}
          />
        </div>

        {/* Article Prose Content */}
        <article 
          className="font-sinhala-title fs-5 mb-5 px-md-3" 
          style={{ lineHeight: '2.1', whiteSpace: 'pre-line', color: 'var(--color-text)' }}
        >
          {lang === 'si' ? blog.content_si : blog.content_en}
        </article>

        {/* ============================================================== */}
        {/* MINI GALLERY SECTION                                           */}
        {/* ============================================================== */}
        {galleryItems.length > 0 && (
          <section className="mini-gallery-section my-5 p-4 p-md-5 card-literary rounded-4 shadow-sm" style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-card-border)' }}>
            
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--color-card-border)' }}>
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded-circle bg-primary bg-opacity-10" style={{ color: 'var(--color-primary)' }}>
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="font-editorial fs-4 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                    {t('blog.gallery_title')}
                  </h3>
                  <p className="font-sinhala-title text-muted small mb-0">
                    {t('blog.gallery_subtitle')}
                  </p>
                </div>
              </div>
              <span className="badge px-3 py-1 rounded-pill small bg-white text-muted border align-self-start align-self-sm-center">
                {galleryItems.length} {lang === 'si' ? 'ඡායාරූප' : 'Photos'}
              </span>
            </div>

            {/* Grid of Gallery Thumbnails */}
            <div className="row g-3">
              {galleryItems.map((item, index) => (
                <div key={index} className="col-6 col-md-3">
                  <div 
                    onClick={() => setLightboxIndex(index)}
                    className="position-relative rounded-3 overflow-hidden shadow-sm gallery-thumb-card"
                    style={{ 
                      aspectRatio: '1 / 1', 
                      cursor: 'pointer',
                      border: '1.5px solid rgba(0,0,0,0.06)',
                      background: '#fff'
                    }}
                  >
                    <img 
                      src={item.image} 
                      alt={item.caption_en || `Gallery ${index + 1}`}
                      className="w-100 h-100 object-fit-cover transition-transform"
                      style={{ transition: 'transform 0.4s ease' }}
                    />
                    
                    {/* Hover Overlay */}
                    <div 
                      className="position-absolute inset-0 w-100 h-100 d-flex flex-column justify-content-between p-2 text-white opacity-0 hover-opacity-100 transition-opacity"
                      style={{ 
                        top: 0, 
                        left: 0, 
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)',
                        transition: 'opacity 0.25s ease'
                      }}
                    >
                      <div className="text-end">
                        <span className="badge bg-black bg-opacity-50 rounded-circle p-1">
                          <Maximize2 size={12} />
                        </span>
                      </div>
                      <p className="font-sinhala-title small mb-0 text-truncate" style={{ fontSize: '0.72rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                        {lang === 'si' ? item.caption_si : item.caption_en}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>
        )}

        {/* Tags & Social Share Bar */}
        <div className="p-4 card-literary mb-5 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          
          {/* Tags */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <Tag size={16} className="text-muted" />
            {blog.tags?.map((tag, idx) => (
              <span key={idx} className="badge bg-light text-dark border small px-2 py-1">
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Share */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-bold me-1">{t('blog.share_article')}:</span>
            <button 
              onClick={() => handleShare('twitter')} 
              className="btn btn-sm btn-outline-secondary rounded-circle p-2"
              title="Share on Twitter"
            >
              <i className="bi bi-twitter-x"></i>
            </button>
            <button 
              onClick={() => handleShare('facebook')} 
              className="btn btn-sm btn-outline-secondary rounded-circle p-2"
              title="Share on Facebook"
            >
              <i className="bi bi-facebook"></i>
            </button>
            <button 
              onClick={handleCopyLink} 
              className="btn btn-sm btn-outline-secondary rounded-circle p-2"
              title="Copy Link"
            >
              {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
            </button>
          </div>

        </div>

        {/* Author Bio Widget */}
        <div className="card-literary p-4 p-md-5 mb-5 d-flex flex-column flex-sm-row align-items-center gap-4" style={{ background: 'var(--color-bg-alt)' }}>
          <img 
            src="/assets/author-suchetha.jpg" 
            alt="Suchetha Kapuarachchi" 
            className="rounded-circle shadow-sm"
            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
          />
          <div>
            <h5 className="font-editorial fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>
              Suchetha Kapuarachchi (Kim Suu Ah)
            </h5>
            <p className="font-sinhala-title text-muted small mb-2">
              {lang === 'si'
                ? "ශ්‍රී ලාංකීය ලේඛිකාවක වන ඇය 'හුළු අත්ත' සහ 'අරුංගල්' නවකතා ද්විත්වයේ කතුවරියයි."
                : "Renowned Sri Lankan novelist and author of the celebrated works 'Hulu Aththa' and 'Arungal'."}
            </p>
            <Link to="/about" className="small fw-bold text-decoration-none" style={{ color: 'var(--color-primary)' }}>
              {lang === 'si' ? 'කතුවරියගේ ජීවන තොරතුරු කියවන්න →' : 'Read Author Biography →'}
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div className="pt-4 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
            <h4 className="font-editorial fw-bold fs-3 mb-4" style={{ color: 'var(--color-primary)' }}>
              {t('blog.related_posts')}
            </h4>
            <div className="row g-4">
              {relatedBlogs.map((b) => (
                <div key={b.id} className="col-sm-6">
                  <div className="card-literary h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge px-2 py-1 rounded small mb-2" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
                        {b.category}
                      </span>
                      <h5 className="font-sinhala-title fw-bold fs-6 mb-2">
                        {lang === 'si' ? b.title_si : b.title_en}
                      </h5>
                    </div>
                    <Link to={`/blog/${b.slug}`} className="btn btn-sm btn-literary-outline rounded-pill w-fit mt-3">
                      {lang === 'si' ? 'සටහන කියවන්න →' : 'Read Essay →'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN LIGHTBOX MODAL                                      */}
      {/* ============================================================== */}
      {lightboxIndex !== null && galleryItems[lightboxIndex] && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
          style={{ 
            backgroundColor: 'rgba(15, 10, 12, 0.94)', 
            zIndex: 9999,
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setLightboxIndex(null)}
            className="position-absolute top-0 end-0 m-3 m-md-4 btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px', zIndex: 10001 }}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          {/* Previous Button */}
          {galleryItems.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
              }}
              className="position-absolute start-0 ms-2 ms-md-4 btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '46px', height: '46px', zIndex: 10001 }}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          {/* Main Modal Image & Caption Content */}
          <div 
            className="text-center position-relative" 
            style={{ maxWidth: '90vw', maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={galleryItems[lightboxIndex].image} 
              alt={galleryItems[lightboxIndex].caption_en || 'Visual detail'} 
              className="img-fluid rounded-3 shadow-2xl"
              style={{ 
                maxHeight: '70vh', 
                maxWidth: '100%', 
                objectFit: 'contain',
                border: '1px solid rgba(255,255,255,0.1)' 
              }}
            />

            {/* Caption & Counter */}
            <div className="mt-3 text-white px-3">
              <h5 className="font-sinhala-title mb-1 fw-bold fs-5">
                {lang === 'si' ? galleryItems[lightboxIndex].caption_si : galleryItems[lightboxIndex].caption_en}
              </h5>
              <span className="small text-muted font-monospace">
                {lightboxIndex + 1} / {galleryItems.length}
              </span>
            </div>
          </div>

          {/* Next Button */}
          {galleryItems.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % galleryItems.length);
              }}
              className="position-absolute end-0 me-2 me-md-4 btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '46px', height: '46px', zIndex: 10001 }}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          )}

        </div>
      )}

    </div>
  );
};
