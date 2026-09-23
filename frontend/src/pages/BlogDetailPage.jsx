import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlog, getBlogs, getMediaUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { BlogGallery } from '../components/blog/BlogGallery';
import { 
  ArrowLeft, Clock, Calendar, Share2, Tag, Copy, Check, BookOpen, Feather, ArrowRight 
} from 'lucide-react';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([getBlog(slug), getBlogs()])
      .then(([postData, allPosts]) => {
        if (isMounted) {
          setBlog(postData);
          if (Array.isArray(allPosts)) {
            setRelatedBlogs(allPosts.filter((b) => b.id !== postData?.id && b.slug !== slug).slice(0, 2));
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load blog detail:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-5 text-center container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading journal reflection...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-5 text-center container">
        <h2 className="font-editorial">Post Not Found</h2>
        <Link to="/blog" className="btn btn-literary mt-3">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-wrapper py-5">
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/blog"
            className="text-decoration-none d-inline-flex align-items-center gap-2 small fw-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Journal Notes</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="text-center mb-5">
          <div className="d-flex justify-content-center align-items-center gap-3 font-monospace small text-muted mb-3">
            <span
              className="badge px-3 py-1 rounded-pill"
              style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}
            >
              {lang === 'si' ? blog.category_si : blog.category}
            </span>
            <span>{blog.date}</span>
            <span>•</span>
            <span className="d-flex align-items-center gap-1">
              <Clock size={13} />
              {blog.reading_time}
            </span>
          </div>

          <h1 className="font-editorial display-5 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
            {lang === 'si' ? blog.title_si : blog.title_en}
          </h1>

          <p className="font-sinhala-title text-muted fs-5">
            By Suchetha Kapuarachchi (Kim Suu Ah)
          </p>
        </div>

        {/* Featured Image */}
        <div className="rounded-4 overflow-hidden shadow-lg mb-5" style={{ maxHeight: '450px' }}>
          <img
            src={getMediaUrl(blog.featured_image)}
            alt={blog.title_en}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Article Body Typography */}
        <div className="card-literary p-4 p-md-5 mb-5">
          <div
            className="font-sinhala-title fs-5"
            style={{
              lineHeight: '2.1',
              whiteSpace: 'pre-line',
              color: 'var(--color-text)'
            }}
          >
            {lang === 'si' ? blog.content_si : blog.content_en}
          </div>

          {/* Article Mini Gallery */}
          <BlogGallery images={blog.gallery} />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="d-flex flex-wrap gap-2 pt-4 mt-5 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="badge px-3 py-1 rounded-pill font-monospace"
                  style={{
                    background: 'rgba(var(--color-primary-rgb), 0.08)',
                    color: 'var(--color-primary)',
                    fontSize: '0.8rem'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Article Bar */}
          <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
            <span className="small text-muted font-sans-ui fw-semibold">Share this reflection</span>
            <button
              onClick={handleCopyLink}
              className="btn btn-sm btn-literary-outline py-1 px-3"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-5">
            <h3 className="font-editorial fs-4 fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>
              Related Reflections
            </h3>
            <div className="row g-4">
              {relatedBlogs.map((rel) => (
                <div key={rel.id} className="col-md-6">
                  <div className="card-literary p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <span className="small text-muted font-monospace d-block mb-1">{rel.date}</span>
                      <h5 className="font-editorial fw-bold fs-6 mb-2" style={{ color: 'var(--color-primary)' }}>
                        {lang === 'si' ? rel.title_si : rel.title_en}
                      </h5>
                    </div>
                    <Link
                      to={`/blog/${rel.slug}`}
                      className="btn btn-sm btn-literary-outline mt-3 justify-content-center"
                    >
                      <span>Read Note</span>
                      <ArrowRight size={14} />
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
