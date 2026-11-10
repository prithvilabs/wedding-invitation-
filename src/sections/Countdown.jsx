import React, { useState, useEffect } from 'react';
import AnimatedSection from '../animations/AnimatedSection';
import CountdownPlaque from '../components/invitation/CountdownPlaque';

/**
 * Gold Motif Divider under heading matching the reference design:
 * Long tapered gold lines, flanking dots and diamonds, central 4-diamond rhombus cluster.
 */
function CountdownHeaderDivider() {
  return (
    <div className="countdown-header-divider" aria-hidden="true">
      <svg
        viewBox="0 0 440 18"
        className="countdown-header-divider-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cntHeadGoldL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C59648" stopOpacity="0" />
            <stop offset="60%" stopColor="#C59648" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#B3802E" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cntHeadGoldR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B3802E" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#C59648" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C59648" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left tapered hairline */}
        <line x1="8" y1="9" x2="195" y2="9" stroke="url(#cntHeadGoldL)" strokeWidth="1.25" strokeLinecap="round" />
        <circle cx="200" cy="9" r="1.3" fill="#B3802E" />
        <polygon points="205,9 207.5,6.5 210,9 207.5,11.5" fill="#B3802E" />

        {/* Central 4-diamond rhombus cluster */}
        <polygon points="220,2.5 223,5.5 220,8.5 217,5.5" fill="#B3802E" />
        <polygon points="220,9.5 223,12.5 220,15.5 217,12.5" fill="#B3802E" />
        <polygon points="211.5,9 214.5,6 217.5,9 214.5,12" fill="#C59648" />
        <polygon points="222.5,9 225.5,6 228.5,9 225.5,12" fill="#C59648" />
        <polygon points="220,7.5 221.2,9 220,10.5 218.8,9" fill="#F4D685" />

        {/* Right small diamond & dot */}
        <polygon points="230,9 232.5,6.5 235,9 232.5,11.5" fill="#B3802E" />
        <circle cx="240" cy="9" r="1.3" fill="#B3802E" />
        {/* Right tapered hairline */}
        <line x1="245" y1="9" x2="432" y2="9" stroke="url(#cntHeadGoldR)" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    // 28th January 2027 09:00:00 IST (UTC+5:30)
    const targetDate = new Date('2027-01-28T09:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Prithvi Raj & Harshini Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:prithvi-harshini-wedding-20270128@invitation',
      'DTSTAMP:20260914T000000Z',
      'DTSTART:20270128T033000Z',
      'DTEND:20270128T050000Z',
      'SUMMARY:Prithvi Raj & Harshini — Subha Muhurtham Wedding',
      'DESCRIPTION:South Indian Tamil Hindu Wedding of Prithvi Raj & Harshini.\\nSubha Muhurtham: 9:00 AM - 10:30 AM\\nShri Umadri Mahal, Chennai.',
      'LOCATION:Shri Umadri Mahal, Chennai',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Prithvi_Harshini_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatedSection className="section-block muhurtham-floating-section" id="countdown">
      <div className="muhurtham-floating-container text-center">
        {/* Editorial Heading Stack with Reference Gold Flourish Divider */}
        <div className="muhurtham-heading-stack">
          <h2 className="muhurtham-display-title">COUNTING DOWN TO FOREVER</h2>
          <CountdownHeaderDivider />
        </div>

        {/* Subtle Frosted-Glass Countdown Cards matching reference image */}
        <div className="muhurtham-countdown-grid" role="timer" aria-label="Live countdown to wedding Muhurtham">
          <CountdownPlaque digits={timeLeft.days} label="DAYS" />
          <CountdownPlaque digits={timeLeft.hours} label="HOURS" />
          <CountdownPlaque digits={timeLeft.minutes} label="MINUTES" />
          <CountdownPlaque digits={timeLeft.seconds} label="SECONDS" />
        </div>

        {/* Save to Calendar Button matching reference image */}
        <div className="muhurtham-calendar-action-row">
          <button
            type="button"
            className="muhurtham-calendar-btn"
            id="addToCalendarBtn"
            onClick={handleDownloadCalendar}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="muhurtham-btn-icon-svg"
            >
              <rect x="3" y="4.5" width="14" height="12.5" rx="2.5" />
              <line x1="3" y1="8.5" x2="17" y2="8.5" />
              <line x1="7" y1="2.5" x2="7" y2="4.5" />
              <line x1="13" y1="2.5" x2="13" y2="4.5" />
            </svg>
            <span>Save to Calendar</span>
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}
