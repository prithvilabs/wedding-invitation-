import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, isMuted, toggleMusic } = useMusic();

  const isAudible = isPlaying && !isMuted;

  return (
    <aside className="floating-music-dock" aria-label="Music Control">
      <button
        type="button"
        className={`floating-music-icon-btn ${isAudible ? 'is-playing' : 'is-paused'}`}
        id="floatingMusicBtn"
        onClick={toggleMusic}
        aria-label={isAudible ? "Pause wedding music" : "Resume wedding music"}
        aria-pressed={isAudible}
      >
        {isAudible ? (
          <Volume2 size={22} strokeWidth={2} className="music-svg-icon" />
        ) : (
          <VolumeX size={22} strokeWidth={2} className="music-svg-icon" />
        )}
      </button>
    </aside>
  );
}
