import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme, themes } from '../../context/ThemeContext';
import { BookOpen, Palette, Globe, MailOpen, Menu, X, Shield } from 'lucide-react';

export const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentTheme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/home', labelKey: 'nav.home' },
    { to: '/about', labelKey: 'nav.about' },
    { to: '/books', labelKey: 'nav.books' },
    { to: '/blog', labelKey: 'nav.blog' },
    { to: '/gallery', labelKey: 'nav.gallery' },
    { to: '/contact', labelKey: 'nav.contact' }
  ];

  return (
    <header className="navbar-custom">
      <div className="container d-flex align-items-center justify-content-between px-3">
        
        {/* Brand / Logo */}
        <Link 
          to="/home" 
          className="d-flex align-items-center gap-2 text-decoration-none" 
          style={{ color: 'var(--color-primary)' }}
        >
          <img 
            src="/assets/pink-lotus.png" 
            alt="Suchetha Lotus" 
            style={{ width: '34px', height: '34px', objectFit: 'contain' }}
            className="animate-float flex-shrink-0"
          />
          <div style={{ minWidth: 0 }}>
            <div className="font-editorial fw-bold fs-6 fs-sm-5 text-truncate" style={{ letterSpacing: '0.02em' }}>
              Suchetha Kapuarachchi
            </div>
            <div className="font-sinhala-title text-muted d-none d-sm-block" style={{ fontSize: '0.72rem', marginTop: '-3px' }}>
              සුචේතා කපුආරච්චි • Kim Suu Ah
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="d-none d-lg-flex align-items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link-custom ${isActive ? 'active fw-bold' : ''}`}
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        {/* Controls: Theme, Language, Invitation, Admin */}
        <div className="d-flex align-items-center gap-1 gap-sm-2">
          
          {/* Theme Dropdown (Desktop & Tablet) */}
          <div className="position-relative d-none d-sm-block">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="theme-pill-btn py-1 px-2 px-sm-3"
              title="Change Literary Theme"
            >
              <span 
                className="theme-pill-dot" 
                style={{ backgroundColor: themes[currentTheme].primary }} 
              />
              <span className="d-none d-md-inline small">
                {currentTheme === 'huluAththa' ? 'Hulu Aththa' : currentTheme === 'arungal' ? 'Arungal' : 'Plum Theme'}
              </span>
              <Palette size={14} style={{ color: 'var(--color-primary)' }} />
            </button>

            {themeDropdownOpen && (
              <div 
                className="position-absolute end-0 mt-2 py-2 card-literary shadow-lg"
                style={{ width: '220px', zIndex: 1050, background: 'var(--color-card-bg)' }}
              >
                <div className="px-3 py-1 text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Select Book World Theme
                </div>
                {Object.values(themes).map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => {
                      setTheme(thm.id);
                      setThemeDropdownOpen(false);
                    }}
                    className="w-100 text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-2"
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: currentTheme === thm.id ? '700' : '500',
                      color: currentTheme === thm.id ? thm.primary : 'var(--color-text)',
                      background: currentTheme === thm.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <span 
                      className="rounded-circle d-inline-block" 
                      style={{ width: '12px', height: '12px', backgroundColor: thm.primary, border: '1px solid #fff' }}
                    />
                    <span>{thm.name_si || thm.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="lang-switcher">
            <button
              onClick={() => toggleLanguage('si')}
              className={`lang-btn ${lang === 'si' ? 'active' : ''}`}
              title="සිංහල"
              style={{ fontSize: '0.78rem', padding: '3px 8px' }}
            >
              සිං
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              title="English"
              style={{ fontSize: '0.78rem', padding: '3px 8px' }}
            >
              EN
            </button>
          </div>

          {/* Revisit Invitation Icon (Hidden on smallest mobile, in drawer) */}
          <button
            onClick={() => navigate('/invitation')}
            className="btn btn-sm btn-outline-secondary rounded-circle d-none d-md-flex align-items-center justify-content-center p-0"
            title="Revisit Invitation Card"
            style={{ width: '32px', height: '32px', borderColor: 'var(--color-card-border)' }}
          >
            <MailOpen size={14} style={{ color: 'var(--color-primary)' }} />
          </button>

          {/* Admin Portal Link */}
          <Link
            to="/admin/login"
            className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0"
            title="Admin Portal"
            style={{ width: '32px', height: '32px', borderColor: 'var(--color-card-border)' }}
          >
            <Shield size={14} style={{ color: 'var(--color-primary)' }} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="d-lg-none btn btn-sm p-1 border-0 bg-transparent ms-1"
            style={{ color: 'var(--color-primary)' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Full-featured & Sleek) */}
      {mobileMenuOpen && (
        <div 
          className="d-lg-none border-top mt-2 pt-3 pb-4 px-4 shadow-xl animate-fade-in" 
          style={{ background: 'var(--color-card-bg)', borderBottom: '2px solid var(--color-card-border)' }}
        >
          {/* Navigation Links */}
          <div className="d-flex flex-column gap-2 mb-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link-custom py-2 ${isActive ? 'active fw-bold' : ''}`}
                style={{ fontSize: '1rem' }}
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </div>

          {/* Mobile Theme Selection Bar */}
          <div className="pt-3 border-top" style={{ borderColor: 'var(--color-card-border)' }}>
            <span className="small text-muted fw-bold d-block mb-2">Book Theme:</span>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {Object.values(themes).map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => {
                    setTheme(thm.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${currentTheme === thm.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{
                    fontSize: '0.78rem',
                    background: currentTheme === thm.id ? thm.primary : 'transparent',
                    borderColor: thm.primary,
                    color: currentTheme === thm.id ? '#fff' : 'var(--color-text)'
                  }}
                >
                  <span 
                    className="rounded-circle d-inline-block" 
                    style={{ width: '8px', height: '8px', backgroundColor: thm.primary, border: '1px solid #fff' }}
                  />
                  <span>{thm.name_si || thm.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="d-flex gap-2">
              <button
                onClick={() => {
                  navigate('/invitation');
                  setMobileMenuOpen(false);
                }}
                className="btn btn-sm btn-outline-secondary flex-grow-1 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '0.85rem' }}
              >
                <MailOpen size={15} />
                <span>Invitation Card</span>
              </button>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-sm btn-outline-secondary flex-grow-1 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '0.85rem' }}
              >
                <Shield size={15} />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
