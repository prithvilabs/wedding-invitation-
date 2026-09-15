import React, { useState } from 'react';
import { Send, MapPin, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import weddingLogo from '../assets/wedding-logo.png';

const WhatsAppIcon = ({ size = 16, className = "" }) => (
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

export default function RSVP() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    attending: 'Joyfully Accept',
    guestCount: '2',
    eventsAttending: 'All Events',
    wishesMessage: ''
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttendingChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      attending: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Please provide both your name and phone number to confirm.'
      });
      return;
    }

    setFormStatus({
      type: 'success',
      message: 'Nandri! Your RSVP has been graciously recorded. We look forward to celebrating with you!'
    });

    const msg = encodeURIComponent(
      `*Wedding RSVP Confirmation*\n` +
      `*Name:* ${formData.fullName}\n` +
      `*Phone:* ${formData.phoneNumber}\n` +
      `*Response:* ${formData.attending}\n` +
      `*Guests:* ${formData.guestCount || 1}\n` +
      `*Events:* ${formData.eventsAttending}\n` +
      (formData.wishesMessage ? `*Wishes:* "${formData.wishesMessage}"` : '')
    );

    const waUrl = `https://wa.me/919876543210?text=${msg}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const whatsappDirectMsg = encodeURIComponent(
    `Hi Prithvi & Harshini, we joyfully confirm our presence for your wedding celebrations!`
  );

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
                />
              </div>

              <div className="form-control-pod">
                <label htmlFor="phoneNumber">WhatsApp / Mobile Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2: Attendance Segmented Buttons & Number of Guests */}
            <div className="form-row-duo form-row-aligned">
              <div className="form-control-pod">
                <label>Will you be attending? *</label>
                <div className="attend-toggle-row" role="radiogroup">
                  <button
                    type="button"
                    className={`attend-btn ${formData.attending === 'Joyfully Accept' ? 'selected' : ''}`}
                    onClick={() => handleAttendingChange('Joyfully Accept')}
                    aria-pressed={formData.attending === 'Joyfully Accept'}
                  >
                    <Check size={13} strokeWidth={2.4} className="attend-btn-icon" />
                    <span>Joyfully Accept</span>
                  </button>
                  <button
                    type="button"
                    className={`attend-btn ${formData.attending === 'Regretfully Decline' ? 'selected' : ''}`}
                    onClick={() => handleAttendingChange('Regretfully Decline')}
                    aria-pressed={formData.attending === 'Regretfully Decline'}
                  >
                    <X size={13} strokeWidth={2.4} className="attend-btn-icon" />
                    <span>Regretfully Decline</span>
                  </button>
                </div>
              </div>

              <div className="form-control-pod">
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
                />
              </div>
            </div>

            {/* Row 3: Events You Will Attend (Clean Dropdown Only) */}
            <div className="form-control-pod">
              <label htmlFor="eventsAttending">Events You Will Attend</label>
              <div className="select-wrapper">
                <select
                  id="eventsAttending"
                  name="eventsAttending"
                  value={formData.eventsAttending}
                  onChange={handleChange}
                  className="rsvp-select-control"
                >
                  <option value="All Events">All Events</option>
                  <option value="Pre-Wedding Reception — 27 Jan">Pre-Wedding Reception — 27 Jan</option>
                  <option value="Wedding Ceremony — 28 Jan">Wedding Ceremony — 28 Jan</option>
                  <option value="Grand Wedding Reception — 7 Feb">Grand Wedding Reception — 7 Feb</option>
                </select>
              </div>
            </div>

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
              />
            </div>

            {/* Row 5: Action Buttons (Equal Height & Width) */}
            <div className="form-actions-row">
              <button type="submit" className="submit-action-btn" id="submitRsvpBtn">
                <Send size={14} strokeWidth={2} />
                <span>SEND RSVP CONFIRMATION</span>
              </button>

              <a
                id="whatsappDirectLink"
                href={`https://wa.me/919876543210?text=${whatsappDirectMsg}`}
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

          {/* Venue Directions Guide */}
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
