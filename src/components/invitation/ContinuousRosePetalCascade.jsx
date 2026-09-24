import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = `${import.meta.env.BASE_URL}assets/envelope-scene/`;

const PETAL_SPRITES = [
  `${BASE}petal_red_1.png`,
  `${BASE}petal_pink_1.png`,
  `${BASE}petal_red_2.png`,
  `${BASE}petal_pink_2.png`,
  `${BASE}petal_red_3.png`,
  `${BASE}petal_pink_3.png`,
  `${BASE}petal_red_4.png`,
  `${BASE}petal_pink_4.png`,
];

/**
 * ContinuousRosePetalCascade Component
 * 
 * Cinematic, photorealistic cascade of soft-focus pink and deep red rose petals.
 * - Triggers upon interaction, falling majestically across the invitation card.
 * - Fluidly continues across the cross-dissolve into the main site.
 * - After the transition completes (4.5s), it gently fades out so the main page
 *   settles into its normal, elegant ambient petal density without overcrowding.
 */
export default function ContinuousRosePetalCascade({ active = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // When active starts, allow the cascade to bridge the entrance into the main site,
  // then gracefully fade out so the main site maintains its normal calm petal count
  useEffect(() => {
    if (!active) return;
    setIsFadingOut(false);
    setIsFinished(false);

    // Fade out after 4.2 seconds (after cross-dissolve completes)
    const tFade = setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    // Unmount after fade completes at 5.5 seconds
    const tDone = setTimeout(() => {
      setIsFinished(true);
    }, 5500);

    return () => {
      clearTimeout(tFade);
      clearTimeout(tDone);
    };
  }, [active]);

  // Generate randomized physical properties for the entrance cascade
  const petals = useMemo(() => {
    const totalCount = prefersReducedMotion ? 6 : isMobile ? 14 : 26;
    const items = [];

    for (let i = 0; i < totalCount; i++) {
      const sprite = PETAL_SPRITES[i % PETAL_SPRITES.length];
      const xPercent = 4 + ((i * 14.3) % 92);
      const duration = 5.5 + ((i * 2.1) % 6.5);
      const initialDelay = ((i * 0.16) % 2.0);

      const isForeground = i % 5 === 0;
      const isBackground = !isForeground && i % 3 === 0;

      let size, blur, maxOpacity, swayX, rotZDelta;

      if (isForeground) {
        size = isMobile ? 38 : 56 + (i % 3) * 10;
        blur = '3.2px';
        maxOpacity = 0.88;
        swayX = 32 + (i % 4) * 8;
        rotZDelta = 240;
      } else if (isBackground) {
        size = isMobile ? 16 : 20 + (i % 4) * 3;
        blur = '1.6px';
        maxOpacity = 0.52;
        swayX = 16 + (i % 4) * 5;
        rotZDelta = 160 + (i % 3) * 35;
      } else {
        size = isMobile ? 24 : 32 + (i % 5) * 5;
        blur = '0px';
        maxOpacity = 0.94;
        swayX = 24 + (i % 4) * 7;
        rotZDelta = 200 + (i % 5) * 30;
      }

      const swayDir = i % 2 === 0 ? 1 : -1;
      const rotZStart = (i * 51) % 360;
      const rotXCycles = (i % 2 === 0 ? 2 : 3) * 360;
      const rotYCycles = (i % 3 === 0 ? 2 : 1) * 360;

      items.push({
        id: `cascade-petal-${i}`,
        sprite,
        startX: xPercent,
        size,
        blur,
        maxOpacity,
        duration,
        initialDelay,
        swayX: swayX * swayDir,
        rotZStart,
        rotZDelta: rotZDelta * swayDir,
        rotXCycles,
        rotYCycles,
      });
    }

    return items;
  }, [isMobile, prefersReducedMotion]);

  if (!active || isFinished) return null;

  return (
    <div
      className="continuous-petal-cascade-stage"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10005,
        overflow: 'hidden',
        perspective: '1200px',
        WebkitPerspective: '1200px',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 1.3s ease-out',
      }}
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="continuous-petal-item"
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.startX}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            filter: p.blur !== '0px' ? `blur(${p.blur})` : 'none',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            backfaceVisibility: 'visible',
            WebkitBackfaceVisibility: 'visible',
            willChange: 'transform, opacity',
          }}
          initial={{
            y: '-12vh',
            x: 0,
            rotate: p.rotZStart,
            rotateX: 0,
            rotateY: 0,
            opacity: 0,
          }}
          animate={{
            y: ['-12vh', '112vh'],
            x: [
              0,
              p.swayX * 0.7,
              -p.swayX * 0.4,
              p.swayX * 1.1,
              -p.swayX * 0.3,
              0,
            ],
            rotate: [p.rotZStart, p.rotZStart + p.rotZDelta],
            rotateX: [0, p.rotXCycles * 0.5, p.rotXCycles],
            rotateY: [0, p.rotYCycles * 0.5, p.rotYCycles],
            opacity: [0, p.maxOpacity, p.maxOpacity * 0.98, p.maxOpacity * 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            delay: p.initialDelay,
            times: [0, 0.08, 0.5, 0.92, 1],
          }}
        >
          <img
            src={p.sprite}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(35, 8, 12, 0.35))',
              userSelect: 'none',
              WebkitUserDrag: 'none',
            }}
            loading="eager"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
