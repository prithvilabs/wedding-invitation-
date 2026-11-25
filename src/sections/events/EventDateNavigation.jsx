import React from 'react';
import { motion } from 'framer-motion';
import { readDate } from './calendarDates';

/** 27 Jan | 28 Jan | 07 Feb: the same selection as the calendar, as three buttons */
export default function EventDateNavigation({ events, selectedId, onSelect, still }) {
  return (
    <div className="evt-nav" role="group" aria-label="Choose a celebration">
      {events.map((event) => {
        const date = readDate(event.date);
        const active = event.id === selectedId;
        return (
          <button
            key={event.id}
            type="button"
            className={`evt-nav-btn${active ? ' is-active' : ''}`}
            aria-pressed={active}
            aria-controls="event-details"
            aria-label={`${date.shortLabel}: ${event.title}`}
            onClick={() => onSelect(event.id)}
          >
            {active && (
              <motion.span
                className="evt-nav-pill"
                layoutId={still ? undefined : 'evt-nav-pill'}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                aria-hidden="true"
              />
            )}
            <span className="evt-nav-label">{date.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
