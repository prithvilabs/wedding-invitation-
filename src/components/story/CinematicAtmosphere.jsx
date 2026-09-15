import React from 'react';
import { motion, useTransform } from 'framer-motion';

export default function CinematicAtmosphere({ scrollProgress }) {
  // Sky lighting & night transitions:
  // 0.0 - 0.55: India & Domestic Flights (Warm Parchment Sunrise / Daylight)
  // 0.55 - 0.78: Transatlantic Ocean Flight to Boston (Deep Night Sky & Celestial Stars)
  // 0.78 - 0.88: USA Reunion & Family Blessings (Golden Hour Dawn)
  // 0.88 - 1.00: Sacred Wedding Climax (Temple Gold Radiance & Rising Particles)
  const skyOverlayOpacity = useTransform(
    scrollProgress,
    [0, 0.52, 0.62, 0.74, 0.82, 0.88, 1],
    [0, 0, 0.94, 0.96, 0.1, 0, 0.35]
  );

  const starfieldOpacity = useTransform(
    scrollProgress,
    [0.55, 0.63, 0.74, 0.80],
    [0, 0.95, 0.95, 0]
  );

  const goldParticlesOpacity = useTransform(
    scrollProgress,
    [0.85, 0.92, 1],
    [0, 0.85, 1]
  );

  return (
    <div className="cinematic-atmosphere-layer" aria-hidden="true">
      {/* 1. Transatlantic Twilight Ocean/Night Sky Veil */}
      <motion.div
        className="transatlantic-night-sky"
        style={{ opacity: skyOverlayOpacity }}
      >
        {/* Subtle Starfield */}
        <motion.div className="celestial-stars-grid" style={{ opacity: starfieldOpacity }}>
          <span className="star s1" style={{ top: '10%', left: '16%' }} />
          <span className="star s2" style={{ top: '22%', left: '40%' }} />
          <span className="star s3" style={{ top: '14%', left: '78%' }} />
          <span className="star s4" style={{ top: '35%', left: '26%' }} />
          <span className="star s5" style={{ top: '46%', left: '88%' }} />
          <span className="star s6" style={{ top: '60%', left: '14%' }} />
          <span className="star s7" style={{ top: '72%', left: '66%' }} />
          <span className="star s8" style={{ top: '80%', left: '36%' }} />
          <span className="star s9" style={{ top: '28%', left: '60%' }} />
          <span className="star s10" style={{ top: '68%', left: '82%' }} />
        </motion.div>
      </motion.div>

      {/* 2. Finale Rising Gold Dust Particles (Sacred Wedding Dissolve) */}
      <motion.div
        className="finale-gold-radiance"
        style={{ opacity: goldParticlesOpacity }}
      >
        <span className="gold-particle gp1" />
        <span className="gold-particle gp2" />
        <span className="gold-particle gp3" />
        <span className="gold-particle gp4" />
        <span className="gold-particle gp5" />
      </motion.div>

      {/* 3. Subtle Film Grain Texture Overlay */}
      <div className="cinematic-film-grain" />

      {/* 4. Lens Vignette */}
      <div className="cinematic-lens-vignette" />
    </div>
  );
}
