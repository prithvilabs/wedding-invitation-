/*
 * "Save to Calendar": a Google Calendar link and an .ics file for an event.
 * Used by the page and by vite.config.js (which writes the .ics files), so this
 * file must stay plain JavaScript: no images, CSS or import.meta.
 */
const COUPLE = 'Prithvi Raj & Harshini';
const UTC_OFFSET = '+05:30'; // both venues are in India (no daylight saving)
const pad2 = (n) => String(n).padStart(2, '0');

/** '2027-01-27' + '18:30' (India time) -> '20270127T130000Z' */
function utcStamp(date, time) {
  const d = new Date(`${date}T${time}:00${UTC_OFFSET}`);
  return (
    `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}` +
    `T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}00Z`
  );
}

function calendarEntry(event) {
  return {
    title: `${COUPLE}: ${event.title}`,
    location: `${event.venue}, ${event.locality}`,
    details: `${event.description}\n\nTime: ${event.time}\nDirections: ${event.directionsUrl}`,
    start: utcStamp(event.date, event.startsAt),
    end: utcStamp(event.date, event.endsAt || event.holdUntil)
  };
}

export function googleCalendarUrl(event) {
  const entry = calendarEntry(event);
  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: entry.title,
    dates: `${entry.start}/${entry.end}`,
    ctz: 'Asia/Kolkata',
    location: entry.location,
    details: entry.details
  });
  return `https://calendar.google.com/calendar/render?${query}`;
}

export const icsPath = (event) => `calendar/${event.id}.ics`;

const escapeText = (s) => s.replace(/([\\;,])/g, '\\$1').replace(/\n/g, '\\n');

/** Calendar files allow at most 75 bytes per line; longer ones continue after a space */
function fold(line) {
  const size = (s) => new TextEncoder().encode(s).length;
  const out = [];
  let current = '';
  for (const ch of line) {
    if (size(current + ch) > 73) {
      out.push(current);
      current = ' ';
    }
    current += ch;
  }
  out.push(current);
  return out.join('\r\n');
}

export function icsFile(event) {
  const entry = calendarEntry(event);
  return (
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//Special Days//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}-${event.date}@wedding-invitation`,
      'DTSTAMP:20260101T000000Z',
      `DTSTART:${entry.start}`,
      `DTEND:${entry.end}`,
      `SUMMARY:${escapeText(entry.title)}`,
      `LOCATION:${escapeText(entry.location)}`,
      `DESCRIPTION:${escapeText(entry.details)}`,
      `URL:${event.directionsUrl}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText(entry.title)}`,
      'TRIGGER:-P1D',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ]
      .map(fold)
      .join('\r\n') + '\r\n'
  );
}
