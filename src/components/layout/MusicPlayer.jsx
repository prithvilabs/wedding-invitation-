import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music2 } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);

  // Web Audio API Indian Tambura Drone Synthesizer (Sa-Pa-Sa in C#)
  const startDroneSynth = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const droneNotes = [138.59, 207.65, 277.18, 138.59];
      let noteIdx = 0;

      const playPluck = () => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(droneNotes[noteIdx], ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 2.5);

        noteIdx = (noteIdx + 1) % droneNotes.length;
      };

      playPluck();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = setInterval(playPluck, 1200);
    } catch (err) {
      console.warn('Drone synth error:', err);
    }
  };

  const stopDroneSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!isPlaying) {
      if (audio) {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Audio file blocked or not found -> start synthesizer
            startDroneSynth();
            setIsPlaying(true);
          });
      } else {
        startDroneSynth();
        setIsPlaying(true);
      }
    } else {
      if (audio) {
        audio.pause();
      }
      stopDroneSynth();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      stopDroneSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <aside className="floating-music-dock" aria-label="Traditional Mangala Vathiyam Music Player">
      <audio ref={audioRef} id="weddingAudio" loop preload="none">
        <source src="assets/song.mp3" type="audio/mpeg" />
      </audio>

      <button
        type="button"
        className={`floating-music-btn ${isPlaying ? 'is-playing' : ''}`}
        id="floatingMusicBtn"
        onClick={toggleMusic}
        aria-label={isPlaying ? "Mute traditional wedding music" : "Play traditional wedding music"}
        aria-pressed={isPlaying}
      >
        <span className="music-icon-pod" aria-hidden="true">
          {isPlaying ? (
            <Volume2 size={16} strokeWidth={1.75} className="music-svg-icon" />
          ) : (
            <VolumeX size={16} strokeWidth={1.75} className="music-svg-icon" />
          )}
        </span>
        <span className="music-equalizer" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span className="music-label">
          {isPlaying ? 'Nadaswaram Playing' : 'Nadaswaram Ambience'}
        </span>
      </button>
    </aside>
  );
}
