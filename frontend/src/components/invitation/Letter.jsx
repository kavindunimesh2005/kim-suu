import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, ArrowRight } from 'lucide-react';

export const Letter = ({ onEnterSanctuary, isExiting = false }) => {
  const { t, lang } = useLanguage();

  return (
    <div
      className={`unfolded-letter-card letter-unfolding ${isExiting ? 'fade-out' : ''}`}
      style={{
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.08)' : 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Letter Header */}
      <div
        className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom"
        style={{ borderColor: 'rgba(200, 162, 122, 0.4)' }}
      >
        <div className="d-flex align-items-center gap-3">
          <img
            src="/assets/pink-lotus.png"
            alt="Lotus"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
          <div>
            <h5 className="font-editorial fw-bold mb-0" style={{ color: '#4B2633', fontSize: '1.2rem' }}>
              Suchetha Kapuarachchi
            </h5>
            <span className="small text-muted font-monospace" style={{ fontSize: '0.8rem' }}>
              Pen Name: Kim Suu Ah
            </span>
          </div>
        </div>
        <span
          className="badge px-3 py-2 rounded-pill font-monospace"
          style={{ background: 'rgba(75, 38, 51, 0.08)', color: '#4B2633', fontSize: '0.82rem' }}
        >
          20-09-2026
        </span>
      </div>

      {/* Opening Salutation */}
      <h2 className="font-editorial fw-bold mb-3" style={{ color: '#4B2633', fontSize: '1.8rem' }}>
        {t('invitation.letter_opening')}
      </h2>

      {/* Primary Literary Sinhala Lines */}
      <div
        className="p-3 mb-4 rounded-3"
        style={{
          background: 'rgba(200, 162, 122, 0.12)',
          borderLeft: '4px solid #C8A27A'
        }}
      >
        <p className="font-sinhala-title fs-5 mb-1" style={{ color: '#4B2633', lineHeight: '1.9' }}>
          "{t('invitation.letter_sinhala_1')}"
        </p>
        <p className="font-sinhala-title fs-5 mb-0" style={{ color: '#4B2633', lineHeight: '1.9' }}>
          "{t('invitation.letter_sinhala_2')}"
        </p>
      </div>

      {/* Welcome Statement */}
      <p className="font-editorial fs-4 fw-bold mb-4" style={{ color: '#7A4A56' }}>
        {t('invitation.letter_welcome')}
      </p>

      {/* Body Prose */}
      <p
        className="font-sinhala-title mb-4"
        style={{
          fontSize: '1.05rem',
          lineHeight: '1.9',
          color: '#3A2E32'
        }}
      >
        {lang === 'si'
          ? "මගේ අකුරු ලෝකයට ඔබව සාදරයෙන් පිළිගනිමි. මේ පිටු අතර රැඳී ඇත්තේ මගේ හුස්ම, සිතුවිලි සහ වචන බවට පත් වූ නොකියූ හැඟීම්ය. හුළු අත්ත නිම්නයේ නිහඬතාවත්, අරුංගල් මඟුලේ පාරම්පරික රිද්මයත් ඔබ සමග බෙදාගන්නට ලැබීම මගේ භාග්‍යයකි. විඳින්න... ඔබේම ආත්මය මෙහි සොයාගන්න."
          : "Between these quiet pages live my deepest breaths, whispered dreams, and feelings that found sanctuary in ink. It is my honor to share the tranquil mists of Hulu Aththa and the sacred heritage of Arungal with you. Step quietly, breathe gently, and may you discover a piece of your own soul here."}
      </p>

      {/* Signature Section */}
      <div
        className="d-flex justify-content-between align-items-end pt-3 border-top mb-4"
        style={{ borderColor: 'rgba(200, 162, 122, 0.35)' }}
      >
        <div>
          <p className="small text-muted mb-0">{t('invitation.letter_signature')}</p>
          <p className="font-editorial fs-3 fw-bold mb-0" style={{ color: '#4B2633' }}>
            Suchetha Kapuarachchi
          </p>
          <span className="font-sinhala-title text-muted small">සුචේතා කපුආරච්චි</span>
        </div>
        <img
          src="/assets/arungal-jhumka.png"
          alt="Adornment"
          style={{ width: '52px', height: '52px', objectFit: 'contain' }}
        />
      </div>

      {/* Enter Button */}
      <button
        type="button"
        onClick={onEnterSanctuary}
        className="btn btn-enter-invitation btn-glow w-100 py-3 fs-5"
        id="enter-sanctuary-btn"
      >
        <BookOpen size={22} />
        <span>{t('invitation.enter_sanctuary')}</span>
        <ArrowRight size={22} className="arrow-icon" />
      </button>
    </div>
  );
};
