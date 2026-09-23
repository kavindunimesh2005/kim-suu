import React from 'react';

export const WaxSeal = ({ state = 'intact', onClick, monogram = 'KS', className = '' }) => {
  // state: 'intact' | 'trembling' | 'breaking' | 'broken'

  if (state === 'broken') {
    return null;
  }

  let animationClass = '';
  if (state === 'trembling') {
    animationClass = 'seal-trembling';
  } else if (state === 'breaking') {
    animationClass = 'seal-breaking';
  }

  return (
    <div 
      className={`wax-seal-wrapper ${className}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Wax Seal"
    >
      <div className={`wax-seal-body ${animationClass}`}>
        <div className="wax-seal-rim" />
        <span className="wax-seal-monogram">{monogram}</span>
      </div>
    </div>
  );
};
