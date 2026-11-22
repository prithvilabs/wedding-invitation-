import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';
import './story-film.css';

// Authentic couple & story photography (unchanged)
import photoBeginning from '../assets/story/The Beginning.jpeg';
import photoFirstHi from '../assets/story/photos/photo_2_first_hi.jpg';
import photoDating from '../assets/story/photos/photo_3_dating.jpg';
import photoTravelling from '../assets/story/Travelling together.jpeg';
import photoOceans from '../assets/story/photos/photo_6_oceans.jpg';
import photoEngaged from '../assets/story/Engaged.jpeg';

/* --------------------------------------------------------------------------
   Story content (unchanged from the previous storybook version)
   -------------------------------------------------------------------------- */
const CHAPTERS = [
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
    aspectRatio: '1/1',
    objectPosition: 'center 8%',
    thumbPosition: 'center 10%',
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
    aspectRatio: '16/10',
    objectPosition: 'center center',
    thumbPosition: 'center center',
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
    aspectRatio: '3/4',
    objectPosition: 'center 3%',
    thumbPosition: 'center 12%',
    frameLabel: 'FRAME 06A',
    footerStamp: 'WE GOT ENGAGED'
  }
];

const N = CHAPTERS.length;
const EASE_CINE = [0.22, 1, 0.36, 1];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const aspectNumber = (ratio = '4/3') => {
  const [w, h] = String(ratio).split('/').map(Number);
  return w && h ? w / h : 4 / 3;
};
const toTitleCase =(s) => s.toLowerCase().replace(/(^|[\s"'])([a-z])/g, (m, p, c) => p + c.toUpperCase());

function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

const scrollToEvents = () => {
  const el = document.getElementById('events') || document.querySelector('.events-section');
  el?.scrollIntoView({ behavior: 'smooth' });
};

/* --------------------------------------------------------------------------
   Small inline icons (no emoji)
   -------------------------------------------------------------------------- */
function WeddingRingsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="12" r="5.5" stroke="#DFB35A" strokeWidth="1.6" />
      <circle cx="15" cy="12" r="5.5" stroke="#F3DACB" strokeWidth="1.6" />
    </svg>
  );
}

function MessageHeartIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#DFB35A" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ArrowIcon({ dir = 'right', size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'right' ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
    </svg>
  );
}

function CloseIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   One 35mm film cell: sprocket bands + photo window + edge marking
   -------------------------------------------------------------------------- */
function FilmCell({ ch }) {
  return (
    <span className="lf-cell">
      <span className="lf-sprockets" aria-hidden="true" />
      <span className="lf-window">
        <img
          src={ch.photo}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          style={{ objectPosition: ch.thumbPosition || ch.objectPosition || 'center center' }}
        />
      </span>
      <span className="lf-sprockets" aria-hidden="true" />
      <span className="lf-edge-mark" aria-hidden="true">{ch.sceneNum}A</span>
    </span>
  );
}

function FrameCaption({ ch }) {
  return (
    <span className="lf-caption">
      <span className="lf-caption-year">{ch.year}</span>
      <span className="lf-caption-title">{toTitleCase(ch.title)}</span>
    </span>
  );
}

/* --------------------------------------------------------------------------
   Desktop: a frame positioned on the curved reel
   -------------------------------------------------------------------------- */
function ReelFrame({ ch, index, pos, geo, onOpen, onFocusFrame, isCentered }) {
  const d = useTransform(pos, (p) => index - p);
  const transform = useTransform(
    d,
    (v) => `translateZ(${-geo.radius}px) rotateY(${v * geo.step}rad) translateZ(${geo.radius}px)`
  );
  const opacity = useTransform(d, (v) => clamp(1.3 - Math.abs(v) * 0.3, 0, 1));
  const shade = useTransform(d, (v) => clamp(Math.abs(v) * 0.24, 0, 0.62));
  const visibility = useTransform(d, (v) => (Math.abs(v) > 3.7 ? 'hidden' : 'visible'));
  // Frames turned nearly edge-on at the far ends of the curve can't be clicked as thin slivers
  const pointerEvents = useTransform(d, (v) => (Math.abs(v) > 2.6 ? 'none' : 'auto'));

  return (
    <motion.div
      className="lf-frame"
      style={{ transform, opacity, visibility, pointerEvents, width: geo.frameW, marginLeft: -geo.frameW / 2 }}
    >
      <button
        type="button"
        className={`lf-frame-btn${isCentered ? ' is-centered' : ''}`}
        data-story-index={index}
        onClick={(e) => onOpen(index, e)}
        onFocus={() => onFocusFrame(index)}
        aria-label={`${ch.badge}: ${toTitleCase(ch.title)}, ${ch.year}. Open memory`}
      >
        <FilmCell ch={ch} />
        <motion.span className="lf-frame-shade" style={{ opacity: shade }} aria-hidden="true" />
      </button>
      <FrameCaption ch={ch} />
    </motion.div>
  );
}

