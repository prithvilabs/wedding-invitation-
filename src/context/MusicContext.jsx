import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import weddingSong from '../assets/wedding-song.mp3';

const MusicContext = createContext(null);

/**
 * Single Global Music Provider
 * Manages exactly ONE HTML Audio instance for the entire wedding invitation.
 */
export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  // The browser refused to start playback (autoplay policy): the music control
  // invites a tap instead of pretending the music is on.
  const [playBlocked, setPlayBlocked] = useState(false);

  useEffect(() => {
    // 1. Initialize Single Global Audio Instance
    const audio = new Audio(weddingSong);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;

    // 2. Synchronize Event Listeners
    // "playing" (not "play") so the UI only shows music as on once sound is
    // actually playing; a blocked or still-buffering start never shows as playing.
    const handlePlaying = () => {
      setIsPlaying(true);
      setPlayBlocked(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(audio.muted || audio.volume === 0);

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Global Play Handler: must be called synchronously inside a user gesture
  // (the curtain touch or the music button) for mobile browsers to allow it.
  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    audio.muted = false;
    if (!audio.paused) return; // already playing: never start a second, overlapping play
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setPlayBlocked(false))
        .catch((err) => {
          // NotAllowedError = blocked by the browser's autoplay policy.
          // AbortError = interrupted by a pause; not a failure.
          if (err && err.name === 'NotAllowedError') setPlayBlocked(true);
          console.warn('Audio playback handled gracefully:', err);
        });
    }
  }, []);

  // Global Pause Handler
  const pauseMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  // Global Toggle Play/Pause Handler
  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }, [playMusic, pauseMusic]);

  // Global Mute/Unmute Handler
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const contextValue = useMemo(
    () => ({
      audio: audioRef.current,
      isPlaying,
      isMuted,
      hasInteracted,
      playBlocked,
      playMusic,
      pauseMusic,
      toggleMusic,
      toggleMute,
    }),
    [isPlaying, isMuted, hasInteracted, playBlocked, playMusic, pauseMusic, toggleMusic, toggleMute]
  );

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
