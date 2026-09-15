import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './Envelope';
import WeddingNames from './WeddingNames';
import StaticBackground from './StaticBackground';

export default function InvitationOpening({ onComplete, onReplayRequest, forceHeroMode = false }) {
  const [openingState, setOpeningState] = useState(forceHeroMode ? 'OPENED' : 'CLOSED');
  const [replayKey, setReplayKey] = useState(0);

  const handleOpenEnvelope = () => {
    setOpeningState('OPENING');
    // Transition from opening flap to name reveal after envelope animation
    setTimeout(() => {
      setOpeningState('NAMES_REVEAL');
    }, 900);
  };

  const handleExplore = () => {
    setOpeningState('OPENED');
    if (onComplete) onComplete();
    const scratchSection = document.getElementById('scratchSection');
    if (scratchSection) {
      scratchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplay = () => {
    setOpeningState('CLOSED');
    setReplayKey(k => k + 1);
  };

  return (
    <div className="invitation-opening-container">
      {/* 1. Static Independent Background Layer (Never moves or blurs during name animation) */}
      <StaticBackground />

      {/* 2. Envelope & Wax Seal Layer */}
      <AnimatePresence mode="wait">
        {openingState === 'CLOSED' || openingState === 'OPENING' ? (
          <Envelope
            key={`envelope-${replayKey}`}
            openingState={openingState}
            onOpen={handleOpenEnvelope}
          />
        ) : null}
      </AnimatePresence>

      {/* 3. Foreground Animated Names Layer (Left & Right Entrance) */}
      <AnimatePresence>
        {openingState === 'NAMES_REVEAL' || openingState === 'OPENED' ? (
          <motion.div
            key={`names-${replayKey}`}
            className="hero-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <WeddingNames
              onExplore={handleExplore}
              onReplay={handleReplay}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
