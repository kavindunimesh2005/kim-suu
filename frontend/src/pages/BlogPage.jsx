import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, getMediaUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Search, Clock, Calendar, ArrowRight, Tag, Bookmark } from 'lucide-react';

export const BlogPage = () => {
  const { t, lang } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Literary Reflections', 'Cultural Heritage', 'Writing Craft'];

  useEffect(() => {
    let isMounted = true;
    getBlogs()
      .then((data) => {
        if (isMounted) {
          setBlogs(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load blogs:', err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' || b.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      b.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.title_si?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content_en?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = filteredBlogs.find((b) => b.is_featured) || filteredBlogs[0];
  const regularBlogs = filteredBlogs.filter((b) => b.id !== featuredBlog?.id);

  return (
    <div className="blog-page-wrapper py-5">
      <div className="container">
        {/* Header */}
        <div className="section-editorial-header">
          <p className="section-label">{t('blog.section_label')}</p>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('blog.title')}
          </h1>
          <p className="section-description">{t('blog.subtitle')}</p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="row g-3 justify-content-between align-items-center mb-5">
          <div className="col-md-6 col-lg-5">
            <div className="position-relative">
              <input
                type="text"
                placeholder={lang === 'si' ? "සටහන් සොයන්න..." : "Search essays & notes..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control rounded-pill ps-4 pe-5 py-2 font-sans-ui"
                style={{
                  background: 'var(--color-card-bg)',
                  borderColor: 'var(--color-card-border)'
                }}
              />
              <Search
                size={18}
                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-7 text-md-end">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="btn btn-sm px-3 py-1 rounded-pill font-monospace"
                    style={{
                      background: isActive ? 'var(--color-primary)' : 'var(--color-card-bg)',
                      color: isActive ? '#FFFFFF' : 'var(--color-text)',
                      border: '1px solid var(--color-card-border)',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}
                  >
                    {cat === 'All' ? t('blog.all_categories') : cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Blog Highlight */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading journal entries...</span>
            </div>
          </div>
        ) : featuredBlog ? (
          <div className="card-literary p-4 p-md-5 mb-5">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="rounded-3 overflow-hidden" style={{ maxHeight: '380px' }}>
                  <img
                    src={getMediaUrl(featuredBlog.featured_image)}
                    alt={featuredBlog.title_en}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-3 small text-muted font-monospace mb-2">
                  <span
                    className="badge px-3 py-1 rounded-pill"
                    style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)' }}
                  >
                    {lang === 'si' ? featuredBlog.category_si : featuredBlog.category}
                  </span>
                  <span>{featuredBlog.date}</span>
                  <span>•</span>
                  <span>{featuredBlog.reading_time}</span>
                </div>

                <h2 className="font-editorial fw-bold display-6 mb-3" style={{ color: 'var(--color-primary)' }}>
                  {lang === 'si' ? featuredBlog.title_si : featuredBlog.title_en}
                </h2>

                <p className="font-sinhala-title fs-5 text-muted mb-4" style={{ lineHeight: '1.8' }}>
                  {lang === 'si' ? featuredBlog.excerpt_si : featuredBlog.excerpt_en}
                </p>

                <Link
                  to={`/blog/${featuredBlog.slug}`}
                  className="btn btn-literary"
                >
                  <span>{t('blog.read_article')}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {/* Regular Blog Cards Grid */}
        <div className="row g-4">
          {regularBlogs.map((post) => (
            <div key={post.id} className="col-md-6">
              <div className="card-literary p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="rounded-3 overflow-hidden mb-3" style={{ height: '220px' }}>
                    <img
                      src={getMediaUrl(post.featured_image)}
                      alt={post.title_en}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="d-flex align-items-center gap-2 small text-muted font-monospace mb-2">
                    <span
                      className="badge px-2 py-1 rounded font-monospace"
                      style={{ background: 'var(--theme-badge-bg)', color: 'var(--theme-badge-text)', fontSize: '0.75rem' }}
                    >
                      {lang === 'si' ? post.category_si : post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.reading_time}</span>
                  </div>

                  <h3 className="font-editorial fw-bold fs-4 mb-2" style={{ color: 'var(--color-primary)' }}>
                    {lang === 'si' ? post.title_si : post.title_en}
                  </h3>

                  <p className="small text-muted mb-4" style={{ lineHeight: '1.75' }}>
                    {lang === 'si' ? post.excerpt_si : post.excerpt_en}
                  </p>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="btn btn-literary-outline w-100 justify-content-center py-2"
                >
                  <span>{t('blog.read_article')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
