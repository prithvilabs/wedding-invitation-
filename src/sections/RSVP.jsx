import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  Send,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Loader2,
  RotateCcw,
  Gift,
  HeartHandshake,
  PartyPopper
} from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import petalSoft from '../../assets/petal_2.png';
import petalDeep from '../../assets/petal_4.png';
import './rsvp.css';
import weddingLogo from '../assets/wedding-logo.png';

// Google Apps Script Web App Endpoint for RSVP Submissions
const RSVP_ENDPOINT =
  import.meta.env.VITE_RSVP_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbx5hPIj0eewQZP5Spt3qPqYarJjFTaJIeEj6HasY6tKqgDC9cbdEaK4wwjDY6sOYZ9v/exec';

const WhatsAppIcon = ({ size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * Validates and normalizes Indian and international phone numbers
 */
const validateAndNormalizePhone = (rawPhone) => {
  if (!rawPhone) return { isValid: false, normalized: '' };
  const cleaned = rawPhone.replace(/[\s\-\(\)\.]/g, '');

  // Matches 10-digit Indian mobile numbers (with optional +91, 91, or 0 prefix)
  const indianMatch = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  if (indianMatch) {
    return {
      isValid: true,
      normalized: indianMatch[1] // Clean 10-digit format (e.g., 9876543210)
    };
  }

  // Gracefully accept standard international numbers (+ followed by 8 to 15 digits)
  if (/^\+?\d{8,15}$/.test(cleaned)) {
    return {
      isValid: true,
      normalized: cleaned
    };
  }

  return { isValid: false, normalized: '' };
};

/*
 * The RSVP is asked one question at a time.
 * YES guests answer all seven; guests who can't come give their name and an optional note.
 */
const QUESTIONS = {
  attend: 'Will you be celebrating with us?',
  name: 'What should we call you?',
  phone: 'How can we reach you? (Optional)',
  guests: 'How many of you will be joining us?',
  events: 'Which celebrations will you be attending?',
  blessing: 'How would you like to shower us with blessings?',
  note: 'Leave us a little love note'
};
const FLOW_YES = ['attend', 'name', 'phone', 'guests', 'events', 'blessing', 'note'];
const FLOW_NO = ['attend', 'name', 'note'];

/** The three celebrations from the wedding schedule (same wording the sheet already uses) */
const EVENT_OPTIONS = [
  'Pre-Wedding Reception — 27 Jan',
  'Wedding Ceremony — 28 Jan',
  'Post-Wedding Reception — 7 Feb'
];

/** Blessing choices, each with a line icon (stored in the sheet as plain text) */
const BLESSING_OPTIONS = [
  { value: 'A wrapped surprise', Icon: Gift },
  { value: 'A little something for our new beginning', Icon: HeartHandshake },
  { value: 'My presence is your present!', Icon: PartyPopper }
];
const blessingIcon = (value) => BLESSING_OPTIONS.find((b) => b.value === value)?.Icon;

/** Venue direction links (same destinations as before) */
const VENUES = [
  { name: 'Shri Umadri Mahal', city: 'Chennai', place: 'Chennai, Tamil Nadu', url: 'https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai' },
  { name: 'Anand Grand Palace', city: 'Hosur', place: 'Hosur, Tamil Nadu', url: 'https://maps.google.com/?q=Anand+Grand+Palace+Hosur+Tamil+Nadu' }
];

/** A gilded map pin with a small lotus inside: the venue buttons' icon */
function VenuePinIcon() {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg className="rsvp-venue-pin-svg" viewBox="0 0 24 30" width="20" height="25" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`vpGold${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7e2a6" />
          <stop offset="48%" stopColor="#d2a74e" />
          <stop offset="100%" stopColor="#9a6b1f" />
        </linearGradient>
        <radialGradient id={`vpIvory${uid}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fffdf7" />
          <stop offset="100%" stopColor="#f6e6c8" />
        </radialGradient>
      </defs>
      <ellipse cx="12" cy="28.2" rx="4.2" ry="1.1" fill="rgba(80,30,20,0.22)" />
      <path
        d="M12 1.2C6.6 1.2 2.6 5.3 2.6 10.5c0 6.4 7.4 13.9 8.7 15.2a1 1 0 0 0 1.4 0c1.3-1.3 8.7-8.8 8.7-15.2 0-5.2-4-9.3-9.4-9.3Z"
        fill={`url(#vpGold${uid})`}
        stroke="#8a5d17"
        strokeWidth="0.6"
      />
      <path d="M6 6.2c1.3-1.9 3.4-3 6-3" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="12" cy="10.4" r="5.4" fill={`url(#vpIvory${uid})`} stroke="rgba(138,93,23,0.55)" strokeWidth="0.5" />
      {/* lotus */}
      <path d="M12 6.9c1.1 1.1 1.5 2.5 0 4.6-1.5-2.1-1.1-3.5 0-4.6Z" fill="#7a1c2c" />
      <path d="M8.6 9.4c1.5-.1 2.6.6 3.1 2.3-1.9.3-2.8-.6-3.1-2.3Z" fill="#a8324a" />
      <path d="M15.4 9.4c-1.5-.1-2.6.6-3.1 2.3 1.9.3 2.8-.6 3.1-2.3Z" fill="#a8324a" />
      <path d="M8.7 12.6h6.6" stroke="#c9a24a" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

const pad2 = (n) => String(n).padStart(2, '0');
const ASSET_BASE = import.meta.env.BASE_URL;
const EASE_SOFT = [0.22, 1, 0.36, 1];

/** A small rose sprig, the YES button's floral accent */
function RoseSprig({ className }) {
  return (
    <svg className={className} viewBox="0 0 40 28" aria-hidden="true">
      <path d="M4 24 C12 18 20 16 30 10" fill="none" stroke="#7f9a62" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="13" cy="18" rx="4.4" ry="2" fill="#8fab70" transform="rotate(-32 13 18)" />
      <ellipse cx="21" cy="17.5" rx="4" ry="1.8" fill="#7f9a62" transform="rotate(24 21 17.5)" />
      <circle cx="31" cy="9" r="5" fill="#f2b8c3" />
      <circle cx="31" cy="9" r="2.6" fill="#de7f95" />
      <circle cx="24" cy="12" r="2.4" fill="#fffaf0" />
    </svg>
  );
}

/** Hanging lantern for the ambient background (its glow flickers softly) */
function AmbientLantern({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 200" aria-hidden="true">
      <path d="M30 0 L30 128" stroke="rgba(164,117,36,0.55)" strokeWidth="1.2" />
      <circle className="rsvp-amb-flame-glow" cx="30" cy="156" r="30" fill="url(#rsvpLanternGlow)" />
      <defs>
        <radialGradient id="rsvpLanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,222,150,0.9)" />
          <stop offset="100%" stopColor="rgba(255,222,150,0)" />
        </radialGradient>
      </defs>
      <path d="M22 128 L38 128 L35 136 L25 136 Z" fill="#c9a24a" />
      <path d="M21 136 L39 136 C42 150 42 164 39 176 L21 176 C18 164 18 150 21 136 Z" fill="rgba(255,236,190,0.92)" stroke="#a47524" strokeWidth="1.2" />
      <path d="M30 136 L30 176 M24 136 C22 150 22 164 24 176 M36 136 C38 150 38 164 36 176" stroke="rgba(164,117,36,0.45)" strokeWidth="0.8" fill="none" />
      <path className="rsvp-amb-flame" d="M30 166 C26 160 28 154 30 150 C32 154 34 160 30 166 Z" fill="#f4a340" />
      <path d="M23 176 L37 176 L33 184 L27 184 Z" fill="#c9a24a" />
    </svg>
  );
}

/** Ambient background: soft light, restrained bokeh, lanterns and a few drifting petals */
function RsvpAmbience({ targetRef, reduceMotion }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] });
  const yFar = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const yNear = useTransform(scrollYProgress, [0, 1], [80, -80]);
  return (
    <div className="rsvp-ambience" aria-hidden="true">
      <div className="rsvp-amb-light" />
      <motion.div className="rsvp-amb-layer" style={reduceMotion ? undefined : { y: yFar }}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={`rsvp-amb-bokeh rsvp-amb-bokeh--${i}`} />
        ))}
      </motion.div>
      <motion.div className="rsvp-amb-layer" style={reduceMotion ? undefined : { y: yNear }}>
        <AmbientLantern className="rsvp-amb-lantern rsvp-amb-lantern--left" />
        <AmbientLantern className="rsvp-amb-lantern rsvp-amb-lantern--right" />
      </motion.div>
      <div className="rsvp-amb-petals">
        {Array.from({ length: 5 }, (_, i) => (
          <img key={i} src={i % 2 ? petalDeep : petalSoft} alt="" className={`rsvp-amb-petal rsvp-amb-petal--${i}`} />
        ))}
      </div>
    </div>
  );
}

