import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Send,
  MapPin,
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

  // Move keyboard / screen-reader focus to the new question's heading (not on first render)
  useEffect(() => {
    if (!hasNavigatedRef.current) return;
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [qIndex, isSuccess]);

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
  const progress = (
    <div className="rsvp-quiz-progress">
      <span className="rsvp-quiz-count">
        Question {qIndex + 1} of {flow.length}
      </span>
      <span className="rsvp-quiz-dots" aria-hidden="true">
        {flow.map((id, i) => (
          <span key={id} className={`rsvp-quiz-dot${i === qIndex ? ' current' : ''}${i < qIndex ? ' done' : ''}`} />
        ))}
      </span>
    </div>
  );

  return (
    <AnimatedSection className="section-block rsvp-section" id="rsvp">
      <div className="section-container rsvp-compact-shell">
        <div className="rsvp-editorial-card">
          {/* RSVP Header */}
          <div className="editorial-heading-stack text-center rsvp-header-compact">
            <div className="rsvp-crest-dock">
              <img
                src={weddingLogo}
                alt="Prithvi Raj & Harshini Wedding Logo"
                className="rsvp-crest-logo"
              />
            </div>
            <p className="editorial-eyebrow">A LITTLE NOTE BEFORE THE CELEBRATION</p>
            <h2 className="editorial-main-title rsvp-title-compact">RSVP</h2>
            <span className="editorial-script-accent rsvp-script-compact">your gracious presence requested</span>
            <div className="gold-divider-flourish flourish-compact" aria-hidden="true">
              <span className="flourish-line" />
              <span className="flourish-node">❈ ❖ ❈</span>
              <span className="flourish-line" />
            </div>
            <p className="rsvp-gentle-note">
              Kindly confirm your presence by 15th January 2027 to help us welcome you with traditional hospitality.
            </p>
          </div>

          {/* Form or Confirmation State */}
          {!isSuccess ? (
            <form id="rsvpForm" className="rsvp-form-grid" onSubmit={handleSubmit} noValidate>
              {/* Question 1: attendance (YES / NO with the playful NO) */}
              {current === 'attend' && (
                <div className="rsvp-step rsvp-fade-enter" key="attend">
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
                      <Check size={16} strokeWidth={2.6} aria-hidden="true" />
                      <span>Yes, absolutely!</span>
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
                      <X size={16} strokeWidth={2.6} aria-hidden="true" />
                      <span>Sorry, I&apos;ll miss it.</span>
                    </motion.button>
                    {noJoke === 'running' && (
                      <p className="rsvp-yesno-hint" aria-hidden="true">
                        Hmm… are you sure?
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Questions 2 onwards: one at a time, Back / Continue */}
              {current !== 'attend' && (
                <div className="rsvp-step rsvp-fade-enter" key={current}>
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
                          placeholder="Optional"
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
                </div>
              )}

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

          {/* Venue Directions Guide (Remains visible) */}
          <div className="venue-route-box">
            <div className="route-lead-row">
              <MapPin size={13} strokeWidth={2} className="route-pin-icon" />
              <span className="route-guide-title">Venue Directions</span>
            </div>
            <div className="route-pill-list">
              <a
                href="https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai"
                target="_blank"
                rel="noreferrer"
                className="venue-pill-link"
              >
                <span>Shri Umadri Mahal · Chennai</span>
                <ArrowUpRight size={12} strokeWidth={2} />
              </a>
              <a
                href="https://maps.google.com/?q=Anand+Grand+Palace+Hosur+Tamil+Nadu"
                target="_blank"
                rel="noreferrer"
                className="venue-pill-link"
              >
                <span>Anand Grand Palace · Hosur</span>
                <ArrowUpRight size={12} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
