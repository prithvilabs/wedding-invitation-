import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import './scroll-opening.css';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/scroll-scene/`;

/**
 * Generates sparkling golden dust particles when the wax seal breaks
 */
function GoldenSparksBurst({ active }) {
  const sparks = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 45 + Math.random() * 85;
      return {
        id: i,
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist + 15}px`,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.12,
      };
    });
  }, []);

  if (!active) return null;

  return (
    <div className="golden-sparks-layer" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="golden-spark"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            '--tx': s.tx,
            '--ty': s.ty,
          }}
        />
      ))}
    </div>
  );
}

/**
 * ScrollOpeningScene Component
 * Implements the requested ceremonial unboxing and unfurling sequence:
 * - Urli bowl with floating jasmine, lotus, temple bells, and diya lights
 * - Closed royal maroon velvet scroll resting on brass pedestal
 * - Tap interaction: background dims, soft golden focus aura intensifies, bell chime & music
 * - Phase 1 (1s): 'P&H' wax seal melts/cracks with crumbling effect, gold cord unspools & falls away
 * - Phase 2 (2s): Heavy velvet scroll unfurls downward with gold embroidery & names
 * - Phase 3 (1s): Fullscreen expansion & wipe-down transition revealing the main website
 */
export default function ScrollOpeningScene({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const { playMusic } = useMusic();
  const ringBell = useBellChime();

  // State phases:
  // 'idle' -> 'tap_activated' -> 'seal_breaking' -> 'unfurling' -> 'wipe_transition' -> 'complete'
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);
  const hasTriggeredRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const handleTapToOpen = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // STEP 1: Immediate Tap Response (0.0s)
    // Bell chimes, music starts, background dims, golden halo intensifies
    setPhase('tap_activated');
    try {
      ringBell();
      playMusic();
    } catch (err) {}

    if (shouldReduceMotion) {
      setPhase('wipe_transition');
      const tFast = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1200);
      timers.current.push(tFast);
      return;
    }

    // STEP 2: Seal Release & Cord Unspooling (0.35s)
    // Golden cracks appear on P&H seal, seal crumbles, cord unspools and drops
    const tSeal = setTimeout(() => {
      setPhase('seal_breaking');
    }, 350);
    timers.current.push(tSeal);

    // STEP 3: Majestic Velvet Unfurling (1.35s)
    // Heavy scroll unrolls downward, revealing gold embroidery & names
    const tUnfurl = setTimeout(() => {
      setPhase('unfurling');
    }, 1350);
    timers.current.push(tUnfurl);

    // STEP 4: Fullscreen Screen Fill & Wipe-Down Transition (3.4s)
    // Velvet expands to fill screen, elegant wipe-down reveals main website
    const tWipe = setTimeout(() => {
      setPhase('wipe_transition');
    }, 3400);
    timers.current.push(tWipe);

    // STEP 5: Entrance Completion (4.5s)
    const tComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500);
    timers.current.push(tComplete);
  }, [ringBell, playMusic, shouldReduceMotion, onComplete]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  const isActivated = phase !== 'idle';
  const isBreaking = phase === 'seal_breaking' || phase === 'unfurling' || phase === 'wipe_transition';
  const isUnfurling = phase === 'unfurling' || phase === 'wipe_transition';
  const isWiping = phase === 'wipe_transition';

  return (
    <div
      className="scroll-opening-container"
      data-testid="interactive-scroll-opening"
      onClick={phase === 'idle' ? handleTapToOpen : undefined}
      role="button"
      tabIndex={0}
      aria-label="Tap to open royal wedding invitation scroll"
      onKeyDown={(e) => {
        if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
          handleTapToOpen();
        }
      }}
    >
      <div className={`scroll-scene-viewport ${isActivated ? 'is-activated' : ''}`}>
        {/* Layer 1: Photorealistic Background (Ceremonial Urli, bells, diyas, mountains) */}
        <div className="scroll-bg-layer">
          <img
            src={`${ASSET_BASE}scene-bg.webp`}
            alt="Ceremonial Urli bowl with floating jasmine and temple bells"
            className="scroll-bg-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Layer 2: Subtle Ambient Dimming Overlay */}
        <div className="scroll-dim-overlay" />

        {/* Layer 3: Soft Golden Radial Focus Glow behind Scroll */}
        <div className="scroll-golden-focus-glow" />

        {/* Layer 4: Initial Closed Scroll on Brass Pedestal */}
        <div className="scroll-altar-rig">
          <div className="scroll-cylinder-shadow" />

          {/* Closed Scroll Cylinder (fades out as unfurling begins) */}
          <div
            className="scroll-cylinder-wrapper"
            style={{
              opacity: isUnfurling ? 0 : 1,
              transform: isBreaking ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <img
              src={`${ASSET_BASE}scroll-cylinder.png`}
              alt="Royal Maroon Velvet Wedding Scroll"
              className="scroll-cylinder-img"
              draggable="false"
            />
          </div>

          {/* Golden Wax Seal & Cord Layer */}
          {!isUnfurling && (
            <div className="scroll-seal-cord-layer">
              {/* Thin Gold Cord Bow (unspools and falls away) */}
              <img
                src={`${ASSET_BASE}gold-cord-bow.png`}
                alt="Golden Cord Bow"
                className={`scroll-cord-bow ${isBreaking ? 'is-unspooling' : ''}`}
                draggable="false"
              />

              {/* The Gold 'P&H' Wax Seal with Crack / Melt Effect */}
              <div
                className={`scroll-wax-seal-anchor ${isBreaking ? 'is-breaking' : ''}`}
                style={{
                  transform: isBreaking ? 'translate(-50%, -50%) scale(1.12)' : 'translate(-50%, -50%)',
                }}
              >
                {/* Breathing aura */}
                <div className="scroll-seal-aura" />

                {/* Wax seal image (splits into crumbling fragments when cracking) */}
                <div className="crack-fragment crack-fragment-tl" style={{ clipPath: 'polygon(0 0, 52% 0, 48% 52%, 0 48%)' }}>
                  <img src={`${ASSET_BASE}wax-seal-ph.png`} alt="" className="scroll-wax-seal-img" />
                </div>
                <div className="crack-fragment crack-fragment-tr" style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 48%, 48% 52%)' }}>
                  <img src={`${ASSET_BASE}wax-seal-ph.png`} alt="" className="scroll-wax-seal-img" />
                </div>
                <div className="crack-fragment crack-fragment-bl" style={{ clipPath: 'polygon(0 48%, 48% 52%, 52% 100%, 0 100%)' }}>
                  <img src={`${ASSET_BASE}wax-seal-ph.png`} alt="" className="scroll-wax-seal-img" />
                </div>
                <div className="crack-fragment crack-fragment-br" style={{ clipPath: 'polygon(48% 52%, 100% 48%, 100% 100%, 52% 100%)' }}>
                  <img src={`${ASSET_BASE}wax-seal-ph.png`} alt="" className="scroll-wax-seal-img" />
                </div>

                {/* SVG Golden Fracture Fissures */}
                <svg
                  className={`seal-crack-fissures ${isBreaking ? 'is-visible' : ''}`}
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <path
                    d="M 50 10 L 48 35 L 53 50 L 32 68 L 20 85 M 53 50 L 72 45 L 88 52 M 48 35 L 35 28 L 22 25 M 53 50 L 52 75 L 58 92"
                    stroke="#ffe380"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px #ffb703)' }}
                  />
                </svg>

                {/* Golden sparks burst */}
                <GoldenSparksBurst active={isBreaking} />
              </div>
            </div>
          )}
        </div>

        {/* Layer 5: The Unfurling Scroll Experience (Majestic downward unroll) */}
        {isUnfurling && (
          <div className="scroll-unfurling-stage">
            {/* Top Stationary Roller Bar */}
            <div className="scroll-top-roller-bar">
              <img
                src={`${ASSET_BASE}scroll-top-roller.png`}
                alt="Scroll Top Roller"
                className="scroll-top-roller-img"
                draggable="false"
              />
            </div>

            {/* Unfurling Velvet Body */}
            <div
              className="scroll-velvet-body-wrapper"
              style={{
                height: isUnfurling ? 'clamp(320px, 48vh, 460px)' : '0px',
              }}
            >
              <img
                src={`${ASSET_BASE}scroll-velvet-body.png`}
                alt="Royal Maroon Velvet with Gold Embroidery"
                className="scroll-velvet-background-img"
                draggable="false"
              />

              {/* Regal Gold Typography and Monogram inside Scroll */}
              <div className="scroll-velvet-content">
                {/* Sacred Lotus / Invocation Motif */}
                <svg className="scroll-sacred-emblem" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 15 C45 30 35 40 20 48 C36 50 45 60 50 82 C55 60 64 50 80 48 C65 40 55 30 50 15 Z" />
                  <circle cx="50" cy="50" r="6" fill="#f6dc96" />
                </svg>

                <h3 className="scroll-content-monogram">P & H</h3>

                <h1 className="scroll-content-names">
                  Prithvi Raj &amp; Harshini
                </h1>

                <div className="scroll-content-divider" />

                <p className="scroll-content-invitation">
                  Cordially invite you to share in the joy and celebration of their auspicious wedding.
                </p>

                <div className="scroll-content-badge">
                  <span>THURSDAY, 28TH JANUARY 2027</span>
                  <span>•</span>
                  <span>CHENNAI</span>
                </div>
              </div>
            </div>

            {/* Bottom Weighted Roller Bar (rolls down under gravity with 3D rotation) */}
            <div
              className="scroll-bottom-roller-bar"
              style={{
                transform: isUnfurling ? 'translateY(0) rotate(720deg)' : 'translateY(-300px) rotate(0deg)',
              }}
            >
              <img
                src={`${ASSET_BASE}scroll-bottom-roller.png`}
                alt="Scroll Bottom Roller"
                className="scroll-bottom-roller-img"
                draggable="false"
              />
            </div>
          </div>
        )}

        {/* Layer 6: Phase 3 Screen Expansion & Elegant Vertical Wipe-Down Veil */}
        <div
          className={`scroll-fullscreen-expansion-veil ${isWiping ? 'is-active is-wiping' : ''}`}
        >
          <div className="scroll-wipe-gold-border" />
        </div>

        {/* Layer 7: Interactive Call to Action Cue */}
        {phase === 'idle' && (
          <div className="scroll-tap-cue" onClick={handleTapToOpen}>
            <span className="cue-sparkle">✦</span>
            <span className="cue-text">TAP SCROLL TO UNVEIL INVITATION</span>
            <span className="cue-sparkle">✦</span>
          </div>
        )}
      </div>
    </div>
  );
}
