import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Clock3, MapPin, Navigation2 } from 'lucide-react';
import EventIllustration from './EventIllustrations';
import SaveToCalendar from './SaveToCalendar';
import { readDate } from './calendarDates';
import hibiscus from '../../assets/events/hibiscus-spray.webp';

function EventMetadata({ event }) {
  return (
    <ul className="evt-meta">
      <li>
        <Clock3 size={17} strokeWidth={1.5} aria-hidden="true" />
        <span>{event.time}</span>
      </li>
      <li>
        <MapPin size={17} strokeWidth={1.5} aria-hidden="true" />
        <span>
          {event.venue}
          <small>{event.locality}</small>
        </span>
      </li>
    </ul>
  );
}

function DirectionsButton({ event }) {
  return (
    <a
      className="evt-btn evt-directions"
      href={event.directionsUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Get directions to ${event.venue}, ${event.locality} (opens Google Maps)`}
    >
      <Navigation2 size={15} strokeWidth={1.6} className="evt-directions-icon" aria-hidden="true" />
      <span>Get Directions</span>
      <ArrowUpRight size={15} strokeWidth={1.8} className="evt-directions-arrow" aria-hidden="true" />
    </a>
  );
}

function EventBody({ event, ghost = false }) {
  const date = readDate(event.date);
  return (
    <>
      <p className="evt-date">
        <span className="evt-date-day">{date.dayLabel}</span>
        <span className="evt-date-month">{date.monthName}</span>
        <span className="evt-date-month">{date.year}</span>
        <span className="evt-date-weekday">{date.weekday}</span>
      </p>
      <h3 className="evt-title">{event.title}</h3>
      <EventMetadata event={event} />
      {ghost ? <div className="evt-art evt-art--ghost" /> : <EventIllustration art={event.art} className="evt-art" />}
      <p className="evt-description">{event.description}</p>
      <div className="evt-actions">
        <DirectionsButton event={event} />
        <SaveToCalendar event={event} />
      </div>
    </>
  );
}

/** The card beside (or under) the calendar: always the selected celebration */
export default function EventDetailPanel({ events, event, still }) {
  const move = still
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -14 } };

  return (
    <div className="evt-panel" id="event-details" role="region" aria-label="Event details" aria-live="polite">
      <img className="evt-panel-flower" src={hibiscus} alt="" width="420" height="496" loading="lazy" />
      <p className="evt-panel-eyebrow">Event Details</p>
      <div className="evt-stack">
        {events.map((e) => (
          <div key={e.id} className="evt-body evt-body--ghost" aria-hidden="true" inert>
            <EventBody event={e} ghost />
          </div>
        ))}
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={event.id}
            className="evt-body evt-body--live"
            {...move}
            transition={{ duration: still ? 0.01 : 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <EventBody event={event} />
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
