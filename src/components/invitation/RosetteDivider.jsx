import React from 'react';

export default function RosetteDivider({ className = '' }) {
  return (
    <div className={`royal-rosette-divider ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 340 24"
        className="rosette-divider-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rosetteGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cfa049" stopOpacity="0" />
            <stop offset="65%" stopColor="#cfa049" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#9e6e1e" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="rosetteGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9e6e1e" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#cfa049" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#cfa049" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left hairline with subtle end dot */}
        <line x1="30" y1="12" x2="152" y2="12" stroke="url(#rosetteGradLeft)" strokeWidth="1.1" />
        <circle cx="152.5" cy="12" r="1.3" fill="#9e6e1e" />

        {/* Right hairline with subtle start dot */}
        <circle cx="187.5" cy="12" r="1.3" fill="#9e6e1e" />
        <line x1="188" y1="12" x2="310" y2="12" stroke="url(#rosetteGradRight)" strokeWidth="1.1" />

        {/* Center 8-petal rosette flower */}
        <g transform="translate(170, 12)">
          <circle cx="0" cy="0" r="2.2" fill="#8f6118" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <path
              key={i}
              d="M 0 -2.2 C 1.4 -3.6, 1.4 -5.5, 0 -6.8 C -1.4 -5.5, -1.4 -3.6, 0 -2.2 Z"
              fill="#b58732"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
