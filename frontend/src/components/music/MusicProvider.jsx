import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { MusicPlayer } from './MusicPlayer';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  // Load persisted settings or sensible defaults
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved !== null ? Math.max(0, Math.min(100, Number(saved))) : 20;
  });
  const [isReady, setIsReady] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  const playerRef = useRef(null);
  const pendingPlayRef = useRef(false);

  // Sync volume with player & localStorage
  const setVolume = useCallback((newVolume) => {
    const clamped = Math.max(0, Math.min(100, Number(newVolume)));
    setVolumeState(clamped);
    localStorage.setItem('musicVolume', String(clamped));
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(clamped);
        if (clamped > 0 && isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        }
      } catch (e) {}
    }
  }, [isMuted]);

  // Attempt to play music
  const playMusic = useCallback(() => {
    localStorage.setItem('musicEnabled', 'true');
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      } catch (err) {
        console.warn('Playback request error:', err);
        setIsAutoplayBlocked(true);
      }
    } else {
      pendingPlayRef.current = true;
    }
  }, []);

  // Pause music preserving track position
  const pauseMusic = useCallback(() => {
    localStorage.setItem('musicEnabled', 'false');
    pendingPlayRef.current = false;
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (err) {
        console.warn('Pause request error:', err);
      }
    }
  }, []);

  // Toggle play/pause
  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying, pauseMusic, playMusic]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (e) {}
  }, [isMuted]);

  // Special entry trigger when invitation envelope is opened & portfolio is entered
  const startMusicAfterInvitation = useCallback(() => {
    const userPreference = localStorage.getItem('musicEnabled');
    if (userPreference === 'false') {
      // User explicitly turned off music previously; do not force
      return;
    }

    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.setVolume(volume);
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      } catch (err) {
        console.warn('Autoplay after invitation blocked:', err);
        setIsAutoplayBlocked(true);
      }
    } else {
      pendingPlayRef.current = true;
    }
  }, [volume]);

  // Handle YouTube Player callbacks
  const handlePlayerReady = useCallback((player) => {
    playerRef.current = player;
    setIsReady(true);
    try {
      player.setVolume(volume);
      if (isMuted) {
        player.mute();
      }

      // If a play request was queued while initializing
      if (pendingPlayRef.current) {
        pendingPlayRef.current = false;
        player.playVideo();
      } else {
        // If invitation was already unlocked in session and user preference is enabled
        const isUnlocked = sessionStorage.getItem('invitation_unlocked') === 'true';
        const musicEnabled = localStorage.getItem('musicEnabled');
        if (isUnlocked && musicEnabled === 'true') {
          player.playVideo();
        }
      }
    } catch (err) {
      console.warn('Error during player ready setup:', err);
    }
  }, [volume, isMuted]);

  const handlePlayerStateChange = useCallback((event) => {
    // 1 = PLAYING, 2 = PAUSED
    if (event.data === 1) {
      setIsPlaying(true);
      setIsAutoplayBlocked(false);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  }, []);

  const handlePlayerError = useCallback((event) => {
    setHasError(true);
  }, []);

  const contextValue = {
    isPlaying,
    isMuted,
    volume,
    isReady,
    isAutoplayBlocked,
    hasError,
    playMusic,
    pauseMusic,
    toggleMusic,
    toggleMute,
    setVolume,
    startMusicAfterInvitation
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
      <MusicPlayer
        onPlayerReady={handlePlayerReady}
        onPlayerStateChange={handlePlayerStateChange}
        onPlayerError={handlePlayerError}
      />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
