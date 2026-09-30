import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ChevronDown, ChevronUp, Disc } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'y-AtP4k0mjQ';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isReady, setIsReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('yt-bg-music-player', {
          height: '1',
          width: '1',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              setIsReady(true);
              event.target.setVolume(70);
              // Try playing immediately
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (window.YT && window.YT.PlayerState) {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                } else if (event.data === window.YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                } else if (event.data === window.YT.PlayerState.ENDED) {
                  // Continuous loop reassurance
                  event.target.playVideo();
                }
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Auto-play on first user interaction anywhere on screen if autoplay was blocked by browser
    const handleFirstUserInteraction = () => {
      setHasInteracted(true);
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        try {
          const state = playerRef.current.getPlayerState ? playerRef.current.getPlayerState() : -1;
          if (state !== 1) { // 1 is PLAYING
            playerRef.current.playVideo();
          }
        } catch (err) {
          console.log('Player interaction trigger', err);
        }
      }
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, []);

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!playerRef.current || typeof playerRef.current.playVideo !== 'function') return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!playerRef.current || typeof playerRef.current.mute !== 'function') return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  return (
    <>
      {/* Hidden YouTube IFrame Container */}
      <div 
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1
        }}
      >
        <div id="yt-bg-music-player"></div>
      </div>

      {/* Floating Modern Literary Background Music Widget */}
      <div 
        className="music-player-floating-container"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {!isExpanded ? (
          /* Minimized Badge */
          <button
            onClick={() => setIsExpanded(true)}
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-lg border-0"
            style={{
              background: 'linear-gradient(135deg, rgba(75, 38, 51, 0.92) 0%, rgba(45, 20, 30, 0.95) 100%)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(200, 162, 122, 0.4)',
              color: '#FBF8F5',
              cursor: 'pointer',
              boxShadow: isPlaying ? '0 8px 30px rgba(75, 38, 51, 0.4), 0 0 15px rgba(200, 162, 122, 0.3)' : '0 4px 15px rgba(0,0,0,0.25)',
              transition: 'all 0.3s ease'
            }}
            title="Music Player (පසුබිම් සංගීතය)"
          >
            {/* Spinning Disc / Icon */}
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isPlaying ? 'music-spin 4s linear infinite' : 'none',
                color: '#C8A27A'
              }}
            >
              <Disc size={20} />
            </div>

            {/* Visualizer bars */}
            <div className="d-flex align-items-end gap-1" style={{ height: '14px' }}>
              <span 
                style={{
                  width: '3px',
                  height: isPlaying ? '14px' : '4px',
                  backgroundColor: '#C8A27A',
                  borderRadius: '2px',
                  animation: isPlaying ? 'music-bar-1 0.8s ease-in-out infinite alternate' : 'none'
                }}
              />
              <span 
                style={{
                  width: '3px',
                  height: isPlaying ? '10px' : '6px',
                  backgroundColor: '#E6D2BF',
                  borderRadius: '2px',
                  animation: isPlaying ? 'music-bar-2 0.6s ease-in-out infinite alternate' : 'none'
                }}
              />
              <span 
                style={{
                  width: '3px',
                  height: isPlaying ? '13px' : '3px',
                  backgroundColor: '#C8A27A',
                  borderRadius: '2px',
                  animation: isPlaying ? 'music-bar-3 0.9s ease-in-out infinite alternate' : 'none'
                }}
              />
            </div>

            <span className="small fw-semibold ms-1 d-none d-sm-inline" style={{ fontSize: '0.82rem', letterSpacing: '0.02em' }}>
              {isPlaying ? 'Music Playing' : 'Play Music'}
            </span>

            {/* Quick Play/Pause on icon */}
            <div 
              onClick={(e) => togglePlay(e)}
              role="button"
              className="p-1 rounded-circle ms-1 d-flex align-items-center justify-content-center"
              style={{ background: 'rgba(200, 162, 122, 0.25)', color: '#FAF6EE' }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} style={{ marginLeft: '1px' }} />}
            </div>
          </button>
        ) : (
          /* Expanded Full Music Player Card */
          <div 
            className="p-3 rounded-4 shadow-2xl animate-fade-in"
            style={{
              width: '290px',
              background: 'linear-gradient(145deg, rgba(40, 20, 28, 0.96) 0%, rgba(65, 32, 44, 0.95) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(200, 162, 122, 0.45)',
              boxShadow: '0 20px 45px rgba(0,0,0,0.5), 0 0 25px rgba(200, 162, 122, 0.2)',
              color: '#FAF6EE'
            }}
          >
            {/* Header: Title & Minimize */}
            <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom" style={{ borderColor: 'rgba(200, 162, 122, 0.25)' }}>
              <div className="d-flex align-items-center gap-2">
                <div 
                  style={{
                    animation: isPlaying ? 'music-spin 3s linear infinite' : 'none',
                    color: '#C8A27A'
                  }}
                >
                  <Disc size={18} />
                </div>
                <div>
                  <div className="fw-bold text-truncate" style={{ fontSize: '0.85rem', color: '#FAF6EE' }}>
                    Background Music
                  </div>
                  <div className="small text-muted" style={{ fontSize: '0.72rem', color: 'rgba(250, 246, 238, 0.65)' }}>
                    පසුබිම් සංගීතය • Continuous Loop
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(false)}
                className="btn btn-sm p-1 rounded-circle border-0"
                style={{ color: 'rgba(250, 246, 238, 0.75)', background: 'rgba(255, 255, 255, 0.1)' }}
                title="Minimize"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Visualizer Wave when active */}
            <div className="d-flex align-items-center justify-content-center gap-1 my-2 py-1" style={{ height: '24px' }}>
              {[0.6, 0.9, 0.5, 0.8, 1.0, 0.7, 0.4, 0.85, 0.65].map((scale, index) => (
                <div 
                  key={index}
                  style={{
                    width: '3px',
                    height: isPlaying ? `${Math.round(20 * scale)}px` : '4px',
                    backgroundColor: index % 2 === 0 ? '#C8A27A' : '#E6D2BF',
                    borderRadius: '2px',
                    transition: 'height 0.2s ease',
                    animation: isPlaying ? `music-bar-${(index % 3) + 1} ${0.5 + index * 0.1}s ease-in-out infinite alternate` : 'none'
                  }}
                />
              ))}
            </div>

            {/* Controls Row */}
            <div className="d-flex align-items-center justify-content-between mt-2 pt-2">
              
              {/* Play / Pause Primary Button */}
              <button
                onClick={togglePlay}
                className="btn btn-sm px-3 py-2 rounded-pill fw-bold d-flex align-items-center gap-2 border-0 shadow-sm"
                style={{
                  background: isPlaying 
                    ? 'linear-gradient(135deg, #C8A27A 0%, #A87E56 100%)' 
                    : 'linear-gradient(135deg, #7A4A56 0%, #4B2633 100%)',
                  color: '#FAF6EE',
                  fontSize: '0.82rem'
                }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Pause' : 'Play Song'}</span>
              </button>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="btn btn-sm p-2 rounded-circle border-0"
                style={{ 
                  background: isMuted ? 'rgba(220, 53, 69, 0.25)' : 'rgba(255, 255, 255, 0.1)', 
                  color: isMuted ? '#FF8E9E' : '#FAF6EE' 
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="mt-3 pt-1">
              <div className="d-flex justify-content-between small mb-1" style={{ fontSize: '0.72rem', color: 'rgba(250, 246, 238, 0.65)' }}>
                <span>Volume</span>
                <span>{isMuted ? '0%' : `${volume}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="form-range"
                style={{
                  accentColor: '#C8A27A',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes music-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes music-bar-1 {
          0% { height: 4px; }
          100% { height: 18px; }
        }
        @keyframes music-bar-2 {
          0% { height: 16px; }
          100% { height: 6px; }
        }
        @keyframes music-bar-3 {
          0% { height: 8px; }
          100% { height: 20px; }
        }
      `}</style>
    </>
  );
};
