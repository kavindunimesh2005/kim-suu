import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Feather, Menu, X, Palette, Check } from 'lucide-react';

export const Navbar = () => {
  const { t, lang, toggleLanguage } = useLanguage();
  const { currentTheme, setTheme, themes } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const navLinks = [
    { path: '/home', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/books', label: t('nav.books') },
    { path: '/blog', label: t('nav.blog') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const currentThemeColor = themes[currentTheme]?.primary || '#4B2633';

  return (
    <nav className="navbar-custom">
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand / Author Signature */}
        <Link to="/home" className="text-decoration-none d-flex align-items-center gap-2 flex-shrink-1 overflow-hidden" onClick={() => setMobileMenuOpen(false)}>
          <img
            src="/assets/pink-lotus.png"
            alt="Lotus"
            style={{ width: '30px', height: '30px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div className="text-start text-truncate">
            <span className="navbar-brand-name d-block text-truncate">
              Suchetha Kapuarachchi
            </span>
            <span className="navbar-brand-sub text-truncate">
              සුචේතා කපුආරච්චි
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (English by Default) */}
        <div className="d-none d-lg-flex align-items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link-custom ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Language Toggle, Theme Selector, & Mobile Hamburger */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          {/* Theme Dropdown / Indicator */}
          <div className="position-relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="theme-pill-btn"
              title="Change Literary Theme"
              aria-label="Change Literary Theme"
              aria-expanded={themeDropdownOpen}
            >
              <span
                className="theme-pill-dot"
                style={{ backgroundColor: currentThemeColor }}
              />
              <span className="d-none d-md-inline">
                {currentTheme === 'huluAththa'
                  ? 'Hulu Aththa'
                  : currentTheme === 'arungal'
                  ? 'Arungal'
                  : 'Plum Theme'}
              </span>
              <Palette size={14} className="opacity-75" />
            </button>

            {themeDropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 p-2 rounded-3 shadow-lg border"
                style={{
                  background: 'var(--color-card-bg)',
                  borderColor: 'var(--color-card-border)',
                  minWidth: '220px',
                  zIndex: 1050,
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="px-2 py-1 small text-muted font-sans-ui fw-bold border-bottom mb-1">
                  Literary Color Themes
                </div>
                <button
                  onClick={() => {
                    setTheme('default');
                    setThemeDropdownOpen(false);
                  }}
                  className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 small"
                  style={{ color: 'var(--color-text)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="theme-pill-dot" style={{ backgroundColor: '#4B2633' }} />
                    <span>Default Plum</span>
                  </div>
                  {currentTheme === 'default' && <Check size={14} style={{ color: '#4B2633' }} />}
                </button>

                <button
                  onClick={() => {
                    setTheme('huluAththa');
                    setThemeDropdownOpen(false);
                  }}
                  className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 small"
                  style={{ color: 'var(--color-text)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="theme-pill-dot" style={{ backgroundColor: '#718A68' }} />
                    <span>Hulu Aththa Green</span>
                  </div>
                  {currentTheme === 'huluAththa' && <Check size={14} style={{ color: '#718A68' }} />}
                </button>

                <button
                  onClick={() => {
                    setTheme('arungal');
                    setThemeDropdownOpen(false);
                  }}
                  className="dropdown-item d-flex align-items-center justify-content-between p-2 rounded-2 small"
                  style={{ color: 'var(--color-text)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span className="theme-pill-dot" style={{ backgroundColor: '#6B4632' }} />
                    <span>Arungal Earth Brown</span>
                  </div>
                  {currentTheme === 'arungal' && <Check size={14} style={{ color: '#6B4632' }} />}
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher: Visible on desktop & tablet */}
          <div className="lang-switcher d-none d-sm-inline-flex">
            <button
              onClick={() => toggleLanguage('si')}
              className={`lang-btn ${lang === 'si' ? 'active' : ''}`}
              title="සිංහල භාෂාවට මාරු වන්න"
            >
              සිංහල
            </button>
            <span className="text-muted opacity-50 px-1" style={{ fontSize: '0.8rem' }}>|</span>
            <button
              onClick={() => toggleLanguage('en')}
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              title="Switch to English"
            >
              English
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn p-2 d-lg-none border-0 text-muted d-flex align-items-center justify-content-center"
            style={{ width: '44px', height: '44px' }}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} style={{ color: 'var(--color-primary)' }} /> : <Menu size={26} style={{ color: 'var(--color-primary)' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none px-3 py-4 border-top mt-2 animate-fade-in"
          style={{
            background: 'var(--color-glass-nav)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--color-card-border)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Navigation Links */}
          <div className="d-flex flex-column gap-2 mb-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-link-mobile ${isActive ? 'active' : ''}`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="badge rounded-pill px-2 py-1 small" style={{ background: 'var(--color-primary)', color: '#fff', fontSize: '0.72rem' }}>
                      Current
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Drawer Bottom: Language Switcher & Quick Themes */}
          <div className="pt-3 border-top d-flex flex-column gap-3" style={{ borderColor: 'var(--color-card-border)' }}>
            {/* Language Switcher on Mobile Drawer */}
            <div className="d-flex align-items-center justify-content-between">
              <span className="small text-muted font-sans-ui fw-bold">Language / භාෂාව:</span>
              <div className="lang-switcher">
                <button
                  onClick={() => toggleLanguage('si')}
                  className={`lang-btn ${lang === 'si' ? 'active' : ''}`}
                >
                  සිංහල
                </button>
                <span className="text-muted opacity-50 px-1" style={{ fontSize: '0.8rem' }}>|</span>
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Quick Literary Theme Switcher in Mobile Drawer */}
            <div className="d-flex flex-column gap-2">
              <span className="small text-muted font-sans-ui fw-bold">Literary Palette:</span>
              <div className="d-flex gap-2">
                <button
                  onClick={() => {
                    setTheme('default');
                  }}
                  className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2 rounded-3 border"
                  style={{
                    background: currentTheme === 'default' ? 'rgba(75, 38, 51, 0.12)' : 'var(--color-card-bg)',
                    borderColor: currentTheme === 'default' ? '#4B2633' : 'var(--color-card-border)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text)'
                  }}
                >
                  <span className="theme-pill-dot" style={{ backgroundColor: '#4B2633' }} />
                  <span>Plum</span>
                </button>

                <button
                  onClick={() => {
                    setTheme('huluAththa');
                  }}
                  className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2 rounded-3 border"
                  style={{
                    background: currentTheme === 'huluAththa' ? 'rgba(113, 138, 104, 0.15)' : 'var(--color-card-bg)',
                    borderColor: currentTheme === 'huluAththa' ? '#718A68' : 'var(--color-card-border)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text)'
                  }}
                >
                  <span className="theme-pill-dot" style={{ backgroundColor: '#718A68' }} />
                  <span>Green</span>
                </button>

                <button
                  onClick={() => {
                    setTheme('arungal');
                  }}
                  className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2 rounded-3 border"
                  style={{
                    background: currentTheme === 'arungal' ? 'rgba(107, 70, 50, 0.15)' : 'var(--color-card-bg)',
                    borderColor: currentTheme === 'arungal' ? '#6B4632' : 'var(--color-card-border)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text)'
                  }}
                >
                  <span className="theme-pill-dot" style={{ backgroundColor: '#6B4632' }} />
                  <span>Brown</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
