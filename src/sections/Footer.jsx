import React from 'react';
import AnimatedSection from '../animations/AnimatedSection';

/**
 * Decorative Gold Lotus Motif
 */
const LotusIcon = ({ width = 30, height = 19 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <defs>
      <linearGradient id="footerLotusGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DFB35A" />
        <stop offset="50%" stopColor="#D5B46B" />
        <stop offset="100%" stopColor="#A47524" />
      </linearGradient>
    </defs>
    <path
      d="M 18 2 C 15.6 6.8, 15.6 13, 18 18.2 C 20.4 13, 20.4 6.8, 18 2 Z"
      stroke="url(#footerLotusGold)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 18 18.2 C 14.5 16, 11 11.2, 11.8 6.5 C 14.2 9, 16.6 12, 18 14"
      stroke="url(#footerLotusGold)"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 18 18.2 C 21.5 16, 25 11.2, 24.2 6.5 C 21.8 9, 19.4 12, 18 14"
      stroke="url(#footerLotusGold)"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 16 18.2 C 12 17.2, 6.2 14.8, 5.5 10.8 C 8.6 12.2, 12.2 14.8, 14.8 16.8"
      stroke="url(#footerLotusGold)"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 20 18.2 C 24 17.2, 29.8 14.8, 30.5 10.8 C 27.4 12.2, 23.8 14.8, 21.2 16.8"
      stroke="url(#footerLotusGold)"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 12 19.2 C 15 21.2, 21 21.2, 24 19.2"
      stroke="url(#footerLotusGold)"
      strokeWidth="1.15"
      strokeLinecap="round"
    />
    <circle cx="18" cy="18.2" r="0.9" fill="#D5B46B" />
  </svg>
);

/**
 * Gold Vector Icons for LinkedIn & WhatsApp
 */
const LinkedInIcon = ({ size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="final-ceremonial-footer">
      <AnimatedSection className="footer-inner text-center">
        {/* 1. Existing Wedding Header */}
        <p className="footer-quote-passage">
          "Two lives, two hearts, joined together in friendship and love for a lifetime."
        </p>

        <h2 className="footer-couple-lead">
          Prithvi Raj <span>&amp;</span> Harshini
        </h2>

        <div className="footer-date-stamp">28TH JANUARY 2027 · CHENNAI, TAMIL NADU</div>

        <div className="gold-divider-flourish footer-divider-flourish" aria-hidden="true">
          <span className="flourish-line" />
          <span className="flourish-node">❈ ❖ ❈</span>
          <span className="flourish-line" />
        </div>

        {/* 2. Wedding Wishes & Developer Signature Section (Minimal, no cards) */}
        <div className="footer-wishes-flow">
          {/* Centered Small Gold Lotus */}
          <div className="wishes-lotus-wrap" aria-hidden="true">
            <LotusIcon width={28} height={18} />
          </div>

          {/* Heading with Thin Gold Hairlines: —— WITH WARM WISHES —— */}
          <div className="wishes-heading-row">
            <span className="wishes-heading-line" aria-hidden="true" />
            <span className="wishes-sub-heading">WITH WARM WISHES</span>
            <span className="wishes-heading-line" aria-hidden="true" />
          </div>

          {/* Main Message: 2 lines on desktop, warm ivory, elegant italic serif */}
          <p className="wishes-main-quote">
            Wishing you a lifetime of love,<br className="wishes-desktop-break" />
            happiness &amp; togetherness.
          </p>

          {/* Thin Gold Horizontal Divider with Symmetrical Diamond: —— ❖ —— */}
          <div className="wishes-mid-divider" aria-hidden="true">
            <span className="wishes-mid-line" />
            <span className="wishes-mid-diamond">❖</span>
            <span className="wishes-mid-line" />
          </div>

          {/* Personal Message */}
          <p className="wishes-creation-text">
            A special creation for Prithvi &amp; Harshini
          </p>

          {/* Developer Signature & Social Links Row: Crafted by Prasanna | [LinkedIn] [WhatsApp] */}
          <div className="dev-signature-row">
            <span className="dev-signature-credit">Crafted by Prasanna</span>
            <span className="dev-signature-pipe" aria-hidden="true" />
            <div className="dev-signature-socials" role="group" aria-label="Developer contacts">
              <a
                href="https://www.linkedin.com/in/prasanna-raj-r-0b50a7282/"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-signature-icon-link"
                aria-label="Connect with Prasanna on LinkedIn"
              >
                <LinkedInIcon size={16} />
              </a>
              <a
                href="https://wa.me/917810096062"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-signature-icon-link"
                aria-label="Message Prasanna on WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </footer>
  );
}
