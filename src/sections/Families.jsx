import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';

const ASSET_BASE = import.meta.env.BASE_URL;

/**
 * LotusOrnament SVG Component
 * Exact match to the South Indian gold outline lotus motif in the reference UI
 */
function LotusOrnament({ width = 36, height = 22, className = '', id = 'default' }) {
  const gradId = `lotusGoldGrad_${id}`;
  return (
    <svg
      className={`lotus-motif-icon ${className}`}
      width={width}
      height={height}
      viewBox="0 0 36 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB35A" />
          <stop offset="50%" stopColor="#C8A265" />
          <stop offset="100%" stopColor="#A47524" />
        </linearGradient>
      </defs>
      {/* Center Petal */}
      <path
        d="M 18 2 C 15.6 6.8, 15.6 13, 18 18.2 C 20.4 13, 20.4 6.8, 18 2 Z"
        stroke={`url(#${gradId})`}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner Left Petal */}
      <path
        d="M 18 18.2 C 14.5 16, 11 11.2, 11.8 6.5 C 14.2 9, 16.6 12, 18 14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner Right Petal */}
      <path
        d="M 18 18.2 C 21.5 16, 25 11.2, 24.2 6.5 C 21.8 9, 19.4 12, 18 14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Outer Left Flared Petal */}
      <path
        d="M 16 18.2 C 12 17.2, 6.2 14.8, 5.5 10.8 C 8.6 12.2, 12.2 14.8, 14.8 16.8"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Outer Right Flared Petal */}
      <path
        d="M 20 18.2 C 24 17.2, 29.8 14.8, 30.5 10.8 C 27.4 12.2, 23.8 14.8, 21.2 16.8"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Base Calyx Arc */}
      <path
        d="M 12 19.2 C 15 21.2, 21 21.2, 24 19.2"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        fill="none"
      />
      {/* Central Pearl Accent */}
      <circle cx="18" cy="18.2" r="0.9" fill="#C8A265" />
    </svg>
  );
}

/**
 * Families Section Component
 * Exact 1:1 replica of the South Indian Wedding Editorial UI design
 */
