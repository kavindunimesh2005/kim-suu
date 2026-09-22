import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { BookCard3D } from '../components/books/BookCard3D';
import { Sparkles, Feather, BookOpen, ArrowRight, Quote, Heart, Send } from 'lucide-react';

export const HomePage = () => {
  const { t, lang } = useLanguage();
  const { currentTheme, setTheme } = useTheme();

  const [books, setBooks] = useState([]);
  const [stories, setStories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, storiesData, blogsData] = await Promise.all([
          api.getBooks(),
          api.getStories(),
          api.getBlogs()
        ]);
        setBooks(booksData || []);
        setStories((storiesData || []).slice(0, 3));
        setBlogs((blogsData || []).slice(0, 2));
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="homepage-wrapper">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION: CINEMATIC EDITORIAL AUTHOR INTRO             */}
      {/* ============================================================== */}
      <section className="py-5 py-lg-6 position-relative overflow-hidden">
        
        {/* Floating Decorative Motifs */}
        <div className="position-absolute top-0 end-0 p-4 opacity-25 d-none d-lg-block pointer-events-none">
          <img 
            src="/assets/red-mandala.png" 
            alt="Motif" 
            style={{ width: '220px', height: '220px' }} 
            className="animate-spin-slow"
          />
        </div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            
            {/* Left Column: Editorial Typography */}
            <div className="col-lg-7 text-center text-lg-start">
              
              <div 
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small fw-bold mb-3 shadow-sm"
                style={{ 
                  background: 'rgba(var(--color-primary-rgb), 0.08)', 
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-card-border)'
                }}
              >
                <Sparkles size={14} />
                <span>{t('hero.tagline')}</span>
              </div>

              <h1 className="font-editorial display-4 fw-bold mb-2" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                Suchetha Kapuarachchi
              </h1>

              <h2 className="font-sinhala-title fs-3 text-muted mb-3">
                සුචේතා කපුආරච්චි <span className="fs-6 font-monospace opacity-75">• Kim Suu Ah</span>
              </h2>

              <p className="font-sinhala-title fs-5 mb-4 text-muted" style={{ lineHeight: '1.9', maxWidth: '620px' }}>
                {lang === 'si'
                  ? "ස්වභාවධර්මයේ නිහඬතාව, නොකියූ ප්‍රේමය සහ ශ්‍රී ලාංකීය සාහිත්‍යයේ ආත්මීය සුවඳ එක්තැන් කළ අකුරු අඩවිය. මෙහිදී සෑම පිටුවක්ම ඔබව රැගෙන යන්නේ හදවතේ සුවදායකම නවාතැන වෙතය."
                  : "A literary sanctuary where the silence of untamed nature, the tenderness of unspoken love, and Sri Lanka's cultural heritage breathe into life. Every page invites your soul into a haven of contemplation."}
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3 pt-2">
                <a href="#books-showcase" className="btn btn-literary">
                  <BookOpen size={18} />
                  <span>{t('hero.explore_books')}</span>
                  <ArrowRight size={18} />
                </a>

                <Link to="/about" className="btn btn-literary-outline">
                  <Feather size={18} />
                  <span>{t('hero.read_journey')}</span>
                </Link>
              </div>

              {/* Quick Author Accolades */}
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-4 mt-5 pt-3 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
                <div>
                  <span className="font-editorial display-6 fw-bold d-block" style={{ color: 'var(--color-primary)' }}>2</span>
                  <span className="small text-muted font-sinhala-title">ප්‍රකාශිත නවකතා (Novels)</span>
                </div>
                <div style={{ width: '1px', height: '35px', background: 'var(--color-card-border)' }} />
                <div>
                  <span className="font-editorial display-6 fw-bold d-block" style={{ color: 'var(--color-primary)' }}>10k+</span>
                  <span className="small text-muted font-sinhala-title">ආදරණීය පාඨක ප්‍රජාව</span>
                </div>
                <div style={{ width: '1px', height: '35px', background: 'var(--color-card-border)' }} />
                <div>
                  <span className="font-editorial display-6 fw-bold d-block" style={{ color: 'var(--color-primary)' }}>2026</span>
                  <span className="small text-muted font-sinhala-title">නව සාහිත්‍ය ප්‍රවේශය</span>
                </div>
              </div>

            </div>

            {/* Right Column: Author Portrait with Artistic Frame */}
            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                
                {/* Background artistic halo */}
                <div 
                  className="position-absolute top-50 start-50 translate-middle rounded-circle"
                  style={{
                    width: '380px',
                    height: '380px',
                    background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.12) 0%, transparent 70%)',
                    zIndex: 0
                  }}
                />

                {/* Portrait Card */}
                <div 
                  className="card-literary p-3 position-relative"
                  style={{
                    borderRadius: '24px',
                    transform: 'rotate(-2deg)',
                    boxShadow: '0 25px 50px -12px rgba(var(--color-primary-rgb), 0.25)',
                    zIndex: 1
                  }}
                >
                  <img 
                    src="/assets/author-suchetha.jpg" 
                    alt="Suchetha Kapuarachchi" 
                    className="img-fluid rounded-4"
                    style={{ 
                      maxHeight: '440px', 
                      width: '100%', 
                      objectFit: 'cover',
                      filter: 'contrast(1.02)'
                    }}
                  />
                  <div className="pt-3 pb-1 text-center">
                    <h5 className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                      Suchetha Kapuarachchi
                    </h5>
                    <p className="font-sinhala-title text-muted small mb-0">
                      කතුවරිය සුචේතා කපුආරච්චි
                    </p>
                  </div>
                </div>

                {/* Floating Decorative Jewel */}
                <div 
                  className="position-absolute bottom-0 start-0 translate-middle-y animate-float d-none d-sm-block"
                  style={{ zIndex: 3, marginLeft: '-25px' }}
                >
                  <img 
                    src="/assets/arungal-jhumka.png" 
                    alt="Arungal Earring" 
                    style={{ width: '75px', height: '75px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}
                  />
                </div>

                {/* Floating Butterfly Accent */}
                <div 
                  className="position-absolute top-0 end-0 animate-float d-none d-sm-block"
                  style={{ zIndex: 3, marginTop: '-20px', marginRight: '-20px', animationDelay: '1.5s' }}
                >
                  <img 
                    src="/assets/green-butterfly.png" 
                    alt="Butterfly" 
                    style={{ width: '65px', height: '65px', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))' }}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. THE SIGNATURE TWO-BOOK WORLD SHOWCASE (THEME ENGINE)        */}
      {/* ============================================================== */}
      <section id="books-showcase" className="py-5 py-lg-6" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span 
              className="badge px-3 py-1 rounded-pill small mb-2 text-uppercase"
              style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)', letterSpacing: '0.1em' }}
            >
              Interactive Book Worlds
            </span>
            <h2 className="font-editorial display-5 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              {t('hero.featured_novels')}
            </h2>
            <p className="font-sinhala-title text-muted">
              {lang === 'si'
                ? "හුළු අත්ත හෝ අරුංගල් තෝරා මුළු වෙබ් අඩවියම ඒ ඒ කෘතියේ සුවිශේෂී වර්ණ හා සෞන්දර්යයට මුසු කරවන්න."
                : "Select either novel to seamlessly transform the entire website into that book's unique visual and emotional universe."}
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {books.map((book) => (
              <div key={book.id} className="col-md-6 col-lg-5">
                <BookCard3D book={book} />
              </div>
            ))}
          </div>

          {/* Theme Quick Reset Bar */}
          <div className="text-center mt-5">
            <button
              onClick={() => setTheme('default')}
              className={`btn btn-sm rounded-pill px-4 py-2 ${currentTheme === 'default' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              {lang === 'si' ? "මුල් ප්ලම් තේමාවට නැවත මාරු වන්න" : "Reset to Default Plum Theme"}
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. LITERARY QUOTE & PHILOSOPHY SECTION                         */}
      {/* ============================================================== */}
      <section className="py-5 py-lg-6 position-relative">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 text-center">
              
              <div className="mb-3 d-flex justify-content-center">
                <img 
                  src="/assets/arungal-calligraphy.png" 
                  alt="Calligraphy" 
                  style={{ maxHeight: '60px', objectFit: 'contain' }} 
                />
              </div>

              <blockquote className="literary-quote font-sinhala-title my-4 fs-4" style={{ lineHeight: '1.9' }}>
                {lang === 'si'
                  ? "සෑම පොතක්ම කියවන්නාගේ හදවතට විවර වන නිහඬ කවුළුවකි. එහිදී ඔබ දකින්නේ මගේ වචන පමණක් නොව, ඔබේම ආත්මයේ ගැඹුරුම සේයාවන්ය."
                  : "Every book is a quiet window opened to the reader's heart. Looking through it, you discover not just my words, but the deepest reflections of your own soul."}
              </blockquote>

              <div className="mt-3">
                <p className="font-editorial fs-5 fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                  Suchetha Kapuarachchi
                </p>
                <p className="text-muted small">
                  Novelist • Author of Hulu Aththa & Arungal
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. STORIES / POEMS PREVIEW                                     */}
      {/* ============================================================== */}
      <section className="py-5" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div>
              <h3 className="font-editorial fw-bold fs-2 mb-1" style={{ color: 'var(--color-primary)' }}>
                {t('stories.title')}
              </h3>
              <p className="font-sinhala-title text-muted mb-0 small">
                {t('stories.subtitle')}
              </p>
            </div>
            <Link to="/stories" className="btn btn-literary-outline btn-sm mt-3 mt-md-0">
              <span>{lang === 'si' ? "සියලු නිර්මාණ කියවන්න" : "View All Stories"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="row g-4">
            {stories.map((story) => (
              <div key={story.id} className="col-md-4">
                <div className="card-literary h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span 
                      className="badge px-3 py-1 rounded-pill small mb-3"
                      style={{ background: 'rgba(var(--color-primary-rgb), 0.08)', color: 'var(--color-primary)' }}
                    >
                      {story.category}
                    </span>
                    <h4 className="font-sinhala-title fs-5 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                      {lang === 'si' ? story.title_si : story.title_en}
                    </h4>
                    <p className="font-sinhala-title text-muted small fst-italic" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                      {lang === 'si' ? story.content_si.slice(0, 140) + '...' : story.content_en.slice(0, 140) + '...'}
                    </p>
                  </div>
                  <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted font-monospace">{story.date}</span>
                    <Link to="/stories" className="text-decoration-none small fw-bold" style={{ color: 'var(--color-primary)' }}>
                      Read More &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. LITERARY JOURNAL PREVIEWS                                   */}
      {/* ============================================================== */}
      <section className="py-5 py-lg-6">
        <div className="container">
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div>
              <h3 className="font-editorial fw-bold fs-2 mb-1" style={{ color: 'var(--color-primary)' }}>
                {t('blog.title')}
              </h3>
              <p className="font-sinhala-title text-muted mb-0 small">
                {t('blog.subtitle')}
              </p>
            </div>
            <Link to="/blog" className="btn btn-literary-outline btn-sm mt-3 mt-md-0">
              <span>{lang === 'si' ? "සියලු සටහන් කියවන්න" : "Read Journal"}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="row g-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="col-lg-6">
                <div className="card-literary h-100 overflow-hidden d-flex flex-column flex-md-row">
                  <div className="col-md-5">
                    <img 
                      src={blog.featured_image} 
                      alt={blog.title_en} 
                      style={{ width: '100%', height: '100%', minHeight: '220px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge px-2 py-1 rounded small" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
                          {blog.category}
                        </span>
                        <span className="small text-muted font-monospace">{blog.reading_time}</span>
                      </div>
                      <h4 className="font-sinhala-title fs-5 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                        {lang === 'si' ? blog.title_si : blog.title_en}
                      </h4>
                      <p className="small text-muted mb-3" style={{ lineHeight: '1.6' }}>
                        {lang === 'si' ? blog.content_si.slice(0, 110) + '...' : blog.content_en.slice(0, 110) + '...'}
                      </p>
                    </div>
                    <Link to={`/blog/${blog.slug}`} className="btn btn-sm btn-literary rounded-pill w-fit">
                      <span>{t('blog.read_article')}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. READER LETTER & NEWSLETTER SIGNUP                           */}
      {/* ============================================================== */}
      <section className="py-5" style={{ background: 'var(--color-bg-alt)' }}>
        <div className="container">
          <div className="card-literary p-4 p-md-5 text-center max-w-3xl mx-auto shadow-sm" style={{ border: '2px dashed var(--color-card-border)' }}>
            <div className="mb-3 d-flex justify-content-center">
              <img src="/assets/daisy-flower.png" alt="Daisy" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </div>
            <h3 className="font-editorial fs-2 fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>
              Join the Author's Inner Circle
            </h3>
            <p className="font-sinhala-title text-muted mb-4 small" style={{ maxWidth: '520px', margin: '0 auto' }}>
              {lang === 'si'
                ? "සුචේතාගේ නවතම කෘති, සාහිත්‍යමය සටහන් සහ පෞද්ගලික ලිපි සෘජුවම ඔබගේ විද්‍යුත් තැපෑලට ලබාගන්න."
                : "Receive intimate reflections from Suchetha's writing desk, novel updates, and personal letters directly to your inbox."}
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 max-w-md mx-auto" style={{ maxWidth: '440px' }}>
              <input 
                type="email" 
                placeholder="Your email address..."
                className="form-control rounded-pill px-4 py-2"
                style={{ border: '1.5px solid var(--color-card-border)', background: '#fff' }}
              />
              <button className="btn btn-literary rounded-pill text-nowrap">
                <Send size={16} />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
