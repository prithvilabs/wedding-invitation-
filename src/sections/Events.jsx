import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';
import CalendarExperience from './events/CalendarExperience';
import EventDetailPanel from './events/EventDetailPanel';
import EventDateNavigation from './events/EventDateNavigation';
import { SPECIAL_DAYS } from '../data/specialDays';
import './events/events.css';

/**
 * South Indian Gold Lotus Ornament
 */
function LotusOrnament({ width = 36, height = 22, className = '', id = 'default' }) {
  const gradId = `scheduleLotusGrad_${id}`;
  return (
    <svg
      className={`lotus-motif-icon ${className}`}
      width={width}
      height={height}
      viewBox="0 0 36 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB35A" />
          <stop offset="50%" stopColor="#C8A265" />
          <stop offset="100%" stopColor="#A47524" />
        </linearGradient>
      </defs>
      <path
        d="M 18 2 C 15.6 6.8, 15.6 13, 18 18.2 C 20.4 13, 20.4 6.8, 18 2 Z"
        stroke={`url(#${gradId})`}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 18 18.2 C 14.5 16, 11 11.2, 11.8 6.5 C 14.2 9, 16.6 12, 18 14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 18 18.2 C 21.5 16, 25 11.2, 24.2 6.5 C 21.8 9, 19.4 12, 18 14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 16 18.2 C 12 17.2, 6.2 14.8, 5.5 10.8 C 8.6 12.2, 12.2 14.8, 14.8 16.8"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 20 18.2 C 24 17.2, 29.8 14.8, 30.5 10.8 C 27.4 12.2, 23.8 14.8, 21.2 16.8"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 12 19.2 C 15 21.2, 21 21.2, 24 19.2"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="18" cy="18.2" r="0.9" fill="#C8A265" />
    </svg>
  );
}

function EventsHeading() {
  return (
    <header className="evt-heading">
      <p className="evt-heading-eyebrow">
        <span>The Wedding</span>
        <LotusOrnament width={34} height={21} id="eventsTop" />
        <span>Celebration</span>
      </p>
      <h2 className="evt-heading-title">Our Special Days</h2>
      <span className="evt-heading-flourish" aria-hidden="true">
        <svg viewBox="0 0 120 14" width="120" height="14" fill="none" stroke="currentColor" strokeLinecap="round">
          <path d="M2 7H34M86 7H118" strokeWidth="1" />
          <path d="M36 7C44 0 52 0 60 7C68 14 76 14 84 7C76 0 68 0 60 7C52 14 44 14 36 7Z" strokeWidth="1.1" />
        </svg>
      </span>
      <p className="evt-heading-lead">Three occasions. One beautiful journey.</p>
    </header>
  );
}

/** Phones get one month at a time; anything wider shows both months on the page */
function useIsPhone() {
  const query = '(max-width: 639px)';
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setPhone(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return phone;
}

export default function Events() {
  // The one selection everything follows: calendar, panel and date buttons
  const [selectedId, setSelectedId] = useState(SPECIAL_DAYS[0].id);
  const selectedEvent = SPECIAL_DAYS.find((e) => e.id === selectedId);
  const still = Boolean(useReducedMotion());
  const phone = useIsPhone();

  return (
    <AnimatedSection className="section-block events-section evt-section" id="events">
      <div className="evt-container">
        <EventsHeading />

        <div className="evt-layout">
          <CalendarExperience
            events={SPECIAL_DAYS}
            selectedId={selectedId}
            onSelect={setSelectedId}
            layout={phone ? 'single' : 'spread'}
            still={still}
          />
          <EventDetailPanel events={SPECIAL_DAYS} event={selectedEvent} still={still} />
          <EventDateNavigation events={SPECIAL_DAYS} selectedId={selectedId} onSelect={setSelectedId} still={still} />
        </div>

        {/* Closing tagline (as before) */}
        <div className="schedule-bottom-cluster text-center">
          <div className="schedule-tagline-row">
            <span className="tagline-flourish-symbol" aria-hidden="true">❖</span>
            <p className="schedule-script-tagline">
              Together forever in love and destiny
            </p>
            <span className="tagline-flourish-symbol" aria-hidden="true">❖</span>
          </div>

          <div className="schedule-bottom-lotus-row" aria-hidden="true">
            <span className="schedule-bottom-line" />
            <LotusOrnament width={30} height={18} id="scheduleBottom" />
            <span className="schedule-bottom-line" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
