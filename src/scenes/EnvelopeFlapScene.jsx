import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import './envelope-flap.css';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/envelope-scene/`;

/**
 * EnvelopeFlapScene Component
 * 
 * Cinematic, ultra high-definition (HD) close-up opening experience:
 * - Pristine closed textured cream paper invitation card
 * - Identical copper wax seal with PH monogram and calligraphy 'Prithvi Raj & Harshini'
 * - Background: soft, deep-focus bokeh of peach rose petals and warm glowing fairy lights
 * - NO UI elements like 'TAP TO OPEN'
 * - On interaction (click/tap):
 *   1. Slow-motion 3D animation: top flap smoothly lifts and flips backward (-175deg),
 *      physically lifting off the card to reveal the ornate embossed gold foil lining on underside and interior.
 *   2. Simultaneous cascade of realistic soft-focus pink and red rose petals.
 *   3. Slow, fluid non-jump-cut cross-dissolve into the main wedding invitation site,
 *      while the rose petals continue their descent seamlessly across the transition.
 */
export default function EnvelopeFlapScene({ onComplete, onTriggerCascade }) {
  const shouldReduceMotion = useReducedMotion();
  const { playMusic } = useMusic();
  const ringBell = useBellChime();

  // Phases: 'idle' -> 'opening' (3D flap lift + petal cascade) -> 'dissolving' (cross-dissolve) -> 'completed'
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);
  const hasTriggeredRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const handleOpenInvitation = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Trigger audio
    try {
      ringBell();
      playMusic();
    } catch (e) {
      // Audio autoplay fallback
    }

    // Trigger continuous rose petal cascade immediately
    if (onTriggerCascade) {
      onTriggerCascade();
    }

    if (shouldReduceMotion) {
      setPhase('completed');
      if (onComplete) onComplete();
      return;
    }

    // Phase 1: 3D Flap Lift (0.0s – 1.8s)
    setPhase('opening');

    // Phase 2: Fluid Non-Jump-Cut Cross-Dissolve to Main Site (1.8s – 3.4s)
    const tDissolve = setTimeout(() => {
      setPhase('dissolving');
      if (onComplete) onComplete();
    }, 1800);
    timers.current.push(tDissolve);

    // Phase 3: Cleanup & Final Unmount (3.6s)
    const tComplete = setTimeout(() => {
      setPhase('completed');
    }, 3600);
    timers.current.push(tComplete);
  }, [ringBell, playMusic, shouldReduceMotion, onComplete, onTriggerCascade]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  if (phase === 'completed') return null;

  const isOpening = phase === 'opening' || phase === 'dissolving';
  const isDissolving = phase === 'dissolving';

  return (
    <div
      className={`envelope-opening-stage ${isOpening ? 'is-opening' : ''} ${isDissolving ? 'is-dissolving' : ''}`}
      onClick={phase === 'idle' ? handleOpenInvitation : undefined}
      role="button"
      tabIndex={0}
      aria-label="Wedding invitation card of Prithvi Raj & Harshini. Tap anywhere to open."
      onKeyDown={(e) => {
        if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
          handleOpenInvitation();
        }
      }}
    >
      {/* 1. Underlying Soft Deep-Focus Bokeh Background */}
      <div className="envelope-bokeh-backdrop" aria-hidden="true" />

      {/* 2. Main Macro Invitation Card Stage (Perspective 3D Container) */}
      <div className="envelope-card-perspective-box" aria-hidden="true">
        {/* Base Card with Gold Foil Damask Interior, Seal & Names */}
        <div className="envelope-base-card-layer">
          <img
            src={`${ASSET_BASE}envelope-base-with-gold-clean.webp`}
            alt="Textured cream paper invitation card with copper wax seal"
            className="envelope-closed-bg-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* 3. The 3D Lifting Top Flap (Sits in front, covering the gold foil when closed) */}
        <div className="envelope-flap-3d-hinge">
          {/* Front Face: Textured Cream Deckled Paper Flap */}
          <div className="envelope-flap-face envelope-flap-front">
            <img
              src={`${ASSET_BASE}envelope-flap-cream-v2.png`}
              alt=""
              className="envelope-flap-img"
              draggable={false}
            />
            {/* Dynamic Light Specular Reflection across paper grain */}
            <div className="envelope-flap-paper-sheen" />
          </div>

          {/* Underside Face: Ornate Embossed Gold Foil Damask Lining */}
          <div className="envelope-flap-face envelope-flap-back">
            <img
              src={`${ASSET_BASE}envelope-flap-gold-v2.png`}
              alt=""
              className="envelope-flap-img envelope-foil-img"
              draggable={false}
            />
            {/* Metallic Gold Specular Shimmer */}
            <div className="envelope-gold-foil-shimmer" />
          </div>

          {/* Dynamic 3D Cast Shadow Beneath the Lifting Flap */}
          <div className="envelope-flap-cast-shadow" />
        </div>

        {/* 4. Tactile Copper Wax Seal Aura & Subtle Breathing Highlight */}
        <div className="envelope-wax-seal-hotspot">
          <div className="envelope-seal-breathing-aura" />
          <div className="envelope-seal-specular-glint" />
        </div>
      </div>
    </div>
  );
}
