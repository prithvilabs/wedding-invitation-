import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';

// Authentic High-Resolution Couple & Story Photography
import photoBeginning from '../assets/story/photos/photo_1_beginning.jpg';
import photoFirstHi from '../assets/story/photos/photo_2_first_hi.jpg';
import photoDating from '../assets/story/photos/photo_3_dating.jpg';
import photoTravelling from '../assets/story/photos/photo_4_travelling.jpg';
import photoOceans from '../assets/story/photos/photo_6_oceans.jpg';
import photoEngaged from '../assets/story/photos/photo_7_engaged.jpg';

const ASSET_BASE = import.meta.env.BASE_URL;

/* --------------------------------------------------------------------------
   Custom Inline SVGs (No Emojis) - South Indian Wedding Elegance
   -------------------------------------------------------------------------- */
function LotusMotif({ width = 32, height = 20, className = '' }) {
  return (
    <svg
      className={`story-lotus-motif ${className}`}
      width={width}
      height={height}
      viewBox="0 0 36 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="storyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB35A" />
          <stop offset="50%" stopColor="#C9A24A" />
          <stop offset="100%" stopColor="#A47524" />
        </linearGradient>
      </defs>
      <path
        d="M 18 2 C 15.6 6.8, 15.6 13, 18 18.2 C 20.4 13, 20.4 6.8, 18 2 Z"
        stroke="url(#storyGoldGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 18 18.2 C 14.5 16, 11 11.2, 11.8 6.5 C 14.2 9, 16.6 12, 18 14"
        stroke="url(#storyGoldGrad)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 18 18.2 C 21.5 16, 25 11.2, 24.2 6.5 C 21.8 9, 19.4 12, 18 14"
        stroke="url(#storyGoldGrad)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 16 18.2 C 12 17.2, 6.2 14.8, 5.5 10.8 C 8.6 12.2, 12.2 14.8, 14.8 16.8"
        stroke="url(#storyGoldGrad)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 20 18.2 C 24 17.2, 29.8 14.8, 30.5 10.8 C 27.4 12.2, 23.8 14.8, 21.2 16.8"
        stroke="url(#storyGoldGrad)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18.2" r="1" fill="#C9A24A" />
    </svg>
  );
}

