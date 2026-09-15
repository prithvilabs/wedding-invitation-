import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';

export default function StoryPhoto({
  src,
  alt,
  date,
  location,
  stamp,
  rotation = 2,
  isActive = false
}) {
  return (
    <motion.div
      className={`story-travel-photo-card ${isActive ? 'is-active-card' : ''}`}
      style={{
        '--card-rotation': `${rotation}deg`
      }}
      initial={{
        opacity: 0,
        scale: 1.08,
        rotate: rotation - 3,
        y: 40,
        filter: 'blur(8px)'
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: rotation,
        y: 0,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, rotate: 0, transition: { duration: 0.35 } }}
    >
      {/* Physical Photo White/Ivory Border Frame */}
      <div className="travel-photo-frame">
        <div className="travel-photo-inner">
          <img src={src} alt={alt} className="travel-photo-img" loading="lazy" />
          <div className="travel-photo-vignette" />
        </div>

        {/* Caption & Travel Tag on physical paper footer */}
        <div className="travel-photo-caption-strip">
          <div className="photo-location-tag">
            <MapPin size={11} strokeWidth={2} className="photo-pin-icon" />
            <span>{location}</span>
          </div>
          <div className="photo-date-stamp">
            <Calendar size={11} strokeWidth={2} className="photo-cal-icon" />
            <span>{date}</span>
          </div>
        </div>

        {/* Vintage Postal / Travel Stamp Mark */}
        {stamp && (
          <div className="vintage-postal-stamp" aria-hidden="true">
            <span className="stamp-inner-text">{stamp}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
