import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('author_lang') || 'en';
  });

  const toggleLanguage = (selectedLang) => {
    const newLang = selectedLang || (lang === 'si' ? 'en' : 'si');
    setLang(newLang);
    localStorage.setItem('author_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Translation lookup helper
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if translation missing
        let fallback = translations['en'];
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
