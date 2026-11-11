import React from 'react';

/**
 * CountdownCard (CountdownPlaque)
 * Matches the reference design:
 * - Frosted-glass container with warm translucent peach-ivory fill
 * - Luminous glass highlight rim and bevel
 * - Deep burgundy serif numbers (#380a15)
 * - Delicate gold diamond-and-whisker divider flourish
 * - Tracked serif uppercase label (DAYS, HOURS, MINUTES, SECONDS)
 */
function CountdownPlaque({ digits, label }) {
  return (
    <div
      className="countdown-card countdown-plaque-item"
      role="timer"
      aria-label={`${digits} ${label}`}
    >
      <span className="countdown-number">{digits}</span>

      {/* Decorative Gold Divider Flourish matching reference image */}
      <div className="countdown-card-divider" aria-hidden="true">
        <svg width="72" height="10" viewBox="0 0 72 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`cardGoldL-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C59648" stopOpacity="0" />
              <stop offset="60%" stopColor="#C59648" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B3802E" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id={`cardGoldR-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B3802E" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#C59648" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C59648" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="3" y1="5" x2="26" y2="5" stroke={`url(#cardGoldL-${label})`} strokeWidth="1.0" strokeLinecap="round" />
          <circle cx="29.5" cy="5" r="1.05" fill="#B3802E" />
          <polygon points="36,1.8 39,5 36,8.2 33,5" fill="#B3802E" />
          <circle cx="42.5" cy="5" r="1.05" fill="#B3802E" />
          <line x1="46" y1="5" x2="69" y2="5" stroke={`url(#cardGoldR-${label})`} strokeWidth="1.0" strokeLinecap="round" />
        </svg>
      </div>

      <span className="countdown-label">{label}</span>
    </div>
  );
}

const MemoizedCountdownPlaque = React.memo(CountdownPlaque);
export default MemoizedCountdownPlaque;
export { MemoizedCountdownPlaque as CountdownCard };
