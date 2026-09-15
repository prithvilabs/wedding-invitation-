import React from 'react';

export default function StoryAirplane({
  percentX = 50,
  percentY = 0,
  angle = 90,
  bankAngle = 0,
  isFlying = true,
  nightMode = false
}) {
  return (
    <div
      className={`story-airplane-anchor ${nightMode ? 'airplane-night-mode' : ''}`}
      style={{
        left: `${percentX}%`,
        top: `${percentY}%`,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`
      }}
      aria-hidden="true"
    >
      <div
        className="airplane-fuselage-wrapper"
        style={{
          transform: `rotateY(${bankAngle}deg)`
        }}
      >
        {/* Forward Headlight Projection Beam */}
        <div className="airplane-headlight-beam" />

        {/* Dynamic Jet Contrail Stream */}
        {isFlying && (
          <div className="airplane-contrail-stream">
            <span className="contrail-glow" />
            <span className="contrail-particle p1" />
            <span className="contrail-particle p2" />
            <span className="contrail-particle p3" />
          </div>
        )}

        {/* High-Precision Vector Aircraft (Luxury Antique Gold & Forest Accents) */}
        <svg
          className="airplane-svg"
          viewBox="0 0 64 64"
          width="44"
          height="44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic Ground Shadow */}
          <ellipse cx="32" cy="56" rx="16" ry="4.5" fill="rgba(15, 47, 43, 0.28)" />

          {/* Main Aircraft Wings & Fuselage Body */}
          <path
            d="M32 5C29.6 5 27.6 7.6 27.6 13.5V33.5L8 43.5V48.5L27.6 40.5V52.5L21 56.5V59.5L32 56.5L43 59.5V56.5L36.4 52.5V40.5L56 48.5V43.5L36.4 33.5V13.5C36.4 7.6 34.4 5 32 5Z"
            fill="url(#cinematicPlaneGrad)"
            stroke="#734B0B"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Cockpit Canopy */}
          <path
            d="M29.5 10C29.5 9 30.6 8 32 8C33.4 8 34.5 9 34.5 10V15.5H29.5V10Z"
            fill="#0F2F2B"
          />

          {/* Metallic Wing Highlights */}
          <line x1="27.6" y1="35.5" x2="12" y2="43.5" stroke="#FFF5D6" strokeWidth="1" />
          <line x1="36.4" y1="35.5" x2="52" y2="43.5" stroke="#FFF5D6" strokeWidth="1" />

          {/* Centerline Fuselage Reflection */}
          <line x1="32" y1="17" x2="32" y2="45" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.2" />

          {/* Wingtip Navigation Strobe Lights */}
          <circle cx="8.5" cy="45.5" r="2.2" fill="#E53935" className="nav-strobe red-strobe" />
          <circle cx="55.5" cy="45.5" r="2.2" fill="#43A047" className="nav-strobe green-strobe" />
          <circle cx="32" cy="6" r="2.2" fill="#FFF" className="nav-strobe white-beacon" />

          <defs>
            <linearGradient id="cinematicPlaneGrad" x1="8" y1="5" x2="56" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#F5D485" />
              <stop offset="55%" stopColor="#D4A64A" />
              <stop offset="85%" stopColor="#B98224" />
              <stop offset="100%" stopColor="#734B0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
