import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Very slow, very subtle scale/translate drift applied to an entire scene
 * so static artwork reads as a held film shot rather than a photo.
 * Keep `toScale` within ~1.00-1.06 — anything larger reads as a CSS zoom.
 */
export default function CameraMotion({
  active = true,
  fromScale = 1,
  toScale = 1.05,
  duration = 14,
  className = '',
  style = {},
  children
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ scale: fromScale }}
      animate={active ? { scale: toScale } : { scale: fromScale }}
      transition={{ duration, ease: 'linear' }}
    >
      {children}
    </motion.div>
  );
}
