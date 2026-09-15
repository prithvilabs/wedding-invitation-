import React from 'react';
import AnimatedSection from '../animations/AnimatedSection';

export default function Footer() {
  return (
    <footer className="final-ceremonial-footer">
      <AnimatedSection className="footer-inner text-center">
        {/* Wedding Quote Passage */}
        <p className="footer-quote-passage">
          "Two lives, two hearts, joined together in friendship and love for a lifetime."
        </p>

        {/* Couple Names Lead */}
        <h2 className="footer-couple-lead">
          Prithvi Raj <span>&amp;</span> Harshini
        </h2>

        {/* Date & Location Stamp */}
        <div className="footer-date-stamp">28TH JANUARY 2027 · CHENNAI, TAMIL NADU</div>

        {/* Decorative Gold Flourish Divider */}
        <div className="gold-divider-flourish footer-divider-flourish" aria-hidden="true">
          <span className="flourish-line" />
          <span className="flourish-node">❈ ❖ ❈</span>
          <span className="flourish-line" />
        </div>
      </AnimatedSection>
    </footer>
  );
}
