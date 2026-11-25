import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import FlowerConfetti from '../../components/invitation/FlowerConfetti';
import ScratchSurface from './ScratchSurface';
import { PlaqueFrame, PlaquePaper, RevealedInvitation, ScratchDemo } from './PlaqueLayers';
import { SHAPES } from './plaque';
import './scratch.css';

// How much of the coating has gone
const FEEDBACK_AT = 0.1; // show the progress line
const PEEK_AT = 0.4; // the rest of the coating turns sheer
const REVEAL_AT = 0.65; // the rest clears by itself

function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** The scratch card: hidden invitation, coating, and the ornamental border above both */
export default function ScratchReveal({ event }) {
  const still = Boolean(useReducedMotion());
  const shape = useMedia('(max-width: 600px)') ? SHAPES.phone : SHAPES.wide;
  const touch = useMedia('(pointer: coarse)');
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0); // in steps of 2%, so scratching rarely re-renders
  const [confettiFrom, setConfettiFrom] = useState(null);
  const cardRef = useRef(null);
  const onScreen = useInView(cardRef, { amount: 0.4 });

  const reveal = useCallback(() => {
    setStarted(true);
    setRevealed(true);
    const box = cardRef.current?.getBoundingClientRect();
    if (box) setConfettiFrom({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
  }, []);

  const onStart = useCallback(() => setStarted(true), []);
  const onProgress = useCallback(
    (fraction) => {
      if (fraction >= REVEAL_AT) reveal();
      else setProgress(Math.floor(fraction * 50) / 50);
    },
    [reveal]
  );

  const peeking = progress >= PEEK_AT;
  let status = 'idle';
  if (revealed) status = 'done';
  else if (started) status = progress >= FEEDBACK_AT ? 'progress' : 'started';

  return (
    <div className="sc-wrap">
      <FlowerConfetti active={Boolean(confettiFrom)} origin={confettiFrom} onComplete={() => setConfettiFrom(null)} />

      <div
        ref={cardRef}
        className={`sc-card sc-card--${shape.key}${onScreen ? ' is-on-screen' : ''}`}
        style={{ aspectRatio: `${shape.w} / ${shape.h}` }}
        data-status={status}
      >
        <PlaquePaper shape={shape} />
        <RevealedInvitation event={event} revealed={revealed} still={still} />

        <AnimatePresence>
          {!revealed && (
            <motion.div
              key={shape.key}
              className={`sc-surface${peeking ? ' is-peeking' : ''}`}
              exit={still ? { opacity: 0, transition: { duration: 0.01 } } : { opacity: 0, scale: 1.035, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }}
            >
              <ScratchSurface shape={shape} sparkles={!still} onStart={onStart} onProgress={onProgress} />
              {!started && !still && (
                <span className="sc-shimmer" aria-hidden="true">
                  <span />
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <PlaqueFrame shape={shape} />
        {!started && <ScratchDemo shape={shape} still={still} />}
      </div>

      {/* Guidance: one line, always the same height, so nothing on the page moves */}
      <div className="sc-status" role="status">
        {status === 'idle' && (
          <p className="sc-hint">
            <Sparkles size={15} strokeWidth={1.6} aria-hidden="true" />
            {touch ? 'Use your finger to uncover our special day' : 'Drag across the card to uncover our special day'}
          </p>
        )}
        {status === 'progress' && (
          <div className="sc-progress">
            <span className="sc-progress-track" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.min(1, progress / REVEAL_AT)})` }} />
            </span>
            <p>{peeking ? 'Almost there…' : 'Keep going…'}</p>
          </div>
        )}
        {status === 'done' && (
          <motion.p
            className="sc-done"
            initial={still ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            Our special day awaits!
          </motion.p>
        )}
      </div>

      {/* For keyboards and screen readers: appears when tabbed to */}
      {!revealed && (
        <button type="button" className="sc-skip" onClick={reveal}>
          Reveal the date
        </button>
      )}
    </div>
  );
}
