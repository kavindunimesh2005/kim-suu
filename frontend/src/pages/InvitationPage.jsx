import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useMusic } from '../components/music/MusicProvider';
import { InvitationCard } from '../components/invitation/InvitationCard';
import { Envelope } from '../components/invitation/Envelope';
import { Letter } from '../components/invitation/Letter';
import confetti from 'canvas-confetti';
import { FastForward } from 'lucide-react';

export const InvitationPage = () => {
  const { verifyInvitation, unlockInvitationDirectly } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { startMusicAfterInvitation } = useMusic();
  const navigate = useNavigate();

  // Animation Stages:
  // 0 = Initial Invitation Card with 3D Tilt
  // 1 = Envelope Appears in center
  // 2 = Wax seal trembles & fractures
  // 3 = Envelope Flap opens in 3D
  // 4 = Letter slides out of envelope
  // 5 = Letter unfolds with prose & typography
  // 6 = Paper wash transition into Home Sanctuary
  const [sequenceStage, setSequenceStage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Floating Dust Particles
  const [particles] = useState(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 5.5 + 4) % 96}%`,
      top: `${(i * 7 + 10) % 88}%`,
      size: `${3 + (i % 4) * 2}px`,
      delay: `${(i * 0.45) % 4}s`,
      duration: `${6 + (i % 3) * 2.5}s`
    }));
  });

  const handleOpenInvitation = (username, password) => {
    setErrorMsg('');

    const res = verifyInvitation(username, password);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    // Sparkle confetti effect
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C8A27A', '#4B2633', '#F3E9DD', '#D9C7A3']
      });
    } catch (e) {}

    // Begin cinematic sequence: 5-8 seconds total
    setSequenceStage(1); // Envelope appears

    setTimeout(() => {
      setSequenceStage(2); // Wax seal trembles & cracks
    }, 800);

    setTimeout(() => {
      setSequenceStage(3); // Flap opens
    }, 1800);

    setTimeout(() => {
      setSequenceStage(4); // Letter slides out
    }, 2800);

    setTimeout(() => {
      setSequenceStage(5); // Letter typography unfolds
    }, 4000);
  };

  const handleEnterSanctuary = () => {
    setSequenceStage(6);
    unlockInvitationDirectly();
    if (typeof startMusicAfterInvitation === 'function') {
      startMusicAfterInvitation();
    }
    setTimeout(() => {
      navigate('/home');
    }, 850);
  };

  const handleSkip = () => {
    unlockInvitationDirectly();
    if (typeof startMusicAfterInvitation === 'function') {
      startMusicAfterInvitation();
    }
    setSequenceStage(6);
    setTimeout(() => {
      navigate('/home');
    }, 400);
  };

  return (
    <div className="invitation-stage">
      {/* Warm Parchment Texture & Subtle Vignette */}
      <div className="parchment-bg" />

      {/* Subtle Animated Ambient Glow in Center */}
      <div className="ambient-glow-circle ambient-light" />

      {/* Faint Botanical Watermarks */}
      <img
        src="/assets/lake-boat-watercolor.png"
        alt="Watermark"
        className="botanical-watermark top-left"
      />
      <img
        src="/assets/tree-swing.png"
        alt="Watermark"
        className="botanical-watermark bottom-right"
      />

      {/* Floating Dust Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}

      {/* Language Switcher in Corner */}
      <div className="position-absolute top-0 end-0 p-4" style={{ zIndex: 30 }}>
        <div className="lang-switcher bg-white bg-opacity-75 shadow-sm">
          <button
            onClick={() => toggleLanguage('en')}
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            aria-label="Switch to English"
          >
            English
          </button>
          <button
            onClick={() => toggleLanguage('si')}
            className={`lang-btn ${lang === 'si' ? 'active' : ''}`}
            aria-label="Switch to Sinhala"
          >
            සිංහල
          </button>
        </div>
      </div>

      {/* Skip Button (always visible during animation) */}
      {sequenceStage > 0 && sequenceStage < 6 && (
        <button
          onClick={handleSkip}
          className="btn-skip-animation"
          title="Skip cinematic transition"
          aria-label="Skip to Homepage"
        >
          <span>{t('invitation.skip_button')}</span>
          <FastForward size={14} />
        </button>
      )}

      {/* Main Dynamic Stage Content */}
      <div className="position-relative w-100 d-flex justify-content-center" style={{ zIndex: 10 }}>
        {/* STAGE 0: Vintage Invitation Card */}
        {sequenceStage === 0 && (
          <InvitationCard
            onSubmit={handleOpenInvitation}
            errorMsg={errorMsg}
          />
        )}

        {/* STAGES 1 TO 4: Envelope Transformation, Wax Crack & Letter Slide */}
        {sequenceStage >= 1 && sequenceStage <= 4 && (
          <Envelope stage={sequenceStage} />
        )}

        {/* STAGE 5: Unfolded Letter Typography Experience */}
        {sequenceStage >= 5 && (
          <Letter
            onEnterSanctuary={handleEnterSanctuary}
            isExiting={sequenceStage === 6}
          />
        )}
      </div>

      {/* Cinematic Paper Expansion Wash into Home */}
      <div className={`home-expand-wash ${sequenceStage === 6 ? 'active' : ''}`} />
    </div>
  );
};
