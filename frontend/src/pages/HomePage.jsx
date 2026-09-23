import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getBlogs, getGallery, getMediaUrl } from '../services/api';
import { Hero } from '../components/home/Hero';
import { BookShowcase } from '../components/home/BookShowcase';
import { AboutPreview } from '../components/home/AboutPreview';
import { Lightbox } from '../components/gallery/Lightbox';
import { ArrowRight, BookOpen, Clock, Send, Eye } from 'lucide-react';

export const HomePage = () => {
  const { t, lang } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [selectedLightboxItem, setSelectedLightboxItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getBlogs(), getGallery()])
      .then(([blogsData, galleryData]) => {
        if (isMounted) {
          setBlogs(Array.isArray(blogsData) ? blogsData : []);
          setGallery(Array.isArray(galleryData) ? galleryData : []);
        }
      })
      .catch((err) => {
        console.error('Failed to load home page data:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="homepage-wrapper">
      {/* 1. Cinematic Editorial Hero with Layered Portrait */}
      <Hero />

      {/* 2. 3D Book Showcase with Dynamic Theme Switching */}
      <BookShowcase />

      {/* 3. Author Editorial Magazine Profile */}
      <AboutPreview />


      {/* 5. Editorial Blog Section */}
      <section className="py-6 position-relative" style={{ background: 'rgba(var(--color-primary-rgb), 0.02)' }}>
        <div className="container">
          <div className="section-editorial-header">
            <p className="section-label">{t('blog.section_label')}</p>
            <h2 className="section-title">{t('blog.title')}</h2>
            <p className="section-description">{t('blog.subtitle')}</p>
          </div>

          <div className="row g-4 mb-5">
            {blogs.slice(0, 3).map((post) => (
              <div key={post.id} className="col-md-6 col-lg-4">
                <div className="card-literary h-100 d-flex flex-column justify-content-between p-3 p-md-4">
                  <div>
                    {/* Featured Image */}
                    <div className="rounded-3 overflow-hidden mb-3 position-relative" style={{ height: '200px' }}>
                      <img
                        src={getMediaUrl(post.featured_image)}
                        alt={post.title_en}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      <span
                        className="position-absolute top-0 start-0 m-2 badge px-3 py-1 rounded-pill small font-monospace"
                        style={{ background: 'var(--color-primary)', color: '#FFFFFF' }}
                      >
                        {lang === 'si' ? post.category_si : post.category}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 small text-muted font-monospace mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="d-flex align-items-center gap-1">
                        <Clock size={12} />
                        {post.reading_time}
                      </span>
                    </div>

                    <h4 className="font-editorial fw-bold fs-5 mb-2" style={{ color: 'var(--color-primary)', lineHeight: '1.4' }}>
                      {lang === 'si' ? post.title_si : post.title_en}
                    </h4>

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

          <div className="text-center">
            <Link to="/blog" className="btn btn-literary">
              <span>View All Journal Reflections</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Visual Masonry Gallery Preview */}
      <section className="py-6 position-relative">
        <div className="container">
          <div className="section-editorial-header">
            <p className="section-label">{t('gallery.section_label')}</p>
            <h2 className="section-title">{t('gallery.title')}</h2>
            <p className="section-description">{t('gallery.subtitle')}</p>
          </div>

          <div className="gallery-masonry-grid mb-5">
            {gallery.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="gallery-card-brick"
                onClick={() => setSelectedLightboxItem(item)}
              >
                <img src={getMediaUrl(item.image)} alt={item.title_en} loading="lazy" />
                <div className="gallery-overlay-caption">
                  <span className="badge align-self-start mb-1 px-2 py-1 rounded font-monospace small" style={{ background: 'var(--color-accent)', color: '#241C1E' }}>
                    {lang === 'si' ? item.category_si : item.category}
                  </span>
                  <h6 className="font-editorial fw-bold mb-1 fs-6">
                    {lang === 'si' ? item.title_si : item.title_en}
                  </h6>
                  <p className="small mb-0 opacity-75 d-flex align-items-center gap-1">
                    <Eye size={12} />
                    <span>{t('gallery.view_full')}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery" className="btn btn-literary">
              <span>Explore Complete Gallery</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Literary Call to Action: Send a Letter */}
      <section className="py-5 position-relative mb-5">
        <div className="container">
          <div
            className="p-5 rounded-4 text-center border position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-bg-alt) 0%, rgba(255,255,255,0.9) 100%)',
              borderColor: 'var(--color-card-border)'
            }}
          >
            <div className="position-relative" style={{ zIndex: 2 }}>
              <img
                src="/assets/daisy-flower.png"
                alt="Daisy"
                style={{ width: '48px', height: '48px', marginBottom: '16px' }}
              />
              <h2 className="font-editorial display-6 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                {t('contact.title')}
              </h2>
              <p className="font-sinhala-title fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: '600px', lineHeight: '1.8' }}>
                {t('contact.subtitle')}
              </p>
              <Link to="/contact" className="btn btn-literary px-5 py-3 fs-5">
                <Send size={20} />
                <span>{t('contact.send_btn')}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox for Gallery Preview */}
      <Lightbox
        item={selectedLightboxItem}
        onClose={() => setSelectedLightboxItem(null)}
      />
    </div>
  );
};
