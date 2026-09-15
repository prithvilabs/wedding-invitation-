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

  useEffect(() => {
    // 1. Initialize Single Global Audio Instance
    const audio = new Audio(weddingSong);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = 'auto';
    audioRef.current = audio;

    // 2. Synchronize Event Listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(audio.muted || audio.volume === 0);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Global Play Handler (called on user gesture)
  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    audio.muted = false;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
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

  return (
    <MusicContext.Provider
      value={{
        audio: audioRef.current,
        isPlaying,
        isMuted,
        hasInteracted,
        playMusic,
        pauseMusic,
        toggleMusic,
        toggleMute,
      }}
    >
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
