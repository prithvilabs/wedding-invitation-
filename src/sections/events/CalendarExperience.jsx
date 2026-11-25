import React, { useEffect, useId, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useMotionValue, usePresence, useSpring, useTransform } from 'framer-motion';
import { buildMonth, monthsOf, readDate, WEEKDAYS } from './calendarDates';
import hibiscus from '../../assets/events/hibiscus-spray.webp';
import blossom from '../../assets/events/blossom-sprig.webp';

const FLIP_EASE = [0.45, 0.05, 0.25, 1];
const SHEETS = 6;

/** One of the special dates: a real button, lifted and lit when selected */
function HighlightedDate({ event, selected, onSelect }) {
  const date = readDate(event.date);
  return (
    <button
      type="button"
      className={`cal-date${selected ? ' is-selected' : ''}`}
      data-event-id={event.id}
      aria-pressed={selected}
      aria-label={`${date.fullLabel}: ${event.title}, ${event.time}`}
      onClick={() => onSelect(event.id)}
    >
      <span className="cal-date-disc">{date.dayLabel}</span>
      {selected && <span className="cal-date-sweep" aria-hidden="true" />}
      <span className="cal-date-chip" aria-hidden="true">
        {event.title}
      </span>
    </button>
  );
}

function CalendarDay({ day, event, selectedId, onSelect }) {
  if (!day) return <td className="cal-cell" />;
  if (!event) return <td className="cal-cell">{day}</td>;
  return (
    <td className="cal-cell cal-cell--event">
      <HighlightedDate event={event} selected={event.id === selectedId} onSelect={onSelect} />
    </td>
  );
}

