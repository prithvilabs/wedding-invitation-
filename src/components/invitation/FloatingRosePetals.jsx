import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Real photographic rose petal assets
import petal1 from '../../../assets/petal_1.png';
import petal2 from '../../../assets/petal_2.png';
import petal3 from '../../../assets/petal_3.png';
import petal4 from '../../../assets/petal_4.png';

const PETAL_ASSETS = [petal1, petal2, petal3, petal4];

/**
 * FloatingRosePetals Component
 * Premium Cinematic Rose Petal Animation using real transparent photographic assets
 * and multi-axis 3D tumbling Framer Motion physics.
 */
export default function FloatingRosePetals() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  // Generate randomized, natural physical properties for each individual petal,
  // keeping the central 25-30% bottom area clean and unobstructed for caricature placement
  const petals = useMemo(() => {
    const totalCount = prefersReducedMotion ? 6 : isMobile ? 12 : 28;
    const items = [];

    for (let i = 0; i < totalCount; i++) {
      const assetIndex = i % PETAL_ASSETS.length;
      const imageSrc = PETAL_ASSETS[assetIndex];

      // Flank distribution: Left flank (2% - 33%) and Right flank (67% - 97%)
      // Leaves the center-bottom unobstructed and serene
      const isLeftFlank = i % 2 === 0;
      const flankRatio = i / totalCount;
      const boundedX = isLeftFlank
        ? 2 + (flankRatio * 30) + ((i * 7) % 5)
        : 66 + (flankRatio * 28) + ((i * 7) % 5);

      // Slow, luxurious falling speed (18s to 34s)
      const duration = 18 + ((i * 3.7) % 14) + (i % 4) * 1.5;

      // Negative delay ensures petals are naturally in flight on initial load
      const startDelay = -(((i * 2.1) + ((i % 7) * 3.3)) % duration);

      const isForeground = (i % 8 === 0) && !isMobile;
      const isBackground = !isForeground && (i % 3 === 0);

      let size, blur, maxOpacity, swayX, rotZDelta;

      if (isForeground) {
        size = 58 + (i % 3) * 10;
        blur = '3.8px';
        maxOpacity = 0.85;
        swayX = isLeftFlank ? -25 - (i % 4) * 6 : 25 + (i % 4) * 6;
        rotZDelta = 240;
      } else if (isBackground) {
        size = 18 + (i % 4) * 2;
        blur = '1.6px';
        maxOpacity = 0.50;
        swayX = isLeftFlank ? -18 - (i % 4) * 4 : 18 + (i % 4) * 4;
        rotZDelta = 160 + (i % 3) * 50;
      } else {
        size = 30 + (i % 5) * 3.2;
        blur = '0px';
        maxOpacity = 0.92;
        swayX = isLeftFlank ? -22 - (i % 4) * 5 : 22 + (i % 4) * 5;
        rotZDelta = 200 + (i % 5) * 40;
      }

      const swayDir = i % 2 === 0 ? 1 : -1;
      const rotZStart = (i * 47) % 360;
      const rotXCycles = (i % 2 === 0 ? 2 : 3) * 360;
      const rotYCycles = (i % 3 === 0 ? 2 : 1) * 360;

      items.push({
        id: `real-petal-${i}`,
        imageSrc,
        startX: boundedX,
        size,
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
  }, [isMobile, prefersReducedMotion]);

  return (
    <div className="floating-petals-stage" aria-hidden="true">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="floating-petal-item"
          style={{
            left: `${p.startX}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
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
            // Gentle organic S-curve wind drift
            x: [
              0,
              p.swayX * 0.8,
              -p.swayX * 0.5,
              p.swayX * 1.05,
              -p.swayX * 0.3,
              0,
            ],
            // Dynamic 3D tumbling across multiple axes
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
          <img
            src={p.imageSrc}
            alt=""
            className="photorealistic-petal-img"
            loading="eager"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
