import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import './curtain-opening.css';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/curtain-scene/`;

/**
 * Floating Soft-Focus Golden Dust Motes
 * Drifts lazily in the newly opened space catching the spotlight and sunset rays
 */
function FloatingGoldenMotes({ active }) {
  const motes = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${15 + Math.random() * 70}%`,
      size: `${2.5 + Math.random() * 4.5}px`,
      duration: `${3.5 + Math.random() * 3.5}s`,
      delay: `${Math.random() * 1.8}s`,
      dx: `${(Math.random() - 0.5) * 60}px`,
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="curtain-motes-layer" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="curtain-mote"
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            '--duration': m.duration,
            '--dx': m.dx,
            animationDelay: m.delay,
          }}
        />
      ))}
    </div>
  );
}

/**
 * CurtainOpeningScene Component
 * Implements the Grand Theater Velvet Curtain Opening Experience:
 * - Rich closed theater velvet curtain with warm golden pin-spots from above
 * - Centered circular metallic gold medallion with 'P&H' floral crest and cursive script
 * - Tap interaction (0.5s): Medallion pulses subtly, spotlights intensify, bell & music start
 * - Curtain parting (3.0s): Left and right velvet panels glide smoothly to the edges
 * - Medallion splits in the exact center and moves with the respective curtain panel
 * - Floating soft-focus golden dust motes catch the light in the opening space
 * - Progressive reveal of the main website (top nav, logo, names, couple sunset scene)
 * - Final state: Curtains settle at far edges framing the interactive website
 */
export default function CurtainOpeningScene({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const { playMusic } = useMusic();
  const ringBell = useBellChime();

  // State phases: 'idle' -> 'tapped' (0.5s) -> 'parting' (3.0s) -> 'settled'
  const [phase, setPhase] = useState('idle');
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const timers = useRef([]);
  const hasTriggeredRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const handleTapToOpen = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // STEP 1: Tap Interaction (0.0s - 0.5s)
    // Medallion pulses subtly once, spotlights intensify, bell chime sounds, music starts
    setPhase('tapped');
    try {
      ringBell();
      playMusic();
    } catch (err) {}

    if (shouldReduceMotion) {
      setPhase('settled');
      if (onComplete) onComplete();
      return;
    }

    // STEP 2: Curtain Parting (0.5s - 3.5s)
    // 3-second deliberate and majestic parting of the heavy velvet curtain panels
    const tPart = setTimeout(() => {
      setPhase('parting');
    }, 500);
    timers.current.push(tPart);

    // STEP 3: Full Reveal & Final Settled State (3.5s)
    // Curtains settle at far edges framing the interactive website
    const tSettle = setTimeout(() => {
      setPhase('settled');
      if (onComplete) onComplete();
    }, 3500);
    timers.current.push(tSettle);
  }, [ringBell, playMusic, shouldReduceMotion, onComplete]);

  // Clean timer cleanup on unmount
  useEffect(() => clearAllTimers, [clearAllTimers]);

  // When curtains are settled at edges, gently fade them as user scrolls down past the hero
  useEffect(() => {
    if (phase !== 'settled') return;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setScrollOpacity(1);
      } else {
        const fade = Math.max(0, 1 - (y - 80) / 270);
        setScrollOpacity(fade);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  const isTapped = phase === 'tapped';
  const isParting = phase === 'parting';
  const isSettled = phase === 'settled';

  return (
    <div
      className={`theater-curtain-container ${isTapped ? 'is-tapped' : ''} ${isParting ? 'is-parting' : ''} ${isSettled ? 'is-settled' : ''}`}
      style={{
        opacity: isSettled ? scrollOpacity : 1,
        pointerEvents: isSettled ? 'none' : 'auto',
      }}
      data-testid="theater-curtain-opening"
      aria-label="Closed theater velvet curtain. Tap medallion to reveal wedding invitation."
    >
      <div className="theater-curtain-viewport">
        {/* Layer 1: Left Velvet Curtain Panel */}
        <div className="curtain-panel curtain-panel-left">
          <img
            src={`${ASSET_BASE}curtains-closed.webp`}
            alt=""
            className="curtain-sheet curtain-sheet-left"
            draggable="false"
            loading="eager"
            decoding="async"
          />

          <div className="curtain-seam-shadow-left" />

          {/* Left Hemisphere of the Central Gold Medallion */}
          <div className="medallion-half medallion-half-left">
            <img
              src={`${ASSET_BASE}medallion-ph.png`}
              alt="P&H Monogram Medallion Left"
              className="medallion-img"
              draggable="false"
            />
          </div>
        </div>

        {/* Layer 2: Right Velvet Curtain Panel */}
        <div className="curtain-panel curtain-panel-right">
          <img
            src={`${ASSET_BASE}curtains-closed.webp`}
            alt=""
            className="curtain-sheet curtain-sheet-right"
            draggable="false"
            loading="eager"
            decoding="async"
          />

          <div className="curtain-seam-shadow-right" />

          {/* Right Hemisphere of the Central Gold Medallion */}
          <div className="medallion-half medallion-half-right">
            <img
              src={`${ASSET_BASE}medallion-ph.png`}
              alt="P&H Monogram Medallion Right"
              className="medallion-img"
              draggable="false"
            />
          </div>
        </div>

        {/* Layer 3: Warm Overhead Golden Pin-Spots / Spotlights */}
        <div className="curtain-spotlights-layer" />

        {/* Layer 4: Soft-Focus Golden Dust Motes in the Opened Light */}
        <FloatingGoldenMotes active={isParting || isSettled} />

        {/* Layer 5: Interactive Center Medallion Tap Anchor (when idle) */}
        {!isParting && !isSettled && (
          <div
            className="medallion-tap-trigger"
            onClick={handleTapToOpen}
            role="button"
            tabIndex={0}
            aria-label="Tap gold medallion to open wedding invitation"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTapToOpen();
              }
            }}
          >
            {/* Ambient breathing halo around closed medallion */}
            <div className="medallion-breathing-aura" />
          </div>
        )}

        {/* Layer 6: Elegant Floating Tap Cue at Bottom */}
        {phase === 'idle' && (
          <div className="curtain-tap-cue" onClick={handleTapToOpen}>
            <span className="cue-sparkle-gold">✦</span>
            <span className="cue-text-gold">TAP MEDALLION TO UNVEIL</span>
            <span className="cue-sparkle-gold">✦</span>
          </div>
        )}
      </div>
    </div>
  );
}
