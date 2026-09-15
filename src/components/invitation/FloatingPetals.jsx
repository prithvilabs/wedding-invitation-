import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Realistic Botanical Rose Petal Shapes
 * Handcrafted organic vectors featuring natural curvature, subtle folds, vein lines, and velvety gradients.
 */
const RealisticPetal = ({ type, colorScheme, id }) => {
  const getGradients = () => {
    switch (colorScheme) {
      case 'royal-ruby':
        return {
          main: ['#d6344d', '#9e152d', '#520814'],
          shadow: '#38040d',
          highlight: '#ff8597',
          goldEdge: 'rgba(255, 215, 130, 0.45)',
        };
      case 'garnet-gold':
        return {
          main: ['#b8203a', '#780d1f', '#3b050d'],
          shadow: '#240207',
          highlight: '#f06d84',
          goldEdge: 'rgba(235, 185, 90, 0.65)',
        };
      case 'blush-crimson':
        return {
          main: ['#e64964', '#b01e38', '#5e0b1b'],
          shadow: '#400611',
          highlight: '#ffa8b8',
          goldEdge: 'rgba(255, 235, 180, 0.35)',
        };
      case 'velvet-deep':
      default:
        return {
          main: ['#a81930', '#6e0c1c', '#33030b'],
          shadow: '#1f0106',
          highlight: '#e85870',
          goldEdge: 'rgba(240, 195, 110, 0.4)',
        };
    }
  };

  const g = getGradients();
  const gradId = `petal-grad-${id}`;
  const shadowId = `petal-shadow-${id}`;
  const edgeId = `petal-edge-${id}`;

  if (type === 'cupped') {
    // Cupped Rose Petal with natural apex notch and internal 3D cup shadow
    return (
      <svg viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
        <defs>
          <radialGradient id={gradId} cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor={g.highlight} stopOpacity="0.95" />
            <stop offset="30%" stopColor={g.main[0]} stopOpacity="0.95" />
            <stop offset="70%" stopColor={g.main[1]} stopOpacity="0.92" />
            <stop offset="100%" stopColor={g.main[2]} stopOpacity="0.88" />
          </radialGradient>
          <linearGradient id={shadowId} x1="50%" y1="90%" x2="50%" y2="20%">
            <stop offset="0%" stopColor={g.shadow} stopOpacity="0.75" />
            <stop offset="100%" stopColor={g.shadow} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={edgeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={g.goldEdge} />
            <stop offset="60%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Main Petal Body with organic wavy contours */}
        <path
          d="M20 3 C26 3, 35 8, 37 18 C39 28, 30 38, 20 41 C10 38, 1 28, 3 18 C5 8, 14 3, 20 3 Z"
          fill={`url(#${gradId})`}
        />
        {/* Subtle Apex Notch */}
        <path
          d="M17 3 C19 5, 21 5, 23 3"
          stroke={g.main[2]}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Internal Cup Shadow giving realistic concave depth */}
        <path
          d="M10 24 C14 34, 26 34, 30 24 C28 32, 12 32, 10 24 Z"
          fill={`url(#${shadowId})`}
        />
        {/* Delicate Central Vein Radiance */}
        <path
          d="M20 40 C20 30, 20 16, 20 8"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        {/* Outer Rim Light */}
        <path
          d="M4 16 C6 8, 14 4, 20 4 C26 4, 34 8, 36 16"
          stroke={`url(#${edgeId})`}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'folded') {
    // Asymmetrically Curled Petal with realistic folded edge
    return (
      <svg viewBox="0 0 38 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
        <defs>
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={g.highlight} stopOpacity="0.95" />
            <stop offset="40%" stopColor={g.main[0]} stopOpacity="0.92" />
            <stop offset="85%" stopColor={g.main[1]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={g.main[2]} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={shadowId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={g.shadow} stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Base Petal Body */}
        <path
          d="M18 2 C28 3, 36 12, 34 24 C32 34, 24 39, 17 40 C10 39, 4 33, 4 22 C4 11, 10 1, 18 2 Z"
          fill={`url(#${gradId})`}
        />
        {/* Curled Flap with softer rim */}
        <path
          d="M6 14 C12 12, 16 18, 14 28 C10 26, 6 22, 6 14 Z"
          fill={`url(#${shadowId})`}
        />
        {/* Fold Highlight */}
        <path
          d="M6 14 C12 12, 16 18, 14 28"
          stroke="rgba(255, 230, 200, 0.4)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        {/* Fine Vein Whisper */}
        <path
          d="M17 38 C17 28, 20 18, 22 10"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="0.6"
        />
      </svg>
    );
  }

  if (type === 'side-flutter') {
    // Slender Side-View Petal seen during tumbling flutter
    return (
      <svg viewBox="0 0 32 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={g.highlight} stopOpacity="0.95" />
            <stop offset="45%" stopColor={g.main[0]} stopOpacity="0.9" />
            <stop offset="85%" stopColor={g.main[1]} stopOpacity="0.88" />
            <stop offset="100%" stopColor={g.main[2]} stopOpacity="0.82" />
          </linearGradient>
        </defs>
        <path
          d="M16 2 C24 8, 28 22, 22 36 C18 42, 14 44, 13 44 C11 44, 8 38, 7 30 C5 18, 10 4, 16 2 Z"
          fill={`url(#${gradId})`}
        />
        {/* Rolled outer contour line */}
        <path
          d="M16 2 C24 8, 28 22, 22 36"
          stroke={g.goldEdge}
          strokeWidth="0.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'broad-ripple') {
    // Wide Undulating Rose Petal with gentle ruffled rim
    return (
      <svg viewBox="0 0 42 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={g.highlight} stopOpacity="0.95" />
            <stop offset="40%" stopColor={g.main[0]} stopOpacity="0.93" />
            <stop offset="80%" stopColor={g.main[1]} stopOpacity="0.9" />
            <stop offset="100%" stopColor={g.main[2]} stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <path
          d="M21 2 C28 1, 38 6, 40 16 C41 24, 34 32, 21 36 C8 32, 1 24, 2 16 C4 6, 14 1, 21 2 Z"
          fill={`url(#${gradId})`}
        />
        {/* Soft edge rim */}
        <path
          d="M5 14 C12 5, 30 5, 37 14"
          stroke="rgba(255, 235, 190, 0.3)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Teardrop Rosebud Petal (default)
  return (
    <svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
      <defs>
        <linearGradient id={gradId} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={g.highlight} stopOpacity="0.95" />
          <stop offset="40%" stopColor={g.main[0]} stopOpacity="0.9" />
          <stop offset="80%" stopColor={g.main[1]} stopOpacity="0.88" />
          <stop offset="100%" stopColor={g.main[2]} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path
        d="M17 2 C25 3, 31 11, 30 22 C29 31, 22 38, 17 38 C12 38, 5 31, 4 22 C3 11, 9 3, 17 2 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M17 37 C17 27, 18 15, 17 6"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.6"
      />
    </svg>
  );
};

/**
 * FloatingPetals Component
 * Continuous, highly realistic, dense falling rose petals across the entire wedding website.
 * Implemented with Framer Motion, 3D tumbling physics, depth-of-field layers, and pointer-events: none.
 */
export default function FloatingPetals() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate realistic, rich particle configurations
  const particles = useMemo(() => {
    // Significantly increased density for luxury wedding atmosphere
    const totalCount = isMobile ? 18 : 38;
    const items = [];

    const types = ['cupped', 'folded', 'side-flutter', 'broad-ripple', 'teardrop'];
    const colorSchemes = ['velvet-deep', 'royal-ruby', 'garnet-gold', 'blush-crimson'];

    for (let i = 0; i < totalCount; i++) {
      const type = types[i % types.length];
      const colorScheme = colorSchemes[i % colorSchemes.length];

      // Even horizontal spread with gentle organic offset
      const startX = ((i + 0.5) / totalCount) * 96 + ((i * 13) % 9) - 4;
      const boundedX = Math.max(2, Math.min(96, startX));

      // Slow, graceful, cinematic falling duration (16s to 32s)
      const duration = 16 + ((i * 3.7) % 12) + (i % 3) * 1.5;

      // Negative start delay ensures immediate dense distribution across the entire screen
      const startDelay = -(((i * 2.1) + ((i % 5) * 3.4)) % duration);

      // Depth layers: 0 = Far/Soft, 1 = Mid-depth, 2 = Foreground crisp
      const depthTier = i % 3;
      let width, height, blur, maxOpacity, swayX, rotZDelta;

      if (depthTier === 0) {
        // Soft background petals
        width = 18 + (i % 4) * 2;
        height = width * 1.15;
        blur = '1.6px';
        maxOpacity = 0.5;
        swayX = 30 + (i % 4) * 10;
        rotZDelta = 180 + (i % 3) * 90;
      } else if (depthTier === 1) {
        // Mid-ground petals
        width = 24 + (i % 5) * 2;
        height = width * 1.18;
        blur = '0.5px';
        maxOpacity = 0.78;
        swayX = 50 + (i % 5) * 12;
        rotZDelta = 240 + (i % 4) * 60;
      } else {
        // Foreground crisp petals
        width = 32 + (i % 4) * 3;
        height = width * 1.2;
        blur = '0px';
        maxOpacity = 0.94;
        swayX = 68 + (i % 4) * 15;
        rotZDelta = 320 + (i % 3) * 80;
      }

      const swayDir = i % 2 === 0 ? 1 : -1;
      const rotZStart = (i * 37) % 360;
      const rotXCycles = (i % 2 === 0 ? 2 : 3) * 360;
      const rotYCycles = (i % 3 === 0 ? 2 : 1) * 360;

      items.push({
        id: `rose-petal-${i}`,
        type,
        colorScheme,
        startX: boundedX,
        width,
        height,
        blur,
        maxOpacity,
        duration,
        startDelay,
        swayX: swayX * swayDir,
        rotZStart,
        rotZDelta: rotZDelta * swayDir,
        rotXCycles,
        rotYCycles,
      });
    }

    return items;
  }, [isMobile]);

  return (
    <div className="floating-petals-stage" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="floating-petal-item"
          style={{
            left: `${p.startX}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            filter: p.blur !== '0px' ? `blur(${p.blur})` : 'none',
          }}
          initial={{
            y: '-10vh',
            x: 0,
            rotate: p.rotZStart,
            rotateX: 0,
            rotateY: 0,
            opacity: 0,
          }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [
              0,
              p.swayX * 0.75,
              -p.swayX * 0.45,
              p.swayX * 0.9,
              -p.swayX * 0.25,
              0,
            ],
            rotate: [p.rotZStart, p.rotZStart + p.rotZDelta],
            rotateX: [0, p.rotXCycles * 0.5, p.rotXCycles],
            rotateY: [0, p.rotYCycles * 0.5, p.rotYCycles],
            opacity: [0, p.maxOpacity, p.maxOpacity * 0.96, p.maxOpacity * 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: p.startDelay,
            times: [0, 0.08, 0.5, 0.92, 1],
          }}
        >
          <RealisticPetal type={p.type} colorScheme={p.colorScheme} id={p.id} />
        </motion.div>
      ))}
    </div>
  );
}
