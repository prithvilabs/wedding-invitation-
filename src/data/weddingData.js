/**
 * Single source of truth for all wedding-specific content.
 * Every scene reads from here instead of hardcoding names/dates/venues.
 * Unknown fields stay `null` and components must render a graceful
 * placeholder rather than inventing details.
 */

export const couple = {
  groom: 'Prithvi Raj',
  bride: 'Harshini',
  displayNames: 'PRITHVI RAJ ✦ HARSHINI'
};

export const weddingDate = {
  iso: '2027-01-28T09:00:00+05:30',
  display: '28 January 2027',
  day: 'Thursday',
  city: 'Chennai',
  state: 'Tamil Nadu'
};

export const blessing = {
  eyebrow: 'With the Divine Blessings',
  eyebrowSecondary: 'of our Ancestors & Family'
};

export const sanskritVerse = {
  text: 'Mangalyam Tantunanena Mama Jeevana Hetuna',
  essence: 'The sacred thread that binds two lives into one.'
};

/**
 * Ceremony pages for the Scene 4 storybook.
 * Fill in `venue`, `time`, `dress` as they are finalized —
 * missing values render as "To be announced".
 */
export const ceremonies = [
  {
    id: 'nichayathartham',
    number: '01',
    title: 'Nichayathartham',
    meaning: 'The formal engagement & betrothal ceremony',
    date: null,
    time: null,
    venue: null,
    dress: null
  },
  {
    id: 'reception',
    number: '02',
    title: 'Grand Reception',
    meaning: 'An evening of celebration with family & friends',
    date: null,
    time: null,
    venue: null,
    dress: null
  },
  {
    id: 'muhurtham',
    number: '03',
    title: 'Sacred Muhurtham',
    meaning: 'The auspicious wedding rites at the chosen hour',
    date: weddingDate.display,
    time: '9:00 AM IST',
    venue: null,
    dress: null
  },
  {
    id: 'sapthapadi',
    number: '04',
    title: 'Sapthapadi',
    meaning: 'Seven sacred steps, seven vows, one life together',
    date: weddingDate.display,
    time: null,
    venue: null,
    dress: null
  }
];

/**
 * Kalyana Mandapam / venue details. Only real, confirmed information
 * should ever be filled in here — never invented.
 */
export const venue = {
  name: null,
  address: null,
  city: weddingDate.city,
  state: weddingDate.state,
  googleMapsUrl: null,
  appleMapsUrl: null,
  nearestAirport: null,
  nearestRailway: null,
  parkingInfo: null,
  accommodationInfo: null,
  placeholder: 'Venue details will be updated shortly.'
};

export const rsvp = {
  dietaryOptions: [
    'Traditional South Indian Banana Leaf Feast',
    'Sattvic',
    'Vegan'
  ]
};

export const theme = {
  maroon: '#4d0a16',
  crimsonDeep: '#32060e',
  gold: '#dfb35a',
  goldRich: '#cfa049',
  softGold: '#f7e7c4',
  emerald: '#144929',
  ivory: '#fffdfa',
  parchment: '#faf4e8'
};