export default function Families() {
  return (
    <AnimatedSection className="section-block families-section" id="families">
      <div className="section-container families-container">
        {/* 1. Header Hierarchy: Lotus + INTRODUCING + the families + 3 Rosettes */}
        <div className="families-heading-cluster text-center">
          {/* Top Lotus Flanked by Delicate Hairlines */}
          <div className="heading-lotus-row" aria-hidden="true">
            <span className="heading-lotus-line" />
            <LotusOrnament width={34} height={20} id="headingLotus" />
            <span className="heading-lotus-line" />
          </div>

          {/* INTRODUCING */}
          <h2 className="families-main-title">INTRODUCING</h2>

          {/* the families */}
          <span className="families-script-title">the families</span>

          {/* 3 Rosettes with Outstretched Hairlines */}
          <div className="families-heading-divider" aria-hidden="true">
            <span className="families-divider-line" />
            <span className="families-divider-rosette">✽ ❖ ✽</span>
            <span className="families-divider-line" />
          </div>
        </div>

        {/* 2. Main Two-Column Family Stationery Cards with Central Gopuram Axis */}
        <div className="families-stationery-layout">
          {/* LEFT CARD: Groom's Family */}
          <motion.div
            className="family-stationery-card groom-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 4 Delicate Botanical Watercolor Corner Accents */}
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-tl"
              aria-hidden="true"
            />
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-tr"
              aria-hidden="true"
            />
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-bl"
              aria-hidden="true"
            />
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-br"
              aria-hidden="true"
            />

            {/* Inner Antique-Gold Border Frame */}
            <div className="card-inner-frame" aria-hidden="true" />

            {/* Card Content */}
            <div className="card-content-stack">
              {/* GROOM'S LINEAGE Badge */}
              <div className="lineage-capsule-badge">GROOM'S LINEAGE</div>

              {/* Prithvi Raj in Romantic Script */}
              <h3 className="family-calligraphy-name">Prithvi Raj</h3>

              {/* Under-name Delicate Flourish Divider */}
              <div className="name-delicate-divider" aria-hidden="true">
                <span className="name-divider-line" />
                <span className="name-divider-motif">❖</span>
                <span className="name-divider-line" />
              </div>

              {/* Lineage Tree */}
              <div className="lineage-detail-tree">
                <span className="lineage-relation-label">Son of</span>
                <p className="lineage-parent-name">Mr. G. Venkatesan</p>
                <span className="lineage-gold-flourish" aria-hidden="true">❖</span>
                <p className="lineage-parent-name">Mrs. Thenmozhi</p>

                {/* Sibling Separator: Dotted line with center diamond */}
                <div className="lineage-sibling-separator-cluster" aria-hidden="true">
                  <span className="sibling-sep-line" />
                  <span className="sibling-sep-diamond">❖</span>
                  <span className="sibling-sep-line" />
                </div>

                <span className="lineage-relation-label">Brother</span>
                <p className="lineage-sibling-name">Jayavarshan</p>

                {/* Location Capsule */}
                <div className="lineage-location-capsule">
                  <MapPin size={13} strokeWidth={2.2} className="lineage-map-pin" />
                  <span>Hosur, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CENTER DIVIDER: South Indian Temple Gopuram Axis */}
          <div className="families-gopuram-axis" aria-hidden="true">
            <div className="gopuram-axis-line gopuram-axis-line-top" />
            <div className="gopuram-motif-container">
              <img
                src={`${ASSET_BASE}assets/temple-gopuram-divider.png`}
                alt=""
                className="gopuram-icon-img"
              />
            </div>
            <div className="gopuram-axis-line gopuram-axis-line-bottom" />
          </div>

          {/* RIGHT CARD: Bride's Family */}
          <motion.div
            className="family-stationery-card bride-card"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 4 Delicate Botanical Watercolor Corner Accents */}
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-tl"
              aria-hidden="true"
            />
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-tr"
              aria-hidden="true"
            />
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-bl"
              aria-hidden="true"
            />
            <img
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              className="card-corner-floral corner-br"
              aria-hidden="true"
            />

            {/* Inner Antique-Gold Border Frame */}
            <div className="card-inner-frame" aria-hidden="true" />

            {/* Card Content */}
            <div className="card-content-stack">
              {/* BRIDE'S LINEAGE Badge */}
              <div className="lineage-capsule-badge">BRIDE'S LINEAGE</div>

              {/* Harshini in Romantic Script */}
              <h3 className="family-calligraphy-name">Harshini</h3>

              {/* Under-name Delicate Flourish Divider */}
              <div className="name-delicate-divider" aria-hidden="true">
                <span className="name-divider-line" />
                <span className="name-divider-motif">❖</span>
                <span className="name-divider-line" />
              </div>

              {/* Lineage Tree */}
              <div className="lineage-detail-tree">
                <span className="lineage-relation-label">Daughter of</span>
                <p className="lineage-parent-name">Mr. M. Muthu Kumar</p>
                <span className="lineage-gold-flourish" aria-hidden="true">❖</span>
                <p className="lineage-parent-name">Mrs. Subashini</p>

                {/* Sibling Separator: Dotted line with center diamond */}
                <div className="lineage-sibling-separator-cluster" aria-hidden="true">
                  <span className="sibling-sep-line" />
                  <span className="sibling-sep-diamond">❖</span>
                  <span className="sibling-sep-line" />
                </div>

                <span className="lineage-relation-label">Brother</span>
                <p className="lineage-sibling-name">Tharun Kumar</p>

                {/* Location Capsule */}
                <div className="lineage-location-capsule">
                  <MapPin size={13} strokeWidth={2.2} className="lineage-map-pin" />
                  <span>Chennai, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. Bottom Tagline: Flanked by Gold Hairlines & Lotus Finial */}
        <div className="families-tagline-cluster text-center">
          <div className="tagline-text-row">
            <span className="tagline-side-line" aria-hidden="true" />
            <p className="families-script-tagline">
              Together forever in love and destiny
            </p>
            <span className="tagline-side-line" aria-hidden="true" />
          </div>

          <div className="tagline-bottom-lotus-row" aria-hidden="true">
            <span className="tagline-bottom-line" />
            <LotusOrnament width={30} height={18} id="taglineLotus" />
            <span className="tagline-bottom-line" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
