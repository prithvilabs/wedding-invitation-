import React, { useId } from 'react';
import { Clock3, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import hibiscus from '../../assets/events/hibiscus-spray.webp';
import { readDate } from '../events/calendarDates';

const cleanId = (id) => id.replace(/[^a-zA-Z0-9]/g, '');

/** The ivory paper and its shadow (a still picture: nothing here is redrawn while scratching) */
export function PlaquePaper({ shape }) {
  const id = cleanId(useId());
  return (
    <svg className="sc-layer" viewBox={`0 0 ${shape.w} ${shape.h}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}paper`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffaf3" />
          <stop offset="55%" stopColor="#fcefe2" />
          <stop offset="100%" stopColor="#f8e2cd" />
        </linearGradient>
        <radialGradient id={`${id}light`} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#fffdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={shape.path} fill="#5d2420" opacity="0.1" transform="translate(0 9)" />
      <path d={shape.path} fill="#5d2420" opacity="0.14" transform="translate(0 4)" />
      <path d={shape.path} fill={`url(#${id}paper)`} />
      <path d={shape.path} fill={`url(#${id}light)`} />
    </svg>
  );
}

/** Layer 3: the border and flowers, always on top and never scratched away */
export function PlaqueFrame({ shape }) {
  const id = cleanId(useId());
  const { w, h } = shape;
  // an inset copy of the outline: the same path, scaled towards the middle
  const inset = (by) => {
    const sx = (w - by * 2) / w;
    const sy = (h - by * 2) / h;
    return `translate(${by} ${by}) scale(${sx} ${sy})`;
  };
  return (
    <svg className="sc-layer sc-frame" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6dfa8" />
          <stop offset="50%" stopColor="#c99a45" />
          <stop offset="100%" stopColor="#f3d697" />
        </linearGradient>
      </defs>
      <g fill="none">
        <path d={shape.path} stroke="#fff6e6" strokeWidth="7" transform={inset(3)} vectorEffect="non-scaling-stroke" className="sc-frame-ivory" />
        <path d={shape.path} stroke="#5d1120" strokeWidth="2.2" />
        <path d={shape.path} stroke={`url(#${id}gold)`} strokeWidth="1.5" transform={inset(7.5)} />
      </g>
      {shape.flowers.map((f, i) => (
        <image
          key={i}
          href={hibiscus}
          width={f.w}
          height={f.w * (496 / 420)}
          transform={`translate(${f.x} ${f.y})${f.flip ? ' scale(-1 1)' : ''}`}
        />
      ))}
    </svg>
  );
}

function CalendarSketch({ date }) {
  return (
    <svg className="sc-cal" viewBox="0 0 64 60" aria-hidden="true">
      <rect x="6" y="9" width="52" height="47" rx="6" fill="#fffaf2" stroke="#c99a45" strokeWidth="1.6" />
      <path d="M6 22V15a6 6 0 0 1 6-6h40a6 6 0 0 1 6 6v7Z" fill="#6a1526" />
      {[18, 32, 46].map((x) => (
        <path key={x} d={`M${x} 4v9`} stroke="#c99a45" strokeWidth="3" strokeLinecap="round" />
      ))}
      <text x="32" y="19.5" textAnchor="middle" className="sc-cal-month">
        {date.monthName.slice(0, 3).toUpperCase()}
      </text>
      <text x="32" y="46" textAnchor="middle" className="sc-cal-day">
        {date.dayLabel}
      </text>
      <path d="M22 51.5h7M35 51.5h7" stroke="#c99a45" strokeWidth="1" strokeLinecap="round" />
      <path d="M32 49.4l2.2 2.1-2.2 2.1-2.2-2.1z" fill="#c99a45" />
    </svg>
  );
}

const ordinal = (n) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;

/** Layer 1: what is hidden underneath. Everything comes from the wedding's own event data. */
export function RevealedInvitation({ event, revealed, still }) {
  const date = readDate(event.date);
  return (
    <div className="sc-content" id="scratchRevealedLayer" aria-hidden={!revealed}>
      <p className="sc-invited">
        <span aria-hidden="true">✦</span>
        You are invited
        <span aria-hidden="true">✦</span>
      </p>
      <CalendarSketch date={date} />
      <motion.h3
        className="sc-date"
        animate={revealed && !still ? { scale: [0.9, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>{date.weekday},</span>{' '}
        <span>
          {ordinal(date.day)} {date.monthName} {date.year}
        </span>
      </motion.h3>
      <p className="sc-details">
        <span>
          <Clock3 strokeWidth={1.7} aria-hidden="true" />
          {event.time}
        </span>
        <span>
          <MapPin strokeWidth={1.7} aria-hidden="true" />
          {event.venue}, {event.locality}
        </span>
      </p>
      <p className="sc-message">Come, celebrate love with us</p>
    </div>
  );
}

/** Before the first touch: a finger shows what to do, leaving a "scratched" trail behind it */
export function ScratchDemo({ shape, still }) {
  const d = `M${shape.demo.map((p) => p.join(' ')).join('L')}`;
  const [a, b, c, e] = shape.demo;
  const vars = {};
  [a, b, c, e].forEach(([x, y], i) => {
    vars[`--x${i}`] = `${x}px`;
    vars[`--y${i}`] = `${y}px`;
  });
  return (
    <svg className={`sc-layer sc-demo${still ? ' is-still' : ''}`} viewBox={`0 0 ${shape.w} ${shape.h}`} style={vars} aria-hidden="true">
      <path className="sc-demo-trail" d={d} pathLength="1" strokeWidth={shape.demoWidth} />
      <g className="sc-demo-finger">
        <circle r="15" fill="#fffaf2" opacity="0.92" />
        <circle r="15" fill="none" stroke="#8f5a22" strokeWidth="1" />
        <path
          d="M-3.2 -8.4a1.9 1.9 0 0 1 3.8 0V-1.6l.1-1.2a1.7 1.7 0 0 1 3.3.2v.7a1.6 1.6 0 0 1 3.1.5v3.3c0 4.2-2.4 6.6-6.2 6.6-2.6 0-4-1.1-5.4-3.1l-2.6-3.7c-.9-1.4.8-2.8 2-1.7l1.9 1.7Z"
          fill="#f7d9c9"
          stroke="#5d1120"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