function CalendarMonth({ monthKey, events, selectedId, onSelect }) {
  const month = useMemo(() => buildMonth(monthKey), [monthKey]);
  const eventOn = useMemo(() => {
    const map = new Map();
    events.forEach((event) => {
      const date = readDate(event.date);
      if (date.monthKey === monthKey) map.set(date.day, event);
    });
    return map;
  }, [events, monthKey]);

  return (
    <table className="cal-month">
      <caption className="cal-month-name">
        <span>
          {month.name} {month.year}
        </span>
      </caption>
      <thead>
        <tr>
          {WEEKDAYS.map((d) => (
            <th key={d} scope="col" abbr={d}>
              {d.slice(0, 3)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {month.weeks.map((week, w) => (
          <tr key={w}>
            {week.map((day, i) => (
              <CalendarDay key={i} day={day} event={eventOn.get(day)} selectedId={selectedId} onSelect={onSelect} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The paper page. When the month changes, the old page lifts away over the rings. */
function CalendarBody({ months, still, children }) {
  const [isPresent, safeToRemove] = usePresence();
  useEffect(() => {
    if (!isPresent && still) safeToRemove();
  }, [isPresent, still, safeToRemove]);
  const turning = !isPresent && !still;

  return (
    <motion.div
      className="cal-page"
      data-months={months}
      inert={!isPresent}
      initial={false}
      animate={turning ? { rotateX: 96, opacity: 0 } : { rotateX: 0, opacity: 1 }}
      transition={{
        rotateX: { duration: 0.75, ease: FLIP_EASE },
        opacity: { duration: 0.2, delay: turning ? 0.55 : 0 }
      }}
      style={{ zIndex: isPresent ? 1 : 2 }}
      onAnimationComplete={() => {
        if (!isPresent) safeToRemove();
      }}
    >
      {children}
    </motion.div>
  );
}

/** Champagne-gold binding rings along the top edge */
function CalendarBinding({ count }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="cal-binding" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className="cal-ring" viewBox="0 0 30 52">
          <defs>
            <linearGradient id={`${id}ring${i}`} x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="#8d5d1c" />
              <stop offset="28%" stopColor="#fbeec2" />
              <stop offset="52%" stopColor="#d4a24c" />
              <stop offset="78%" stopColor="#f3d896" />
              <stop offset="100%" stopColor="#8a5a1a" />
            </linearGradient>
          </defs>
          <ellipse cx="14" cy="43" rx="6" ry="4.4" fill="#6b3a24" opacity="0.75" />
          <path
            d="M11 42C1 26 4 5 15 4C26 3 28 18 25 27"
            fill="none"
            stroke="rgba(70,30,15,.28)"
            strokeWidth="5.4"
            strokeLinecap="round"
            transform="translate(1.6 1.6)"
          />
          <path
            d="M11 42C1 26 4 5 15 4C26 3 28 18 25 27"
            fill="none"
            stroke={`url(#${id}ring${i})`}
            strokeWidth="4.8"
            strokeLinecap="round"
          />
          <path
            d="M9.6 37C3.6 24 6.4 8 15 6.4"
            fill="none"
            stroke="#fffbe6"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.85"
          />
        </svg>
      ))}
    </div>
  );
}

/** The marble-and-brass stand the calendar rests on */
function Pedestal() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const u = (name) => `url(#${id}${name})`;
  return (
    <svg className="cal-pedestal" viewBox="0 0 720 130" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c98478" />
          <stop offset="45%" stopColor="#f0c8b2" />
          <stop offset="100%" stopColor="#a65a56" />
        </linearGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7e4f17" />
          <stop offset="18%" stopColor="#dcb563" />
          <stop offset="46%" stopColor="#fbe9b4" />
          <stop offset="72%" stopColor="#cf9c48" />
          <stop offset="100%" stopColor="#74470f" />
        </linearGradient>
        <radialGradient id={`${id}shade`}>
          <stop offset="0%" stopColor="rgba(60,15,15,.5)" />
          <stop offset="100%" stopColor="rgba(60,15,15,0)" />
        </radialGradient>
        <pattern id={`${id}engraving`} width="26" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M2 10C6 2 12 2 13 10C14 18 20 18 24 10M13 10C9 12 8 15 10 17M13 10C17 8 18 5 16 3"
            fill="none"
            stroke="#7a4c14"
            strokeWidth="1.1"
            opacity="0.6"
          />
        </pattern>
      </defs>
      <ellipse cx="360" cy="100" rx="356" ry="30" fill={u('shade')} />
      <path d="M20 46A340 42 0 0 0 700 46V70A340 42 0 0 1 20 70Z" fill={u('rim')} />
      <path d="M20 50A340 42 0 0 0 700 50V67A340 42 0 0 1 20 67Z" fill={u('engraving')} />
      <path d="M20 67A340 42 0 0 0 700 67" fill="none" stroke="#fbe9b4" strokeWidth="1.4" opacity="0.7" />
      <ellipse cx="360" cy="46" rx="340" ry="42" fill={u('top')} stroke={u('rim')} strokeWidth="4" />
      <ellipse cx="330" cy="40" rx="250" ry="24" fill="#fff3e2" opacity="0.18" />
    </svg>
  );
}

/**
 * The 3D desk calendar. `layout` is 'spread' (both months on the page) or 'single'
 * (one month at a time, for phones). `still` switches every movement off.
 */
export default function CalendarExperience({ events, selectedId, onSelect, layout, still }) {
  const spread = layout === 'spread';
  const months = useMemo(() => monthsOf(events), [events]);
  const currentMonth = readDate(events.find((e) => e.id === selectedId).date).monthKey;
  const shown = spread ? months : [currentMonth];

  // Turning the page replaces the button that was pressed; keep keyboard focus on the chosen date
  const rootRef = useRef(null);
  const keepFocus = useRef(false);
  const select = (id) => {
    keepFocus.current = true;
    onSelect(id);
  };
  useEffect(() => {
    if (!keepFocus.current) return;
    keepFocus.current = false;
    const page = [...rootRef.current.querySelectorAll('.cal-page')].find((p) => !p.inert);
    const target = page?.querySelector(`[data-event-id="${selectedId}"]`);
    if (target && document.activeElement !== target) target.focus({ preventScroll: true });
  }, [selectedId]);

  // A few degrees of movement with the mouse, so the object has depth (never on touch)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const easedX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const easedY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const baseX = spread ? 7 : 8;
  const baseY = spread ? 14 : 6;
  const rotateY = useTransform(easedX, (v) => baseY + v * 5);
  const rotateX = useTransform(easedY, (v) => baseX - v * 3);
  const onPointerMove = (e) => {
    if (still || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - r.left) / r.width - 0.5);
    pointerY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      className={`cal-stage cal-stage--${layout}`}
      ref={rootRef}
      role="group"
      aria-label="Wedding calendar"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Pedestal />
      <motion.div
        className="cal-entrance"
        initial={still ? false : { rotateY: 20, rotateX: -5, y: 18 }}
        whileInView={{ rotateY: 0, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div key={layout} className="cal-object" style={{ rotateX, rotateY }}>
          <div className="cal-leg" aria-hidden="true" />
          <div className="cal-cover" aria-hidden="true" />
          {/* the block of pages: thin sheets fanned out behind the top one */}
          {Array.from({ length: SHEETS }, (_, i) => (
            <div key={i} className="cal-sheet" style={{ '--i': SHEETS - i }} aria-hidden="true" />
          ))}
          <div className="cal-pages">
            <AnimatePresence initial={false}>
              <CalendarBody key={currentMonth} months={shown.length} still={still}>
                {shown.map((m) => (
                  <CalendarMonth key={m} monthKey={m} events={events} selectedId={selectedId} onSelect={select} />
                ))}
              </CalendarBody>
            </AnimatePresence>
          </div>
          <CalendarBinding count={spread ? 6 : 4} />
          <img className="cal-flower cal-flower--top" src={hibiscus} alt="" width="420" height="496" loading="lazy" />
          <img className="cal-flower cal-flower--sprig" src={blossom} alt="" loading="lazy" />
        </motion.div>
      </motion.div>
      <img className="cal-flower cal-flower--foot" src={hibiscus} alt="" width="420" height="496" loading="lazy" />

      {/* A thread of light that passes once around the calendar when a date is chosen */}
      {!still && (
        <svg key={selectedId} className="cal-orbit" viewBox="0 0 640 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M12 70C40 150 250 176 420 150C560 130 640 90 626 58" pathLength="1" />
        </svg>
      )}
      {!still && (
        <div className="cal-motes" aria-hidden="true">
          {Array.from({ length: spread ? 9 : 4 }, (_, i) => (
            <span key={i} className={`cal-mote cal-mote--${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
