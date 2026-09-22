import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Heart, Feather, BookMarked } from 'lucide-react';

export const Footer = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="footer-custom mt-auto pt-5 pb-4 border-top" style={{ background: 'var(--color-bg-alt)', borderColor: 'var(--color-card-border)' }}>
      <div className="container">
        <div className="row g-4 mb-4 align-items-center">
          
          {/* Author Brand */}
          <div className="col-lg-4 text-center text-lg-start">
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-2">
              <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '32px', height: '32px' }} />
              <h4 className="font-editorial mb-0 fw-bold" style={{ color: 'var(--color-primary)' }}>
                Suchetha Kapuarachchi
              </h4>
            </div>
            <p className="text-muted small mb-0 font-sinhala-title">
              {lang === 'si'
                ? "සෑම පොතක්ම අවසාන වන්නේ පිටුවකින් නොව, පාඨකයාගේ හදවතේ උපදින නව ඇරඹුමකිනි."
                : "A book never truly ends on the final page; it begins anew within the reader's soul."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-5 text-center">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/home" className="text-decoration-none text-muted small">{t('nav.home')}</Link>
              <Link to="/about" className="text-decoration-none text-muted small">{t('nav.about')}</Link>
              <Link to="/books" className="text-decoration-none text-muted small">{t('nav.books')}</Link>
              <Link to="/stories" className="text-decoration-none text-muted small">{t('nav.stories')}</Link>
              <Link to="/blog" className="text-decoration-none text-muted small">{t('nav.blog')}</Link>
              <Link to="/gallery" className="text-decoration-none text-muted small">{t('nav.gallery')}</Link>
              <Link to="/contact" className="text-decoration-none text-muted small">{t('nav.contact')}</Link>
            </div>
          </div>

          {/* Socials */}
          <div className="col-lg-3 text-center text-lg-end">
            <div className="d-flex justify-content-center justify-content-lg-end gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted hover-primary" title="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted hover-primary" title="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://goodreads.com" target="_blank" rel="noreferrer" className="text-muted hover-primary" title="Goodreads">
                <BookMarked size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar with Copyright & Subtle Admin Link */}
        <div className="pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <p className="small text-muted mb-0">
            &copy; {new Date().getFullYear()} Suchetha Kapuarachchi (Kim Suu Ah). {t('footer.rights')}
          </p>

          {/* Subtle Admin Link (as requested: discreet, not prominent) */}
          <Link 
            to="/admin/login" 
            className="text-muted small text-decoration-none d-flex align-items-center gap-1 opacity-50 hover-opacity-100"
            style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}
            title="Administrator Access"
          >
            <Shield size={12} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
