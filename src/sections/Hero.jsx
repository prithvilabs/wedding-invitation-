import React from 'react';
import WeddingNames from '../components/invitation/WeddingNames';

export default function Hero({ onExplore, onReplay }) {
  return (
    <section className="hero-stage" id="hero">
      <WeddingNames onExplore={onExplore} onReplay={onReplay} />
    </section>
  );
}
