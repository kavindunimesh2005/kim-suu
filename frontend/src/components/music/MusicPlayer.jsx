import React, { useEffect, useRef } from 'react';

const YOUTUBE_VIDEO_ID = 'y-AtP4k0mjQ';

export const MusicPlayer = ({ onPlayerReady, onPlayerStateChange, onPlayerError }) => {
  const playerRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      try {
        playerRef.current = new window.YT.Player('yt-bg-music-element', {
          height: '10',
          width: '10',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              if (onPlayerReady) onPlayerReady(event.target);
            },
            onStateChange: (event) => {
              // Enforce seamless looping on track completion
              if (event.data === window.YT.PlayerState.ENDED) {
                try {
                  event.target.playVideo();
                } catch (e) {}
              }
              if (onPlayerStateChange) onPlayerStateChange(event);
            },
            onError: (event) => {
              console.warn('YouTube Background Music encountered event code:', event.data);
              if (onPlayerError) onPlayerError(event);
            }
          }
        });
      } catch (err) {
        console.warn('Failed to initialize YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initPlayer();
      };

      if (!document.getElementById('yt-iframe-api-script')) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    }
  }, [onPlayerReady, onPlayerStateChange, onPlayerError]);

  return (
    <div className="yt-music-hidden-frame" aria-hidden="true">
      <div id="yt-bg-music-element" />
    </div>
  );
};
