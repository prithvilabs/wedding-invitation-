import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, MapPin, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';

const ASSET_BASE = import.meta.env.BASE_URL;

/**
 * South Indian Gold Lotus Ornament
 */
function LotusOrnament({ width = 36, height = 22, className = '', id = 'default' }) {
  const gradId = `scheduleLotusGrad_${id}`;
  return (
    <svg
      className={`lotus-motif-icon ${className}`}
      width={width}
      height={height}
      viewBox="0 0 36 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB35A" />
          <stop offset="50%" stopColor="#C8A265" />
          <stop offset="100%" stopColor="#A47524" />
        </linearGradient>
      </defs>
      <path
        d="M 18 2 C 15.6 6.8, 15.6 13, 18 18.2 C 20.4 13, 20.4 6.8, 18 2 Z"
        stroke={`url(#${gradId})`}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 18 18.2 C 14.5 16, 11 11.2, 11.8 6.5 C 14.2 9, 16.6 12, 18 14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 18 18.2 C 21.5 16, 25 11.2, 24.2 6.5 C 21.8 9, 19.4 12, 18 14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 16 18.2 C 12 17.2, 6.2 14.8, 5.5 10.8 C 8.6 12.2, 12.2 14.8, 14.8 16.8"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 20 18.2 C 24 17.2, 29.8 14.8, 30.5 10.8 C 27.4 12.2, 23.8 14.8, 21.2 16.8"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 12 19.2 C 15 21.2, 21 21.2, 24 19.2"
        stroke={`url(#${gradId})`}
        strokeWidth="1.15"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="18" cy="18.2" r="0.9" fill="#C8A265" />
    </svg>
  );
}

/**
 * Timeline Gold Rosette Node
 */
function TimelineRosetteNode() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="timeline-rosette-node-svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="#FAF6EE" stroke="#C8A265" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="7.5" stroke="#C8A265" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
      {/* 8-pointed rosette floral star */}
      <path
        d="M 12 4.5 L 13.5 9.5 L 18.5 8 L 14.5 12 L 18.5 16 L 13.5 14.5 L 12 19.5 L 10.5 14.5 L 5.5 16 L 9.5 12 L 5.5 8 L 10.5 9.5 Z"
        fill="#8C3542"
        opacity="0.9"
      />
      <circle cx="12" cy="12" r="2.8" fill="#FDFBF7" stroke="#C8A265" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="1.3" fill="#C8A265" />
    </svg>
  );
}

