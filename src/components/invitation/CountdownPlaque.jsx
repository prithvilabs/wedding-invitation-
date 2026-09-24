import React from 'react';

/**
 * CountdownPlaque
 * Vector accolade cartouche plaque matching the reference design:
 * Top accolade with rosette, bottom accolade with lotus, side notches,
 * inner gold border, and regal typography.
 */
export default function CountdownPlaque({ digits, label }) {
  const isThreeDigits = String(digits).length >= 3;

  return (
    <div className="countdown-plaque-item" role="timer" aria-label={`${digits} ${label}`}>
      <svg
        className="countdown-plaque-svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`plaqueShadow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4.5" floodColor="#380a15" floodOpacity="0.12" />
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#a47524" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Outer Plaque Base */}
        <path
          d="
            M 50 4
            C 56 6, 61 13, 65 14
            L 74 14
            A 14 14 0 0 1 88 28
            L 88 46
            C 86 48, 85 50, 85 50
            C 85 50, 86 52, 88 54
            L 88 72
            A 14 14 0 0 1 74 86
            L 65 86
            C 61 87, 56 94, 50 96
            C 44 94, 39 87, 35 86
            L 26 86
            A 14 14 0 0 1 12 72
            L 12 54
            C 14 52, 15 50, 15 50
            C 15 50, 14 48, 12 46
            L 12 28
            A 14 14 0 0 1 26 14
            L 35 14
            C 39 13, 44 6, 50 4
            Z
          "
          fill="#fdf9f2"
          stroke="#d5b27e"
          strokeWidth="1.3"
          filter={`url(#plaqueShadow-${label})`}
        />

        {/* Inner Gold Contour Line */}
        <path
          d="
            M 50 7.5
            C 55 9.2, 59.5 15, 63.5 16
            L 73 16
            A 11.5 11.5 0 0 1 84.5 27.5
            L 84.5 46.5
            C 83 48.2, 82.2 50, 82.2 50
            C 82.2 50, 83 51.8, 84.5 53.5
            L 84.5 72.5
            A 11.5 11.5 0 0 1 73 84
            L 63.5 84
            C 59.5 85, 55 90.8, 50 92.5
            C 45 90.8, 40.5 85, 36.5 84
            L 27 84
            A 11.5 11.5 0 0 1 15.5 72.5
            L 15.5 53.5
            C 17 51.8, 17.8 50, 17.8 50
            C 17.8 50, 17 48.2, 15.5 46.5
            L 15.5 27.5
            A 11.5 11.5 0 0 1 27 16
            L 36.5 16
            C 40.5 15, 45 9.2, 50 7.5
            Z
          "
          fill="none"
          stroke="#dfc292"
          strokeWidth="0.8"
          opacity="0.9"
        />

        {/* Top Miniature Rosette Emblem */}
        <g transform="translate(50, 12) scale(0.6)">
          <circle cx="0" cy="0" r="1.6" fill="#a47524" />
          <circle cx="0" cy="-3.5" r="1.3" fill="#b58732" />
          <circle cx="0" cy="3.5" r="1.3" fill="#b58732" />
          <circle cx="-3.5" cy="0" r="1.3" fill="#b58732" />
          <circle cx="3.5" cy="0" r="1.3" fill="#b58732" />
          <circle cx="-2.5" cy="-2.5" r="1.1" fill="#b58732" />
          <circle cx="2.5" cy="-2.5" r="1.1" fill="#b58732" />
          <circle cx="-2.5" cy="2.5" r="1.1" fill="#b58732" />
          <circle cx="2.5" cy="2.5" r="1.1" fill="#b58732" />
        </g>

        {/* Big Serif Digits */}
        <text
          x="50"
          y="51"
          fontFamily='"Cinzel", "Cormorant Garamond", Georgia, serif'
          fontSize={isThreeDigits ? '26' : '30'}
          fontWeight="700"
          fill="#2d0610"
          textAnchor="middle"
        >
          {digits}
        </text>

        {/* Tracked Uppercase Label */}
        <text
          x="50"
          y="69"
          fontFamily='"Cinzel", "DM Sans", -apple-system, sans-serif'
          fontSize="8.5"
          fontWeight="600"
          letterSpacing="2.8"
          fill="#642231"
          textAnchor="middle"
        >
          {label}
        </text>

        {/* Bottom Miniature Lotus Emblem */}
        <g transform="translate(50, 84) scale(0.65)">
          <path d="M 0 -4.5 C 1 -2.5, 1.2 -1, 0 0 C -1.2 -1, -1 -2.5, 0 -4.5 Z" fill="#b58732" />
          <path d="M 0 0 C 2.5 -1, 4.5 -0.8, 4 0.5 C 3 1.5, 1 0.8, 0 0 Z" fill="#b58732" />
          <path d="M 0 0 C -2.5 -1, -4.5 -0.8, -4 0.5 C -3 1.5, -1 0.8, 0 0 Z" fill="#b58732" />
          <path d="M 0 0 C 1.8 -3, 3.8 -2.8, 2.8 -1.2 C 1.8 -0.2, 0.7 0, 0 0 Z" fill="#b58732" />
          <path d="M 0 0 C -1.8 -3, -3.8 -2.8, -2.8 -1.2 C -1.8 -0.2, -0.7 0, 0 0 Z" fill="#b58732" />
        </g>
      </svg>
    </div>
  );
}
