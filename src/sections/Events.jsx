import React from 'react';
import { motion } from 'framer-motion';
import { Clock3, MapPin, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';

export default function Events() {
  const eventsData = [
    {
      day: '27',
      monthYear: 'JANUARY 2027',
      fullDate: '27 JANUARY 2027',
      title: 'PRE-WEDDING RECEPTION',
      time: '6:30 PM onwards',
      venue: 'Shri Umadri Mahal',
      venueLocation: '',
      description: 'An evening of celebrations, music, dance, and joyful moments with family and friends.',
      mapUrl: 'https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai',
      isPrimaryVenue: true
    },
    {
      day: '28',
      monthYear: 'JANUARY 2027',
      fullDate: '28 JANUARY 2027',
      title: 'WEDDING CEREMONY',
      time: '9:00 AM – 10:30 AM',
      venue: 'Shri Umadri Mahal',
      venueLocation: '',
      description: 'The wedding ceremony, followed by a traditional South Indian feast.',
      mapUrl: 'https://maps.google.com/?q=Shri+Umadri+Mahal+Chennai',
      isPrimaryVenue: true,
      highlight: true
    },
    {
      day: '07',
      monthYear: 'FEBRUARY 2027',
      fullDate: '7 FEBRUARY 2027',
      title: 'GRAND WEDDING RECEPTION',
      time: '6:00 PM onwards',
      venue: 'Anand Grand Palace',
      venueLocation: 'Hosur, Tamil Nadu',
      description: 'Join us for an evening of celebration, togetherness, and joyful memories as we continue the wedding celebrations with our family and friends.',
      mapUrl: 'https://maps.google.com/?q=Anand+Grand+Palace+Hosur+Tamil+Nadu',
      isPrimaryVenue: false
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
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <AnimatedSection className="section-block events-section" id="events">
      <div className="section-container text-safe-zone schedule-editorial-shell">
        {/* Section Header */}
        <div className="editorial-heading-stack text-center">
          <p className="editorial-eyebrow">A CELEBRATION OF TRADITION, LOVE &amp; FAMILY</p>
          <h2 className="editorial-main-title">SCHEDULE OF EVENTS</h2>
          <span className="editorial-script-accent">auspicious celebrations</span>
          <div className="gold-divider-flourish" aria-hidden="true">
            <span className="flourish-line" />
            <span className="flourish-node">❈ ❖ ❈</span>
            <span className="flourish-line" />
          </div>
          <p className="editorial-lead">Join us for every special milestone of our wedding journey.</p>

          {/* Primary Venue Announcement (Introduced Once) */}
          <motion.div
            className="schedule-venue-hero-chip"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MapPin size={13} className="venue-hero-icon" />
            <span className="venue-hero-name">SHRI UMADRI MAHAL</span>
            <span className="venue-hero-sep">·</span>
            <span className="venue-hero-loc">CHENNAI, TAMIL NADU</span>
          </motion.div>
        </div>

        {/* Compact Vertical Timeline */}
        <motion.div
          className="schedule-compact-timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {/* Continuous Gold Spine Line */}
          <div className="timeline-continuous-spine" aria-hidden="true" />

          {eventsData.map((evt, idx) => (
            <motion.article
              key={idx}
              className={`timeline-entry-row ${evt.highlight ? 'entry-highlight' : ''}`}
              variants={itemVariants}
            >
              {/* Left Column: Date & Time Badge */}
              <div className="timeline-date-pod">
                <div className="timeline-date-tag">
                  <span className="date-tag-day">{evt.day}</span>
                  <span className="date-tag-month">{evt.monthYear}</span>
                </div>
                <div className="timeline-time-tag">
                  <Clock3 size={12} strokeWidth={2} className="time-icon-svg" />
                  <span>{evt.time}</span>
                </div>
              </div>

              {/* Center Column: Destination Marker Node */}
              <div className="timeline-marker-axis" aria-hidden="true">
                <div className="timeline-node-circle">
                  <span className="node-inner-dot" />
                </div>
              </div>

              {/* Right Column: Event Content Card */}
              <div className="timeline-details-card">
                <div className="timeline-details-top">
                  <h3 className="timeline-event-title">{evt.title}</h3>
                  <div className="timeline-venue-line">
                    <MapPin size={12} strokeWidth={2} className="venue-pin-svg" />
                    <span className="venue-text-primary">{evt.venue}</span>
                    {evt.venueLocation && (
                      <span className="venue-text-sub">· {evt.venueLocation}</span>
                    )}
                  </div>
                </div>

                <p className="timeline-description-text">“{evt.description}”</p>

                <div className="timeline-action-bar">
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="compact-directions-btn"
                    aria-label={`Get directions to ${evt.title} at ${evt.venue}`}
                  >
                    <span>GET DIRECTIONS</span>
                    <ArrowUpRight size={13} strokeWidth={2.2} className="directions-arrow-svg" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
