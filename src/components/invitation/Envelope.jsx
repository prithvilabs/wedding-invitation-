import React from 'react';
import { motion } from 'framer-motion';
import WaxSeal from './WaxSeal';
import { envelopeModalVariants, envelopeFlapVariants } from '../../animations/variants';
import weddingLogo from '../../assets/wedding-logo.png';

export default function Envelope({ openingState, onOpen, onFlapComplete }) {
  const isOpening = openingState === 'OPENING';

  return (
    <motion.div
      className="envelope-modal-overlay"
      variants={envelopeModalVariants}
      initial="closed"
      animate={isOpening ? "opening" : "closed"}
      exit="exit"
      role="region"
      aria-label="Wedding Invitation Envelope"
    >
      <div className="envelope-outer-box">
        {/* Top Decorative Header */}
        <div className="envelope-sacred-header">
          <img
            src={weddingLogo}
            alt="Wedding Emblem"
            className="envelope-header-logo"
          />
          <p className="envelope-tagline">ROYAL TAMIL NADU HINDU WEDDING INVITATION</p>
        </div>

        {/* Envelope Body */}
        <div className="envelope-body-panel">
          {/* Top 3D Animated Flap */}
          <motion.div
            className="envelope-top-flap"
            variants={envelopeFlapVariants}
            animate={isOpening ? "open" : "closed"}
            onAnimationComplete={() => {
              if (isOpening && onFlapComplete) {
                onFlapComplete();
              }
            }}
          >
            <div className="flap-gold-rim" />
          </motion.div>

          {/* Envelope Center Crest & Address */}
          <div className="envelope-address-lockup">
            <div className="envelope-flourish">❈ ❖ ❈</div>
            <h2 className="envelope-title">Prithvi Raj <span>&amp;</span> Harshini</h2>
            <p className="envelope-subtext">Together with our families, we invite you to celebrate our sacred union</p>
            <div className="envelope-date-preview">28TH JANUARY 2027 · CHENNAI</div>
          </div>

          {/* Interactive Wax Seal */}
          <div className="envelope-seal-dock">
            <WaxSeal onBreak={onOpen} isBreaking={isOpening} />
            <motion.p
              className="seal-prompt-text"
              animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            >
              ✦ TAP WAX SEAL TO OPEN INVITATION ✦
            </motion.p>
          </div>
        </div>

        {/* Gold Border Trims */}
        <div className="envelope-corner-accent tr" />
        <div className="envelope-corner-accent tl" />
        <div className="envelope-corner-accent br" />
        <div className="envelope-corner-accent bl" />
      </div>
    </motion.div>
  );
}
