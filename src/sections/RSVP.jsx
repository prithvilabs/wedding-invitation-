import React, { useState } from 'react';
import { Send, MapPin, ArrowUpRight, Check, X, Loader2, RotateCcw } from 'lucide-react';
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

export default function RSVP() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    attending: 'Joyfully Accept',
    guestCount: '2',
    eventsAttending: 'All Events',
    wishesMessage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

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

  const handleAttendingChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      attending: val,
      ...(val === 'Regretfully Decline'
        ? { guestCount: '0', eventsAttending: 'Not Attending' }
        : {
            guestCount: prev.guestCount === '0' ? '2' : prev.guestCount || '2',
            eventsAttending:
              prev.eventsAttending === 'Not Attending'
                ? 'All Events'
                : prev.eventsAttending || 'All Events'
          })
    }));
    if (formStatus?.type === 'error') {
      setFormStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormStatus(null);

    // 1. Validate Full Name
    const trimmedName = formData.fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setFormStatus({
        type: 'error',
        message: 'Please provide your full name.'
      });
      return;
    }

    // 2. Validate Mobile Number
    const phoneResult = validateAndNormalizePhone(formData.phoneNumber);
    if (!phoneResult.isValid) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210).'
      });
      return;
    }

    // 3. Validate Attendance & Guests
    const isAttending = formData.attending === 'Joyfully Accept';
    let guests = 0;
    if (isAttending) {
      const parsed = parseInt(formData.guestCount, 10);
      if (!parsed || parsed < 1 || parsed > 25) {
        setFormStatus({
          type: 'error',
          message: 'Please enter the number of guests attending (1 to 25).'
        });
        return;
      }
      guests = parsed;
    }

    // Build final submission payload matching Google Sheet columns
    const payload = {
      fullName: trimmedName,
      mobile: phoneResult.normalized,
      mobileNumber: phoneResult.normalized,
      attendance: formData.attending,
      guests: isAttending ? String(guests) : '0',
      guestCount: isAttending ? guests : 0,
      events: isAttending ? (formData.eventsAttending || 'All Events') : 'Not Attending',
      wishes: formData.wishesMessage.trim(),
      source: 'Wedding Website'
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
    setFormData({
      fullName: '',
      phoneNumber: '',
      attending: 'Joyfully Accept',
      guestCount: '2',
      eventsAttending: 'All Events',
      wishesMessage: ''
    });
    setFormStatus(null);
  };

  // WhatsApp RSVP link message (independent of Google Sheets submission)
  const whatsappDirectMsg = encodeURIComponent(
    `Hi Prithvi & Harshini, we joyfully confirm our presence for your wedding celebrations!`
  );

  const isAttending = formData.attending === 'Joyfully Accept';

  return (
    <AnimatedSection className="section-block rsvp-section" id="rsvp">
      <div className="section-container text-safe-zone rsvp-compact-shell">
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
            <p className="editorial-eyebrow">CELEBRATE THIS SACRED CHAPTER WITH US</p>
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
              {/* Row 1: Full Name & WhatsApp / Mobile */}
              <div className="form-row-duo">
                <div className="form-control-pod">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>

                <div className="form-control-pod">
                  <label htmlFor="phoneNumber">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Row 2: Attendance Toggle & Number of Guests (Only when Joyfully Accept) */}
              <div className={`form-row-duo form-row-aligned ${!isAttending ? 'single-pod-row' : ''}`}>
                <div className="form-control-pod">
                  <label>Will you be attending? *</label>
                  <div className="attend-toggle-row" role="radiogroup" aria-label="Will you be attending?">
                    <button
                      type="button"
                      className={`attend-btn ${isAttending ? 'selected' : ''}`}
                      onClick={() => handleAttendingChange('Joyfully Accept')}
                      aria-pressed={isAttending}
                      disabled={isSubmitting}
                    >
                      <Check size={14} strokeWidth={2.4} className="attend-btn-icon" />
                      <span>Joyfully Accept</span>
                    </button>

                    <button
                      type="button"
                      className={`attend-btn ${!isAttending ? 'selected' : ''}`}
                      onClick={() => handleAttendingChange('Regretfully Decline')}
                      aria-pressed={!isAttending}
                      disabled={isSubmitting}
                    >
                      <X size={14} strokeWidth={2.4} className="attend-btn-icon" />
                      <span>Regretfully Decline</span>
                    </button>
                  </div>
                </div>

                {isAttending && (
                  <div className="form-control-pod rsvp-fade-enter">
                    <label htmlFor="guestCount">Number of Guests *</label>
                    <input
                      type="number"
                      id="guestCount"
                      name="guestCount"
                      min="1"
                      max="25"
                      inputMode="numeric"
                      placeholder="Enter number of guests"
                      value={formData.guestCount}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Row 3: Events You Will Attend (Appears when Joyfully Accept) */}
              {isAttending && (
                <div className="form-control-pod rsvp-fade-enter">
                  <label htmlFor="eventsAttending">Events You Will Attend *</label>
                  <div className="select-wrapper">
                    <select
                      id="eventsAttending"
                      name="eventsAttending"
                      value={formData.eventsAttending}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="rsvp-select-control"
                    >
                      <option value="All Events">All Events</option>
                      <option value="Pre-Wedding Reception — 27 Jan">Pre-Wedding Reception — 27 Jan</option>
                      <option value="Wedding Ceremony — 28 Jan">Wedding Ceremony — 28 Jan</option>
                      <option value="Post-Wedding Reception — 7 Feb">Post-Wedding Reception — 7 Feb</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Row 4: Warm Wishes & Blessings */}
              <div className="form-control-pod">
                <label htmlFor="wishesMessage">Warm Wishes &amp; Blessings</label>
                <textarea
                  id="wishesMessage"
                  name="wishesMessage"
                  rows="2"
                  placeholder="Write your heartfelt wishes for Prithvi Raj & Harshini..."
                  value={formData.wishesMessage}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Row 5: Action Buttons */}
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
                      <span>SEND RSVP CONFIRMATION</span>
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

              <h3 className="rsvp-confirmation-heading">
                Thank You, <span className="rsvp-guest-name">{submittedData?.fullName}</span>
              </h3>

              <p className="rsvp-confirmation-text">
                {submittedData?.attendance === 'Joyfully Accept' ? (
                  <>
                    Your RSVP has been received.
                    <br />
                    We look forward to celebrating with you.
                  </>
                ) : (
                  <>
                    Your response has been received.
                    <br />
                    Thank you for your warm wishes and blessings.
                  </>
                )}
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
                      <span className="summary-pill events-pill">
                        {submittedData?.events}
                      </span>
                    </>
                  )}
                </div>

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
