import React from 'react';
import { motion } from 'framer-motion';
import { backgroundArtworkVariants, backgroundVeilVariants } from '../../animations/variants';

/**
 * StaticBackground Layer
 * Completely independent, persistent, non-moving physical background artwork layer.
 * Starts obscured/softened and progressively reveals into full luminous brightness.
 */
export default function StaticBackground({ sessionKey = 0 }) {
  return (
    <div className="wedding-persistent-bg" aria-hidden="true">
      {/* 1. Underlying Continuous Artwork with progressive clarity reveal */}
      <motion.div
        key={`artwork-${sessionKey}`}
        className="wedding-artwork-layer"
        variants={backgroundArtworkVariants}
        initial="hidden"
        animate="visible"
      />

      {/* 2. Soft Cinematic Veil (Progressively fades out from 0.0s to 2.5s) */}
      <motion.div
        key={`veil-${sessionKey}`}
        className="wedding-cinematic-veil"
        variants={backgroundVeilVariants}
        initial="hidden"
        animate="visible"
      />

      {/* 3. Subtle Readability Scrim (Permanent subtle lighting, preserving bright luxurious artwork) */}
      <div className="wedding-ambient-scrim" />

      {/* 4. Warm Central Radial Glow */}
      <div className="wedding-gold-radial" />
    </div>
  );
}
