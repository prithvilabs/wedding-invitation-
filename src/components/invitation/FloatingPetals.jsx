import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Petal SVG Shapes
 * Rich, delicate floral vectors: Rose petals, Jasmine/Ivory petals, Saffron/Marigold petals, and Temple leaves.
 */
const PetalSVG = ({ type, colorScheme }) => {
  switch (type) {
    case 'rose':
      return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
          <defs>
            <linearGradient id={`roseGrad-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {colorScheme === 1 ? (
                <>
                  <stop offset="0%" stopColor="#d94b62" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#8a1327" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4a0814" stopOpacity="0.85" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#e86b7d" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#a31d33" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5e0c19" stopOpacity="0.85" />
                </>
              )}
            </linearGradient>
            <linearGradient id={`roseEdge-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd885" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M16 2 C23 2, 29 9, 28 18 C27 25, 20 30, 16 30 C12 30, 5 25, 4 18 C3 9, 9 2, 16 2 Z"
            fill={`url(#roseGrad-${colorScheme})`}
          />
          <path
            d="M16 2 C21 4, 26 10, 25 17 C22 13, 18 10, 14 9"
            stroke={`url(#roseEdge-${colorScheme})`}
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'jasmine':
      return (
        <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
          <defs>
            <linearGradient id={`jasmineGrad-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#fff6e3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dfb35a" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <path
            d="M14 2 C18 6, 23 12, 21 19 C19 25, 15 26, 14 26 C13 26, 9 25, 7 19 C5 12, 10 6, 14 2 Z"
            fill={`url(#jasmineGrad-${colorScheme})`}
          />
        </svg>
      );

    case 'marigold':
      return (
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
          <defs>
            <linearGradient id={`marigoldGrad-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd166" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#e58c1f" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#964000" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M15 3 C20 4, 25 11, 23 18 C21 24, 17 27, 15 27 C13 27, 9 24, 7 18 C5 11, 10 4, 15 3 Z"
            fill={`url(#marigoldGrad-${colorScheme})`}
          />
        </svg>
      );

    case 'leaf':
      return (
        <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
          <defs>
            <linearGradient id={`leafGrad-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ba35a" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#486d30" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#a38234" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <path
            d="M12 2 C18 7, 21 16, 17 24 C14 28, 12 30, 12 30 C12 30, 10 28, 7 24 C3 16, 6 7, 12 2 Z"
            fill={`url(#leafGrad-${colorScheme})`}
          />
          <path
            d="M12 4 L12 28"
            stroke="rgba(223, 179, 90, 0.45)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mote':
    default:
      return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="petal-svg">
          <defs>
            <radialGradient id={`moteGrad-${colorScheme}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#dfb35a" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#cfa049" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="8" cy="8" r="7" fill={`url(#moteGrad-${colorScheme})`} />
        </svg>
      );
  }
};

/**
 * FloatingPetals Component
 * Continuous, smooth falling floral animation across the entire wedding website.
 * Operates gracefully with Framer Motion, GPU-accelerated transforms, and pointer-events: none.
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

  // Generate deterministic particle configuration with organic variations
  const particles = useMemo(() => {
    const totalCount = isMobile ? 10 : 20;
    const items = [];
    const types = ['rose', 'rose', 'jasmine', 'rose', 'marigold', 'leaf', 'rose', 'jasmine', 'mote'];

    for (let i = 0; i < totalCount; i++) {
      const type = types[i % types.length];
      const startX = Math.floor((i / totalCount) * 96 + (Math.random() * 8 - 4)); // Evenly dispersed X coverage
      const duration = 14 + (i % 5) * 2.8 + Math.random() * 3; // 14s to 28s
      // Negative initial delay ensures petals are already naturally floating everywhere on page load
      const startDelay = -((i * 1.7 + Math.random() * 2) % duration);
      
      // Depth layers: 0 = far/blurred, 1 = mid, 2 = near/sharp
      const depthTier = i % 3;
      let size, blur, maxOpacity, swayDistance;

      if (depthTier === 0) {
        // Subtle background layer
        size = type === 'mote' ? 8 : (type === 'leaf' ? 14 : 16);
        blur = '1.8px';
        maxOpacity = 0.45;
        swayDistance = 35;
      } else if (depthTier === 1) {
        // Mid-ground layer
        size = type === 'mote' ? 10 : (type === 'leaf' ? 18 : 22);
        blur = '0.6px';
        maxOpacity = 0.7;
        swayDistance = 50;
      } else {
        // Foreground sharp layer
        size = type === 'mote' ? 12 : (type === 'leaf' ? 22 : 26);
        blur = '0px';
        maxOpacity = 0.88;
        swayDistance = 65;
      }

      const swayDir = i % 2 === 0 ? 1 : -1;
      const rotateInit = Math.floor((i * 47) % 360);
      const rotateTarget = rotateInit + (i % 2 === 0 ? 360 : -360);

      items.push({
        id: `petal-${i}`,
        type,
        colorScheme: (i % 2) + 1,
        startX: Math.max(2, Math.min(96, startX)),
        size,
        blur,
        maxOpacity,
        duration,
        startDelay,
        swayDistance: swayDistance * swayDir,
        rotateInit,
        rotateTarget,
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
            width: `${p.size}px`,
            height: `${p.size * 1.15}px`,
            filter: p.blur !== '0px' ? `blur(${p.blur})` : 'none',
          }}
          initial={{
            y: '-8vh',
            x: 0,
            rotate: p.rotateInit,
            rotateX: 0,
            rotateY: 0,
            opacity: 0,
          }}
          animate={{
            y: ['-8vh', '108vh'],
            x: [
              0,
              p.swayDistance * 0.7,
              -p.swayDistance * 0.5,
              p.swayDistance * 0.9,
              0,
            ],
            rotate: [p.rotateInit, p.rotateTarget],
            rotateX: [0, 180, 360],
            rotateY: [0, 90, 180, 270, 360],
            opacity: [0, p.maxOpacity, p.maxOpacity * 0.95, p.maxOpacity * 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: p.startDelay,
            times: [0, 0.15, 0.5, 0.85, 1],
          }}
        >
          <PetalSVG type={p.type} colorScheme={p.colorScheme} />
        </motion.div>
      ))}
    </div>
  );
}
