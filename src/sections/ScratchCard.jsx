import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';
import ScratchReveal from './scratch-card/ScratchReveal';
import { readDate } from './events/calendarDates';
import { SPECIAL_DAYS } from '../data/specialDays';

// The date on the card is the wedding ceremony from the site's own event data
const WEDDING = SPECIAL_DAYS.find((event) => event.id === 'wedding-ceremony');

export default function ScratchCard() {
  return (
    <AnimatedSection className="section-block muhurtham-floating-section" id="scratchSection">
      <div className="muhurtham-floating-container text-center">
        {/* 1. Top Lotus Line Divider Matching Reference */}
        <div className="std-top-rosette-line" aria-hidden="true">
          <span className="std-line-segment" />
          <svg className="std-center-rosette" viewBox="0 0 32 20" fill="none">
            <g fill="#A66816">
              <path d="M 16 2 C 14.8 5.5, 14.8 11.5, 16 15 C 17.2 11.5, 17.2 5.5, 16 2 Z" />
              <path d="M 15 5 C 12 8, 10.5 12, 13 15.5 C 14.5 12.5, 15 9, 15 5 Z" />
              <path d="M 17 5 C 20 8, 21.5 12, 19 15.5 C 17.5 12.5, 17 9, 17 5 Z" />
              <path d="M 13 9 C 9 11, 7 14, 10.5 16.5 C 12.5 14.5, 13.5 12, 13 9 Z" />
              <path d="M 19 9 C 23 11, 25 14, 21.5 16.5 C 19.5 14.5, 18.5 12, 19 9 Z" />
              <path d="M 11 16.5 C 14 18, 18 18, 21 16.5 C 19 17.2, 13 17.2, 11 16.5 Z" />
            </g>
          </svg>
          <span className="std-line-segment" />
        </div>

        {/* 2. SAVE THE DATE Heading Row with Flanking Gold Lines */}
        <div className="std-title-row">
          <span className="std-flank-line" aria-hidden="true" />
          <h2 className="std-main-heading">SAVE THE DATE</h2>
          <span className="std-flank-line" aria-hidden="true" />
        </div>

        {/* 3. Subtitle Text */}
        <p className="std-subtitle-text">
          A new chapter begins, and we would be honoured to have you with us as we step into forever.
        </p>

        {/* Delicate Diamond Divider */}
        <div className="std-subtitle-diamond-line" aria-hidden="true">
          <span className="std-sub-flank-line" />
          <span className="std-center-diamond">◆</span>
          <span className="std-sub-flank-line" />
        </div>

        {/* Accessible announcement for Screen Readers */}
        <div className="sr-only">
          Save the Date: {readDate(WEDDING.date).fullLabel}. {WEDDING.title}: {WEDDING.time} at {WEDDING.venue},{' '}
          {WEDDING.locality}.
        </div>

        {/* 4. Scratch-to-reveal card */}
        <motion.div
          className="scratch-card-area"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScratchReveal event={WEDDING} />

          {/* 5. Bottom Thank-You Message with Flanking Gold Lines */}
          <div className="std-bottom-message-row">
            <span className="std-bottom-line" aria-hidden="true" />
            <p className="std-bottom-message">
              Thank you for being an irreplaceable part of our journey.
            </p>
            <span className="std-bottom-line" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
