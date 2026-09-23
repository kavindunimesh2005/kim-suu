import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getAuthor } from '../../services/api';
import { Feather, Award, ArrowRight } from 'lucide-react';

export const AboutPreview = () => {
  const { t, lang } = useLanguage();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAuthor()
      .then((data) => {
        if (isMounted && data) {
          setAuthor(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load author in AboutPreview:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const authorName = author?.name || 'Suchetha Kapuarachchi';
  const bio = lang === 'si'
    ? (author?.bio_si || author?.full_bio_si || author?.bio_summary_si || '')
    : (author?.bio_en || author?.full_bio_en || author?.bio_summary_en || '');
  const philosophy = lang === 'si'
    ? (author?.philosophy_si || 'සෑම පොතක්ම කියවන්නාගේ හදවතට විවර වන නිහඬ කවුළුවකි.')
    : (author?.philosophy_en || 'Every book is a quiet window opened to the reader\'s heart.');
  const achievements = Array.isArray(author?.achievements) ? author.achievements : [];

  return (
    <section className="py-6 position-relative overflow-hidden">
      <div className="container">
        <div className="card-literary p-4 p-md-5">
          <div className="row align-items-center g-5">
            {/* Left: Atmospheric Art & Cabin */}
            <div className="col-lg-5 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="/assets/author-suchetha.jpg"
                  alt="Cabin"
                  style={{ maxWidth: '340px', width: '100%', objectFit: 'contain' }}
                  className="animate-float"
                />
                <img
                  src="/assets/daisy-flower.png"
                  alt="Daisy"
                  style={{
                    width: '60px',
                    height: '60px',
                    position: 'absolute',
                    bottom: '-10px',
                    left: '10px'
                  }}
                />
              </div>
            </div>

            {/* Right: Editorial Magazine Bio Excerpt */}
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 mb-2 text-uppercase fw-bold small" style={{ color: 'var(--color-accent)', letterSpacing: '0.15em' }}>
                <Feather size={14} />
                <span>{t('about.section_label')}</span>
              </div>

              <h2 className="font-editorial display-6 fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                {authorName}
              </h2>

              <p className="font-sinhala-title fs-5 text-muted mb-4" style={{ lineHeight: '1.9' }}>
                {bio}
              </p>

              {/* Literary Philosophy Quote */}
              <div className="literary-quote mb-4">
                <p className="mb-0">
                  "{philosophy}"
                </p>
                <footer className="small text-muted mt-2 fst-normal">
                  — {authorName} (Author Philosophy)
                </footer>
              </div>

              {/* Awards summary */}
              {achievements.length > 0 && (
                <div className="d-flex flex-wrap gap-3 mb-4">
                  {achievements.slice(0, 2).map((ach, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border small"
                      style={{ background: 'var(--color-bg-alt)', borderColor: 'var(--color-card-border)' }}
                    >
                      <Award size={16} style={{ color: 'var(--color-accent)' }} />
                      <span className="fw-semibold">
                        {lang === 'si' ? ach.title_si : ach.title_en}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/about" className="btn btn-literary">
                <span>{t('hero.read_journey')}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
