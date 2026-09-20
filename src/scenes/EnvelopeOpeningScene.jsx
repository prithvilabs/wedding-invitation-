import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import './envelope-opening.css';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/envelope/`;

function FloatingGoldenParticles({ active }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        left: 25 + Math.random() * 50,
        bottom: 20 + Math.random() * 40,
        delay: Math.random() * 2.5,
        duration: 3 + Math.random() * 3,
        size: 2 + Math.random() * 4,
        driftX: (Math.random() - 0.5) * 70
      })),
    []
  );

  return (
    <div className={`envelope-particles-layer ${active ? 'is-active' : ''}`} aria-hidden="true">
      {motes.map((p) => (
        <span
          key={p.id}
          className="envelope-glow-mote"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift-x': `${p.driftX}px`
          }}
        />
      ))}
    </div>
  );
}

export default function EnvelopeOpeningScene({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const { playMusic } = useMusic();
  const ringBell = useBellChime();

  // State phases:
  // 'idle' (Closed, still, waiting ONLY for wax seal click)
  // -> 'seal_press' (0.0s: seal compresses & illuminates)
  // -> 'seal_release' (0.4s: seal releases/detaches)
  // -> 'flap_opening' (0.9s: triangular flap lifts UPWARD)
  // -> 'golden_bloom' (2.0s: golden volumetric light pours out)
  // -> 'camera_push' (2.9s: camera pushes into opening)
  // -> 'transition' (4.1s: golden-ivory flood crossfade to main site)
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);
  const hasTriggeredRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  // The wax seal is the ONLY interactive trigger
  const handleSealClick = useCallback((e) => {
    e.stopPropagation();
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // STEP 1: Seal press & bell sound
    setPhase('seal_press');
    try {
      ringBell();
      playMusic();
    } catch (err) {}

    if (shouldReduceMotion) {
      setPhase('transition');
      const tFast = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
      timers.current.push(tFast);
      return;
    }

    // STEP 2: Wax seal releases / detaches (0.45s)
    const tRelease = setTimeout(() => {
      setPhase('seal_release');
    }, 450);
    timers.current.push(tRelease);

    // STEP 3 & 4: Top triangular flap rotates vertically UPWARD (0.95s)
    const tFlap = setTimeout(() => {
      setPhase('flap_opening');
    }, 950);
    timers.current.push(tFlap);

    // STEP 5: Volumetric golden light beams pour out from envelope interior (2.0s)
    const tBloom = setTimeout(() => {
      setPhase('golden_bloom');
    }, 2000);
    timers.current.push(tBloom);

    // STEP 6: Camera push-in toward the glowing aperture (2.9s)
    const tCamera = setTimeout(() => {
      setPhase('camera_push');
    }, 2900);
    timers.current.push(tCamera);

    // STEP 7: Golden-ivory light crossfade into main wedding website (4.2s)
    const tTransition = setTimeout(() => {
      setPhase('transition');
    }, 4200);
    timers.current.push(tTransition);

    const tComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);
    timers.current.push(tComplete);
  }, [ringBell, playMusic, shouldReduceMotion, onComplete]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  const isFlapOpened = phase === 'flap_opening' || phase === 'golden_bloom' || phase === 'camera_push' || phase === 'transition';
  const isLightBlooming = phase === 'golden_bloom' || phase === 'camera_push' || phase === 'transition';
  const isCameraPushing = phase === 'camera_push' || phase === 'transition';
  const isTransitioning = phase === 'transition';
  const isSealActive = phase === 'seal_press' || phase === 'seal_release' || isFlapOpened;

  return (
    <motion.div
      className="envelope-stage-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
      data-testid="interactive-wax-seal-envelope"
    >
      {/* 3D Cinematic Viewport Rig with ample top clearance for upward flap rotation */}
      <div
        className={`envelope-viewport-rig ${isCameraPushing ? 'is-pushing' : ''}`}
        style={{
          transform: isCameraPushing && !shouldReduceMotion ? 'scale(1.24) translateY(4%)' : 'scale(1) translateY(0)',
          transition: shouldReduceMotion ? 'none' : 'transform 2.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* Layer 1: Dark Ceremonial Setting & Blurred Diyas */}
        <div className="envelope-layer envelope-bg-layer">
          <img
            src={`${ASSET_BASE}background.webp`}
            alt="South Indian Ceremonial Setting"
            className="envelope-bg-img"
            loading="eager"
            decoding="async"
          />
          <div className="envelope-bg-vignette" />
        </div>

        {/* Layer 2: Scattered Jasmine & Rose Petals */}
        <div className="envelope-layer envelope-flowers-layer">
          <img
            src={`${ASSET_BASE}flowers.webp`}
            alt="Jasmine Blossoms and Rose Petals"
            className="envelope-flowers-img"
          />
        </div>

        {/* Layer 3: Central Physical Burgundy Velvet Envelope */}
        <div className="envelope-physical-box">
          {/* Ambient drop shadow under envelope */}
          <div className="envelope-ambient-shadow" />

          {/* Golden Interior Light Beams Streaming Out */}
          <div
            className={`envelope-interior-glow ${isLightBlooming ? 'is-active' : ''}`}
            style={{
              opacity: isLightBlooming ? 1 : 0,
              transform: isLightBlooming ? 'scale(1.35)' : 'scale(0.8)',
              transition: 'opacity 1.8s ease-in-out, transform 2.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <img
              src={`${ASSET_BASE}golden-light.webp`}
              alt="Volumetric Golden Light"
              className="envelope-light-beam-img"
            />
          </div>

          {/* Velvet Envelope Base Pocket (Stationary bottom) */}
          <div className="envelope-pocket-base">
            <img
              src={`${ASSET_BASE}envelope-base.webp`}
              alt="Burgundy Velvet Envelope Body"
              className="envelope-base-img"
              draggable="false"
            />
          </div>

          {/* 3D Triangular Flap (LIFTS STRAIGHT UPWARD from top fold) */}
          <div
            className={`envelope-flap-hinge ${isFlapOpened ? 'is-opened' : ''}`}
            style={{
              transform: isFlapOpened ? 'rotateX(-175deg)' : 'rotateX(0deg)',
              transition: shouldReduceMotion
                ? 'opacity 0.4s ease'
                : 'transform 1.9s cubic-bezier(0.35, 0.05, 0.2, 1.0)'
            }}
          >
            <img
              src={`${ASSET_BASE}envelope-flap.webp`}
              alt="Burgundy Velvet Envelope Flap"
              className="envelope-flap-img"
              draggable="false"
            />
          </div>

          {/* WAX SEAL (THE ONLY INTERACTIVE ELEMENT) */}
          <div
            className={`wax-seal-target ${phase === 'idle' ? 'is-clickable' : ''} ${phase === 'seal_press' ? 'is-pressed' : ''} ${phase === 'seal_release' || isFlapOpened ? 'is-released' : ''}`}
            onClick={phase === 'idle' ? handleSealClick : undefined}
            role="button"
            tabIndex={phase === 'idle' ? 0 : -1}
            aria-label="Click the wax seal to open the wedding invitation"
            onKeyDown={(e) => {
              if (phase === 'idle' && (e.key === 'Enter' || e.key === ' ')) {
                handleSealClick(e);
              }
            }}
          >
            {/* Subtle idle breathing aura around seal */}
            <div className={`wax-seal-halo ${phase === 'idle' ? 'is-breathing' : ''} ${isSealActive ? 'is-ignited' : ''}`} />

            <img
              src={`${ASSET_BASE}wax-seal.webp`}
              alt="Embossed Lotus Wax Seal"
              className="wax-seal-img"
              draggable="false"
            />

            {/* Sparkle release burst on detachment */}
            {phase === 'seal_release' && (
              <div className="wax-seal-release-sparks" />
            )}
          </div>
        </div>

        {/* Layer 4: Rising Golden Dust Particles & Sparks */}
        <FloatingGoldenParticles active={isLightBlooming} />
      </div>

      {/* Layer 5: Expanding Golden-Ivory Light Flood Crossfade */}
      <div
        className={`envelope-light-flood ${isLightBlooming ? 'is-blooming' : ''} ${isTransitioning ? 'is-whiteout' : ''}`}
      />
    </motion.div>
  );
}
