import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Search, Clock, Calendar, ArrowRight, Tag, Bookmark } from 'lucide-react';

export const BlogPage = () => {
  const { t, lang } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Literary Reflections', 'Cultural Heritage', 'Writing Craft'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs(
          selectedCategory === 'All' ? '' : selectedCategory,
          '',
          searchTerm
        );
        setBlogs(data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchBlogs, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const featuredBlog = blogs.find(b => b.is_featured) || blogs[0];
  const regularBlogs = blogs.filter(b => b.id !== featuredBlog?.id);

  return (
    <div className="blog-page-wrapper py-5">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            Literary Journal
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('blog.title')}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="row g-3 justify-content-between align-items-center mb-5">
          
          {/* Categories */}
          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="btn btn-sm rounded-pill px-3 py-2"
                  style={{
                    background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-card-bg)',
                    color: selectedCategory === cat ? '#fff' : 'var(--color-text)',
                    border: '1px solid var(--color-card-border)',
                    fontWeight: '600'
                  }}
                >
                  {cat === 'All' ? t('blog.all_categories') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="col-md-5 col-lg-4">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input 
                type="text" 
                placeholder={t('blog.search_placeholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-control rounded-pill ps-5 py-2"
                style={{ border: '1.5px solid var(--color-card-border)', background: 'var(--color-card-bg)' }}
              />
            </div>
          </div>

        </div>

        {/* Featured Blog Banner (if available and no active search) */}
        {!searchTerm && selectedCategory === 'All' && featuredBlog && (
          <div className="card-literary mb-5 overflow-hidden shadow-md">
            <div className="row g-0">
              <div className="col-lg-6">
                <img 
                  src={featuredBlog.featured_image} 
                  alt={featuredBlog.title_en} 
                  style={{ width: '100%', height: '100%', minHeight: '340px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge px-3 py-1 rounded-pill small" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                      Featured Article
                    </span>
                    <span className="badge px-2 py-1 rounded border text-muted small">
                      {featuredBlog.category}
                    </span>
                  </div>

                  <h2 className="font-sinhala-title fs-2 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                    {lang === 'si' ? featuredBlog.title_si : featuredBlog.title_en}
                  </h2>

                  <p className="font-sinhala-title text-muted fs-6 mb-4" style={{ lineHeight: '1.8' }}>
                    {lang === 'si' 
                      ? featuredBlog.content_si.slice(0, 200) + '...' 
                      : featuredBlog.content_en.slice(0, 200) + '...'}
                  </p>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
                  <div className="d-flex align-items-center gap-3 small text-muted font-monospace">
                    <span>{featuredBlog.date}</span>
                    <span>•</span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={14} />
                      {featuredBlog.reading_time}
                    </span>
                  </div>

                  <Link to={`/blog/${featuredBlog.slug}`} className="btn btn-literary rounded-pill px-4">
                    <span>{t('blog.read_article')}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Regular Blog Grid */}
        <div className="row g-4">
          {(!searchTerm && selectedCategory === 'All' ? regularBlogs : blogs).map((blog) => (
            <div key={blog.id} className="col-md-6 col-lg-4">
              <div className="card-literary h-100 d-flex flex-column justify-content-between overflow-hidden">
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title_en} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    className="hover-zoom"
                  />
                </div>

                <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge px-2 py-1 rounded small" style={{ background: 'rgba(var(--color-primary-rgb), 0.08)', color: 'var(--color-primary)' }}>
                        {blog.category}
                      </span>
                      <span className="small text-muted font-monospace">{blog.reading_time}</span>
                    </div>

                    <h4 className="font-sinhala-title fs-5 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                      {lang === 'si' ? blog.title_si : blog.title_en}
                    </h4>

                    <p className="font-sinhala-title text-muted small mb-3" style={{ lineHeight: '1.7' }}>
                      {lang === 'si' ? blog.content_si.slice(0, 110) + '...' : blog.content_en.slice(0, 110) + '...'}
                    </p>
                  </div>

                  <div className="pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--color-card-border)' }}>
                    <span className="small text-muted font-monospace">{blog.date}</span>
                    <Link to={`/blog/${blog.slug}`} className="btn btn-sm btn-literary-outline rounded-pill">
                      <span>{t('blog.read_article')}</span>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