/*
 * Playful NO button: the first time a guest reaches for NO it dodges around a
 * small playground under the buttons for NO_JOKE_MS, then returns home and
 * behaves normally. Runs once per page visit; skipped for keyboard use and
 * for reduced-motion users, so declining is never blocked.
 */
const NO_JOKE_MS = 6000; // safety net: the joke never lasts longer than this
const NO_MAX_DODGES = 3; // three playful moves; the next reach brings it home for good
const NO_STAGE_HEIGHT = { desktop: 128, phone: 140 }; // keep in sync with .rsvp-yesno-row.is-playing
const NO_HINT_BOX = { w: 170, h: 26 };
let noJokeUsed = false;

const INITIAL_FORM = {
  fullName: '',
  phoneNumber: '',
  // Chosen in question 1; stored as the original 'Joyfully Accept' / 'Regretfully Decline'
  // values so the Attendance column stays consistent with earlier responses
  attending: '',
  guestCount: '',
  events: [],
  blessing: '',
  wishesMessage: ''
};

export default function RSVP() {
  const [formData, setFormData] = useState(INITIAL_FORM);

  // One question at a time: index into the current flow
  const [qIndex, setQIndex] = useState(0);
  const stepHeadingRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const isAttending = formData.attending === 'Joyfully Accept';
  const flow = formData.attending === 'Regretfully Decline' ? FLOW_NO : FLOW_YES;
  const current = flow[Math.min(qIndex, flow.length - 1)];
  const isLastQuestion = qIndex === flow.length - 1;

  // After sending, move keyboard / screen-reader focus to the confirmation heading.
  // (Between questions, focus moves when the new question has animated in: see onAnimationStart.)
  useEffect(() => {
    if (!hasNavigatedRef.current) return;
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [isSuccess]);

  const shellRef = useRef(null);

  // Runaway NO button state
  const reduceMotion = useReducedMotion();
  const yesNoRowRef = useRef(null);
  const yesBtnRef = useRef(null);
  const noBtnRef = useRef(null);
  const noJokeTimerRef = useRef(null);
  const lastDodgeRef = useRef(0);
  const dodgeCountRef = useRef(0);
  const noOffsetRef = useRef({ x: 0, y: 0 });
  const [noJoke, setNoJoke] = useState(() => (noJokeUsed ? 'done' : 'idle')); // 'idle' | 'running' | 'done'
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });

  useEffect(() => () => clearTimeout(noJokeTimerRef.current), []);

  const moveNo = (offset) => {
    noOffsetRef.current = offset;
    setNoOffset(offset);
  };

  // Pick a new spot inside the playground: never over YES or the hint, never off-screen
  const dodgeNo = () => {
    const row = yesNoRowRef.current;
    const no = noBtnRef.current;
    const yes = yesBtnRef.current;
    if (!row || !no || !yes) return;

    // Playground = the full width of the step (inside the card) x the expanded row height.
    // Coordinates below are relative to the row's top-left corner.
    const stage = row.parentElement;
    const rowRect = row.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const minX = stageRect.left - rowRect.left;
    const stageH = window.innerWidth <= 560 ? NO_STAGE_HEIGHT.phone : NO_STAGE_HEIGHT.desktop;
    const w = no.offsetWidth;
    const h = no.offsetHeight;
    const maxX = minX + stage.clientWidth - w;
    const homeX = no.offsetLeft; // layout position, ignores the transform
    const homeY = no.offsetTop;

    // Stay on screen as well as inside the card
    let minY = Math.max(0, 8 - rowRect.top);
    let maxY = Math.min(stageH - h, window.innerHeight - 8 - rowRect.top - h);
    if (maxY < minY) {
      minY = 0;
      maxY = stageH - h;
    }

    const pad = 8;
    const blocked = [
      { x: yes.offsetLeft - pad, y: yes.offsetTop - pad, w: yes.offsetWidth + pad * 2, h: yes.offsetHeight + pad * 2 },
      { x: 0, y: stageH - NO_HINT_BOX.h, w: NO_HINT_BOX.w, h: NO_HINT_BOX.h }
    ];
    const cur = { x: homeX + noOffsetRef.current.x, y: homeY + noOffsetRef.current.y };
    const minJump = Math.min(80, (maxX - minX) / 3);

    let fallback = null;
    for (let i = 0; i < 80; i++) {
      const x = minX + Math.random() * Math.max(0, maxX - minX);
      const y = minY + Math.random() * Math.max(0, maxY - minY);
      if (blocked.some((b) => x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y)) continue;
      const pos = { x: Math.round(x - homeX), y: Math.round(y - homeY) };
      if (Math.hypot(x - cur.x, y - cur.y) >= minJump) {
        moveNo(pos);
        return;
      }
      fallback = fallback || pos;
    }
    if (fallback) moveNo(fallback);
  };

  // Mouse: only a real movement onto NO counts. Browsers send zero-movement "hover"
  // events when the page scrolls under a resting cursor; those must not start the joke.
  const handleNoPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!e.movementX && !e.movementY) return;
    handleNoReach();
  };

  // End the joke: NO glides back to its normal spot and stays there, fully clickable
  const endNoJoke = () => {
    clearTimeout(noJokeTimerRef.current);
    setNoJoke('done');
    moveNo({ x: 0, y: 0 });
  };

  const handleNoReach = () => {
    if (noJoke === 'done' || reduceMotion) return;
    if (Date.now() - lastDodgeRef.current < 250) return; // pointerenter + pointerdown + click of one touch
    lastDodgeRef.current = Date.now();

    if (noJoke === 'idle') {
      noJokeUsed = true;
      dodgeCountRef.current = 0;
      setNoJoke('running');
      noJokeTimerRef.current = setTimeout(endNoJoke, NO_JOKE_MS);
    }
    // Three dodges, then the next reach is the 4th and final movement: back home, for good
    if (dodgeCountRef.current >= NO_MAX_DODGES) {
      endNoJoke();
      return;
    }
    dodgeCountRef.current += 1;
    dodgeNo();
  };

  const handleNoClick = (e) => {
    // Mouse / touch during the joke: dodge instead. Keyboard (detail 0) always selects NO.
    if (noJoke !== 'done' && !reduceMotion && e.detail !== 0) {
      handleNoReach();
      return;
    }
    // The tap that ends the joke only sends NO home; choosing NO takes a fresh tap
    if (e.detail !== 0 && Date.now() - lastDodgeRef.current < 350) return;
    chooseAttendance('Regretfully Decline');
  };

  const goTo = (index) => {
    hasNavigatedRef.current = true;
    setFormStatus(null);
    setQIndex(index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (formStatus?.type === 'error') {
      setFormStatus(null);
    }
  };

  // Question 1: either answer moves on to "What should we call you?"
  const chooseAttendance = (val) => {
    setFormData((prev) => ({ ...prev, attending: val }));
    goTo(1);
  };

  const toggleEvent = (eventName) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(eventName)
        ? prev.events.filter((x) => x !== eventName)
        : EVENT_OPTIONS.filter((x) => x === eventName || prev.events.includes(x)) // keep schedule order
    }));
    setFormStatus(null);
  };

  const chooseBlessing = (value) => {
    setFormData((prev) => ({ ...prev, blessing: value }));
    setFormStatus(null);
  };

  // Validation for one question; returns an error message, or null when it can continue
  const validateQuestion = (id) => {
    if (id === 'attend' && !formData.attending) return 'Please let us know if you can make it.';
    if (id === 'name' && formData.fullName.trim().length < 2) return 'Please provide your full name.';
    if (id === 'phone' && formData.phoneNumber.trim() && !validateAndNormalizePhone(formData.phoneNumber).isValid) {
      return 'Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210), or leave it blank.';
    }
    if (id === 'guests') {
      const parsed = parseInt(formData.guestCount, 10);
      if (!parsed || parsed < 1 || parsed > 25) return 'Please enter the number of guests attending (1 to 25).';
    }
    if (id === 'events' && formData.events.length === 0) return 'Please choose at least one celebration.';
    if (id === 'blessing' && !formData.blessing) return 'Please choose one to continue.';
    return null;
  };

  // Continue (and Enter in a field) moves to the next question; the last one sends the RSVP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormStatus(null);

    if (current === 'attend') return; // answered with the YES / NO buttons
    const error = validateQuestion(current);
    if (error) {
      setFormStatus({ type: 'error', message: error });
      return;
    }
    if (!isLastQuestion) {
      goTo(qIndex + 1);
      return;
    }

    // Final check of every question in this flow
    const firstInvalid = flow.findIndex((id) => validateQuestion(id));
    if (firstInvalid !== -1) {
      goTo(firstInvalid);
      setFormStatus({ type: 'error', message: validateQuestion(flow[firstInvalid]) });
      return;
    }

    const trimmedName = formData.fullName.trim();
    const phoneNormalized = formData.phoneNumber.trim()
      ? validateAndNormalizePhone(formData.phoneNumber).normalized
      : '';
    const guests = isAttending ? parseInt(formData.guestCount, 10) : 0;
    const eventsText = !isAttending
      ? 'Not Attending'
      : formData.events.length === EVENT_OPTIONS.length
        ? 'All Events'
        : formData.events.join(', ');

    // Build final submission payload matching Google Sheet columns
    const payload = {
      fullName: trimmedName,
      mobile: phoneNormalized,
      mobileNumber: phoneNormalized,
      attendance: formData.attending,
      guests: String(guests),
      guestCount: guests,
      events: eventsText,
      wishes: formData.wishesMessage.trim(),
      source: 'Wedding Website',
      // Blessing choice -> Google Sheet column I (blank for guests who can't come)
      blessing: isAttending ? formData.blessing : ''
    };

    setIsSubmitting(true);

    const isPlaceholder =
      !RSVP_ENDPOINT || RSVP_ENDPOINT.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL');

    // If using the placeholder endpoint in development/preview, simulate success
    if (isPlaceholder) {
      console.info(
        'RSVP_ENDPOINT is set to the default placeholder. Simulating successful submission. Deploy the Google Apps Script in google-apps-script/Code.gs to connect your live Google Sheet!'
      );
      setTimeout(() => {
        setSubmittedData(payload);
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 750);
      return;
    }

    try {
      // POST with text/plain prevents CORS preflight OPTIONS failure with Google Apps Script
      const response = await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      let json = null;
      try {
        json = await response.json();
      } catch (parseErr) {
        // Redirection might obscure body in some browsers, but execution succeeds
      }

      if (json && json.success === false) {
        throw new Error(json.message || 'Unable to submit RSVP');
      }

      setSubmittedData(payload);
      setIsSuccess(true);
    } catch (err) {
      console.warn('Standard fetch encountered an issue, attempting safe no-cors mode:', err);
      // Fallback with mode: 'no-cors' guarantees submission even if 302 redirect has CORS header restriction
      try {
        await fetch(RSVP_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
        setSubmittedData(payload);
        setIsSuccess(true);
      } catch (fallbackErr) {
        console.error('RSVP Submission failed:', fallbackErr);
        setFormStatus({
          type: 'error',
          message: 'Something went wrong while sending your RSVP. Please try again or use WhatsApp RSVP.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    setFormData(INITIAL_FORM);
    goTo(0);
  };

  // WhatsApp RSVP link message (independent of Google Sheets submission)
  const whatsappDirectMsg = encodeURIComponent(
    `Hi Prithvi & Harshini, we joyfully confirm our presence for your wedding celebrations!`
  );

  const headingId = `rsvpQuestion-${current}`;
  // Numbered progress with ornamental markers; it reflects the current flow (7 for Yes, 3 for No)
  const progressFraction = flow.length > 1 ? qIndex / (flow.length - 1) : 1;
  const progress = (
    <div
      className="rsvp-progress"
      role="progressbar"
      aria-label="RSVP progress"
      aria-valuemin={1}
      aria-valuemax={flow.length}
      aria-valuenow={qIndex + 1}
      aria-valuetext={`Question ${qIndex + 1} of ${flow.length}`}
    >
      <span className="rsvp-progress-count" aria-hidden="true">
        <span className="rsvp-progress-label">Question</span>
        <span className="rsvp-progress-now">{pad2(qIndex + 1)}</span>
        <span className="rsvp-progress-of">/ {pad2(flow.length)}</span>
      </span>
      <span className="rsvp-progress-track" aria-hidden="true">
        <span className="rsvp-progress-line">
          <span className="rsvp-progress-fill" style={{ transform: `scaleX(${progressFraction})` }} />
        </span>
        {flow.map((id, i) => (
          <span
            key={id}
            className={`rsvp-progress-marker${i === qIndex ? ' is-current' : ''}${i < qIndex ? ' is-done' : ''}`}
            style={{ left: `${flow.length > 1 ? (i / (flow.length - 1)) * 100 : 50}%` }}
          />
        ))}
      </span>
    </div>
  );

  // Each question fades and rises in, and lifts away quickly on the way out
  const stepVariants = reduceMotion
    ? { enter: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.15 } }, leave: { opacity: 0, transition: { duration: 0.1 } } }
    : {
        enter: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE_SOFT } },
        leave: { opacity: 0, y: -10, transition: { duration: 0.16, ease: 'easeIn' } }
      };
  const stepMotion = {
    variants: stepVariants,
    initial: 'enter',
    animate: 'show',
    exit: 'leave',
    onAnimationStart: (label) => {
      if (label === 'show' && hasNavigatedRef.current) stepHeadingRef.current?.focus({ preventScroll: true });
    }
  };

  // Header: logo, eyebrow, title, script line, divider and note arrive in turn
  const headerItem = reduceMotion
    ? { hide: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : { hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SOFT } } };
  const headerContainer = { hide: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.1 } } };

  return (
    <AnimatedSection className="section-block rsvp-section rsvp-lux" id="rsvp">
      <RsvpAmbience targetRef={shellRef} reduceMotion={reduceMotion} />
      <div className="section-container rsvp-compact-shell" ref={shellRef}>
        <div className="rsvp-editorial-card">
          {/* Stationery details: hairline inner frame and floral corners */}
          <span className="rsvp-card-frame" aria-hidden="true" />
          {['tl', 'tr', 'bl', 'br'].map((corner) => (
            <img
              key={corner}
              src={`${ASSET_BASE}assets/card-corner-floral.png`}
              alt=""
              aria-hidden="true"
              className={`rsvp-corner rsvp-corner--${corner}`}
            />
          ))}

          {/* RSVP Header */}
          <motion.div
            className="editorial-heading-stack text-center rsvp-header-compact"
            variants={headerContainer}
            initial="hide"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div className="rsvp-crest-dock" variants={headerItem}>
              <img
                src={weddingLogo}
                alt="Prithvi Raj & Harshini Wedding Logo"
                className="rsvp-crest-logo"
              />
            </motion.div>
            <motion.p className="editorial-eyebrow" variants={headerItem}>A LITTLE NOTE BEFORE THE CELEBRATION</motion.p>
            <motion.h2 className="editorial-main-title rsvp-title-compact" variants={headerItem}>RSVP</motion.h2>
            <motion.span className="editorial-script-accent rsvp-script-compact" variants={headerItem}>your gracious presence requested</motion.span>
            <motion.div className="gold-divider-flourish flourish-compact" aria-hidden="true" variants={headerItem}>
              <span className="flourish-line" />
              <span className="flourish-node">❈ ❖ ❈</span>
              <span className="flourish-line" />
            </motion.div>
            <motion.p className="rsvp-gentle-note" variants={headerItem}>
              Kindly confirm your presence by 15th January 2027 to help us welcome you with traditional hospitality.
            </motion.p>
          </motion.div>

          {/* Form or Confirmation State */}
          {!isSuccess ? (
            <form id="rsvpForm" className="rsvp-form-grid" onSubmit={handleSubmit} noValidate>
              <AnimatePresence mode="wait" initial={false}>
              {/* Question 1: attendance (YES / NO with the playful NO) */}
              {current === 'attend' && (
                <motion.div className="rsvp-step" key="attend" {...stepMotion}>
                  {progress}
                  <h3 className="rsvp-step-question" id={headingId} ref={stepHeadingRef} tabIndex={-1}>
                    {QUESTIONS.attend}
                  </h3>
                  <div
                    className={`rsvp-yesno-row${noJoke === 'running' ? ' is-playing' : ''}`}
                    role="group"
                    aria-labelledby={headingId}
                    ref={yesNoRowRef}
                  >
                    <button
                      type="button"
                      ref={yesBtnRef}
                      className={`rsvp-yesno-btn yes ${formData.attending === 'Joyfully Accept' ? 'selected' : ''}`}
                      onClick={() => chooseAttendance('Joyfully Accept')}
                      aria-pressed={formData.attending === 'Joyfully Accept'}
                    >
                      <span className="rsvp-choice-icon" aria-hidden="true">
                        <Check size={13} strokeWidth={2.6} />
                      </span>
                      <span className="rsvp-choice-label">Yes, absolutely!</span>
                      <RoseSprig className="rsvp-choice-floral" />
                    </button>
                    <motion.button
                      type="button"
                      ref={noBtnRef}
                      className={`rsvp-yesno-btn no ${formData.attending === 'Regretfully Decline' ? 'selected' : ''}`}
                      onPointerMove={handleNoPointerMove}
                      onPointerDown={handleNoReach}
                      onClick={handleNoClick}
                      aria-pressed={formData.attending === 'Regretfully Decline'}
                      animate={{ x: noOffset.x, y: noOffset.y }}
                      transition={{ type: 'spring', stiffness: 240, damping: 20, mass: 0.8 }}
                    >
                      <span className="rsvp-choice-icon" aria-hidden="true">
                        <X size={13} strokeWidth={2.6} />
                      </span>
                      <span className="rsvp-choice-label">Sorry, I&apos;ll miss it.</span>
                    </motion.button>
                    {noJoke === 'running' && (
                      <p className="rsvp-yesno-hint" aria-hidden="true">
                        Hmm… are you sure?
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Questions 2 onwards: one at a time, Back / Continue */}
              {current !== 'attend' && (
                <motion.div className="rsvp-step" key={current} {...stepMotion}>
                  {progress}
                  <h3 className="rsvp-step-question" id={headingId} ref={stepHeadingRef} tabIndex={-1}>
                    {QUESTIONS[current]}
                  </h3>

                  {current === 'name' && (
                    <div className="form-control-pod rsvp-step-field">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        aria-labelledby={headingId}
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        autoComplete="name"
                      />
                    </div>
                  )}

                  {current === 'phone' && (
                    <div className="form-control-pod rsvp-step-field">
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        aria-labelledby={headingId}
                        placeholder="Your phone number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                  )}

                  {current === 'guests' && (
                    <div className="form-control-pod rsvp-step-field">
                      <input
                        type="number"
                        id="guestCount"
                        name="guestCount"
                        aria-labelledby={headingId}
                        min="1"
                        max="25"
                        inputMode="numeric"
                        placeholder="Number of guests attending"
                        value={formData.guestCount}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  {current === 'events' && (
                    <>
                      <p className="rsvp-step-helper">Select all the events you plan to join.</p>
                      <div className="rsvp-quiz-options rsvp-quiz-options--single" role="group" aria-labelledby={headingId}>
                        {EVENT_OPTIONS.map((eventName) => {
                          const selected = formData.events.includes(eventName);
                          return (
                            <button
                              key={eventName}
                              type="button"
                              role="checkbox"
                              aria-checked={selected}
                              className={`rsvp-quiz-option is-check${selected ? ' selected' : ''}`}
                              onClick={() => toggleEvent(eventName)}
                            >
                              <span className="rsvp-quiz-radio rsvp-quiz-check" aria-hidden="true">
                                {selected && <Check size={12} strokeWidth={3} />}
                              </span>
                              <span>{eventName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {current === 'blessing' && (
                    <div className="rsvp-quiz-options rsvp-quiz-options--single" role="radiogroup" aria-labelledby={headingId}>
                      {BLESSING_OPTIONS.map(({ value, Icon }) => {
                        const selected = formData.blessing === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            className={`rsvp-quiz-option rsvp-blessing-option${selected ? ' selected' : ''}`}
                            onClick={() => chooseBlessing(value)}
                          >
                            <span className="rsvp-blessing-icon" aria-hidden="true">
                              <Icon size={18} strokeWidth={1.7} />
                            </span>
                            <span className="rsvp-blessing-label">{value}</span>
                            <span className="rsvp-quiz-radio" aria-hidden="true">
                              {selected && <Check size={12} strokeWidth={3} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {current === 'note' && (
                    <>
                      <p className="rsvp-step-helper" id="rsvpNoteHelp">
                        A wish, a blessing, a piece of advice, or anything you&apos;d like to tell us.
                      </p>
                      <div className="form-control-pod rsvp-step-field">
                        <textarea
                          id="wishesMessage"
                          name="wishesMessage"
                          rows="3"
                          aria-labelledby={headingId}
                          aria-describedby="rsvpNoteHelp"
                          value={formData.wishesMessage}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </>
                  )}

                  {isLastQuestion ? (
                    <>
                      <div className="form-actions-row">
                        <button
                          type="submit"
                          className="submit-action-btn"
                          id="submitRsvpBtn"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={15} className="btn-spinner-icon" />
                              <span>SENDING RSVP...</span>
                            </>
                          ) : (
                            <>
                              <Send size={14} strokeWidth={2} />
                              <span>SEND RSVP</span>
                            </>
                          )}
                        </button>

                        <a
                          id="whatsappDirectLink"
                          href={`https://wa.me/919025228713?text=${whatsappDirectMsg}`}
                          target="_blank"
                          rel="noreferrer"
                          className="whatsapp-action-btn"
                        >
                          <WhatsAppIcon size={16} />
                          <span>WhatsApp RSVP</span>
                        </a>
                      </div>
                      <button
                        type="button"
                        className="rsvp-step-back rsvp-step-back--details"
                        onClick={() => goTo(qIndex - 1)}
                        disabled={isSubmitting}
                      >
                        <ArrowLeft size={14} strokeWidth={2.2} aria-hidden="true" />
                        <span>Back</span>
                      </button>
                    </>
                  ) : (
                    <div className="rsvp-step-nav">
                      <button type="button" className="rsvp-step-back" onClick={() => goTo(qIndex - 1)}>
                        <ArrowLeft size={14} strokeWidth={2.2} aria-hidden="true" />
                        <span>Back</span>
                      </button>
                      <button type="submit" className="rsvp-step-next">
                        <span>Continue</span>
                        <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              </AnimatePresence>

              {formStatus && (
                <div
                  className={`feedback-box ${formStatus.type}`}
                  aria-live="polite"
                >
                  {formStatus.message}
                </div>
              )}
            </form>
          ) : (
            /* Luxury Confirmation State */
            <div className="rsvp-confirmation-card" role="status" aria-live="polite">
              <div className="rsvp-success-crest-badge">
                <div className="rsvp-check-ring">
                  <Check size={28} strokeWidth={2.6} className="rsvp-check-glyph" />
                </div>
              </div>

              <div className="gold-divider-flourish flourish-compact" aria-hidden="true">
                <span className="flourish-line" />
                <span className="flourish-node">❈ ❖ ❈</span>
                <span className="flourish-line" />
              </div>

              <p className="rsvp-confirmation-greeting">
                Dear <span className="rsvp-guest-name">{submittedData?.fullName}</span>,
              </p>

              <h3 className="rsvp-confirmation-heading" ref={stepHeadingRef} tabIndex={-1}>
                {submittedData?.attendance === 'Joyfully Accept'
                  ? "Yay! Can't wait to celebrate with you!"
                  : "We'll miss you! Thank you for letting us know."}
              </h3>

              <p className="rsvp-confirmation-text">
                {submittedData?.attendance === 'Joyfully Accept'
                  ? 'Your RSVP has been received.'
                  : 'Your response has been received.'}
              </p>

              {/* RSVP Receipt Details */}
              <div className="rsvp-confirmation-summary">
                <div className="summary-pill-group">
                  <span className={`summary-pill ${submittedData?.attendance === 'Joyfully Accept' ? 'attendance-pill-accept' : 'attendance-pill-decline'}`}>
                    {submittedData?.attendance === 'Joyfully Accept' ? (
                      <Check size={12} strokeWidth={2.4} />
                    ) : (
                      <X size={12} strokeWidth={2.4} />
                    )}
                    {submittedData?.attendance}
                  </span>

                  {submittedData?.attendance === 'Joyfully Accept' && (
                    <>
                      <span className="summary-pill guests-pill">
                        {submittedData?.guestCount} {submittedData?.guestCount === 1 ? 'Guest' : 'Guests'}
                      </span>
                      {String(submittedData?.events || '')
                        .split(', ')
                        .filter(Boolean)
                        .map((eventName) => (
                          <span key={eventName} className="summary-pill events-pill">
                            {eventName}
                          </span>
                        ))}
                    </>
                  )}
                </div>

                {submittedData?.attendance === 'Joyfully Accept' && submittedData?.blessing && (
                  <p className="summary-blessing">
                    {(() => {
                      const Icon = blessingIcon(submittedData.blessing);
                      return Icon ? <Icon size={15} strokeWidth={1.8} aria-hidden="true" /> : null;
                    })()}
                    <span>{submittedData.blessing}</span>
                  </p>
                )}

                {submittedData?.wishes && (
                  <div className="summary-wishes-quote">
                    &ldquo;{submittedData.wishes}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Buttons in Confirmation State */}
              <div className="rsvp-confirmation-actions">
                <button
                  type="button"
                  className="rsvp-reset-action-btn"
                  onClick={handleResetForm}
                >
                  <RotateCcw size={13} strokeWidth={2.2} />
                  <span>Submit Another Response</span>
                </button>

                <a
                  href={`https://wa.me/919025228713?text=${whatsappDirectMsg}`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-action-btn confirmation-wa-btn"
                >
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp RSVP</span>
                </a>
              </div>
            </div>
          )}

          {/* Venue directions (always visible, same destinations as before) */}
          <div className="rsvp-venues">
            <p className="rsvp-venues-eyebrow">
              <span className="rsvp-venues-line" aria-hidden="true" />
              Venue Directions
              <span className="rsvp-venues-line" aria-hidden="true" />
            </p>
            <div className="rsvp-venue-list">
              {VENUES.map((venue) => (
                <a
                  key={venue.url}
                  href={venue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rsvp-venue-btn"
                  aria-label={`${venue.name} · ${venue.city}: open directions in Google Maps`}
                >
                  <span className="rsvp-venue-pin" aria-hidden="true">
                    <VenuePinIcon />
                  </span>
                  <span className="rsvp-venue-text">
                    <span className="rsvp-venue-name">{venue.name}</span>
                    <span className="rsvp-venue-city">{venue.place}</span>
                  </span>
                  <span className="rsvp-venue-arrow" aria-hidden="true">
                    <ArrowUpRight size={12} strokeWidth={1.8} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