export default function Events() {
  const eventsData = [
    {
      day: '27',
      monthYear: 'JANUARY 2027',
      time: '6:30 PM onwards',
      title: 'PRE-WEDDING RECEPTION',
      venue: 'Shri Umadri Mahal',
      venueFull: 'Shri Umadri Mahal, Chennai',
      description: 'An evening of celebrations, music, dance, and joyful moments with family and friends.',
      mapUrl: 'https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai',
      icon: `${ASSET_BASE}assets/event_icon_1.png`
    },
    {
      day: '28',
      monthYear: 'JANUARY 2027',
      time: '9:00 AM – 10:30 AM',
      title: 'WEDDING CEREMONY',
      venue: 'Shri Umadri Mahal',
      venueFull: 'Shri Umadri Mahal, Chennai',
      description: 'The wedding ceremony, followed by a traditional South Indian feast.',
      mapUrl: 'https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai',
      icon: `${ASSET_BASE}assets/event_icon_2.png`
    },
    {
      day: '07',
      monthYear: 'FEBRUARY 2027',
      time: '6:00 PM onwards',
      title: 'POST WEDDING RECEPTION',
      venue: 'Anand Grand Palace · Hosur, Tamil Nadu',
      venueFull: 'Anand Grand Palace, Hosur, Tamil Nadu',
      description: 'Join us for an evening of celebration, togetherness, and joyful memories as we continue the wedding celebrations with our family and friends.',
      mapUrl: 'https://maps.google.com/?q=Anand+Grand+Palace+Hosur+Tamil+Nadu',
      icon: `${ASSET_BASE}assets/event_icon_3.png`
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <AnimatedSection className="section-block events-section" id="events">
      <div className="section-container schedule-container">
        {/* 1. Header Hierarchy: Lotus + Eyebrow + Main Title + Script Subtitle + Sub-Lotus + Lead */}
        <div className="schedule-heading-cluster text-center">
          {/* Top Lotus Flanked by Delicate Hairlines */}
          <div className="schedule-header-lotus-row" aria-hidden="true">
            <span className="schedule-lotus-line" />
            <LotusOrnament width={34} height={20} id="scheduleTop" />
            <span className="schedule-lotus-line" />
          </div>

          {/* Eyebrow */}
          <p className="schedule-eyebrow">
            <span className="eyebrow-wing">⤚</span>
            A CELEBRATION OF TRADITION, LOVE &amp; FAMILY
            <span className="eyebrow-wing">⤙</span>
          </p>

          {/* Main Title */}
          <h2 className="schedule-main-title">SCHEDULE OF EVENTS</h2>

          {/* Script Accent */}
          <span className="schedule-script-subtitle">auspicious celebrations</span>

          {/* Sub Lotus */}
          <div className="schedule-mid-lotus" aria-hidden="true">
            <LotusOrnament width={28} height={17} id="scheduleMid" />
          </div>

          {/* Lead Text */}
          <p className="schedule-lead-text">
            Join us for every special milestone of our wedding journey.
          </p>

          {/* Primary Venue Announcement Chip (Clickable Google Maps link) */}
          <motion.a
            href="https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai"
            target="_blank"
            rel="noreferrer"
            className="schedule-primary-venue-pill"
            aria-label="View Shri Umadri Mahal on Google Maps"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="pill-flower-accent pill-flower-left" aria-hidden="true">
              <img src={`${ASSET_BASE}assets/card-corner-floral.png`} alt="" />
            </span>
            <MapPin size={13} className="venue-pill-pin" />
            <span className="venue-pill-title">SHRI UMADRI MAHAL</span>
            <span className="venue-pill-sep">·</span>
            <MapPin size={13} className="venue-pill-pin" />
            <span className="venue-pill-loc">CHENNAI, TAMIL NADU</span>
            <span className="pill-flower-accent pill-flower-right" aria-hidden="true">
              <img src={`${ASSET_BASE}assets/card-corner-floral.png`} alt="" />
            </span>
          </motion.a>
        </div>

        {/* 2. Timeline Architecture: Left Dates + Center Spine + Right Horizontal Stationery Cards */}
        <motion.div
          className="schedule-timeline-layout"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {/* Continuous Gold Spine Line */}
          <div className="schedule-timeline-spine" aria-hidden="true" />

          {eventsData.map((evt, idx) => (
            <React.Fragment key={idx}>
              <motion.article className="schedule-event-row" variants={itemVariants}>
                {/* LEFT: Date & Time Pod */}
                <div className="schedule-date-pod">
                  <span className="schedule-date-day">{evt.day}</span>
                  <span className="schedule-date-month">{evt.monthYear}</span>
                  <div className="schedule-time-tag">
                    <Clock3 size={13} strokeWidth={2.2} className="time-clock-icon" />
                    <span>{evt.time}</span>
                  </div>
                </div>

                {/* CENTER: Timeline Rosette Marker Node */}
                <div className="schedule-marker-axis" aria-hidden="true">
                  <TimelineRosetteNode />
                </div>

                {/* RIGHT: Horizontal Stationery Card */}
                <div className="schedule-stationery-card">
                  {/* 4 Delicate Botanical Watercolor Corner Accents */}
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="card-corner-floral corner-tl"
                    aria-hidden="true"
                  />
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="card-corner-floral corner-tr"
                    aria-hidden="true"
                  />
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="card-corner-floral corner-bl"
                    aria-hidden="true"
                  />
                  <img
                    src={`${ASSET_BASE}assets/card-corner-floral.png`}
                    alt=""
                    className="card-corner-floral corner-br"
                    aria-hidden="true"
                  />

                  {/* Inner Gold Hairline Frame */}
                  <div className="card-inner-frame" aria-hidden="true" />

                  {/* Horizontal Card Content: Left Illustration + Right Content Stack */}
                  <div className="schedule-card-body">
                    {/* Left Event Illustration */}
                    <div className="schedule-card-artwork">
                      <img src={evt.icon} alt="" className="event-illustration-img" />
                    </div>

                    {/* Right Content Stack */}
                    <div className="schedule-card-content">
                      <div className="schedule-card-header-row">
                        <h3 className="schedule-card-title">{evt.title}</h3>
                        <a
                          href={evt.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="schedule-card-venue-link"
                          aria-label={`View ${evt.venue} on Google Maps`}
                        >
                          <MapPin size={13} strokeWidth={2.2} className="card-venue-pin" />
                          <span>{evt.venue}</span>
                        </a>
                      </div>

                      <p className="schedule-card-description">“{evt.description}”</p>

                      <div className="schedule-card-action-row">
                        <a
                          href={evt.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="schedule-directions-btn"
                          aria-label={`Get directions to ${evt.title} on Google Maps`}
                        >
                          <span>GET DIRECTIONS</span>
                          <ArrowUpRight size={13} strokeWidth={2.4} className="directions-arrow-icon" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* Rosette divider between date entries on the left */}
              {idx < eventsData.length - 1 && (
                <div className="schedule-inter-date-divider" aria-hidden="true">
                  <span className="inter-date-rosette">✽ ❖ ✽</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* 3. Bottom Tagline: Flanked by Gold Rosettes & Lotus Finial */}
        <div className="schedule-bottom-cluster text-center">
          <div className="schedule-tagline-row">
            <span className="tagline-flourish-symbol" aria-hidden="true">❖</span>
            <p className="schedule-script-tagline">
              Together forever in love and destiny
            </p>
            <span className="tagline-flourish-symbol" aria-hidden="true">❖</span>
          </div>

          <div className="schedule-bottom-lotus-row" aria-hidden="true">
            <span className="schedule-bottom-line" />
            <LotusOrnament width={30} height={18} id="scheduleBottom" />
            <span className="schedule-bottom-line" />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
