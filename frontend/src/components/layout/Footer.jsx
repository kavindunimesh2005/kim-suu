import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getAuthor } from '../../services/api';
import { BookOpen, Mail, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAuthor()
      .then((data) => {
        if (isMounted && data) {
          setAuthor(data);
        }
      })
      .catch(() => { });
    return () => {
      isMounted = false;
    };
  }, []);

  const authorName = author?.name || 'Suchetha Kapuarachchi';
  const authorNameSi = author?.name_si || 'සුචේතා කපුආරච්චි';
  const authorTitle = author?.title_si || 'Novelist & Storyteller';
  const instagramUrl = author?.socials?.instagram || 'https://instagram.com';
  const facebookUrl = author?.socials?.facebook || 'https://facebook.com';

  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4 justify-content-between align-items-center mb-5">
          {/* Left: Author Identity */}
          <div className="col-lg-5 text-center text-lg-start">
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-2">
              <img
                src="/assets/pink-lotus.png"
                alt="Lotus"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
              <h4 className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                {authorName}
              </h4>
            </div>
            <p className="font-sinhala-title text-muted mb-3 small">
              {authorNameSi} • {authorTitle}
            </p>
            <p className="small text-muted mb-0" style={{ maxWidth: '420px', lineHeight: '1.7' }}>
              "Step quietly into a world of stories. Where nature, unspoken romance, and cultural heritage find sanctuary."
            </p>
          </div>

          {/* Center: Navigation Links */}
          <div className="col-lg-4 text-center">
            <div className="d-flex flex-wrap justify-content-center gap-3 small">
              <Link to="/home" className="text-decoration-none text-muted">{t('nav.home')}</Link>
              <Link to="/about" className="text-decoration-none text-muted">{t('nav.about')}</Link>
              <Link to="/books" className="text-decoration-none text-muted">{t('nav.books')}</Link>
              <Link to="/blog" className="text-decoration-none text-muted">{t('nav.blog')}</Link>
              <Link to="/gallery" className="text-decoration-none text-muted">{t('nav.gallery')}</Link>
              <Link to="/contact" className="text-decoration-none text-muted">{t('nav.contact')}</Link>
            </div>
          </div>

          {/* Right: Social Presence */}
          <div className="col-lg-3 text-center text-lg-end">
            <div className="d-flex justify-content-center justify-content-lg-end gap-3">
              <a
                href="https://www.tiktok.com/@kimsuuah?_r=1&_t=ZS-99yzfxQu5yv"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', borderColor: 'var(--color-card-border)' }}
                aria-label="TikTok"
              >
                <i className="bi bi-tiktok fs-6" />
              </a>
              <a
                href="https://www.facebook.com/share/1HffeSFrPE/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', borderColor: 'var(--color-card-border)' }}
                aria-label="Facebook"
              >
                <i className="bi bi-facebook fs-6" />
              </a>
              <a
                href="https://bharana.lk/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '44px', height: '44px', borderColor: 'var(--color-card-border)' }}
                aria-label="Bharana"
              >
                <i className="bi bi-book fs-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted" style={{ borderColor: 'var(--color-card-border)' }}>
          <div>
            © {new Date().getFullYear()} Aura Digital Developer. {t('footer.rights')}
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/invitation"
              className="text-decoration-none text-muted opacity-75 small"
            >
              Reopen Invitation
            </Link>
            <span className="opacity-25">•</span>
            {/* Subtle Admin Link (explicit requirement) */}
            <Link
              to="/admin/login"
              className="text-decoration-none text-muted opacity-50 small hover-opacity-100"
              style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >
              {t('footer.admin_link')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
