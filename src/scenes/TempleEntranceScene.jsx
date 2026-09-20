import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Flame } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import useBellChime from '../hooks/useBellChime';
import CameraMotion from '../components/cinematic/CameraMotion';
import ParallaxLayer from '../components/cinematic/ParallaxLayer';
import { couple, weddingDate, blessing } from '../data/weddingData';
import './temple-entrance.css';

const SEQUENCE = [
  { step: 2, delay: 300 },   // diya ignites
  { step: 3, delay: 1300 },  // bells stir
  { step: 4, delay: 2200 },  // light sliver at door seam
  { step: 5, delay: 3000 },  // doors open + light expands (runs ~2.4s)
  { step: 7, delay: 3800 },  // camera pushes forward (slow, 14s ongoing)
  { step: 8, delay: 5700 },  // typography, once doors have fully opened
  { step: 9, delay: 8500 }   // ceremonial CTA
];

function KuthuVilakku({ lit }) {
  return (
    <svg viewBox="0 0 120 220" className="temple-lamp-svg" aria-hidden="true">
      <defs>
        <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d78a" />
          <stop offset="45%" stopColor="#cfa049" />
          <stop offset="100%" stopColor="#8a5f1f" />
        </linearGradient>
        <radialGradient id="flameGlow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff6dd" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffcf6b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffcf6b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* stand */}
      <rect x="56" y="90" width="8" height="110" fill="url(#brassGrad)" />
      <ellipse cx="60" cy="204" rx="30" ry="8" fill="url(#brassGrad)" />
      <ellipse cx="60" cy="96" rx="16" ry="6" fill="url(#brassGrad)" />
      {/* bowl */}
      <path d="M32 92 Q60 118 88 92 L82 84 Q60 100 38 84 Z" fill="url(#brassGrad)" />
      {/* flame glow */}
      <circle className={`lamp-glow ${lit ? 'is-lit' : ''}`} cx="60" cy="58" r="55" fill="url(#flameGlow)" />
      {/* flame */}
      <path
        className={`lamp-flame ${lit ? 'is-lit' : ''}`}
        d="M60 30c8 12 14 20 14 30a14 14 0 0 1-28 0c0-10 6-18 14-30z"
        fill="#ffb347"
      />
      <path
        className={`lamp-flame-core ${lit ? 'is-lit' : ''}`}
        d="M60 42c4 7 7 11 7 16a7 7 0 0 1-14 0c0-5 3-9 7-16z"
        fill="#fff6dd"
      />
    </svg>
  );
}

function TempleBell({ swinging, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 60 90"
      className="temple-bell-svg"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
      data-swinging={swinging ? 'true' : 'false'}
    >
      <defs>
        <linearGradient id="bellGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d78a" />
          <stop offset="50%" stopColor="#dfb35a" />
          <stop offset="100%" stopColor="#8a5f1f" />
        </linearGradient>
      </defs>
      <line x1="30" y1="0" x2="30" y2="14" stroke="#8a5f1f" strokeWidth="2" />
      <path d="M16 40c0-12 6-26 14-26s14 14 14 26z" fill="url(#bellGrad)" />
      <rect x="12" y="40" width="36" height="6" rx="3" fill="url(#bellGrad)" />
      <line x1="30" y1="46" x2="30" y2="64" stroke="#8a5f1f" strokeWidth="1.5" />
      <circle cx="30" cy="68" r="5" fill="url(#bellGrad)" />
    </svg>
  );
}

function ToranamGarland() {
  const dots = useMemo(
    () =>
      Array.from({ length: 21 }, (_, i) => {
        const t = i / 20;
        const y = Math.sin(t * Math.PI) * 26;
        const gold = i % 3 === 0;
        return { x: t * 100, y, gold };
      }),
    []
  );
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="temple-toranam-svg" aria-hidden="true">
      <path d="M0 2 Q50 30 100 2" stroke="#5c4321" strokeWidth="0.4" fill="none" opacity="0.6" />
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y + 2}
          r={d.gold ? 2.1 : 1.6}
          fill={d.gold ? '#dfb35a' : '#e8871e'}
        />
      ))}
    </svg>
  );
}

