import React, { useState, useRef, useEffect } from 'react';
import { useMusic } from './MusicProvider';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export const MusicButton = () => {
  const {
    isPlaying,
    isMuted,
    volume,
    isReady,
    isAutoplayBlocked,
    hasError,
    toggleMusic,
    toggleMute,
    setVolume
  } = useMusic();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const panelRef = useRef(null);

  // Close volume popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowVolumeSlider(false);
      }
    };
    if (showVolumeSlider) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showVolumeSlider]);

  if (hasError) {
    // If YouTube video is unavailable or restricted, fail gracefully without showing broken UI
    return null;
  }

  const ariaPlayLabel = isPlaying ? 'Pause background music' : 'Play background music';
  const ariaMuteLabel = isMuted ? 'Unmute background music' : 'Mute background music';

  return (
    <div className="floating-music-widget" ref={panelRef}>
      {/* Expandable Volume Popover */}
      {showVolumeSlider && (
        <div className="music-volume-panel" role="region" aria-label="Music volume controls">
          <button
            onClick={toggleMute}
            className="btn btn-sm p-0 border-0 text-muted"
            title={ariaMuteLabel}
            aria-label={ariaMuteLabel}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="music-volume-slider"
            aria-label="Adjust background music volume"
          />
          <span className="music-volume-text">{isMuted ? '0%' : `${volume}%`}</span>
        </div>
      )}

      {/* Secondary Volume / Mute Button */}
      <button
        onClick={() => setShowVolumeSlider((prev) => !prev)}
        className="music-sub-btn"
        title="Volume & Audio Options"
        aria-label="Toggle background music volume slider"
        aria-expanded={showVolumeSlider}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={16} />
        ) : (
          <Volume2 size={16} />
        )}
      </button>

      {/* Main Play/Pause Floating Controller */}
      <button
        onClick={toggleMusic}
        className="music-toggle-btn"
        title={ariaPlayLabel}
        aria-label={ariaPlayLabel}
      >
        {isPlaying ? (
          <>
            <div className="music-equalizer playing" aria-hidden="true">
              <span className="music-bar music-bar-1" />
              <span className="music-bar music-bar-2" />
              <span className="music-bar music-bar-3" />
            </div>
            <span className="music-label">Atmosphere</span>
          </>
        ) : (
          <>
            <Play size={14} fill="currentColor" />
            <span className="music-label">
              {isAutoplayBlocked ? 'Play Music' : 'Soundtrack'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};
