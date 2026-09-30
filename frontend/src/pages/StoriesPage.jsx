import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Feather, BookOpen, X, Sparkles, Calendar, Tag } from 'lucide-react';

export const StoriesPage = () => {
  const { t, lang } = useLanguage();
  const [stories, setStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeStory, setActiveStory] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Stories', 'Poems', 'Quotes', 'Excerpts', 'Literary Notes'];

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await api.getStories(selectedCategory === 'All' ? '' : selectedCategory);
        setStories(data || []);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [selectedCategory]);

  return (
    <div className="stories-page-wrapper py-5">
      <div className="container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span 
            className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
            style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
          >
            Anthology
          </span>
          <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {t('stories.title')}
          </h1>
          <p className="font-sinhala-title fs-5 text-muted">
            {t('stories.subtitle')}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
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
              {cat === 'All' ? t('stories.all') : cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : (
          <div className="row g-4">
            {stories.map((story) => (
              <div key={story.id} className="col-md-6 col-lg-4">
                <div 
                  className="card-literary h-100 p-4 d-flex flex-column justify-content-between"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveStory(story)}
                >
                  <div>
                    {story.cover_image && (
                      <div className="text-center mb-3">
                        <img 
                          src={story.cover_image} 
                          alt="Cover" 
                          style={{ maxHeight: '110px', objectFit: 'contain' }} 
                        />
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span 
                        className="badge px-2 py-1 rounded small"
                        style={{ background: 'rgba(var(--color-primary-rgb), 0.08)', color: 'var(--color-primary)' }}
                      >
                        {story.category}
                      </span>
                      <span className="small text-muted font-monospace">{story.date}</span>
                    </div>

                    <h4 className="font-sinhala-title fs-5 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                      {lang === 'si' ? story.title_si : story.title_en}
                    </h4>

                    <p className="font-sinhala-title text-muted small fst-italic" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                      {lang === 'si' ? story.content_si.slice(0, 160) + '...' : story.content_en.slice(0, 160) + '...'}
                    </p>
                  </div>

                  <div className="pt-3 border-top mt-3 d-flex align-items-center justify-content-between">
                    <span className="small text-muted font-cormorant">Suchetha Kapuarachchi</span>
                    <span className="small fw-bold" style={{ color: 'var(--color-primary)' }}>
                      Read Piece &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* READING MODAL (PARCHMENT READING EXPERIENCE)                  */}
      {/* ============================================================== */}
      {activeStory && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ background: 'rgba(20,10,15,0.7)', zIndex: 9999, backdropFilter: 'blur(6px)' }}
          onClick={() => setActiveStory(null)}
        >
          <div 
            className="card-literary p-4 p-md-5 max-w-2xl w-100 position-relative animate-fade-in"
            style={{ 
              maxWidth: '680px', 
              maxHeight: '85vh', 
              overflowY: 'auto', 
              background: '#FAF6EE',
              border: '2px solid #C8A27A',
              color: '#241C1E'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveStory(null)}
              className="position-absolute top-0 end-0 m-3 btn btn-sm btn-outline-secondary rounded-circle"
            >
              <X size={18} />
            </button>

            {/* Reading Header */}
            <div className="text-center mb-4 pb-3 border-bottom" style={{ borderColor: 'rgba(200, 162, 122, 0.4)' }}>
              {activeStory.cover_image && (
                <img 
                  src={activeStory.cover_image} 
                  alt="Story Motif" 
                  style={{ maxHeight: '90px', objectFit: 'contain' }}
                  className="mb-2" 
                />
              )}
              <span className="badge px-3 py-1 rounded-pill small mb-2" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                {activeStory.category}
              </span>
              <h2 className="font-sinhala-title fs-3 fw-bold mb-1" style={{ color: '#4B2633' }}>
                {lang === 'si' ? activeStory.title_si : activeStory.title_en}
              </h2>
              <span className="font-editorial fst-italic text-muted small">
                {lang === 'si' ? activeStory.title_en : activeStory.title_si} • {activeStory.date}
              </span>
            </div>

            {/* Reading Content */}
            <div className="font-sinhala-title fs-5 my-4 px-2" style={{ lineHeight: '2.1', whiteSpace: 'pre-line' }}>
              {lang === 'si' ? activeStory.content_si : activeStory.content_en}
            </div>

            {/* Reading Footer */}
            <div className="pt-3 border-top text-center" style={{ borderColor: 'rgba(200, 162, 122, 0.3)' }}>
              <p className="font-editorial fst-italic text-muted mb-0 small">
                Penned by Suchetha Kapuarachchi (Kim Suu Ah)
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
