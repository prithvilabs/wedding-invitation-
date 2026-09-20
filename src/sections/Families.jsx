import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import weddingLogo from '../assets/wedding-logo.png';

export default function Families() {
  return (
    <AnimatedSection className="section-block families-section" id="families">
      <div className="section-container text-safe-zone">
        {/* Layered Editorial Heading Hierarchy */}
        <div className="editorial-heading-stack text-center">
          <h2 className="editorial-main-title">INTRODUCING</h2>
          <span className="editorial-script-accent">the families</span>
          <div className="gold-divider-flourish" aria-hidden="true">
            <span className="flourish-line" />
            <span className="flourish-node">❈ ❖ ❈</span>
            <span className="flourish-line" />
          </div>
        </div>

        {/* Balanced Editorial Two-Column Composition with Central Axis */}
        <div className="families-editorial-layout">
          {/* Groom's Lineage */}
          <div className="family-editorial-column groom-column">
            <div className="lineage-role-badge">Groom's Lineage</div>
            <h3 className="family-script-name">Prithvi Raj</h3>
            
            <div className="lineage-tree">
              <span className="lineage-prefix">Son of</span>
              <div className="parents-names">
                <strong>Mr. G. Venkatesan</strong>
                <span className="lineage-amp">&amp;</span>
                <strong>Mrs. Thenmozhi</strong>
              </div>

              <div className="siblings-block">
                <span className="lineage-sub-prefix">Brother</span>
                <p className="sibling-names">Jayavarshan</p>
              </div>

              <div className="lineage-origin-tag">
                <MapPin size={13} strokeWidth={1.75} className="lineage-pin-icon" />
                <span>Hosur, Tamil Nadu</span>
              </div>
            </div>
          </div>

          {/* Central Ornamental Axis with Official Wedding Logo */}
          <div className="sacred-ceremonial-axis" aria-hidden="true">
            <div className="axis-line axis-line-top" />
            <div className="axis-emblem-ring">
              <motion.div
                className="axis-logo-wrapper"
                animate={{
                  scale: [1, 1.05, 1],
                  filter: [
                    'drop-shadow(0 2px 4px rgba(207, 160, 73, 0.4))',
                    'drop-shadow(0 3px 8px rgba(223, 179, 90, 0.7))',
                    'drop-shadow(0 2px 4px rgba(207, 160, 73, 0.4))'
                  ]
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <img
                  src={weddingLogo}
                  alt="Prithvi Raj & Harshini Wedding Logo"
                  className="axis-wedding-logo"
                />
              </motion.div>
            </div>
            <div className="axis-line axis-line-bottom" />
          </div>

          {/* Bride's Lineage */}
          <div className="family-editorial-column bride-column">
            <div className="lineage-role-badge">Bride's Lineage</div>
            <h3 className="family-script-name">Harshini</h3>

            <div className="lineage-tree">
              <span className="lineage-prefix">Daughter of</span>
              <div className="parents-names">
                <strong>Mr. M. Muthu Kumar</strong>
                <span className="lineage-amp">&amp;</span>
                <strong>Mrs. Subashini</strong>
              </div>

              <div className="siblings-block">
                <span className="lineage-sub-prefix">Brother</span>
                <p className="sibling-names">Tharun Kumar</p>
              </div>

              <div className="lineage-origin-tag">
                <MapPin size={13} strokeWidth={1.75} className="lineage-pin-icon" />
                <span>Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Script Accent */}
        <div className="families-closing-tag text-center">
          <p className="script-closing">together forever in love and destiny</p>
        </div>
      </div>
    </AnimatedSection>
  );
}