function DoorPanel({ side }) {
  const emblemX = 50;
  return (
    <svg viewBox="0 0 100 260" preserveAspectRatio="none" className={`temple-door-svg door-${side}`} aria-hidden="true">
      <defs>
        <linearGradient id={`wood-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2c0f0a" />
          <stop offset="50%" stopColor="#4a1c12" />
          <stop offset="100%" stopColor="#230c08" />
        </linearGradient>
        <linearGradient id={`trim-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d78a" />
          <stop offset="100%" stopColor="#8a5f1f" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="260" fill={`url(#wood-${side})`} />
      {/* grain lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={8 + i * 11} y1="6" x2={8 + i * 11} y2="254" stroke="#1a0705" strokeWidth="0.6" opacity="0.5" />
      ))}
      {/* outer trim */}
      <rect x="4" y="4" width="92" height="252" fill="none" stroke={`url(#trim-${side})`} strokeWidth="2.4" />
      {/* panel divisions */}
      <rect x="10" y="12" width="80" height="100" fill="none" stroke={`url(#trim-${side})`} strokeWidth="1.4" />
      <rect x="10" y="148" width="80" height="100" fill="none" stroke={`url(#trim-${side})`} strokeWidth="1.4" />
      {/* lotus emblem, upper panel */}
      <g transform="translate(50 62)">
        <circle r="20" fill="none" stroke={`url(#trim-${side})`} strokeWidth="1.6" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 12;
          const y = Math.sin(angle) * 12;
          return <ellipse key={i} cx={x} cy={y} rx="6" ry="3" fill="#dfb35a" opacity="0.85" transform={`rotate(${(angle * 180) / Math.PI} ${x} ${y})`} />;
        })}
        <circle r="4.5" fill="#f7e7c4" />
      </g>
      {/* lower emblem */}
      <g transform="translate(50 198)">
        <circle r="14" fill="none" stroke={`url(#trim-${side})`} strokeWidth="1.4" />
        <circle r="3.4" fill="#dfb35a" />
      </g>
      {/* door ring handle near the seam */}
      <circle cx={side === 'left' ? 92 : emblemX + 42 - emblemX} cy="130" r="5" fill="none" stroke="#f3d78a" strokeWidth="2" />
    </svg>
  );
}

