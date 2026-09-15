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

  // Generate randomized, natural physical properties for each individual petal
  const petals = useMemo(() => {
    const totalCount = prefersReducedMotion ? 6 : isMobile ? 14 : 34;
    const items = [];

    for (let i = 0; i < totalCount; i++) {
      const assetIndex = i % PETAL_ASSETS.length;
      const imageSrc = PETAL_ASSETS[assetIndex];

      // Natural horizontal distribution across the viewport width
      const rawX = ((i + 0.5) / totalCount) * 96 + ((i * 19) % 13) - 6;
      const boundedX = Math.max(1, Math.min(97, rawX));

      // Slow, luxurious falling speed (18s to 34s)
      const duration = 18 + ((i * 3.7) % 14) + (i % 4) * 1.5;

      // Negative delay ensures petals are already naturally floating across the screen on initial load
      const startDelay = -(((i * 2.1) + ((i % 7) * 3.3)) % duration);

      // 3 Cinematic Depth Tiers:
      // 1. Foreground (~10%): Large (64px-92px), camera-proximity bokeh blur (3.5px-5px)
      // 2. Midground (~55%): Crisp (32px-46px), sharp 0px blur, vivid color
      // 3. Background (~35%): Delicate (16px-24px), soft 1.6px blur, softer opacity
      const isForeground = (i % 9 === 0) && !isMobile;
      const isBackground = !isForeground && (i % 3 === 0);

      let size, blur, maxOpacity, swayX, rotZDelta;

      if (isForeground) {
        size = 66 + (i % 3) * 12; // 66px to 90px
        blur = '4.2px';
        maxOpacity = 0.88;
        swayX = 90;
        rotZDelta = 260;
      } else if (isBackground) {
        size = 18 + (i % 4) * 2; // 18px to 24px
        blur = '1.6px';
        maxOpacity = 0.52;
        swayX = 35 + (i % 4) * 8;
        rotZDelta = 160 + (i % 3) * 50;
      } else {
        size = 32 + (i % 5) * 3.5; // 32px to 46px
        blur = '0px';
        maxOpacity = 0.95;
        swayX = 60 + (i % 4) * 12;
        rotZDelta = 220 + (i % 5) * 45;
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
