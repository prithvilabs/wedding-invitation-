import React from 'react';
import { motion } from 'framer-motion';
import { waxSealVariants } from '../../animations/variants';
import weddingLogo from '../../assets/wedding-logo.png';

export default function WaxSeal({ onBreak, isBreaking = false }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isBreaking && onBreak) {
        onBreak();
      }
    }
  };

  return (
    <motion.button
      type="button"
      className="wax-seal-button"
      aria-label="Tap to open sacred royal wedding invitation"
      onClick={onBreak}
      onKeyDown={handleKeyDown}
      disabled={isBreaking}
      tabIndex={0}
      variants={waxSealVariants}
      initial="idle"
      animate={isBreaking ? "breaking" : "idle"}
      whileHover={!isBreaking ? "hover" : undefined}
      whileTap={!isBreaking ? "tap" : undefined}
    >
      <div className="wax-seal-inner">
        <img
          src={weddingLogo}
          alt="Wedding Emblem"
          className="wax-seal-logo-img"
        />
        <span className="seal-tamil">திறக்க</span>
      </div>
      <div className="seal-gold-border" />
      <div className="seal-radiance-glow" />
    </motion.button>
  );
}
