import React from 'react';
import { WaxSeal } from './WaxSeal';

export const Envelope = ({ stage = 1 }) => {
  // stage:
  // 1: Envelope appears in center
  // 2: Wax seal trembles & cracks
  // 3: Envelope flap rotates open
  // 4: Letter slides out vertically

  const isFlapOpen = stage >= 3;
  const isLetterSliding = stage >= 4;

  let sealState = 'intact';
  if (stage === 2) {
    sealState = 'trembling';
  } else if (stage >= 3) {
    sealState = 'broken';
  }

  return (
    <div className="envelope-3d-stage animate-fade-in">
      <div className="envelope-3d-box">
        {/* Envelope Back Base */}
        <div className="envelope-back" />

        {/* Envelope Interior Lining */}
        <div className="envelope-lining" />

        {/* Emerging Physical Letter */}
        <div
          className="envelope-sliding-letter"
          style={{
            transform: isLetterSliding ? 'translateY(-150px) scale(1.04)' : 'translateY(0) scale(0.96)',
            zIndex: isLetterSliding ? 3 : 2
          }}
        >
          <div style={{ height: '3px', width: '36px', background: '#C8A27A', marginBottom: '10px' }} />
          <p className="font-editorial fw-bold mb-1" style={{ color: '#4B2633', fontSize: '0.95rem' }}>
            A Letter from Suchetha Kapuarachchi
          </p>
          <p className="font-sinhala-title text-muted mb-0" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
            සමහර ලෝක අපිට දකින්න ලැබෙන්නේ පොත් පිටු අතරින්...
          </p>
        </div>

        {/* Front Pocket of the Envelope (bottom & sides) */}
        <div className="envelope-front-pocket" />

        {/* Triangular Top Flap */}
        <div className={`envelope-flap ${isFlapOpen ? 'open' : ''}`} />

        {/* Wax Seal placed on the point of the flap */}
        {stage < 3 && (
          <div className="envelope-seal-position">
            <WaxSeal state={sealState} monogram="KS" />
          </div>
        )}
      </div>

      <div className="text-center mt-5">
        <p className="font-cormorant fs-5 fst-italic" style={{ color: '#F8F3EE', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {stage === 1 && "The author's envelope arrives..."}
          {stage === 2 && "The royal wax seal fractures..."}
          {stage === 3 && "Unfolding the sealed envelope..."}
          {stage === 4 && "The handwritten letter emerges..."}
        </p>
      </div>
    </div>
  );
};
