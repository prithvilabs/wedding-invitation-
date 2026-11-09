import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import weddingLogo from '../../assets/wedding-logo.png';
import './CurtainOpening.css';

/*
 * Timeline
 * Page load:  fade up from warm darkness to full-screen silk; slow bands of warm light
 *             travel across the closed silk; the PH medallion breathes softly.
 *             The curtains wait here until the visitor touches/clicks.
 * Touch +0:   medallion presses; a ripple of light runs outward through the silk
 * Touch +0.3  the medallion cracks in two, each half travelling with its curtain
 * Touch +0.35 anticipation: the curtains draw in a touch, then part in a grand
 *             tableau sweep (inner hems lift in a diagonal swag while the folds
 *             gather outward, hems trailing); camera pushes through;
 *             a shaft of golden light pours through the gap;
 *             vignette lifts
 * Touch +2.1  gathered silk slips off-screen; overlay removed ~2.75s after touch
 */
const PRESS = 0.35; // medallion press + light ripple before the curtains move
const OPEN = 1.9; // folds gather and lift (majestic, unhurried)
const STAGGER = 0.045; // inner folds lead, outer folds follow
const LIFT = 0.5; // how far the inner hem rises (fraction of height)
const EXIT_AFTER = 1.75; // after opening starts, gathered bunches slip off-screen
const EXIT = 0.6;
const DONE_AFTER_TOUCH_MS = 2750; // overlay removed (then the homepage camera push)
const LOAD_CAP_MS = 4000; // fade up anyway if the page is still loading after this

const EASE_FILM = [0.65, 0, 0.35, 1]; // smooth in-out, no bounce
const EASE_PUSH = [0.5, 0, 0.75, 0]; // camera push accelerates into the reveal
const EASE_EXIT = [0.55, 0, 0.9, 0.4];

// Irregular fold widths (relative): broad soft waves between narrow compressed
// folds, with no repeating rhythm, so the drape never reads as stripes
const WIDTHS = [2.1, 0.62, 1.15, 0.5, 1.75, 0.95, 0.58, 1.4, 2.3, 0.7, 1.05, 0.55];

/**
 * One silk curtain made of vertical fold strips. On open, each fold first
 * draws in slightly (anticipation), then slides toward the outer edge (inner
 * folds first), narrows and turns into an accordion pleat, so the fabric
 * gathers rather than sliding as a panel. The whole drape skews as it moves
 * so the hem trails behind the top, like heavy silk with inertia.
 */
