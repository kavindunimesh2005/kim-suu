import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme, themes } from '../../context/ThemeContext';
import { BookOpen, Palette, Globe, MailOpen, Menu, X } from 'lucide-react';

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
      <div className="container d-flex align-items-center justify-content-between">

        {/* Brand / Logo */}
        <Link to="/home" className="d-flex align-items-center gap-2 text-decoration-none" style={{ color: 'var(--color-primary)' }}>
          <img
            src="/assets/pink-lotus.png"
            alt="Suchetha Lotus"
            style={{ width: '38px', height: '38px', objectFit: 'contain' }}
            className="animate-float"
          />
          <div>
            <div className="font-editorial fw-bold fs-5 text-nowrap" style={{ letterSpacing: '0.04em' }}>
              Suchetha Kapuarachchi
            </div>
            <div className="font-sinhala-title text-muted" style={{ fontSize: '0.78rem', marginTop: '-4px' }}>
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

        {/* Controls: Theme, Language, Invitation */}
        <div className="d-flex align-items-center gap-2">

          {/* Theme Dropdown */}
          <div className="position-relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="theme-pill-btn"
              title="Change Literary Theme"
            >
              <span
                className="theme-pill-dot"
                style={{ backgroundColor: themes[currentTheme].primary }}
              />
              <span className="d-none d-sm-inline">
                {currentTheme === 'huluAththa' ? 'Hulu Aththa' : currentTheme === 'arungal' ? 'Arungal' : 'Plum Theme'}
              </span>
              <Palette size={15} style={{ color: 'var(--color-primary)' }} />
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
            >
              සිං
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Revisit Invitation Icon */}
          <button
            onClick={() => navigate('/invitation')}
            className="btn btn-sm btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
            title="Revisit Invitation Card"
            style={{ width: '36px', height: '36px', borderColor: 'var(--color-card-border)' }}
          >
            <MailOpen size={16} style={{ color: 'var(--color-primary)' }} />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="d-lg-none btn btn-sm p-1 border-0 bg-transparent"
            style={{ color: 'var(--color-primary)' }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="d-lg-none border-top mt-2 pt-3 pb-3 px-4 bg-white" style={{ background: 'var(--color-card-bg)' }}>
          <div className="d-flex flex-column gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active fw-bold' : ''}`}
              >
                {t(link.labelKey)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