function GoldDustParticles({ active }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: 30 + Math.random() * 40,
        delay: Math.random() * 4,
        duration: 5 + Math.random() * 4,
        size: 2 + Math.random() * 3
      })),
    []
  );
  return (
    <div className={`temple-dust-particles ${active ? 'is-active' : ''}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="dust-mote"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
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
  const [phase, setPhase] = useState('idle'); // idle -> playing -> exiting
  const [step, setStep] = useState(0);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const beginSequence = useCallback(() => {
    playMusic();
    setPhase('playing');
    setStep(1);

    if (shouldReduceMotion) {
      setStep(9);
      return;
    }

    SEQUENCE.forEach(({ step: s, delay }) => {
      const id = setTimeout(() => setStep(s), delay);
      timers.current.push(id);
    });
  }, [playMusic, shouldReduceMotion]);

  const skipToEnd = useCallback(() => {
    clearTimers();
    setStep(9);
  }, [clearTimers]);

  const handleEnter = useCallback(() => {
    ringBell();
    setPhase('exiting');
    const id = setTimeout(() => {
      if (onComplete) onComplete();
    }, 650);
    timers.current.push(id);
  }, [onComplete, ringBell]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <motion.div
      className="temple-entrance-stage"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        filter: 'blur(10px)',
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
      }}
    >
      <CameraMotion active={step >= 7 && !shouldReduceMotion} className="temple-camera-frame">
        <div className="temple-bg-gradient" />

        <ParallaxLayer speed={0.01} className="temple-gopuram-layer">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet" className="temple-gopuram-svg" aria-hidden="true">
            <defs>
              <linearGradient id="gopuramGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1c0a07" />
                <stop offset="100%" stopColor="#3a120c" />
              </linearGradient>
            </defs>
            <path
              d="M60 300 L60 120 Q60 60 110 40 Q140 10 200 10 Q260 10 290 40 Q340 60 340 120 L340 300 Z"
              fill="url(#gopuramGrad)"
              opacity="0.9"
            />
            {Array.from({ length: 5 }).map((_, i) => (
              <rect key={i} x={90 + i * 3} y={30 + i * 16} width={220 - i * 6} height="3" fill="#5c2417" opacity="0.5" />
            ))}
          </svg>
        </ParallaxLayer>

        <ParallaxLayer speed={0.02} className="temple-pillar-layer temple-pillar-left">
          <svg viewBox="0 0 60 300" preserveAspectRatio="none" aria-hidden="true">
            <rect x="10" y="0" width="40" height="300" fill="#20090a" opacity="0.85" />
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x="10" y={i * 30} width="40" height="2" fill="#8a5f1f" opacity="0.35" />
            ))}
          </svg>
        </ParallaxLayer>
        <ParallaxLayer speed={0.02} className="temple-pillar-layer temple-pillar-right">
          <svg viewBox="0 0 60 300" preserveAspectRatio="none" aria-hidden="true">
            <rect x="10" y="0" width="40" height="300" fill="#20090a" opacity="0.85" />
            {Array.from({ length: 10 }).map((_, i) => (
              <rect key={i} x="10" y={i * 30} width="40" height="2" fill="#8a5f1f" opacity="0.35" />
            ))}
          </svg>
        </ParallaxLayer>

        <div className="temple-toranam-wrap">
          <ToranamGarland />
        </div>

        <div className="temple-doors-layer">
          <div className={`temple-door-shell door-left ${step >= 5 ? 'is-open' : ''}`}>
            <DoorPanel side="left" />
          </div>
          <div className={`temple-door-shell door-right ${step >= 5 ? 'is-open' : ''}`}>
            <DoorPanel side="right" />
          </div>
        </div>

        <div className={`temple-light-bloom ${step >= 4 ? 'is-sliver' : ''} ${step >= 5 ? 'is-expanded' : ''}`} aria-hidden="true" />
        <div className={`temple-floor-glow ${step >= 5 ? 'is-active' : ''}`} aria-hidden="true" />

        <GoldDustParticles active={step >= 5} />

        <ParallaxLayer speed={0.04} className="temple-lamp-wrap">
          <KuthuVilakku lit={step >= 2} />
        </ParallaxLayer>

        <div className="temple-bells-row">
          <TempleBell swinging={step >= 3} delay={0} />
          <TempleBell swinging={step >= 3} delay={120} />
          <TempleBell swinging={step >= 3} delay={240} />
        </div>

        <div className="temple-vignette" aria-hidden="true" />
        <div className="temple-film-grain" aria-hidden="true" />
      </CameraMotion>

      <div className={`temple-typography ${step >= 8 ? 'is-visible' : ''}`}>
        <p className="temple-blessing-line">
          {blessing.eyebrow}
          <br />
          {blessing.eyebrowSecondary}
        </p>
        <h1 className="temple-names-line">{couple.displayNames}</h1>
        <p className="temple-date-line">
          {weddingDate.display.toUpperCase()} · {weddingDate.city.toUpperCase()}
        </p>
      </div>

      <AnimatePresence>
        {step >= 9 && (
          <motion.button
            type="button"
            className="temple-cta-seal"
            onClick={handleEnter}
            onMouseEnter={ringBell}
            onFocus={ringBell}
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Enter the invitation"
          >
            <span className="temple-cta-ring" />
            <span className="temple-cta-label">Enter Invitation</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'idle' && (
          <motion.button
            type="button"
            className="temple-tap-begin"
            onClick={beginSequence}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            aria-label="Begin the wedding invitation"
          >
            <Flame size={22} strokeWidth={1.4} className="temple-tap-icon" />
            <span>Touch to Begin</span>
            <span className="temple-tap-sub">{couple.displayNames}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {phase === 'playing' && step < 9 && (
        <motion.button
          type="button"
          className="temple-skip-btn"
          onClick={skipToEnd}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          whileHover={{ opacity: 1 }}
          aria-label="Skip to the end of the entrance"
        >
          <span>Skip</span>
          <ArrowUpRight size={13} strokeWidth={2} />
        </motion.button>
      )}
    </motion.div>
  );
}
