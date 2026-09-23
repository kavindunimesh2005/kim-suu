import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { InvitationForm } from './InvitationForm';
import { WaxSeal } from './WaxSeal';

export const InvitationCard = ({ onSubmit, errorMsg }) => {
  const { t } = useLanguage();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Parallax Mouse Movement
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt angles (max +/- 8 deg)
    const rotateX = ((centerY - y) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="invitation-card-perspective">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="invitation-card text-center"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Decorative Borders & Corners */}
        <div className="invitation-inner-border" />
        <div className="invitation-corner-ornament top-left" />
        <div className="invitation-corner-ornament top-right" />
        <div className="invitation-corner-ornament bottom-left" />
        <div className="invitation-corner-ornament bottom-right" />

        {/* Botanical Motif Header */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="position-relative" style={{ width: '80px', height: '80px' }}>
            <img
              src="/assets/red-mandala.png"
              alt="Mandala"
              className="animate-spin-slow w-100 h-100 opacity-75"
              style={{ objectFit: 'contain' }}
            />
            <img
              src="/assets/pink-lotus.png"
              alt="Lotus"
              className="position-absolute top-50 start-50 translate-middle"
              style={{ width: '42px', height: '42px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Small Heading: YOU ARE INVITED */}
        <p className="invitation-subtitle">
          {t('invitation.subheading')}
        </p>

        {/* Main Heading: Kim Suu Ah */}
        <h1 className="invitation-title">
          {t('invitation.heading')}
        </h1>

        {/* Literary Line: Step quietly into a world of stories. */}
        <p className="invitation-quote">
          "{t('invitation.literary_line')}"
        </p>

        {/* Wax Seal Accent */}
        <div className="d-flex justify-content-center mb-4">
          <WaxSeal state="intact" monogram="KS" />
        </div>

        {/* Form Controls */}
        <InvitationForm onSubmit={onSubmit} errorMsg={errorMsg} />

        {/* Subtitle / Author Signature note */}
        <div className="mt-4 pt-3 border-top text-muted small" style={{ borderColor: 'rgba(200, 162, 122, 0.4)' }}>
          <span className="font-editorial fw-semibold" style={{ color: '#4B2633' }}>
            Suchetha Kapuarachchi
          </span>
          <span className="mx-2">•</span>
          <span className="font-cormorant fst-italic">Sri Lankan Novelist</span>
        </div>
      </div>
    </div>
  );
};
