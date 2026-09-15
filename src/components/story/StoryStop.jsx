import React from 'react';
import { motion } from 'framer-motion';
import StoryPhoto from './StoryPhoto';
import { Compass } from 'lucide-react';

export default function StoryStop({
  chapter,
  index,
  isLeftAligned = true,
  isActive = false,
  progress = 0
}) {
  return (
    <div
      className={`story-stop-item ${isLeftAligned ? 'align-left' : 'align-right'} ${
        isActive ? 'is-active-stop' : ''
      }`}
      id={`story-chapter-${index + 1}`}
    >
      {/* 1. Stop Waypoint Beacon on the flight route */}
      <div className="stop-route-beacon-anchor" aria-hidden="true">
        <motion.div
          className="stop-beacon-node"
          animate={{
            scale: isActive ? [1, 1.25, 1] : 1,
            boxShadow: isActive
              ? '0 0 0 6px rgba(184, 134, 45, 0.25), 0 0 16px rgba(223, 179, 90, 0.6)'
              : '0 0 0 2px rgba(184, 134, 45, 0.3)'
          }}
          transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
        >
          <span className="beacon-core-dot" />
        </motion.div>
        <span className="stop-beacon-year-tag">{chapter.year}</span>
      </div>

      {/* 2. Editorial Narrative Column */}
      <motion.div
        className="stop-narrative-column"
        initial={{ opacity: 0, x: isLeftAligned ? -35 : 35, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="stop-header-badge-row">
          <span className="stop-chapter-number">{chapter.chapterNum}</span>
          <span className="stop-location-badge">
            <Compass size={12} strokeWidth={2} className="compass-icon" />
            <span>{chapter.location}</span>
          </span>
        </div>

        <span className="stop-date-lead">{chapter.date}</span>
        <h3 className="stop-display-title">{chapter.title}</h3>
        <p className="stop-prose-text">{chapter.desc}</p>
      </motion.div>

      {/* 3. Physical Framed Travel Photograph */}
      <div className="stop-photo-column">
        <StoryPhoto
          src={chapter.img}
          alt={chapter.alt}
          date={chapter.date}
          location={chapter.location}
          stamp={chapter.stamp}
          rotation={isLeftAligned ? 2.5 : -2.5}
          isActive={isActive}
        />
      </div>
    </div>
  );
}
