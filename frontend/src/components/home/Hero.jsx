import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getAuthor, getMediaUrl } from '../../services/api';
import { Sparkles, BookOpen, Feather, ArrowRight } from 'lucide-react';

export const Hero = () => {
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
        console.error('Failed to load author data in Hero:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const authorName = author?.name || 'Suchetha Kapuarachchi';
  const authorNameSi = author?.name_si || 'සුචේතා කපුආරච්චි';
  const authorPenName = author?.pen_name || 'Suchetha';
  const quoteSi = author?.quote_si || 'වචන අතර නිහඬතාවය මගේ ලෝකයයි.';
  const quoteEn = author?.quote_en || 'Silence between words is where my stories breathe.';
  const bioSummary = lang === 'si'
    ? (author?.bio_summary_si || 'සාහිත්‍ය කෘති, කෙටිකතා සහ ස්වභාවධර්මයේ සුවඳ කැටි වූ ලේඛන කලාව.')
    : (author?.bio_summary_en || 'Award-winning contemporary Sri Lankan novelist capturing the quiet beauty of rural life, human longing, and untamed nature.');
  const portraitImg = getMediaUrl(author?.portrait || author?.portrait_image) || '/assets/author-suchetha.jpg';

  return (
    <section className="hero-editorial-section position-relative">
      {/* Background Decorative Motif */}
      <div className="position-absolute top-0 end-0 p-4 opacity-25 d-none d-lg-block pointer-events-none">
        <img
          src="/assets/red-mandala.png"
          alt="Mandala Motif"
          style={{ width: '260px', height: '260px' }}
          className="animate-spin-slow"
        />
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-4 g-lg-5">
          {/* Editorial Typography (Left on desktop, below portrait on mobile) */}
          <div className="col-lg-7 order-2 order-lg-1 text-center text-lg-start">
            {/* Small Label */}
            <div className="hero-author-badge mb-3">
              <Sparkles size={14} />
              <span>{t('hero.label')}</span>
            </div>

            {/* Main Author Name */}
            <h1 className="hero-main-title">
              {authorName}
            </h1>

            {/* Sinhala & Pen Name Subheading */}
            <h2 className="hero-sinhala-name">
              {authorNameSi}{' '}
              <span className="fs-6 font-monospace opacity-75">
                • {authorPenName}
              </span>
            </h2>

            {/* Sinhala Literary Statement */}
            <blockquote className="hero-literary-quote mx-auto mx-lg-0">
              "{quoteSi}"
              <footer className="fs-6 text-muted mt-1 fst-normal">
                — {quoteEn}
              </footer>
            </blockquote>

            {/* Author Description */}
            <p className="hero-author-desc mx-auto mx-lg-0">
              {bioSummary}
            </p>

            {/* Call to Actions */}
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-start gap-3 pt-2">
              <a href="#book-showcase" className="btn btn-literary w-100 w-sm-auto">
                <BookOpen size={18} />
                <span>{t('hero.explore_books')}</span>
                <ArrowRight size={18} />
              </a>

              <Link to="/about" className="btn btn-literary-outline w-100 w-sm-auto">
                <Feather size={18} />
                <span>{t('hero.read_journey')}</span>
              </Link>
            </div>
          </div>

          {/* Layered Editorial Author Portrait (Top on mobile, Right on desktop) */}
          <div className="col-lg-5 order-1 order-lg-2">
            <div className="author-portrait-composition animate-float">
              {/* Back and Mid Paper Layers */}
              <div className="author-paper-layer-back" />
              <div className="author-paper-layer-mid" />

              {/* Main Portrait Wrapper with Masking & Border */}
              <div className="author-image-wrapper">
                <img
                  src={portraitImg}
                  alt={authorName}
                  className="author-portrait-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/author-suchetha.jpg';
                  }}
                />
              </div>

              {/* Botanical Embellishments */}
              <img
                src="/assets/pink-lotus.png"
                alt="Lotus Embellishment"
                className="portrait-botanical-cutout portrait-botanical-lotus"
              />
              <img
                src="/assets/green-butterfly.png"
                alt="Emerald Butterfly"
                className="portrait-botanical-cutout portrait-botanical-butterfly"
              />

              {/* Vintage Stamp Badge */}
              <div className="portrait-stamp-badge">
                <span className="small text-muted d-block text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  Sri Lanka
                </span>
                <span className="font-monospace fw-bold" style={{ fontSize: '0.85rem' }}>
                  {authorPenName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
