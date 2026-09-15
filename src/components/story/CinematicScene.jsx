import React from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, Calendar, Heart, MessageSquare, Send, Sparkles, CheckCheck } from 'lucide-react';
import StoryPhoto from './StoryPhoto';

export default function CinematicScene({
  chapter,
  index,
  isActive = false,
  isLeftAligned = true,
  nightMode = false
}) {
  return (
    <div
      className={`cinematic-story-scene chapter-${index + 1} ${
        isLeftAligned ? 'align-left' : 'align-right'
      } ${isActive ? 'scene-is-active' : ''} ${nightMode ? 'scene-night-mode' : ''}`}
      id={`story-chapter-${index + 1}`}
    >
      {/* 1. Giant Watermarked Year / Keyword in Background */}
      <motion.div
        className="scene-watermark-year"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        whileInView={{ opacity: 0.09, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span>{chapter.watermarkYear || chapter.year}</span>
      </motion.div>

      {/* 2. Route Waypoint Beacon & Telemetry Tag */}
      <div className="scene-beacon-anchor" aria-hidden="true">
        <motion.div
          className="scene-beacon-pulse-ring"
          animate={{
            scale: isActive ? [1, 1.35, 1] : 1,
            opacity: isActive ? [0.75, 1, 0.75] : 0.45
          }}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
        >
          <div className="scene-beacon-inner-dot" />
        </motion.div>
        <span className="scene-telemetry-badge">{chapter.coordinates || chapter.year}</span>
      </div>

      {/* 3. Editorial Story Narrative Column */}
      <motion.div
        className="scene-narrative-card"
        initial={{ opacity: 0, x: isLeftAligned ? -35 : 35, y: 25 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="scene-herald-strip">
          <span className="scene-chapter-tag">{chapter.chapterNum}</span>
          <div className="scene-location-pill">
            <Compass size={12} strokeWidth={2} className="scene-compass-icon" />
            <span>{chapter.location}</span>
          </div>
        </div>

        <span className="scene-date-lead">{chapter.date}</span>
        <h3 className="scene-film-title">{chapter.title}</h3>
        <p className="scene-film-prose">{chapter.desc}</p>

        {chapter.secondaryDesc && (
          <p className="scene-film-secondary-prose">{chapter.secondaryDesc}</p>
        )}

        {/* Custom Interactive Elements Per Chapter */}

        {/* Chapter II: Vintage Minimal Instagram Message Interaction */}
        {chapter.isChatMemory && (
          <motion.div
            className="instagram-memory-box"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="instagram-memory-header">
              <span className="instagram-handle">@prithvi · @harshini</span>
              <span className="instagram-status">Direct Message · 2022</span>
            </div>

            <div className="chat-bubble-stream">
              <div className="chat-bubble sent">
                <span>Hi</span>
                <CheckCheck size={12} className="chat-check" />
              </div>
              <div className="chat-bubble received">
                <span>Hi</span>
                <Heart size={11} className="chat-heart-reaction" />
              </div>
            </div>

            <div className="chat-dissolve-caption">
              <span>And so the conversations began...</span>
            </div>
          </motion.div>
        )}

        {/* Chapter IV: Multiple Travel Stamps & Playful Badge */}
        {chapter.isMultiVisit && (
          <div className="multi-visit-stamps-row">
            <span className="visit-stamp-tag">VISIT #01 · BLR</span>
            <span className="visit-stamp-tag">VISIT #02 · MAA</span>
            <span className="visit-stamp-tag">VISIT #03 · BLR</span>
            <div className="convincing-story-seal">
              <span>"PERFECTLY CONVINCING STORY"</span>
            </div>
          </div>
        )}

        {/* Chapter V: Long Distance LDRRR Callout */}
        {chapter.isLDR && (
          <div className="ldrrr-editorial-badge">
            <span className="ldrrr-code">LDRRR</span>
            <span className="ldrrr-distance">8,000 MILES · 10.5 HR TIME DIFFERENCE</span>
          </div>
        )}

        {/* Chapter VI: Family Blessings Seal & Converging Points */}
        {chapter.isFamilyBlessings && (
          <div className="family-blessings-seal-wrap">
            <div className="converging-nodes-pill">
              <span className="node-city">BANGALORE</span>
              <span className="node-connect-line" />
              <Heart size={13} className="node-heart-icon" />
              <span className="node-connect-line" />
              <span className="node-city">BOSTON</span>
            </div>
            <div className="blessings-royal-seal">
              <Sparkles size={13} className="seal-sparkle-icon" />
              <span>WITH LOVE &amp; BLESSINGS</span>
              <Sparkles size={13} className="seal-sparkle-icon" />
            </div>
          </div>
        )}

        {/* Quote Block */}
        {chapter.quote && (
          <blockquote className="scene-film-quote">
            "{chapter.quote}"
          </blockquote>
        )}
      </motion.div>

      {/* 4. Physical Framed Travel Photograph */}
      <div className="scene-photo-stage">
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
