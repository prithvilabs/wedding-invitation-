/* Calendar maths. Dates are handled as plain year/month/day (never through a time
   zone), so every guest sees the same days wherever they are. */
export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const pad2 = (n) => String(n).padStart(2, '0');

/** '2027-01-27' -> everything the UI needs to print that date */
export function readDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const monthName = MONTHS[month - 1];
  return {
    year,
    month,
    day,
    weekday,
    monthName,
    monthKey: iso.slice(0, 7),
    dayLabel: pad2(day),
    shortLabel: `${pad2(day)} ${monthName.slice(0, 3)}`,
    fullLabel: `${weekday}, ${day} ${monthName} ${year}`
  };
}

/** One month as rows of seven cells (Sunday first); empty cells are null */
export function buildMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length }, (_, i) => i + 1)
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  // every month keeps six rows, so the page never changes size
  while (weeks.length < 6) weeks.push(Array(7).fill(null));
  return { monthKey, year, month, name: MONTHS[month - 1], weeks };
}

/** The months that hold at least one event, in order */
export const monthsOf = (events) => [...new Set(events.map((e) => e.date.slice(0, 7)))].sort();
