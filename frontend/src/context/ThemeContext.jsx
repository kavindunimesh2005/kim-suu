import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  default: {
    id: 'default',
    name: 'Deep Plum / Burgundy Literary Theme',
    name_si: 'මූලික ප්ලම් තේමාව',
    primary: '#4B2633',
    secondary: '#7A4A56',
    background: '#F8F3EE',
    text: '#241C1E',
    accent: '#C8A27A'
  },
  huluAththa: {
    id: 'huluAththa',
    name: 'Light Green / Natural Forest Theme',
    name_si: 'හුළු අත්ත (හරිත ස්වභාවික තේමාව)',
    primary: '#718A68',
    secondary: '#A8B89C',
    background: '#F4F6ED',
    text: '#263126',
    accent: '#D9C7A3'
  },
  arungal: {
    id: 'arungal',
    name: 'Warm Brown / Earthy Literary Theme',
    name_si: 'අරුංගල් (උණුසුම් දුඹුරු තේමාව)',
    primary: '#6B4632',
    secondary: '#8B6349',
    background: '#F3E9DD',
    text: '#2E211A',
    accent: '#B68A5A'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('author_theme') || 'default';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setTheme = (themeId) => {
    if (!themes[themeId] || themeId === currentTheme) return;

    // Trigger cinematic 750ms page color wash overlay
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentTheme(themeId);
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('author_theme', themeId);
    }, 250);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 750);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themeInfo: themes[currentTheme], setTheme, themes, isTransitioning }}>
      {/* Cinematic Color Wash Transition Overlay */}
      <div className={`theme-wash-overlay ${isTransitioning ? 'active' : ''}`} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
