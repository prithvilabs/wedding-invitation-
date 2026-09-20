import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Wraps a scene layer and drifts it slightly against pointer / device-tilt
 * movement so flat artwork reads as depth. `speed` is the drift multiplier —
 * background layers use small values, foreground layers larger ones.
 */
export default function ParallaxLayer({
  speed = 0.02,
  className = '',
  style = {},
  children
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (shouldReduceMotion) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const handlePointerMove = (e) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setOffset({ x: dx * 60 * speed * 10, y: dy * 40 * speed * 10 });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [speed, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      animate={shouldReduceMotion ? {} : { x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 40, damping: 20, mass: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
