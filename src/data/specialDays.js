/**
 * The three wedding celebrations: the single source for the calendar, the event
 * panel and the date buttons. Everything shown (highlighted cells, weekday, month
 * names, labels, directions links) is worked out from these entries.
 *
 * `date` is YYYY-MM-DD. `art` picks the illustration: 'pavilion' | 'mandap' | 'lamps'.
 */
const directionsTo = (place) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export const SPECIAL_DAYS = [
  {
    id: 'pre-wedding-reception',
    date: '2027-01-27',
    title: 'Pre-Wedding Reception',
    time: '6:30 PM onwards',
    venue: 'Shri Umadri Mahal',
    locality: 'Chennai',
    description: 'An evening of celebrations, music, dance, and joyful moments with family and friends.',
    directionsUrl: directionsTo('Shri Umadri Mahal, Chennai'),
    art: 'pavilion'
  },
  {
    id: 'wedding-ceremony',
    date: '2027-01-28',
    title: 'Wedding Ceremony',
    time: '9:00 AM – 10:30 AM',
    venue: 'Shri Umadri Mahal',
    locality: 'Chennai',
    description: 'The wedding ceremony, followed by a traditional South Indian feast.',
    directionsUrl: directionsTo('Shri Umadri Mahal, Chennai'),
    art: 'mandap'
  },
  {
    id: 'post-wedding-reception',
    date: '2027-02-07',
    title: 'Post-Wedding Reception',
    time: '6:00 PM onwards',
    venue: 'Anand Grand Palace',
    locality: 'Hosur, Tamil Nadu',
    description: 'An evening of celebration and togetherness with family and friends.',
    directionsUrl: directionsTo('Anand Grand Palace, Hosur, Tamil Nadu'),
    art: 'lamps'
  }
];
