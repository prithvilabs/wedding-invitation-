import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import { couple, weddingDate, blessing } from '../data/weddingData';
import './temple-entrance.css';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/scene-01/`;

function GoldDustParticles({ active }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: 20 + Math.random() * 60,
        bottom: 10 + Math.random() * 50,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
        size: 2 + Math.random() * 3.5,
        driftX: (Math.random() - 0.5) * 60
      })),
    []
  );

  return (
    <div className={`temple-dust-layer ${active ? 'is-active' : ''}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="dust-mote"
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

export default function TempleEntranceScene({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const { playMusic } = useMusic();
  const ringBell = useBellChime();

  // Sequence state: 'idle' -> 'triggered' -> 'lamps_lit' -> 'doors_opening' -> 'camera_push' -> 'exiting'
  const [phase, setPhase] = useState('idle');
  const [isLampsLit, setIsLampsLit] = useState(false);
  const [isBellsSwinging, setIsBellsSwinging] = useState(false);
  const [isDoorsOpen, setIsDoorsOpen] = useState(false);
  const [isCameraPush, setIsCameraPush] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const timers = useRef([]);
  const hasTriggeredRef = useRef(false);

  const clearAllTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const startEntranceSequence = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    setPhase('triggered');

    // PHASE 1 (0.0s -> 0.7s): Sound + bell stir + start music
    ringBell();
    playMusic();
    setIsBellsSwinging(true);

    if (shouldReduceMotion) {
      setIsLampsLit(true);
      setIsDoorsOpen(true);
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        if (onComplete) onComplete();
      }, 2000);
      timers.current.push(exitTimer);
      return;
    }

    // PHASE 2 (0.5s -> 1.4s): Illuminate lamps
    const tLamps = setTimeout(() => {
      setIsLampsLit(true);
    }, 500);
    timers.current.push(tLamps);

    // PHASE 3 & 4 (0.8s -> 3.0s): Open doors & expand golden light rays
    const tDoors = setTimeout(() => {
      setIsDoorsOpen(true);
    }, 800);
    timers.current.push(tDoors);

    // PHASE 5 (2.2s -> 4.0s): Cinematic camera push forward
    const tCamera = setTimeout(() => {
      setIsCameraPush(true);
    }, 2200);
    timers.current.push(tCamera);

    // PHASE 6 (3.8s -> 4.5s): Fade typography and transition to Scene 2
    const tFade = setTimeout(() => {
      setIsFadingOut(true);
    }, 3800);
    timers.current.push(tFade);

    const tComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4500);
    timers.current.push(tComplete);
  }, [ringBell, playMusic, shouldReduceMotion, onComplete]);

  const handleSkip = useCallback(() => {
    clearAllTimers();
    if (onComplete) onComplete();
  }, [clearAllTimers, onComplete]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  return (
    <motion.div
      className="scene1-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      data-testid="scene-01-temple-entrance"
    >
      {/* 3D Cinematic Camera Viewport */}
      <div
        className={`scene1-camera-viewport ${isCameraPush ? 'is-pushed' : ''}`}
        style={{
          transform: isCameraPush && !shouldReduceMotion ? 'scale(1.08) translateY(-1%)' : 'scale(1) translateY(0)',
          transition: shouldReduceMotion ? 'none' : 'transform 2.4s cubic-bezier(0.25, 1, 0.3, 1)'
        }}
      >
        {/* LAYER 1: Base Temple Sanctum Background */}
        <div className="scene1-layer scene1-bg-layer">
          <img
            src={`${ASSET_BASE}background.webp`}
            alt="Temple Sanctum Interior"
            className="scene1-bg-img"
            loading="eager"
            decoding="async"
          />
          <div className="scene1-bg-overlay" />
        </div>

        {/* LAYER 2: Volumetric Golden Light Rays (Behind Doors) */}
        <div
          className={`scene1-layer scene1-light-rays-layer ${isDoorsOpen ? 'is-visible' : ''}`}
          style={{
            opacity: isDoorsOpen ? 0.95 : 0.1,
            transform: isDoorsOpen ? 'scale(1.1)' : 'scale(0.95)',
            filter: isDoorsOpen ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.6)',
            transition: shouldReduceMotion ? 'none' : 'opacity 2.2s ease-in-out, transform 2.5s ease-out, filter 2.2s ease-in-out'
          }}
        >
          <img
            src={`${ASSET_BASE}light-rays.webp`}
            alt="Golden Light Rays"
            className="scene1-light-rays-img"
          />
        </div>

        {/* LAYER 3: Brass Kuthuvilakku Lamps (Sides) */}
        <div
          className={`scene1-layer scene1-lamps-layer ${isLampsLit ? 'is-lit' : ''}`}
          style={{
            opacity: isLampsLit ? 1 : 0.25,
            filter: isLampsLit ? 'brightness(1.1) drop-shadow(0 0 25px rgba(255, 180, 50, 0.45))' : 'brightness(0.5)',
            transition: shouldReduceMotion ? 'none' : 'opacity 1.2s ease-out, filter 1.2s ease-out'
          }}
        >
          <img
            src={`${ASSET_BASE}lamps.webp`}
            alt="Brass Kuthuvilakku Lamps"
            className="scene1-lamps-img"
          />
          <div className={`scene1-lamp-glow-left ${isLampsLit ? 'is-active' : ''}`} />
          <div className={`scene1-lamp-glow-right ${isLampsLit ? 'is-active' : ''}`} />
        </div>

        {/* LAYER 4: Marigold and Jasmine Flower Toranam (Top Arch) */}
        <div className="scene1-layer scene1-flowers-layer">
          <img
            src={`${ASSET_BASE}flowers.webp`}
            alt="South Indian Marigold and Jasmine Garland"
            className="scene1-flowers-img"
          />
        </div>

        {/* LAYER 5: Antique Temple Bells (Top Hanging) */}
        <div className={`scene1-layer scene1-bells-layer ${isBellsSwinging ? 'is-swinging' : ''}`}>
          <img
            src={`${ASSET_BASE}bells.webp`}
            alt="Traditional Temple Bells"
            className="scene1-bells-img"
          />
        </div>

        {/* LAYER 6 & 7: Heavy Carved Wooden Temple Doors (3D Perspective) */}
        <div className="scene1-doors-perspective-stage">
          {/* Left Door Panel */}
          <div
            className="scene1-door-wrapper door-left-wrapper"
            style={{
              transformOrigin: 'left center',
              transform: isDoorsOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)',
              transition: shouldReduceMotion
                ? 'opacity 0.4s ease'
                : 'transform 2.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)'
            }}
          >
            <img
              src={`${ASSET_BASE}doors-left.webp`}
              alt="Carved Temple Left Door"
              className="scene1-door-img"
              draggable="false"
            />
            {/* Dark inner shadow on door face */}
            <div className={`scene1-door-shadow ${isDoorsOpen ? 'is-open' : ''}`} />
          </div>

          {/* Right Door Panel */}
          <div
            className="scene1-door-wrapper door-right-wrapper"
            style={{
              transformOrigin: 'right center',
              transform: isDoorsOpen ? 'rotateY(105deg)' : 'rotateY(0deg)',
              transition: shouldReduceMotion
                ? 'opacity 0.4s ease'
                : 'transform 2.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)'
            }}
          >
            <img
              src={`${ASSET_BASE}doors-right.webp`}
              alt="Carved Temple Right Door"
              className="scene1-door-img"
              draggable="false"
            />
            <div className={`scene1-door-shadow ${isDoorsOpen ? 'is-open' : ''}`} />
          </div>
        </div>

        {/* LAYER 8: Atmospheric Particles & Vignette */}
        <GoldDustParticles active={isDoorsOpen} />
        <div className="scene1-vignette" />
      </div>

      {/* LAYER 9: UI Typography & Interactive Call-to-Action */}
      <div className={`scene1-ui-container ${phase !== 'idle' ? 'is-fading' : ''}`}>
        <div className="scene1-typography-box">
          <motion.p
            className="scene1-blessing-text"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            {blessing.eyebrow}
            <br />
            {blessing.eyebrowSecondary}
          </motion.p>

          <motion.h1
            className="scene1-names-text"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.35 }}
          >
            {couple.displayNames}
          </motion.h1>

          <motion.p
            className="scene1-date-text"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            {weddingDate.display.toUpperCase()} · {weddingDate.city.toUpperCase()}
          </motion.p>
        </div>

        {/* Central Ceremonial Touch to Begin CTA */}
        <AnimatePresence>
          {phase === 'idle' && (
            <motion.button
              type="button"
              className="scene1-cta-button"
              onClick={startEntranceSequence}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.4 } }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label="Touch to begin the wedding invitation"
            >
              <span className="scene1-cta-glow-pulse" />
              <div className="scene1-cta-content">
                <Sparkles className="scene1-cta-icon" size={18} />
                <span className="scene1-cta-title">TOUCH TO BEGIN</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Skip button for non-blocking navigation */}
      {phase !== 'idle' && !isFadingOut && (
        <button
          type="button"
          className="scene1-skip-control"
          onClick={handleSkip}
          aria-label="Skip to main invitation"
        >
          <span>Skip</span>
          <ArrowRight size={14} />
        </button>
      )}
    </motion.div>
  );
}
