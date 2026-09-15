import React from 'react';
import { motion } from 'framer-motion';

export default function WorldMapBackground({ cameraX = '0%', cameraY = '0%', cameraScale = 1 }) {
  return (
    <motion.div
      className="story-world-map-backdrop"
      style={{
        x: cameraX,
        y: cameraY,
        scale: cameraScale
      }}
      aria-hidden="true"
    >
      {/* Subtle Illustrated World Map Silhouettes (India to USA flight corridor) */}
      <svg
        className="world-map-svg"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Navigation Grid Lines (Longitudes & Latitudes) */}
        <g stroke="rgba(185, 130, 36, 0.08)" strokeWidth="0.8" strokeDasharray="4 6">
          <line x1="0" y1="225" x2="1200" y2="225" />
          <line x1="0" y1="450" x2="1200" y2="450" />
          <line x1="0" y1="675" x2="1200" y2="675" />
          <line x1="200" y1="0" x2="200" y2="900" />
          <line x1="400" y1="0" x2="400" y2="900" />
          <line x1="600" y1="0" x2="600" y2="900" />
          <line x1="800" y1="0" x2="800" y2="900" />
          <line x1="1000" y1="0" x2="1000" y2="900" />
        </g>

        {/* Continents & Landmasses */}
        {/* North America / Boston (USA) */}
        <path
          d="M120 200 Q180 150 260 170 Q340 200 320 300 Q290 390 210 400 Q140 370 120 270 Z"
          fill="rgba(15, 47, 43, 0.035)"
          stroke="rgba(185, 130, 36, 0.15)"
          strokeWidth="1.2"
        />
        {/* Boston Marker Dot & Label */}
        <circle cx="280" cy="240" r="3" fill="#B98224" opacity="0.6" />
        <text
          x="280"
          y="260"
          fill="rgba(15, 47, 43, 0.45)"
          fontFamily="'Cinzel', serif"
          fontSize="11"
          letterSpacing="2"
          textAnchor="middle"
        >
          BOSTON
        </text>

        {/* Atlantic Ocean Label */}
        <text
          x="480"
          y="400"
          fill="rgba(185, 130, 36, 0.22)"
          fontFamily="'Cinzel', serif"
          fontSize="14"
          letterSpacing="6"
          textAnchor="middle"
        >
          ATLANTIC OCEAN
        </text>

        {/* Europe / Middle East Corridor */}
        <path
          d="M520 240 Q590 200 640 245 Q670 310 600 340 Q530 320 520 240 Z"
          fill="rgba(15, 47, 43, 0.035)"
          stroke="rgba(185, 130, 36, 0.14)"
          strokeWidth="1.2"
        />

        {/* Indian Subcontinent */}
        <path
          d="M740 330 Q820 300 870 350 Q840 480 790 530 Q740 460 730 380 Z"
          fill="rgba(15, 47, 43, 0.04)"
          stroke="rgba(185, 130, 36, 0.18)"
          strokeWidth="1.4"
        />
        {/* Chennai Marker Dot */}
        <circle cx="810" cy="460" r="3.5" fill="#B98224" opacity="0.7" />
        <text
          x="840"
          y="464"
          fill="rgba(15, 47, 43, 0.55)"
          fontFamily="'Cinzel', serif"
          fontSize="10"
          letterSpacing="1.5"
        >
          CHENNAI
        </text>
        {/* Bangalore Marker Dot */}
        <circle cx="770" cy="470" r="3" fill="#B98224" opacity="0.7" />
        <text
          x="715"
          y="474"
          fill="rgba(15, 47, 43, 0.55)"
          fontFamily="'Cinzel', serif"
          fontSize="10"
          letterSpacing="1.5"
        >
          BLR
        </text>

        {/* Bay of Bengal Label */}
        <text
          x="870"
          y="520"
          fill="rgba(185, 130, 36, 0.22)"
          fontFamily="'Cinzel', serif"
          fontSize="11"
          letterSpacing="4"
          textAnchor="middle"
        >
          BAY OF BENGAL
        </text>

        {/* Vintage Compass Rose (top right corner) */}
        <g transform="translate(1060, 160)" opacity="0.45">
          <circle cx="0" cy="0" r="48" stroke="#B98224" strokeWidth="1" fill="none" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="36" stroke="#B98224" strokeWidth="0.8" fill="none" />
          {/* Compass Points */}
          <polygon points="0,-42 6,-8 0,0 -6,-8" fill="#B98224" />
          <polygon points="0,42 6,8 0,0 -6,8" fill="#B98224" opacity="0.6" />
          <polygon points="-42,0 -8,-6 0,0 -8,6" fill="#B98224" opacity="0.6" />
          <polygon points="42,0 8,-6 0,0 8,6" fill="#B98224" opacity="0.6" />
          <text x="0" y="-48" textAnchor="middle" fill="#0F2F2B" fontFamily="'Cinzel', serif" fontSize="10" fontWeight="bold">N</text>
          <text x="56" y="4" textAnchor="middle" fill="#0F2F2B" fontFamily="'Cinzel', serif" fontSize="10" fontWeight="bold">E</text>
          <text x="0" y="60" textAnchor="middle" fill="#0F2F2B" fontFamily="'Cinzel', serif" fontSize="10" fontWeight="bold">S</text>
          <text x="-56" y="4" textAnchor="middle" fill="#0F2F2B" fontFamily="'Cinzel', serif" fontSize="10" fontWeight="bold">W</text>
        </g>
      </svg>

      {/* Floating Clouds */}
      <motion.div
        className="story-cloud cloud-1"
        animate={{ x: [-20, 25, -20] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 160 60" width="160" height="60" fill="rgba(255, 255, 255, 0.45)">
          <path d="M20 45 Q30 20 60 25 Q80 10 110 20 Q140 15 150 45 Q155 55 140 55 L20 55 Q5 55 20 45 Z" />
        </svg>
      </motion.div>

      <motion.div
        className="story-cloud cloud-2"
        animate={{ x: [25, -25, 25] }}
        transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut', delay: 2 }}
      >
        <svg viewBox="0 0 200 70" width="200" height="70" fill="rgba(255, 255, 255, 0.4)">
          <path d="M25 55 Q40 25 75 30 Q100 15 140 25 Q175 20 185 55 Q190 65 170 65 L25 65 Q10 65 25 55 Z" />
        </svg>
      </motion.div>

      <motion.div
        className="story-cloud cloud-3"
        animate={{ x: [-30, 20, -30] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut', delay: 5 }}
      >
        <svg viewBox="0 0 140 50" width="140" height="50" fill="rgba(255, 255, 255, 0.35)">
          <path d="M15 40 Q25 15 50 20 Q70 8 95 18 Q120 12 130 40 Q135 48 120 48 L15 48 Q5 48 15 40 Z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
