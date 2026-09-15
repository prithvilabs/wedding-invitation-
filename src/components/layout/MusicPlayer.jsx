import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, isMuted, toggleMusic } = useMusic();

  const isAudible = isPlaying && !isMuted;

  return (
    <aside className="floating-music-dock" aria-label="Wedding Music Player">
      <button
        type="button"
        className={`floating-music-btn ${isAudible ? 'is-playing' : ''}`}
        id="floatingMusicBtn"
        onClick={toggleMusic}
        aria-label={isAudible ? "Pause wedding background music" : "Play wedding background music"}
        aria-pressed={isAudible}
      >
        <span className="music-icon-pod" aria-hidden="true">
          {isAudible ? (
            <Volume2 size={16} strokeWidth={1.75} className="music-svg-icon" />
          ) : (
            <VolumeX size={16} strokeWidth={1.75} className="music-svg-icon" />
          )}
        </span>
        <span className="music-equalizer" aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <span className="music-label">
          {isAudible ? 'Nadaswaram Playing' : 'Nadaswaram Ambience'}
        </span>
      </button>
    </aside>
  );
}