/* --------------------------------------------------------------------------
   Full-screen memory: the frame flies toward the camera and expands
   -------------------------------------------------------------------------- */
function MemoryView({ index, setIndex, getOriginRect, onClosed, reduceMotion }) {
  const ch = CHAPTERS[index];
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const flyRef = useRef(null);
  const contentRef = useRef(null);
  const surfaceRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closingRef = useRef(false);
  const indexRef = useRef(index);
  // Direction of travel between memories (content slides in from that side)
  const navDir = index >= indexRef.current ? 1 : -1;
  indexRef.current = index;

  // In-card photo zoom: the photo scales up inside the card (transforms only, no layout change)
  const cardRef = useRef(null);
  const zoomRef = useRef(null);
  const zx = useMotionValue(0);
  const zy = useMotionValue(0);
  const zs = useMotionValue(1);
  const [zoomed, setZoomed] = useState(false);
  const [zoomUsed, setZoomUsed] = useState(false); // after the first zoom, the image scale eases instead of drifting
  const zoomedRef = useRef(false);
  const zoomTransition = { duration: reduceMotion ? 0 : 0.8, ease: [0.65, 0, 0.35, 1] };

  const zoomIn = () => {
    const card = cardRef.current;
    const el = zoomRef.current;
    if (!card || !el || zoomedRef.current) return;
    const c = card.getBoundingClientRect();
    const p = el.getBoundingClientRect();
    const margin = 14;
    // Stay inside the card and inside the visible screen
    const left = c.left + margin;
    const right = c.right - margin;
    const top = Math.max(c.top, 0) + margin;
    const bottom = Math.min(c.bottom, window.innerHeight) - margin;
    // The frame grows as far as the card allows (on narrow phones it may barely grow;
    // the crop-zoom of the image inside the frame still carries the effect)
    const scale = Math.max(1, Math.min((right - left) / p.width, (bottom - top) / p.height));
    zoomedRef.current = true;
    setZoomed(true);
    setZoomUsed(true);
    animate(zx, (left + right) / 2 - (p.left + p.width / 2), zoomTransition);
    animate(zy, (top + bottom) / 2 - (p.top + p.height / 2), zoomTransition);
    animate(zs, scale, zoomTransition);
    animate(contentRef.current, { opacity: 0 }, { duration: reduceMotion ? 0 : 0.35 });
    animate(closeBtnRef.current, { opacity: 0 }, { duration: reduceMotion ? 0 : 0.3 });
  };

  const zoomOut = useCallback(
    (instant = false) => {
      if (!zoomedRef.current) return;
      zoomedRef.current = false;
      setZoomed(false);
      const t = instant ? { duration: 0 } : zoomTransition;
      animate(zx, 0, t);
      animate(zy, 0, t);
      animate(zs, 1, t);
      animate(contentRef.current, { opacity: 1 }, instant ? { duration: 0 } : { duration: 0.45, delay: 0.3 });
      animate(closeBtnRef.current, { opacity: 1 }, instant ? { duration: 0 } : { duration: 0.35, delay: 0.35 });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduceMotion]
  );

  // A new chapter, or a resized window, always starts un-zoomed
  useEffect(() => {
    zoomOut(true);
    setZoomUsed(false);
  }, [index, zoomOut]);
  useEffect(() => {
    const onResize = () => zoomOut(true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [zoomOut]);

  const flipStyle = (from, to) => {
    const scale = from.width / to.width;
    const x = from.left + from.width / 2 - (to.left + to.width / 2);
    const y = from.top + from.height / 2 - (to.top + to.height / 2);
    return { x, y, scale };
  };

  // Opening: frame window -> full memory photo
  useLayoutEffect(() => {
    const fly = flyRef.current;
    const from = getOriginRect(index);
    const to = fly.getBoundingClientRect();

    animate(backdropRef.current, { opacity: [0, 1] }, { duration: reduceMotion ? 0.2 : 0.55, ease: 'easeOut' });
    if (from && !reduceMotion) {
      const f = flipStyle(from, to);
      fly.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.scale})`;
      animate(fly, { x: [f.x, 0], y: [f.y, 0], scale: [f.scale, 1] }, { duration: 0.85, ease: EASE_CINE });
    } else {
      animate(fly, { opacity: [0, 1] }, { duration: 0.3 });
    }
    // The film frame itself expands into the frosted card (FLIP of the card surface)
    const surface = surfaceRef.current;
    const cellFrom = getOriginRect(index, 'cell');
    if (cellFrom && !reduceMotion) {
      const to = cardRef.current.getBoundingClientRect();
      const sx = cellFrom.width / to.width;
      const sy = cellFrom.height / to.height;
      const x = cellFrom.left + cellFrom.width / 2 - (to.left + to.width / 2);
      const y = cellFrom.top + cellFrom.height / 2 - (to.top + to.height / 2);
      surface.style.opacity = '1';
      surface.style.transform = `translate(${x}px, ${y}px) scale(${sx}, ${sy})`;
      animate(surface, { x: [x, 0], y: [y, 0], scaleX: [sx, 1], scaleY: [sy, 1] }, { duration: 0.85, ease: EASE_CINE });
    } else {
      animate(surface, { opacity: [0, 1] }, { duration: 0.3 });
    }
    animate(closeBtnRef.current, { opacity: [0, 1] }, { delay: reduceMotion ? 0 : 0.5, duration: 0.4 });
    animate(contentRef.current, { opacity: [0, 1], y: [12, 0] }, { delay: reduceMotion ? 0 : 0.5, duration: 0.6, ease: EASE_CINE });
    closeBtnRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(
    (after) => {
      if (closingRef.current) return;
      closingRef.current = true;
      zoomOut(true); // the photo flies back to the reel from its normal size
      const fly = flyRef.current;
      const to = getOriginRect(indexRef.current);
      const from = fly.getBoundingClientRect();
      const done = () => onClosed(after);

      animate(contentRef.current, { opacity: 0 }, { duration: 0.2 });
      animate(closeBtnRef.current, { opacity: 0 }, { duration: 0.2 });
      // The card folds back into its film frame
      const surface = surfaceRef.current;
      const cellTo = getOriginRect(indexRef.current, 'cell');
      if (cellTo && !reduceMotion) {
        const card = cardRef.current.getBoundingClientRect();
        animate(
          surface,
          {
            x: cellTo.left + cellTo.width / 2 - (card.left + card.width / 2),
            y: cellTo.top + cellTo.height / 2 - (card.top + card.height / 2),
            scaleX: cellTo.width / card.width,
            scaleY: cellTo.height / card.height,
            opacity: [1, 1, 0]
          },
          { duration: 0.7, ease: [0.65, 0, 0.35, 1] }
        );
      } else {
        animate(surface, { opacity: 0 }, { duration: 0.3 });
      }
      animate(backdropRef.current, { opacity: 0 }, { duration: 0.5, delay: reduceMotion ? 0 : 0.2 });
      if (to && !reduceMotion) {
        const f = flipStyle(to, from);
        animate(fly, { x: f.x, y: f.y, scale: f.scale }, { duration: 0.7, ease: [0.65, 0, 0.35, 1] }).then(done);
      } else {
        animate(fly, { opacity: 0 }, { duration: 0.25 }).then(done);
      }
    },
    [getOriginRect, onClosed, reduceMotion, zoomOut]
  );

  // Clicks outside the photo: first step back out of a zoom, then close
  const stepBack = () => (zoomedRef.current ? zoomOut() : close());

  // Scrolling (wheel / trackpad) or swiping moves between memories inside the same card.
  // If the card is taller than the screen (small phones), vertical scrolling stays native.
  useEffect(() => {
    const root = rootRef.current;
    const layout = root?.querySelector('.lf-memory-layout');
    if (!root || !layout) return undefined;
    let acc = 0;
    let lockUntil = 0;
    let resetTimer;
    const step = (dir) => {
      const next = indexRef.current + dir;
      if (next < 0 || next > N - 1 || closingRef.current) return;
      lockUntil = Date.now() + 750;
      acc = 0;
      setIndex(next);
    };
    const onWheel = (e) => {
      const scrollable = layout.scrollHeight > layout.clientHeight + 1;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (scrollable && !horizontal) return; // let the card scroll
      e.preventDefault();
      if (zoomedRef.current || Date.now() < lockUntil) return;
      acc += horizontal ? e.deltaX : e.deltaY;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (acc = 0), 220);
      if (Math.abs(acc) > 70) step(acc > 0 ? 1 : -1);
    };
    let touch = null;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e) => {
      if (!touch || zoomedRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.x;
      const dy = t.clientY - touch.y;
      touch = null;
      // horizontal swipe only, so vertical scrolling of a tall card still works
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    root.addEventListener('touchstart', onTouchStart, { passive: true });
    root.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      root.removeEventListener('wheel', onWheel);
      root.removeEventListener('touchstart', onTouchStart);
      root.removeEventListener('touchend', onTouchEnd);
      clearTimeout(resetTimer);
    };
  }, [setIndex]);

  // Keyboard: Esc un-zooms or closes, arrows move between memories, Tab stays inside
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (zoomedRef.current) zoomOut();
        else close();
      } else if (e.key === 'ArrowRight' && indexRef.current < N - 1) setIndex(indexRef.current + 1);
      else if (e.key === 'ArrowLeft' && indexRef.current > 0) setIndex(indexRef.current - 1);
      else if (e.key === 'Tab') {
        const items = rootRef.current?.querySelectorAll('button:not([disabled])');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, setIndex, zoomOut]);

  return createPortal(
    <div className="lf-memory" role="dialog" aria-modal="true" aria-labelledby="lfMemoryTitle" ref={rootRef}>
      {/* Transparent: the wedding page stays visible; this only catches clicks outside the card */}
      <div className="lf-memory-backdrop" ref={backdropRef} style={{ opacity: 0 }} onClick={stepBack} />


      <div className="lf-memory-layout" onClick={(e) => e.target === e.currentTarget && stepBack()}>
        {/* Keepsake-page card: centred, ~680px; the photo flies in on top of it */}
        <article
          className={`lf-memory-card${zoomed ? ' is-zoomed' : ''}`}
          ref={cardRef}
          onClick={() => zoomedRef.current && zoomOut()}
        >
          <span className="lf-memory-card-surface" ref={surfaceRef} style={{ opacity: 0 }} aria-hidden="true" />

          <button
            type="button"
            className="lf-memory-close"
            onClick={() => close()}
            ref={closeBtnRef}
            aria-label="Close memory"
            style={{ opacity: 0 }}
          >
            <CloseIcon size={14} />
          </button>

          <div className="lf-memory-fly" ref={flyRef}>
            {/* Click the photo to move closer to it (same image, zoomed inside the card) */}
            <motion.button
              type="button"
              ref={zoomRef}
              className={`lf-memory-zoom${aspectNumber(ch.aspectRatio) < 1 ? ' is-portrait' : ''}${zoomed ? ' is-zoomed' : ''}`}
              style={{ x: zx, y: zy, scale: zs, '--lf-aspect': aspectNumber(ch.aspectRatio) }}
              onClick={(e) => {
                e.stopPropagation();
                if (zoomedRef.current) zoomOut();
                else zoomIn();
              }}
              aria-pressed={zoomed}
              aria-label={zoomed ? 'Zoom out of the photo' : 'Zoom into the photo'}
            >
            <motion.div
              className="lf-memory-photo"
              layout
              transition={{ layout: { duration: 0.5, ease: EASE_CINE } }}
              style={{ aspectRatio: ch.aspectRatio || '4/3' }}
            >
              <motion.img
                key={ch.id}
                src={ch.photo}
                alt={ch.photoAlt}
                style={{ objectPosition: ch.objectPosition || 'center center' }}
                initial={{ opacity: 0, scale: 1 }}
                // Slow drift while reading; when zoomed, the image also moves closer inside its frame (crop-zoom)
                animate={{ opacity: 1, scale: zoomed ? 1.2 : reduceMotion ? 1 : 1.07 }}
                transition={{
                  opacity: { duration: 0.45 },
                  scale: zoomUsed
                    ? { duration: reduceMotion ? 0 : 0.9, ease: [0.65, 0, 0.35, 1] }
                    : { duration: 14, ease: 'linear' }
                }}
              />
            </motion.div>
            </motion.button>
          </div>

          <div className="lf-memory-content" ref={contentRef} style={{ opacity: 0 }}>
            <motion.div
              key={ch.id}
              className="lf-memory-text"
              initial={{ opacity: 0, x: reduceMotion ? 0 : navDir * 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: EASE_CINE }}
            >
              <p className="lf-memory-stamp">{ch.footerStamp}</p>
              <p className="lf-memory-kicker">
                {ch.sceneNum} — {ch.title}
              </p>
              <div className="lf-memory-meta">
                <span>{ch.badgeOverlay || ch.year}</span>
                {ch.routeTag && <span>{ch.routeTag}</span>}
                {ch.id === 'first-hi' && (
                  <span className="lf-memory-meta-icon">
                    <MessageHeartIcon /> Instagram direct message
                  </span>
                )}
                {ch.id === 'engaged' && (
                  <span className="lf-memory-meta-icon">
                    <WeddingRingsIcon size={14} /> The promise for a lifetime
                  </span>
                )}
              </div>

              <span className="lf-memory-rule" aria-hidden="true" />

              <h3 className="lf-memory-quote" id="lfMemoryTitle">
                &ldquo;{ch.quote}&rdquo;
              </h3>
              <p className="lf-memory-body">{ch.subtext}</p>

              {ch.id === 'engaged' && (
                <div className="lf-memory-epilogue">
                  <span className="lf-memory-rule" aria-hidden="true" />
                  <p className="lf-memory-closing">
                    <span className="lf-memory-highlight">This is the chapter where we stay.</span>{' '}
                    <span className="lf-memory-tagline">And this is only the beginning.</span>
                  </p>
                  <div className="lf-memory-finale">
                    <p className="lf-memory-names">
                      PRITHVI RAJ <span>&amp;</span> HARSHINI <span className="lf-memory-names-year">· 2027</span>
                    </p>
                    <button type="button" className="lf-continue-btn lf-continue-btn--small" onClick={() => close('events')}>
                      VIEW OUR WEDDING <ArrowIcon size={13} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="lf-memory-nav">
              <button type="button" onClick={() => setIndex(index - 1)} disabled={index === 0} aria-label="Previous memory">
                <ArrowIcon dir="left" size={13} />
              </button>
              <span className="lf-memory-count" aria-live="polite">
                {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
              </span>
              <button type="button" onClick={() => setIndex(index + 1)} disabled={index === N - 1} aria-label="Next memory">
                <ArrowIcon size={13} />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>,
    document.body
  );
}

/* --------------------------------------------------------------------------
   Section
   -------------------------------------------------------------------------- */
const DUST = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 1.5 + ((i * 7) % 4) * 0.6,
  delay: `${-((i * 1.7) % 9)}s`,
  duration: `${9 + ((i * 3) % 7)}s`
}));

export default function Story() {
  const reduceMotion = useReducedMotion();
  const wide = useMediaQuery('(min-width: 768px)');
  const use3D = wide && !reduceMotion;

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const stripRef = useRef(null);
  const inView = useInView(viewportRef, { once: true, amount: 0.35 });

  // Reel position in "frames" (0 = first chapter centred). target -> spring -> pos
  const target = useMotionValue(0);
  const pos = useSpring(target, { stiffness: 70, damping: 20, mass: 0.9 });
  const userControlledRef = useRef(false);
  const [centered, setCentered] = useState(0);
  const centeredRef = useRef(0);

  const [memoryIndex, setMemoryIndex] = useState(null);
  const memoryOpenRef = useRef(false);
  memoryOpenRef.current = memoryIndex !== null;

  // Geometry of the curved reel, from the available width
  const [geo, setGeo] = useState({ frameW: 236, radius: 800, step: 236 / 800 });
  useEffect(() => {
    if (!use3D || !viewportRef.current) return undefined;
    const el = viewportRef.current;
    const update = () => {
      const frameW = Math.round(clamp(el.clientWidth * 0.23, 190, 248));
      const radius = frameW * 3.4;
      setGeo({ frameW, radius, step: frameW / radius });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [use3D]);

  // Page scroll moves the film through the memories until the guest takes the controls
  const { scrollYProgress } = useScroll({ target: viewportRef, offset: ['start 0.32', 'end 0.02'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!use3D || userControlledRef.current || memoryOpenRef.current) return;
    target.set(clamp(v, 0, 1) * (N - 1));
  });

  useMotionValueEvent(pos, 'change', (v) => {
    const c = clamp(Math.round(v), 0, N - 1);
    if (c !== centeredRef.current) {
      centeredRef.current = c;
      setCentered(c);
    }
  });

  // Light leaks drift gently with the film (parallax)
  const leakX = useTransform(pos, (v) => -v * 26);

  const goTo = useCallback(
    (i) => {
      userControlledRef.current = true;
      target.set(clamp(i, 0, N - 1));
    },
    [target]
  );

  // Drag the film (desktop)
  const dragRef = useRef(null);
  const lastDragEndRef = useRef(0);
  const onPointerDown = (e) => {
    if (!use3D || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dragRef.current = { x: e.clientX, start: target.get(), moved: false, id: e.pointerId };
  };
  const onPointerMove = (e) => {
    const dr = dragRef.current;
    if (!dr) return;
    const dx = e.clientX - dr.x;
    if (!dr.moved && Math.abs(dx) > 6) {
      dr.moved = true;
      userControlledRef.current = true;
      try {
        e.currentTarget.setPointerCapture(dr.id);
      } catch {
        /* ignore */
      }
    }
    if (dr.moved) target.set(clamp(dr.start - (dx / geo.frameW) * 1.1, -0.35, N - 0.65));
  };
  const onPointerUp = () => {
    const dr = dragRef.current;
    dragRef.current = null;
    if (dr?.moved) {
      lastDragEndRef.current = Date.now();
      target.set(clamp(Math.round(target.get()), 0, N - 1));
    }
  };

  // Horizontal wheel / trackpad swipe moves the film; vertical scrolling is left to the page
  useEffect(() => {
    if (!use3D) return undefined;
    const el = viewportRef.current;
    let snapTimer;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      userControlledRef.current = true;
      target.set(clamp(target.get() + e.deltaX / geo.frameW, -0.35, N - 0.65));
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => target.set(clamp(Math.round(target.get()), 0, N - 1)), 160);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(snapTimer);
    };
  }, [use3D, geo.frameW, target]);

  const onViewportKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(Math.round(target.get()) + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(Math.round(target.get()) - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault();
      setMemoryIndex(centeredRef.current);
    }
  };

  const openMemory = (i) => {
    if (Date.now() - lastDragEndRef.current < 120) return; // the end of a drag is not a click
    if (use3D) goTo(i);
    setMemoryIndex(i);
  };

  // Where the memory flies from / returns to: that chapter's photo window on the reel or strip
  // part: 'window' = the photo inside the frame, 'cell' = the whole film frame
  const getOriginRect = useCallback((i, part = 'window') => {
    const el = document.querySelector(`[data-story-index="${i}"] .${part === 'cell' ? 'lf-cell' : 'lf-window'}`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight ? r : null;
  }, []);

  // Moving between memories keeps the reel / strip in step, so closing returns to the right frame
  const changeMemory = useCallback(
    (i) => {
      const next = clamp(i, 0, N - 1);
      setMemoryIndex(next);
      if (use3D) {
        userControlledRef.current = true;
        target.set(next);
        // the reel glides to the selected frame behind the translucent card
      } else {
        const strip = stripRef.current;
        const item = strip?.querySelector(`[data-story-index="${next}"]`);
        if (strip && item) {
          const sr = strip.getBoundingClientRect();
          const ir = item.getBoundingClientRect();
          const left = strip.scrollLeft + (ir.left - sr.left) - (strip.clientWidth - ir.width) / 2;
          strip.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }
    },
    [use3D, target, reduceMotion]
  );

  const memoryIndexRef = useRef(null);
  memoryIndexRef.current = memoryIndex;
  const onMemoryClosed = useCallback((after) => {
    const i = memoryIndexRef.current;
    setMemoryIndex(null);
    requestAnimationFrame(() => {
      if (after === 'events') scrollToEvents();
      else document.querySelector(`[data-story-index="${i}"]`)?.focus({ preventScroll: true });
    });
  }, []);

  // Lock page scroll while a memory is open
  useEffect(() => {
    if (memoryIndex === null) return undefined;
    const body = document.body.style.overflow;
    const html = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = body;
      document.documentElement.style.overflow = html;
    };
  }, [memoryIndex !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const centeredCh = CHAPTERS[centered];

  return (
    <AnimatedSection className="section-block story-film-section" id="story">
      <div className="lf-section" ref={sectionRef}>
        {/* Title card */}
        <header className="lf-header">
          <p className="lf-eyebrow">PRITHVI <span aria-hidden="true">✦</span> HARSHINI</p>
          <h2 className="lf-title">Our Story</h2>
          <p className="lf-subtitle">A journey of two hearts</p>
          <motion.p
            className="lf-opening-line"
            initial={{ opacity: 0, y: 6, letterSpacing: '0.14em' }}
            animate={inView ? { opacity: 1, y: 0, letterSpacing: '0.04em' } : undefined}
            transition={{ delay: reduceMotion ? 0 : 1.1, duration: 1.4, ease: EASE_CINE }}
          >
            Every love story has a beginning…
          </motion.p>
        </header>

        {use3D ? (
          /* ---------------- Desktop: curved 3D film reel ---------------- */
          <div
            className={`lf-viewport${inView ? ' is-live' : ''}`}
            ref={viewportRef}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="Our story film reel. Use the left and right arrow keys to move through the memories."
            onKeyDown={onViewportKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ '--lf-frame-w': `${geo.frameW}px` }}
          >
            <motion.div className="lf-leaks" style={{ x: leakX }} aria-hidden="true">
              <span className="lf-leak lf-leak--a" />
              <span className="lf-leak lf-leak--b" />
            </motion.div>

            <div className="lf-dust" aria-hidden="true">
              {DUST.map((p, i) => (
                <span
                  key={i}
                  style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }}
                />
              ))}
            </div>

            <motion.div
              className="lf-camera"
              animate={inView ? { rotateX: [7, 5, 7], rotateY: [-1.6, 1.6, -1.6] } : { rotateX: 7 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="lf-reel"
                initial={{ z: -760, rotateY: -22, opacity: 0 }}
                animate={inView ? { z: 0, rotateY: 0, opacity: 1 } : undefined}
                transition={{ duration: 1.7, ease: EASE_CINE }}
              >
                {CHAPTERS.map((ch, i) => (
                  <ReelFrame
                    key={ch.id}
                    ch={ch}
                    index={i}
                    pos={pos}
                    geo={geo}
                    isCentered={i === centered}
                    onOpen={openMemory}
                    onFocusFrame={goTo}
                  />
                ))}
              </motion.div>
            </motion.div>

            <span className="lf-grain" aria-hidden="true" />
          </div>
        ) : (
          /* ---------------- Phones / reduced motion: 2D filmstrip ---------------- */
          <div className="lf-strip-wrap" ref={viewportRef}>
            <div className="lf-strip" ref={stripRef} role="list" aria-label="Our story film strip">
              {CHAPTERS.map((ch, i) => (
                <div className="lf-strip-item" role="listitem" key={ch.id}>
                  <button
                    type="button"
                    className="lf-frame-btn"
                    data-story-index={i}
                    onClick={() => openMemory(i)}
                    aria-label={`${ch.badge}: ${toTitleCase(ch.title)}, ${ch.year}. Open memory`}
                  >
                    <FilmCell ch={ch} />
                  </button>
                  <FrameCaption ch={ch} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls + live chapter title */}
        <div className="lf-controls">
          {use3D && (
            <button
              type="button"
              className="lf-arrow"
              onClick={() => goTo(centered - 1)}
              disabled={centered === 0}
              aria-label="Previous memory"
            >
              <ArrowIcon dir="left" />
            </button>
          )}
          <p className="lf-now" aria-live="polite">
            {use3D ? (
              <>
                <span className="lf-now-num">{centeredCh.sceneNum}</span>
                <span className="lf-now-title">{toTitleCase(centeredCh.title)}</span>
                <span className="lf-now-year">{centeredCh.year}</span>
              </>
            ) : (
              <span className="lf-now-hint">Swipe the film · tap a memory</span>
            )}
          </p>
          {use3D && (
            <button
              type="button"
              className="lf-arrow"
              onClick={() => goTo(centered + 1)}
              disabled={centered === N - 1}
              aria-label="Next memory"
            >
              <ArrowIcon />
            </button>
          )}
        </div>
        {use3D && <p className="lf-hint">Scroll, drag the film or click a memory</p>}

        <div className="lf-continue">
          <button type="button" className="lf-continue-btn" onClick={scrollToEvents}>
            CONTINUE OUR STORY <ArrowIcon />
          </button>
        </div>
      </div>

      {memoryIndex !== null && (
        <MemoryView
          index={memoryIndex}
          setIndex={changeMemory}
          getOriginRect={getOriginRect}
          onClosed={onMemoryClosed}
          reduceMotion={!!reduceMotion}
        />
      )}
    </AnimatedSection>
  );
}
