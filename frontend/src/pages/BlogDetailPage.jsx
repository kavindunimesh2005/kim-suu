import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, Clock, Calendar, Share2, Tag, Copy, Check, BookOpen, Feather 
} from 'lucide-react';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
            <span>Back to Journal</span>
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
        <div className="card-literary mb-5 overflow-hidden shadow">
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
              Read Author Biography &rarr;
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
                      Read Essay &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
