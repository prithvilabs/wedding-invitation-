import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarPlus, ChevronDown, Download, ExternalLink } from 'lucide-react';
import { googleCalendarUrl, icsPath } from './calendarLinks';

/** "Save to Calendar" with a small choice of calendars */
export default function SaveToCalendar({ event }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onBlur = (e) => {
    if (e.relatedTarget && !rootRef.current.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div className="evt-save" ref={rootRef} onBlur={onBlur}>
      <button
        type="button"
        ref={buttonRef}
        className="evt-btn evt-save-btn"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Save ${event.title} to your calendar`}
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarPlus size={16} strokeWidth={1.6} aria-hidden="true" />
        <span>Save to Calendar</span>
        <ChevronDown size={15} strokeWidth={1.8} className="evt-save-chevron" aria-hidden="true" />
      </button>
      <ul className={`evt-save-menu${open ? ' is-open' : ''}`} id={menuId} hidden={!open}>
        <li>
          <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <span>
              Google Calendar
              <small>Opens with the details filled in</small>
            </span>
            <ExternalLink size={15} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </li>
        <li>
          {/* no "download" attribute: iPhones then show their own Add to Calendar screen */}
          <a
            href={`${import.meta.env.BASE_URL}${icsPath(event)}`}
            type="text/calendar"
            onClick={() => setOpen(false)}
          >
            <span>
              Apple / Outlook
              <small>Calendar file (.ics)</small>
            </span>
            <Download size={15} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  );
}
