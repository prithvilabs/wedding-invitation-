import React, { useState } from 'react';
import { Check, X, Send, MessageCircle, MapPin, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import weddingLogo from '../assets/wedding-logo.png';

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
                <MessageCircle size={15} strokeWidth={2} />
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
