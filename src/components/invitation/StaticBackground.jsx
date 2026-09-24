import React from 'react';
import backdropImg from '../../assets/backdrop.png';

/**
 * StaticBackground Layer
 * Completely independent, persistent, non-moving physical background artwork layer.
 */
export default function StaticBackground() {
  return (
    <div className="wedding-persistent-bg" aria-hidden="true">
      {/* 1. Underlying Continuous Artwork with full clarity immediately */}
      <div
        className="wedding-artwork-layer"
        style={{ backgroundImage: `url(${backdropImg})` }}
      />

      {/* 2. Subtle Readability Scrim */}
      <div className="wedding-ambient-scrim" />
    </div>
  );
}