function WeddingRingsIcon({ width = 24, height = 24, className = '' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="12" r="5.5" stroke="#C9A24A" strokeWidth="1.6" />
      <circle cx="15" cy="12" r="5.5" stroke="#5A1F2B" strokeWidth="1.6" />
      <path d="M9 5.8L9 6.8M15 5.8L15 6.8" stroke="#C9A24A" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MapPinIcon({ width = 14, height = 14, className = '' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PlaneIcon({ width = 14, height = 14, className = '' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-2 1l1.4 1.4 4.5 1.5-3.5 3.5-2.5-.5-1.5 1.5 3 2 2 3 1.5-1.5-.5-2.5 3.5-3.5 1.5 4.5 1.4 1.4c.8-.4 1.2-1.2 1-2z" />
    </svg>
  );
}

function MessageHeartIcon({ width = 14, height = 14, className = '' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#C9A24A" className={className} aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function CloseIcon({ width = 14, height = 14, className = '' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default function Story() {
  // Initial state: ONLY the film roll is visible. Individual stories are hidden by default.
  const [activeChapter, setActiveChapter] = useState(null);
  const reelTrackRef = useRef(null);

  // Exact 6 Story Chapters defined in the cinematic keepsake direction
  const chapters = [
    {
      id: 'beginning',
      sceneNum: '01',
      badge: 'CHAPTER 01',
      year: '2021',
      title: 'THE BEGINNING',
      quote: 'A mutual friend. One introduction that changed everything.',
      subtext: 'A quiet spark in a bustling world, setting a lifetime in motion. A first impression that said far more than words ever could.',
      photo: photoBeginning,
      photoAlt: 'The Beginning - 2021',
      filmMeta: 'SCENE 01 • KEEPSAKE ARCHIVE • 2021',
      frameLabel: 'FRAME 01A',
      badgeOverlay: 'OCT 2021',
      footerStamp: 'FIRST INTRODUCTION'
    },
    {
      id: 'first-hi',
      sceneNum: '02',
      badge: 'CHAPTER 02',
      year: '2022',
      title: 'THE FIRST "HI"',
      quote: 'A simple "Hi" became countless conversations.',
      subtext: 'A little curiosity turned into an Instagram request. That single small word opened the doorway to late-night chats, inside jokes, and unspoken comfort.',
      photo: photoFirstHi,
      photoAlt: 'The First "Hi" - 2022',
      filmMeta: 'SCENE 02 • DIRECT MESSAGE • 2022',
      frameLabel: 'FRAME 02A',
      footerStamp: "JUST A 'HI'..."
    },
    {
      id: 'moments',
      sceneNum: '03',
      badge: 'CHAPTER 03',
      year: '2022',
      title: 'MOMENTS TOGETHER',
      quote: 'From the first conversations to something more meaningful.',
      subtext: 'Somewhere between shared sunsets and endless walks, our story quietly and beautifully became ours.',
      photo: photoDating,
      photoAlt: 'Moments Together - 2022',
      filmMeta: 'SCENE 03 • CINEMASCOPE 2.39:1',
      frameLabel: 'FRAME 03A',
      footerStamp: 'SAME HEARTS • NEW CHAPTER'
    },
    {
      id: 'travelling',
      sceneNum: '04',
      badge: 'CHAPTER 04',
      year: 'TRAVEL',
      title: 'TRAVELLING TOGETHER',
      routeTag: 'Chennai → Bengaluru',
      quote: 'Exploring new cities, new places and new memories.',
      subtext: 'Between bustling railway platforms, quiet morning filter coffees, and temple spires reaching into the sky, every mile brought us closer.',
      photo: photoTravelling,
      photoAlt: 'Travelling Together - Chennai to Bengaluru',
      filmMeta: 'SCENE 04 • EXPEDITION SOUTH INDIA',
      frameLabel: 'FRAME 04A',
      badgeOverlay: 'CHENNAI ➔ BENGALURU',
      footerStamp: 'TEMPLE EXPEDITIONS'
    },
    {
      id: 'oceans',
      sceneNum: '05',
      badge: 'CHAPTER 05',
      year: '2023',
      title: 'ACROSS OCEANS',
      routeTag: '8,000 Miles Apart',
      quote: '8,000 miles apart, yet growing closer every day.',
      subtext: 'She moved across the world to Boston for higher education. Oceans, time zones, and opposite schedules divided us, but our hearts were tethered by the exact same moon.',
      photo: photoOceans,
      photoAlt: 'Across Oceans - 2023',
      filmMeta: 'SCENE 05 • TRANSATLANTIC FLIGHT • 2023',
      frameLabel: 'FRAME 05A',
      footerStamp: 'DIFFERENT SKIES • SAME MOON'
    },
    {
      id: 'engaged',
      sceneNum: '06',
      badge: 'CHAPTER 06',
      year: '2026',
      title: 'WE GOT ENGAGED',
      quote: 'With hearts full of love, blessings from our families, and a promise for a lifetime.',
      subtext: 'We grew in different places, under different skies, and on completely opposite schedules. After years of counting miles, days and hours, we are finally done with the countdown. This is the chapter where we stay.',
      photo: photoEngaged,
      photoAlt: 'We Got Engaged - 2026',
      filmMeta: 'FINAL SCENE • A PROMISE FOR A LIFETIME',
      frameLabel: 'FRAME 06A',
      footerStamp: 'WE GOT ENGAGED'
    }
  ];

  // Click active frame toggles closed; clicking another frame opens only that chapter
  const handleFrameClick = (chapterId) => {
    setActiveChapter((prev) => (prev === chapterId ? null : chapterId));
  };

  const handleClose = () => {
    setActiveChapter(null);
  };

  // Navigate to adjacent chapters
  const currentChapterIndex = chapters.findIndex((c) => c.id === activeChapter);
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  // Smooth scroll to next section (Events)
  const handleViewWedding = () => {
    const eventsSec = document.getElementById('events') || document.querySelector('.events-section');
    if (eventsSec) {
      eventsSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentCh = chapters.find((c) => c.id === activeChapter);

  return (
    <AnimatedSection className="section-block story-cinematic-section" id="story">
      <div className="story-cinematic-container">

        {/* =================================================================
            1. CINEMATIC HERO / OPENING TITLE CARD (MATCHING WEDDING STATIONERY)
            ================================================================= */}
        <div className="story-cinematic-hero text-center">
          {/* Top Lotus Flanked by Gold Hairlines */}
          <div className="story-lotus-row" aria-hidden="true">
            <span className="story-lotus-line" />
            <LotusMotif width={36} height={22} />
            <span className="story-lotus-line" />
          </div>

          <div className="story-names-badge">
            <span className="names-dot">✦</span>
            <span className="names-text">PRITHVI ✦ HARSHINI</span>
            <span className="names-dot">✦</span>
          </div>

          <h2 className="story-cinematic-main-title">
            OUR STORY
          </h2>

          <p className="story-cinematic-main-quote">
            &ldquo;A journey of two hearts&rdquo;
          </p>

          <div className="story-cinematic-tagline-wrap">
            <span className="tagline-dot">•</span>
            <span className="tagline-text">Different places • Countless moments • A beautiful forever</span>
            <span className="tagline-dot">•</span>
          </div>

          {/* Elegant Rosette / Hairline Divider */}
          <div className="story-hero-rosette-divider" aria-hidden="true">
            <span className="rosette-line" />
            <span className="rosette-symbol">✽ ❖ ✽</span>
            <span className="rosette-line" />
          </div>
        </div>

        {/* =================================================================
            2. VINTAGE WEDDING KEEPSAKE FILM ROLL (WARM IVORY & CHAMPAGNE GOLD)
            ================================================================= */}
        <div className="story-film-reel-dock">
          <div className="film-strip-wrapper" ref={reelTrackRef}>
            {/* Top Sprocket Perforations */}
            <div className="film-sprockets-row top" aria-hidden="true">
              {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} className="sprocket-hole"></span>
              ))}
            </div>

            {/* Top Film Edge Metadata Track */}
            <div className="film-edge-meta-track top" aria-hidden="true">
              <span>✦ KODAK 500T ✦</span>
              <span>35MM WEDDING STORYBOOK FILM</span>
              <span>24.00 FPS • KEEPSAKE ARCHIVE</span>
              <span>PRITHVI &amp; HARSHINI</span>
            </div>

            {/* Interactive Film Frames Ribbon */}
            <div className="film-reel-frames-track" role="navigation" aria-label="Our Story Film Timeline">
              {chapters.map((ch) => {
                const isActive = activeChapter === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleFrameClick(ch.id)}
                    className={`film-frame-tab ${isActive ? 'active-frame' : ''}`}
                    aria-label={`${isActive ? 'Close' : 'Open'} ${ch.badge}: ${ch.title} (${ch.year})`}
                    aria-expanded={isActive}
                    type="button"
                  >
                    <div className="tab-frame-outer">
                      <div className="tab-frame-meta">
                        <span className="tab-frame-num">• {ch.sceneNum}A •</span>
                        <span className="tab-frame-year">{ch.year}</span>
                      </div>

                      <div className="tab-thumb-window">
                        <img
                          src={ch.photo}
                          alt=""
                          className="tab-thumb-img"
                          loading="lazy"
                        />
                        {isActive && <div className="tab-active-indicator" />}
                      </div>

                      <div className="tab-frame-footer tab-frame-caption">
                        <span className="tab-chapter-title tab-title-text">{ch.title}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Film Edge Metadata Track */}
            <div className="film-edge-meta-track bottom" aria-hidden="true">
              <span>EASTMAN ROMANCE ARCHIVE</span>
              <span>EMULSION 7219 • CHAPTERS 01–06</span>
              <span>CHRONICLES OF FOREVER</span>
            </div>

            {/* Bottom Sprocket Perforations */}
            <div className="film-sprockets-row bottom" aria-hidden="true">
              {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} className="sprocket-hole"></span>
              ))}
            </div>
          </div>
        </div>

        {/* Initial Prompt Pill (Visible ONLY when no chapter is open) */}
        {!activeChapter && (
          <div className="film-reel-guidance-pill" aria-live="polite">
            <span className="guidance-dot">✦</span>
            <span className="guidance-text">TAP A FILM FRAME ABOVE TO OPEN OUR STORY</span>
            <span className="guidance-dot">✦</span>
          </div>
        )}

        {/* =================================================================
            3. LUXURY WEDDING STORYBOOK POPUP CARD (IVORY, GOLD & BURGUNDY)
            ================================================================= */}
        <div className="story-scenes-container">
          <AnimatePresence mode="wait">
            {activeChapter && currentCh && (
              <motion.div
                key={activeChapter}
                className="story-active-scene-wrapper"
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Main Storybook Keepsake Card */}
                <div className="storybook-card">
                  {/* Four Botanical Watercolor Corner Accents */}
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="storybook-corner-floral corner-tl"
                    aria-hidden="true"
                  />
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="storybook-corner-floral corner-tr"
                    aria-hidden="true"
                  />
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="storybook-corner-floral corner-bl"
                    aria-hidden="true"
                  />
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="storybook-corner-floral corner-br"
                    aria-hidden="true"
                  />

                  {/* Inner Gold Hairline Frame */}
                  <div className="storybook-inner-frame" aria-hidden="true" />

                  {/* Card Header Action Bar */}
                  <div className="storybook-header-bar">
                    <div className="storybook-header-info">
                      <span className="storybook-badge-pill">{currentCh.badge}</span>
                      <span className="storybook-year-pill">{currentCh.year}</span>
                      {currentCh.routeTag && (
                        <span className="storybook-route-pill">
                          {currentCh.id === 'travelling' && <MapPinIcon width={12} height={12} />}
                          {currentCh.id === 'oceans' && <PlaneIcon width={12} height={12} />}
                          <span>{currentCh.routeTag}</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleClose}
                      className="btn-storybook-close"
                      aria-label="Close chapter"
                      type="button"
                    >
                      <span>CLOSE CHAPTER</span>
                      <CloseIcon width={13} height={13} />
                    </button>
                  </div>

                  {/* Card Main Editorial Content Layout */}
                  <div className="storybook-content-grid">
                    {/* Left: Golden Framed Keepsake Photo */}
                    <div className="storybook-photo-column">
                      <div className="storybook-photo-matting">
                        <div className="photo-inner-fillet">
                          <img
                            src={currentCh.photo}
                            alt={currentCh.photoAlt}
                            className="storybook-photo-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Subtle Keepsake Photo Label */}
                        <div className="storybook-photo-caption">
                          <span className="caption-tag">• {currentCh.frameLabel} •</span>
                          <span className="caption-stamp">{currentCh.footerStamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Narrative Storybook Typography */}
                    <div className="storybook-narrative-column">
                      <div className="storybook-narrative-header">
                        <div className="narrative-lotus-ornament" aria-hidden="true">
                          <LotusMotif width={28} height={18} />
                        </div>

                        <span className="storybook-chapter-subtitle">
                          {currentCh.year} • {currentCh.badge}
                        </span>

                        <h3 className="storybook-scene-title">
                          {currentCh.title}
                        </h3>

                        {currentCh.id === 'first-hi' && (
                          <div className="narrative-meta-badge">
                            <MessageHeartIcon width={12} height={12} />
                            <span>INSTAGRAM DIRECT MESSAGE</span>
                          </div>
                        )}

                        {currentCh.id === 'engaged' && (
                          <div className="narrative-meta-badge engaged-badge">
                            <WeddingRingsIcon width={18} height={18} />
                            <span>THE PROMISE FOR A LIFETIME</span>
                          </div>
                        )}
                      </div>

                      {/* Main Quote with Burgundy Left Accent Border */}
                      <blockquote className="storybook-main-quote">
                        &ldquo;{currentCh.quote}&rdquo;
                      </blockquote>

                      {/* Narrative Description */}
                      <p className="storybook-story-body">
                        {currentCh.subtext}
                      </p>

                      {currentCh.id === 'engaged' && (
                        <div className="engaged-storybook-highlight">
                          <span className="engaged-highlight-text">
                            This is the chapter where we stay.
                          </span>
                        </div>
                      )}

                      {/* Traditional South Indian Rosette Flourish Divider */}
                      <div className="storybook-flourish-divider" aria-hidden="true">
                        <span className="flourish-hairline" />
                        <span className="flourish-symbol">✽ ❖ ✽</span>
                        <span className="flourish-hairline" />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Navigation (Prev / Close / Next) */}
                  <div className="storybook-footer-nav">
                    {prevChapter ? (
                      <button
                        onClick={() => handleFrameClick(prevChapter.id)}
                        className="storybook-nav-btn prev"
                        type="button"
                      >
                        <span className="nav-arrow">←</span>
                        <span>PREV: {prevChapter.badge}</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={handleClose}
                      className="storybook-nav-btn close"
                      type="button"
                    >
                      <span>CLOSE CHAPTER</span>
                      <CloseIcon width={13} height={13} />
                    </button>

                    {nextChapter ? (
                      <button
                        onClick={() => handleFrameClick(nextChapter.id)}
                        className="storybook-nav-btn next"
                        type="button"
                      >
                        <span>NEXT: {nextChapter.badge}</span>
                        <span className="nav-arrow">→</span>
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Chapter 06 Grand Finale Epilogue & View Our Wedding Button */}
                  {activeChapter === 'engaged' && (
                    <div className="storybook-epilogue-wrap">
                      <div className="epilogue-ornament-row" aria-hidden="true">
                        <span className="epilogue-line" />
                        <LotusMotif width={24} height={16} />
                        <span className="epilogue-line" />
                      </div>

                      <h4 className="storybook-epilogue-tagline">
                        And this is only the beginning.
                      </h4>

                      <div className="storybook-epilogue-names">
                        <span>PRITHVI RAJ</span>
                        <span className="epilogue-ampersand">&amp;</span>
                        <span>HARSHINI</span>
                      </div>

                      <div className="storybook-epilogue-year">2027</div>

                      <div className="storybook-epilogue-cta">
                        <button
                          onClick={handleViewWedding}
                          className="btn-view-our-wedding"
                          type="button"
                          aria-label="View our wedding celebration events"
                        >
                          <span className="btn-text">VIEW OUR WEDDING</span>
                          <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </AnimatedSection>
  );
}
