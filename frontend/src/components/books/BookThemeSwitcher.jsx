import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Palette, Sparkles, Check } from 'lucide-react';

export const BookThemeSwitcher = () => {
  const { currentTheme, setTheme } = useTheme();
  const { t } = useLanguage();

  const themeOptions = [
    {
      id: 'default',
      name: 'Burgundy Plum',
      name_si: 'මූලික ප්ලම්',
      color: '#4B2633',
      accent: '#C8A27A',
      label: t('books.default_theme_btn')
    },
    {
      id: 'huluAththa',
      name: 'Hulu Aththa Forest',
      name_si: 'හුළු අත්ත හරිත',
      color: '#718A68',
      accent: '#D9C7A3',
      label: t('books.hulu_theme_btn')
    },
    {
      id: 'arungal',
      name: 'Arungal Earth',
      name_si: 'අරුංගල් දුඹුරු',
      color: '#6B4632',
      accent: '#B68A5A',
      label: t('books.arungal_theme_btn')
    }
  ];

  return (
    <div
      className="p-3 p-md-4 rounded-4 shadow-sm border mb-4"
      style={{
        background: 'var(--color-card-bg)',
        borderColor: 'var(--color-card-border)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <Palette size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h6 className="font-editorial fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
              Interactive Book Atmosphere
            </h6>
            <span className="small text-muted" style={{ fontSize: '0.8rem' }}>
              Switch the entire sanctuary's visual tone to match each novel
            </span>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {themeOptions.map((opt) => {
            const isActive = currentTheme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className="btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill transition"
                style={{
                  background: isActive ? opt.color : 'rgba(255, 255, 255, 0.7)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text)',
                  border: `1.5px solid ${isActive ? opt.accent : 'var(--color-card-border)'}`,
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  boxShadow: isActive ? `0 4px 15px ${opt.color}40` : 'none'
                }}
              >
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: opt.color,
                    border: '1px solid #FFFFFF'
                  }}
                />
                <span>{opt.name}</span>
                {isActive && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
