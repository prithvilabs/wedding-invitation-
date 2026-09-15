import React from 'react';
import { motion } from 'framer-motion';
import weddingLogo from '../../assets/wedding-logo.png';
import {
  groomNameVariants,
  brideNameVariants,
  wedsVariants,
  heraldVariants,
  detailsVariants
} from '../../animations/variants';

export default function WeddingNames({ onExplore, onReplay }) {
  return (
    <div className="home-floating-composition">
      {/* 1. Actual Wedding Logo (Floating directly over background) */}
      <motion.div
        className="home-actual-logo-dock"
        variants={heraldVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src={weddingLogo}
          alt="Prithvi Raj & Harshini Wedding Logo"
          className="wedding-actual-logo"
        />
      </motion.div>

      {/* 2. Couple Names (Prithvi Raj weds Harshini) */}
      <div className="home-reference-names-stream">
        {/* Groom Name */}
        <motion.div
          className="name-capsule-script groom-script-capsule"
          variants={groomNameVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="reference-script-name">Prithvi Raj</span>
        </motion.div>

        {/* "weds" Accent */}
        <motion.div
          className="name-capsule-script weds-script-capsule"
          variants={wedsVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="reference-weds-calligraphy">weds</span>
        </motion.div>

        {/* Bride Name */}
        <motion.div
          className="name-capsule-script bride-script-capsule"
          variants={brideNameVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="reference-script-name">Harshini</span>
        </motion.div>
      </div>

      {/* 3. Supporting Heading: WE ARE GETTING MARRIED with subtle gold SVG ornaments */}
      <motion.div
        className="home-reference-details-block"
        variants={detailsVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Refined Luxury Gold Diamond Motif */}
        <div className="home-gold-ornament" aria-hidden="true">
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 0L13.5 3.8L18 5L13.5 6.2L11 10L8.5 6.2L4 5L8.5 3.8L11 0Z" fill="#B8862D" opacity="0.85" />
            <circle cx="1.5" cy="5" r="1" fill="#B8862D" opacity="0.6" />
            <circle cx="20.5" cy="5" r="1" fill="#B8862D" opacity="0.6" />
          </svg>
        </div>

        <h2 className="reference-getting-married-title">
          WE ARE GETTING MARRIED
        </h2>

        <div className="home-gold-ornament" aria-hidden="true">
          <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 0L13.5 3.8L18 5L13.5 6.2L11 10L8.5 6.2L4 5L8.5 3.8L11 0Z" fill="#B8862D" opacity="0.85" />
            <circle cx="1.5" cy="5" r="1" fill="#B8862D" opacity="0.6" />
            <circle cx="20.5" cy="5" r="1" fill="#B8862D" opacity="0.6" />
          </svg>
        </div>

        {/* Date Display */}
        <div className="reference-date-venue-cluster">
          <p className="reference-date-display">Thursday, 28th January 2027</p>
        </div>
      </motion.div>
    </div>
  );
}

