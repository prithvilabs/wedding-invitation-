import React from 'react';
import WeddingNames from '../components/invitation/WeddingNames';

export default function Hero({ ready = true }) {
  return (
    <section className="hero-stage" id="hero">
      <WeddingNames ready={ready} />
    </section>
  );
}
