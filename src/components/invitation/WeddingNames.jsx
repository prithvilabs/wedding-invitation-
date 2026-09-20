import React from 'react';
import { motion } from 'framer-motion';
import weddingLogo from '../../assets/wedding-logo.png';
import coupleCaricature from '../../assets/cari.png';
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
      {/* 1. Floral Gold Crest Logo (Top Center) */}
      <motion.div
        className="home-actual-logo-dock"
        variants={heraldVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src={weddingLogo}
          alt="Prithvi Raj & Harshini Monogram"
          className="wedding-actual-logo"
        />
      </motion.div>

      {/* 2. Main Couple Names: Prithvi Raj weds Harshini */}
      <h1 className="home-reference-names-stream">
        {/* Groom Name */}
        <motion.span
          className="name-capsule-script groom-script-capsule"
          variants={groomNameVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="reference-script-name">Prithvi Raj</span>
        </motion.span>

        {/* "weds" Accent */}
        <motion.span
          className="name-capsule-script weds-script-capsule"
          variants={wedsVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="reference-weds-calligraphy">weds</span>
        </motion.span>

        {/* Bride Name */}
        <motion.span
          className="name-capsule-script bride-script-capsule"
          variants={brideNameVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="reference-script-name">Harshini</span>
        </motion.span>
      </h1>

      {/* 3. Supporting Heading & Details */}
      <motion.div
        className="home-reference-details-block"
        variants={detailsVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Delicate Olive Leaf Branch Divider */}
        <div className="home-leaf-divider" aria-hidden="true">
          <span className="leaf-hairline" />
          <svg
            className="leaf-twig-icon"
            width="32"
            height="16"
            viewBox="0 0 32 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Center stem */}
            <path
              d="M3 8 Q16 7, 29 8"
              stroke="#435848"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Center leaf */}
            <path
              d="M16 7 Q16 1, 14 0 Q12 1, 16 7"
              fill="#435848"
              opacity="0.9"
            />
            {/* Left upper leaf */}
            <path
              d="M11 7.5 Q9 3, 6 2 Q7 5, 11 7.5"
              fill="#4f6655"
              opacity="0.85"
            />
            {/* Left lower leaf */}
            <path
              d="M12 8 Q10 12, 7 13 Q8 10, 12 8"
              fill="#4f6655"
              opacity="0.85"
            />
            {/* Right upper leaf */}
            <path
              d="M21 7.5 Q23 3, 26 2 Q25 5, 21 7.5"
              fill="#4f6655"
              opacity="0.85"
            />
            {/* Right lower leaf */}
            <path
              d="M20 8 Q22 12, 25 13 Q24 10, 20 8"
              fill="#4f6655"
              opacity="0.85"
            />
          </svg>
          <span className="leaf-hairline" />
        </div>

        {/* WE ARE GETTING MARRIED */}
        <h2 className="reference-getting-married-title">
          WE ARE GETTING MARRIED
        </h2>

        {/* Date Display */}
        <div className="reference-date-venue-cluster">
          <p className="reference-date-display">Thursday, 28th January 2027</p>
        </div>
      </motion.div>

      {/* 4. Couple Caricature Standing at Bottom Center */}
      <motion.div
        className="home-couple-caricature-dock"
        variants={detailsVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src={coupleCaricature}
          alt="Prithvi Raj & Harshini Wedding Caricature"
          className="wedding-couple-caricature"
        />
      </motion.div>
    </div>
  );
}
