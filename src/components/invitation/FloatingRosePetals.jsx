import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Photorealistic Rose Petal Vector Models matching Cinematic Wedding Reference
 * Features natural asymmetric curves, curled 3D folds, translucent backlit sunlight rims,
 * and multi-stop velvety gradients.
 */
const CinematicRosePetal = ({ type, paletteIndex, id }) => {
  const palettes = [
    {
      // 1. Sunlit Vibrant Crimson (Primary reference color)
      highlight: '#ff829b',
      sunRim: '#ffaec0',
      bodyTop: '#d82242',
      bodyMid: '#9e102a',
      bodyDark: '#520614',
      shadowFold: '#2b0209',
      warmGlow: 'rgba(255, 220, 140, 0.45)',
    },
    {
      // 2. Romantic Deep Ruby
      highlight: '#ff6985',
      sunRim: '#ff9cb0',
      bodyTop: '#c71837',
      bodyMid: '#8a0a20',
      bodyDark: '#450410',
      shadowFold: '#200106',
      warmGlow: 'rgba(255, 205, 120, 0.4)',
    },
    {
      // 3. Velvety Garnet Wine
      highlight: '#ea5572',
      sunRim: '#f58ea3',
      bodyTop: '#b3132f',
      bodyMid: '#75081a',
      bodyDark: '#38030b',
      shadowFold: '#180104',
      warmGlow: 'rgba(240, 180, 80, 0.35)',
    },
    {
      // 4. Luminous Coral Blush Rose
      highlight: '#ffa3b5',
      sunRim: '#ffd1dc',
      bodyTop: '#e63b59',
      bodyMid: '#ad1833',
      bodyDark: '#610a1b',
      shadowFold: '#36040e',
      warmGlow: 'rgba(255, 235, 170, 0.55)',
    },
  ];

  const p = palettes[paletteIndex % palettes.length];
  const gradId = `cinematic-rose-grad-${id}`;
  const shadowId = `cinematic-rose-shadow-${id}`;
  const rimId = `cinematic-rose-rim-${id}`;

  if (type === 'cupped-broad') {
    // Broad, cupped rose petal with notched crown and deep concave center
    return (
      <svg viewBox="0 0 46 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="rose-petal-svg">
        <defs>
          <radialGradient id={gradId} cx="42%" cy="30%" r="70%">
            <stop offset="0%" stopColor={p.highlight} stopOpacity="0.95" />
            <stop offset="25%" stopColor={p.bodyTop} stopOpacity="0.95" />
            <stop offset="68%" stopColor={p.bodyMid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id={shadowId} x1="50%" y1="95%" x2="50%" y2="30%">
            <stop offset="0%" stopColor={p.shadowFold} stopOpacity="0.75" />
            <stop offset="70%" stopColor={p.shadowFold} stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.sunRim} stopOpacity="0.9" />
            <stop offset="45%" stopColor={p.warmGlow} stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Outer petal body */}
        <path
          d="M23 3.5 C31 3.2, 42.5 9, 43.5 21 C44.5 32, 34.5 44, 23 47 C11.5 44, 1.5 32, 2.5 21 C3.5 9, 15 3.2, 23 3.5 Z"
          fill={`url(#${gradId})`}
        />
        {/* Subtle crown notch */}
        <path
          d="M20 3.5 C22 5.5, 24 5.5, 26 3.5"
          stroke={p.bodyDark}
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* 3D internal cup shadow */}
        <path
          d="M11 27 C16 39.5, 30 39.5, 35 27 C32.5 36.5, 13.5 36.5, 11 27 Z"
          fill={`url(#${shadowId})`}
        />
        {/* Fine organic vein paths */}
        <path
          d="M23 45 C23 34, 22.5 20, 23 9"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
        <path
          d="M23 30 C19 24, 15 19, 10 17"
          stroke="rgba(255, 255, 255, 0.09)"
          strokeWidth="0.55"
        />
        <path
          d="M23 28 C27 22, 31 18, 36 17"
          stroke="rgba(255, 255, 255, 0.09)"
          strokeWidth="0.55"
        />
        {/* Sunlit edge rim */}
        <path
          d="M4.5 19 C6 10, 15 4.5, 23 4.5 C31 4.5, 40 10, 41.5 19"
          stroke={`url(#${rimId})`}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'curled-edge') {
    // Petal with a natural folded/rolled side flap showing inner velvety shadow
    return (
      <svg viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="rose-petal-svg">
        <defs>
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={p.highlight} stopOpacity="0.95" />
            <stop offset="20%" stopColor={p.bodyTop} stopOpacity="0.95" />
            <stop offset="65%" stopColor={p.bodyMid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={shadowId} x1="0%" y1="40%" x2="100%" y2="60%">
            <stop offset="0%" stopColor={p.shadowFold} stopOpacity="0.75" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id={rimId} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p.sunRim} stopOpacity="0.95" />
            <stop offset="60%" stopColor={p.warmGlow} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <path
          d="M21 2.5 C32 4, 41 14, 39 27 C37 38.5, 27 45, 20 46 C12 45, 4.5 38, 4.5 25 C4.5 12.5, 12 1.5, 21 2.5 Z"
          fill={`url(#${gradId})`}
        />
        {/* Curled fold flap */}
        <path
          d="M6.5 16 C14 13.5, 19 20, 16 32 C11 29.5, 6.5 25, 6.5 16 Z"
          fill={`url(#${shadowId})`}
        />
        <path
          d="M6.5 16 C14 13.5, 19 20, 16 32"
          stroke={p.sunRim}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Vein curve */}
        <path
          d="M20 43 C20 32, 22.5 20, 25 10"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="0.7"
        />
        {/* Sunlight rim on crown */}
        <path
          d="M21 3 C30 4.5, 39.5 13, 38 25"
          stroke={`url(#${rimId})`}
          strokeWidth="0.95"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === 'side-flutter') {
    // Dynamic twisting petal seen at an angle in mid-flight
    return (
      <svg viewBox="0 0 38 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="rose-petal-svg">
        <defs>
          <linearGradient id={gradId} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor={p.highlight} stopOpacity="0.95" />
            <stop offset="30%" stopColor={p.bodyTop} stopOpacity="0.95" />
            <stop offset="70%" stopColor={p.bodyMid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <path
          d="M19 2 C28.5 8, 33 24, 26 40 C21 47.5, 16.5 50, 15 50 C13 50, 9 42.5, 8 33.5 C6.5 20, 12 4.5, 19 2 Z"
          fill={`url(#${gradId})`}
        />
        {/* Outer rolled edge */}
        <path
          d="M19 2 C28.5 8, 33 24, 26 40"
          stroke={p.sunRim}
          strokeWidth="0.95"
          strokeLinecap="round"
        />
        <path
          d="M15 48 C17 36, 19 22, 20 8"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="0.65"
        />
      </svg>
    );
  }

  if (type === 'wavy-ripple') {
    // Wide undulating petal with natural petal ripples
    return (
      <svg viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="rose-petal-svg">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="36%" r="64%">
            <stop offset="0%" stopColor={p.highlight} stopOpacity="0.95" />
            <stop offset="25%" stopColor={p.bodyTop} stopOpacity="0.95" />
            <stop offset="68%" stopColor={p.bodyMid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0.9" />
          </radialGradient>
        </defs>

        <path
          d="M24 2.5 C32.5 1.5, 44 7, 46 18.5 C47 28, 39 37.5, 24 41.5 C9 37.5, 1 28, 2 18.5 C4 7, 15.5 1.5, 24 2.5 Z"
          fill={`url(#${gradId})`}
        />
        {/* Sunlit ripple rim */}
        <path
          d="M5.5 17 C13.5 6, 34.5 6, 42.5 17"
          stroke={p.sunRim}
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <path
          d="M24 39 C24 28, 24 15, 24 6"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Classic Teardrop Rose Petal (Default)
  return (
    <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="rose-petal-svg">
      <defs>
        <linearGradient id={gradId} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={p.highlight} stopOpacity="0.95" />
          <stop offset="25%" stopColor={p.bodyTop} stopOpacity="0.95" />
          <stop offset="68%" stopColor={p.bodyMid} stopOpacity="0.95" />
          <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <path
        d="M20 2.5 C29.5 3.5, 36.5 12.5, 35.5 25 C34.5 35.5, 26 43, 20 43 C14 43, 5.5 35.5, 4.5 25 C3.5 12.5, 10.5 3.5, 20 2.5 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M20 41 C20 30, 21 16, 20 6"
        stroke="rgba(255, 255, 255, 0.18)"
        strokeWidth="0.7"
      />
      <path
        d="M6.5 20 C8.5 11, 14.5 5.5, 20 5.5 C25.5 5.5, 31.5 11, 33.5 20"
        stroke={p.sunRim}
        strokeWidth="0.85"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * FloatingRosePetals Component
 * Recreates the exact cinematic falling rose petal atmosphere from the reference image:
 * - Macro foreground petals with camera bokeh blur passing near the lens
 * - Sharp, richly-detailed midground petals tumbling in 3D perspective
 * - Delicate background petals floating high in the sky
 * - Continuous, non-repeating flow with pointer-events: none
 */
export default function FloatingRosePetals() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkState = () => {
      setIsMobile(window.innerWidth < 768);
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    checkState();
    window.addEventListener('resize', checkState);
    return () => window.removeEventListener('resize', checkState);
  }, []);

  // Generate particle configuration matching the visual depth of the reference image
  const petals = useMemo(() => {
    // Total count tailored to match the rich density in the reference image (approx 40 on desktop, 18 on mobile)
    const totalCount = prefersReducedMotion ? 8 : isMobile ? 18 : 42;
    const items = [];

    const types = ['cupped-broad', 'curled-edge', 'side-flutter', 'wavy-ripple', 'teardrop'];

    for (let i = 0; i < totalCount; i++) {
      const type = types[i % types.length];
      const paletteIndex = i % 4;

      // Natural horizontal distribution across 0% to 100% of the viewport width
      const rawX = ((i + 0.5) / totalCount) * 96 + ((i * 19) % 13) - 6;
      const boundedX = Math.max(1, Math.min(97, rawX));

      // Slow, luxurious falling speed (16s to 32s)
      const duration = 16 + ((i * 3.7) % 14) + (i % 4) * 1.5;

      // Negative delay ensures petals are already naturally floating everywhere on initial page load
      const startDelay = -(((i * 2.1) + ((i % 7) * 3.3)) % duration);

      // 3 Cinematic Depth Tiers matching the reference photo:
      // 1. Foreground Macro Petals (~10%): Large, close to camera, with realistic optical depth blur (as seen in bottom-left corner of reference)
      // 2. Midground Sharp Petals (~55%): Crisp, vibrant ruby-crimson, clearly defined folds and highlights
      // 3. Background Distant Petals (~35%): Small, soft blur, floating high in the background
      const isForeground = (i % 8 === 0) && !isMobile;
      const isBackground = !isForeground && (i % 3 === 0);

      let width, height, blur, maxOpacity, swayDistance, rotZDelta;

      if (isForeground) {
        // Macro foreground bokeh (like the prominent blurred petal in the reference)
        width = 62 + (i % 3) * 14; // 62px to 90px
        height = width * 1.12;
        blur = '3.8px';
        maxOpacity = 0.88;
        swayDistance = 90;
        rotZDelta = 260;
      } else if (isBackground) {
        // Soft distant background
        width = 15 + (i % 4) * 2.5; // 15px to 22px
        height = width * 1.15;
        blur = '1.8px';
        maxOpacity = 0.55;
        swayDistance = 35 + (i % 4) * 10;
        rotZDelta = 160 + (i % 3) * 50;
      } else {
        // Sharp primary midground
        width = 28 + (i % 5) * 3.5; // 28px to 42px
        height = width * 1.16;
        blur = '0px';
        maxOpacity = 0.95;
        swayDistance = 60 + (i % 4) * 12;
        rotZDelta = 220 + (i % 5) * 45;
      }

      const swayDir = i % 2 === 0 ? 1 : -1;
      const rotZStart = (i * 47) % 360;
      const rotXCycles = (i % 2 === 0 ? 2 : 3) * 360;
      const rotYCycles = (i % 3 === 0 ? 2 : 1) * 360;

      items.push({
        id: `cinematic-rose-item-${i}`,
        type,
        paletteIndex,
        startX: boundedX,
        width,
        height,
        blur,
        maxOpacity,
        duration,
        startDelay,
        swayX: swayDistance * swayDir,
        rotZStart,
        rotZDelta: rotZDelta * swayDir,
        rotXCycles,
        rotYCycles,
      });
    }

    return items;
  }, [isMobile, prefersReducedMotion]);

  return (
    <div className="floating-petals-stage" aria-hidden="true">
      {petals.map((p) => (
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
            y: '-14vh',
            x: 0,
            rotate: p.rotZStart,
            rotateX: 0,
            rotateY: 0,
            opacity: 0,
          }}
          animate={{
            y: ['-14vh', '114vh'],
            x: [
              0,
              p.swayX * 0.8,
              -p.swayX * 0.5,
              p.swayX * 1.05,
              -p.swayX * 0.3,
              0,
            ],
            rotate: [p.rotZStart, p.rotZStart + p.rotZDelta],
            rotateX: [0, p.rotXCycles * 0.5, p.rotXCycles],
            rotateY: [0, p.rotYCycles * 0.5, p.rotYCycles],
            opacity: [0, p.maxOpacity, p.maxOpacity * 0.98, p.maxOpacity * 0.92, 0],
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
          <CinematicRosePetal type={p.type} paletteIndex={p.paletteIndex} id={p.id} />
        </motion.div>
      ))}
    </div>
  );
}
