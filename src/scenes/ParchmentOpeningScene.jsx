import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import ParchmentFlowerCascade from '../components/invitation/ParchmentFlowerCascade';
import './parchment-opening.css';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/parchment-scene/`;

/**
 * Soft Golden Release Embers when the wax seal breaks
 */
function ReleaseEmbers({ active }) {
  const embers = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const dist = 35 + Math.random() * 65;
      return {
        id: i,
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist - 10}px`,
        size: 3 + Math.random() * 3.5,
        delay: Math.random() * 0.14,
      };
    });
  }, []);

  if (!active) return null;

  return (
    <div className="parchment-release-embers-layer" aria-hidden="true">
      {embers.map((e) => (
        <span
          key={e.id}
          className="parchment-ember"
          style={{
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDelay: `${e.delay}s`,
            '--tx': e.tx,
            '--ty': e.ty,
          }}
        />
      ))}
    </div>
  );
}

/**
 * ParchmentOpeningScene Component
 * Implements the "Smooth Seal Break & Flower Cascade" entrance experience:
 * - Macro photograph of minimalist, matte cream-colored handmade deckled-edge parchment
 * - Deep-reddish-gold translucent wax seal with 'P&H' floral monogram crest
 * - Dark gold foil calligraphy "Prithvi Raj & Harshini"
 * - Phase 1 (0.5s): Seal pulses and glows warm gold, paper curls upward slightly
 * - Phase 2 (2.0s): Seal releases & lifts, pink bougainvillea & jasmine cascade, center-outward ripple dissolve
 * - Phase 3 (1.5s): Full reveal of couple, date, and navigation; flowers settle at bottom
 */
export default function ParchmentOpeningScene({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const { playMusic } = useMusic();
  const ringBell = useBellChime();

  // State phases: 'idle' -> 'activated' (0.5s) -> 'releasing' (2.0s) -> 'full_reveal' (1.5s) -> 'completed'
  const [phase, setPhase] = useState('idle');
  const [ripplePercent, setRipplePercent] = useState(0);
  const [showCascade, setShowCascade] = useState(false);
  const [sealOrigin, setSealOrigin] = useState(null);
  const sealRef = useRef(null);
  const timers = useRef([]);
  const hasTriggeredRef = useRef(false);
  const rippleRafRef = useRef(null);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    if (rippleRafRef.current) {
      cancelAnimationFrame(rippleRafRef.current);
    }
  }, []);

  const handleTapToOpen = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Capture exact viewport coordinates of wax seal for flower emission
    if (sealRef.current) {
      const rect = sealRef.current.getBoundingClientRect();
      setSealOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    // PHASE 1: Seal Activation (0.0s – 0.5s)
    // Seal pulses subtly, glows warm gold, paper curls upward
    setPhase('activated');
    try {
      ringBell();
      playMusic();
    } catch (err) {}

    if (shouldReduceMotion) {
      setPhase('completed');
      if (onComplete) onComplete();
      return;
    }

    // PHASE 2: Seal Release, Flower Cascade & Center-Outward Ripple Dissolve (0.5s – 2.5s — 2.0s Slow & Fluid)
    const tRelease = setTimeout(() => {
      setPhase('releasing');
      setShowCascade(true);

      // Smooth center-outward ripple animation
      const startTime = performance.now();
      const rippleDuration = 2000; // 2.0 seconds

      const animateRipple = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / rippleDuration);
        // Smooth easing: starts gently and accelerates smoothly outward
        const eased = Math.pow(progress, 1.8) * 135;
        setRipplePercent(eased);

        if (progress < 1) {
          rippleRafRef.current = requestAnimationFrame(animateRipple);
        }
      };

      rippleRafRef.current = requestAnimationFrame(animateRipple);
    }, 500);
    timers.current.push(tRelease);

    // PHASE 3: The Full Reveal (2.5s – 4.0s — 1.5s)
    const tReveal = setTimeout(() => {
      setPhase('full_reveal');
      if (onComplete) onComplete();
    }, 2500);
    timers.current.push(tReveal);

    // Final unmount cleanup (4.0s)
    const tComplete = setTimeout(() => {
      setPhase('completed');
    }, 4000);
    timers.current.push(tComplete);
  }, [ringBell, playMusic, shouldReduceMotion, onComplete]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  const isActivated = phase === 'activated' || phase === 'releasing' || phase === 'full_reveal';
  const isReleasing = phase === 'releasing' || phase === 'full_reveal';
  const isDissolving = phase === 'releasing' || phase === 'full_reveal';
  const isCompleted = phase === 'completed';

  if (isCompleted) return null;

  return (
    <div
      className={`parchment-opening-container ${isActivated ? 'is-activated' : ''} ${isReleasing ? 'is-releasing' : ''} ${isCompleted ? 'is-completed' : ''}`}
      onClick={phase === 'idle' ? handleTapToOpen : undefined}
      role="button"
      tabIndex={0}
      aria-label="Handmade parchment wedding invitation card. Tap anywhere to open."
      onKeyDown={(e) => {
        if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
          handleTapToOpen();
        }
      }}
    >
      {/* Soft Ambient Blurred Background Lighting */}
      <div className="parchment-ambient-backdrop" />

      {/* Realistic Soft-Focus Pink Bougainvillea & White Jasmine Cascade */}
      <ParchmentFlowerCascade
        active={showCascade}
        origin={sealOrigin}
        onComplete={() => {}}
      />

      {/* 1. Center Deckled Parchment Card */}
      <div
        className={`parchment-card-stage ${isDissolving ? 'is-dissolving' : ''}`}
        style={
          isDissolving
            ? {
                '--ripple': `${ripplePercent}%`,
              }
            : undefined
        }
      >
        {/* High-Resolution Macro Parchment Paper Cover */}
        <img
          src={`${ASSET_BASE}parchment-cover.webp`}
          alt="Handmade deckled parchment wedding invitation with gold foil calligraphy"
          className="parchment-cover-img"
          loading="eager"
          decoding="async"
        />

        {/* Paper Curl Shadow Behind Seal (Phase 1) */}
        <div className="parchment-paper-curl-shadow" />

        {/* 2. Centered Deep-Reddish-Gold Translucent Wax Seal */}
        <div
          ref={sealRef}
          className="parchment-wax-seal-wrapper"
          aria-label="Deep-reddish-gold wax seal with P&H monogram crest"
        >
          {/* Ambient Warm Golden Breathing Glow */}
          <div className="parchment-seal-aura" />

          {/* Transparent Reddish-Gold Wax Seal Image */}
          <img
            src={`${ASSET_BASE}reddish-wax-seal.png`}
            alt=""
            className="parchment-wax-seal-img"
            draggable="false"
          />

          {/* Soft Golden Release Embers when seal lifts */}
          <ReleaseEmbers active={isReleasing} />
        </div>
      </div>

      {/* 3. Floating Tap Cue at Bottom */}
      {phase === 'idle' && (
        <div className="parchment-tap-cue" onClick={handleTapToOpen}>
          <span className="parchment-cue-sparkle">✦</span>
          <span className="parchment-cue-text">TAP TO OPEN INVITATION</span>
          <span className="parchment-cue-sparkle">✦</span>
        </div>
      )}
    </div>
  );
}
