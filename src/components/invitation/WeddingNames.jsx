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
        {/* Ornamental Lotus Divider */}
        <div className="home-lotus-divider" aria-hidden="true">
          <span className="lotus-hairline" />
          <svg
            className="lotus-motif-icon"
            width="36"
            height="22"
            viewBox="0 0 36 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="lotusGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D2B06A" />
                <stop offset="50%" stopColor="#B58A3A" />
                <stop offset="100%" stopColor="#D2B06A" />
              </linearGradient>
            </defs>
            {/* Center Petal */}
            <path
              d="M 18 2 C 15.6 6.8, 15.6 13, 18 18.2 C 20.4 13, 20.4 6.8, 18 2 Z"
              stroke="url(#lotusGoldGradient)"
              strokeWidth="1.15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Inner Left Petal */}
            <path
              d="M 18 18.2 C 14.5 16, 11 11.2, 11.8 6.5 C 14.2 9, 16.6 12, 18 14"
              stroke="url(#lotusGoldGradient)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Inner Right Petal */}
            <path
              d="M 18 18.2 C 21.5 16, 25 11.2, 24.2 6.5 C 21.8 9, 19.4 12, 18 14"
              stroke="url(#lotusGoldGradient)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Outer Left Flared Petal */}
            <path
              d="M 16 18.2 C 12 17.2, 6.2 14.8, 5.5 10.8 C 8.6 12.2, 12.2 14.8, 14.8 16.8"
              stroke="url(#lotusGoldGradient)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Outer Right Flared Petal */}
            <path
              d="M 20 18.2 C 24 17.2, 29.8 14.8, 30.5 10.8 C 27.4 12.2, 23.8 14.8, 21.2 16.8"
              stroke="url(#lotusGoldGradient)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Base Calyx Arc */}
            <path
              d="M 12 19.2 C 15 21.2, 21 21.2, 24 19.2"
              stroke="url(#lotusGoldGradient)"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
            {/* Central Pearl Accent */}
            <circle
              cx="18"
              cy="18.2"
              r="0.9"
              fill="#D2B06A"
            />
          </svg>
          <span className="lotus-hairline" />
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
