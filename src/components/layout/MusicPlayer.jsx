import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, isMuted, playBlocked, toggleMusic } = useMusic();

  const isAudible = isPlaying && !isMuted;
  // The browser blocked autoplay: invite one tap (a user gesture) to start the music
  const needsTap = playBlocked && !isAudible;

  const label = isAudible ? 'Pause wedding music' : needsTap ? 'Tap to play wedding music' : 'Resume wedding music';

  return (
    <aside className="floating-music-dock" aria-label="Music Control">
      {needsTap && (
        <span className="music-tap-hint" aria-hidden="true">
          Tap for music
        </span>
      )}
      <button
        type="button"
        className={`floating-music-icon-btn ${isAudible ? 'is-playing' : 'is-paused'}${needsTap ? ' needs-tap' : ''}`}
        id="floatingMusicBtn"
        onClick={toggleMusic}
        aria-label={label}
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
