import React, { useState, useEffect } from 'react';
import { CalendarPlus } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: '000',
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
        setTimeLeft({ days: '000', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(3, '0'),
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
        {/* Editorial Heading Stack for Countdown Floating Over Background */}
        <div className="muhurtham-heading-stack">
          <h2 className="muhurtham-display-title">COUNTING DOWN TO FOREVER</h2>
          
          <div className="muhurtham-divider-flourish" aria-hidden="true">
            <span className="muhurtham-flourish-line" />
            <span className="muhurtham-flourish-node">❈ ❖ ❈</span>
            <span className="muhurtham-flourish-line" />
          </div>
          
          <p className="muhurtham-instruction-text">
            Thursday, 28th January 2027 · 9:00 AM – 10:30 AM · Shri Umadri Mahal, Chennai
          </p>
        </div>

        {/* High-Contrast Luxury Timer Pods */}
        <div className="muhurtham-countdown-grid" role="timer" aria-label="Live countdown to wedding Muhurtham">
          <div className="muhurtham-time-pod">
            <span className="muhurtham-pod-digits">{timeLeft.days}</span>
            <span className="muhurtham-pod-label">DAYS</span>
          </div>
          <div className="muhurtham-pod-colon">:</div>
          <div className="muhurtham-time-pod">
            <span className="muhurtham-pod-digits">{timeLeft.hours}</span>
            <span className="muhurtham-pod-label">HOURS</span>
          </div>
          <div className="muhurtham-pod-colon">:</div>
          <div className="muhurtham-time-pod">
            <span className="muhurtham-pod-digits">{timeLeft.minutes}</span>
            <span className="muhurtham-pod-label">MINUTES</span>
          </div>
          <div className="muhurtham-pod-colon">:</div>
          <div className="muhurtham-time-pod">
            <span className="muhurtham-pod-digits">{timeLeft.seconds}</span>
            <span className="muhurtham-pod-label">SECONDS</span>
          </div>
        </div>

        {/* Calendar Action */}
        <div className="muhurtham-calendar-action-row">
          <button
            type="button"
            className="muhurtham-calendar-btn"
            id="addToCalendarBtn"
            onClick={handleDownloadCalendar}
          >
            <CalendarPlus size={16} strokeWidth={1.75} className="muhurtham-btn-icon-svg" />
            <span>Save to Calendar (.ics)</span>
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}