function Curtain({ side, folds, open }) {
  const left = side === 'left';
  const dir = left ? -1 : 1;

  const strips = useMemo(() => {
    const widths = Array.from({ length: folds }, (_, i) => WIDTHS[i % WIDTHS.length]);
    const total = widths.reduce((a, b) => a + b, 0);
    let before = 0;
    return widths.map((w, i) => {
      const s = {
        i, // 0 = outer edge ... folds-1 = centre edge
        w,
        // offset of this fold from the outer edge, as a % of its own width
        travel: (before / w) * 100,
        // broad light: brighter toward the centre of each curtain, darker at the outer edge
        tone: 0.05 * Math.sin(((before + w / 2) / total) * Math.PI) - 0.02 + ((i * 7) % 5) * 0.006,
        // small, progressive phase offset: the cloth sways as one piece (no stepped hem)
        sway: i * 0.12
      };
      before += w;
      return s;
    });
  }, [folds]);

  return (
    <motion.div
      className={`co-curtain co-curtain--${side}`}
      initial={{ x: '0%' }}
      animate={{ x: open ? `${dir * 32}%` : '0%' }}
      transition={{ delay: EXIT_AFTER, duration: EXIT, ease: EASE_EXIT }}
    >
      {/* Silk inertia: hem trails behind the top while moving, then settles */}
      <motion.div
        className="co-drape"
        initial={{ skewX: 0 }}
        animate={open ? { skewX: [0, 0, dir * -4.5, dir * 1.2, 0] } : { skewX: 0 }}
        transition={{ duration: OPEN + 0.2, times: [0, 0.12, 0.5, 0.82, 1], ease: 'easeInOut' }}
      >
        <div className="co-folds" style={{ flexDirection: left ? 'row' : 'row-reverse' }}>
          {strips.map(({ i, w, travel, tone, sway }) => {
            const fromCentre = folds - 1 - i;
            const inner = i === folds - 1;
            const gathered = `${dir * travel * 0.86}%`;
            // Tableau swag: the closer to the centre, the higher the hem lifts
            const lift = LIFT * Math.pow(i / (folds - 1), 1.3);
            return (
              <motion.div
                key={i}
                className={`co-fold${inner ? ' co-fold--inner' : ''}`}
                style={{ flexGrow: w, zIndex: i, transformOrigin: left ? '0% 0%' : '100% 0%' }}
                initial={{ x: '0%', scaleX: 1, scaleY: 1, rotateY: 0 }}
                animate={
                  open
                    ? {
                        // anticipation (draw in toward the centre) -> gather outward and lift
                        x: ['0%', `${-dir * 3.5}%`, gathered],
                        scaleX: [1, 1.03, 0.58],
                        scaleY: [1, 1, 1 - lift],
                        rotateY: [0, 0, (i % 2 ? 1 : -1) * 50 * dir]
                      }
                    : { x: '0%', scaleX: 1, scaleY: 1, rotateY: 0 }
                }
                transition={{
                  delay: fromCentre * STAGGER,
                  duration: OPEN,
                  times: [0, 0.14, 1],
                  ease: ['easeOut', EASE_FILM]
                }}
              >
                <div className="co-fold__cloth" style={{ '--tone': tone, animationDelay: `-${sway}s` }} />
                {/* As the fabric bunches, pleats turned away from the light fall into shadow */}
                <motion.div
                  className="co-fold__shade"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: open ? (i % 2 ? 0.45 : 0.1) : 0 }}
                  transition={{ delay: fromCentre * STAGGER + OPEN * 0.15, duration: OPEN * 0.85, ease: EASE_FILM }}
                />
                {inner && <div className="co-fold__trim" />}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}


/**
 * Stage 1: a film-like silk curtain opening over the already-rendered
 * homepage. The curtains wait, closed, with the PH medallion at the centre;
 * touching/clicking anywhere (or pressing Enter on the medallion) opens them.
 */
export default function CurtainOpening({ onDone, onOpen }) {
  const [folds] = useState(() => (window.innerWidth < 640 ? 7 : 10));
  const [travelPx] = useState(() => Math.round(window.innerWidth * 0.46)); // medallion halves / ripple travel
  const [begun, setBegun] = useState(false); // page loaded: fade up, light sweep
  const [touched, setTouched] = useState(false); // medallion pressed
  const [opening, setOpening] = useState(false); // curtains parting
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const prevOverflow = useRef('');
  const timers = useRef([]);
  const medallionRef = useRef(null);

  // Runs once: parent re-renders (e.g. music state) must not restart anything.
  // Fades up once the page has loaded (so the curtains never open onto a
  // half-loaded homepage), capped so slow images can't keep it dark.
  useEffect(() => {
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      setBegun(true);
      medallionRef.current?.focus({ preventScroll: true });
    };

    if (document.readyState === 'complete') begin();
    else {
      window.addEventListener('load', begin, { once: true });
      timers.current.push(setTimeout(begin, LOAD_CAP_MS));
    }

    return () => {
      window.removeEventListener('load', begin);
      timers.current.forEach(clearTimeout);
      document.body.style.overflow = prevOverflow.current;
    };
  }, []);

  const open = () => {
    if (!begun || touched) return;
    setTouched(true);
    // Called synchronously inside the touch/click, so browsers allow audio to start
    onOpen?.();
    timers.current.push(setTimeout(() => setOpening(true), PRESS * 1000));
    timers.current.push(
      setTimeout(() => {
        document.body.style.overflow = prevOverflow.current;
        onDoneRef.current?.();
      }, DONE_AFTER_TOUCH_MS)
    );
  };

  return (
    <div
      className={`co-overlay${begun && !touched ? ' is-waiting' : ''}${opening ? ' is-opening' : ''}`}
      data-testid="curtain-opening"
      onClick={open}
    >
      {/* Camera rig: settles on fade-up, then pushes forward through the opening */}
      <motion.div
        className="co-rig"
        aria-hidden="true"
        initial={{ scale: 1.04 }}
        animate={{ scale: opening ? 1.16 : begun ? 1 : 1.04 }}
        transition={opening ? { duration: OPEN + 0.5, ease: EASE_PUSH } : { duration: 1.6, ease: EASE_FILM }}
      >
        <Curtain side="left" folds={folds} open={opening} />
        <Curtain side="right" folds={folds} open={opening} />
        <div className="co-seam" />
      </motion.div>

      {/* Slow bands of warm light travel across the closed silk while it waits */}
      <motion.div
        className="co-sweep"
        aria-hidden="true"
        initial={{ x: '-70%', opacity: 0 }}
        animate={begun && !opening ? { x: '70%', opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={
          begun && !opening
            ? { delay: 0.3, duration: 1.6, ease: 'easeInOut', times: [0, 0.2, 0.75, 1], repeat: Infinity, repeatDelay: 2.4 }
            : { duration: 0.3 }
        }
      />

      {/* Golden light pouring through the gap */}
      <motion.div
        className="co-shaft"
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0.1 }}
        animate={opening ? { opacity: [0, 0.9, 0], scaleX: [0.1, 1, 1.6] } : { opacity: 0, scaleX: 0.1 }}
        transition={{ duration: 2.2, times: [0, 0.45, 1], ease: 'easeInOut' }}
      />

      {/* Depth: vignette while closed, lifts on reveal */}
      <motion.div
        className="co-vignette"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ delay: 0.3, duration: 1.0, ease: 'easeOut' }}
      />

      {/* PH medallion at the centre of the curtains: the touch point */}
      <div className="co-medallion-anchor">
        <motion.button
          ref={medallionRef}
          type="button"
          className="co-medallion"
          aria-label="Open the wedding invitation"
          disabled={!begun || touched}
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={
            touched
              ? // press in, then hand over to the two halves
                { opacity: [1, 1, 0], scale: [1, 0.93, 0.96] }
              : begun
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.92 }
          }
          transition={
            touched
              ? { duration: 0.32, times: [0, 0.6, 1], ease: 'easeOut' }
              : { delay: 0.5, duration: 1.1, ease: EASE_FILM }
          }
          whileHover={!touched ? { scale: 1.04 } : undefined}
        >
          <span className="co-medallion__halo" aria-hidden="true" />
          <span className="co-medallion__disc" aria-hidden="true">
            <img src={weddingLogo} alt="" className="co-medallion__logo" draggable="false" />
          </span>
        </motion.button>

        {/* The seal breaks: each half of the medallion travels away with its curtain */}
        {touched &&
          ['left', 'right'].map((half) => {
            const d = half === 'left' ? -1 : 1;
            return (
              <motion.div
                key={half}
                className={`co-medallion co-medallion-half co-medallion-half--${half}`}
                aria-hidden="true"
                initial={{ x: 0, rotate: 0, opacity: 0, scale: 0.96 }}
                animate={{
                  x: [0, d * 7, d * travelPx],
                  y: [0, 0, -0.06 * window.innerHeight],
                  rotate: [0, d * 3, d * 16],
                  opacity: [1, 1, 1, 0],
                  scale: [0.96, 0.96, 0.9]
                }}
                transition={{
                  delay: PRESS - 0.06,
                  duration: OPEN * 0.85,
                  times: [0, 0.12, 1],
                  opacity: { delay: PRESS - 0.06, duration: OPEN * 0.85, times: [0, 0.1, 0.38, 0.62] },
                  ease: EASE_FILM
                }}
              >
                <span className="co-medallion__disc">
                  <img src={weddingLogo} alt="" className="co-medallion__logo" draggable="false" />
                </span>
              </motion.div>
            );
          })}
      </div>

      {/* The touch sends a ripple of light outward through the silk */}
      {touched &&
        ['left', 'right'].map((side) => (
          <motion.div
            key={side}
            className="co-ripple"
            aria-hidden="true"
            initial={{ x: 0, opacity: 0, scaleX: 0.6 }}
            animate={{ x: (side === 'left' ? -1 : 1) * travelPx * 1.1, opacity: [0, 0.95, 0], scaleX: [0.6, 1.4, 1.8] }}
            transition={{ duration: 1.05, ease: [0.25, 0.6, 0.3, 1], times: [0, 0.3, 1] }}
          />
        ))}

      {/* Fade up from warm darkness once the page is ready */}
      <motion.div
        className="co-fade"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: begun ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}
