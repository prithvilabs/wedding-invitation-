import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MusicProvider, useMusic } from './context/MusicContext';
import StaticBackground from './components/invitation/StaticBackground';
import FloatingRosePetals from './components/invitation/FloatingRosePetals';
import Navigation from './components/layout/Navigation';
import MusicPlayer from './components/layout/MusicPlayer';
import Hero from './sections/Hero';
import ScratchCard from './sections/ScratchCard';
import Countdown from './sections/Countdown';
import Families from './sections/Families';
import Story from './sections/Story';
import Events from './sections/Events';
import RSVP from './sections/RSVP';
import Footer from './sections/Footer';

function WeddingApp() {
  const { playMusic } = useMusic();

  // Smoothly trigger audio on first user touch/click anywhere on the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      playMusic();
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [playMusic]);

  return (
    <div className="wedding-app-root">
      {/* 1. Persistent Background Artwork Layer */}
      <StaticBackground />

      {/* 2. Romantic Ambient Falling Rose Petals */}
      <FloatingRosePetals />

      {/* 3. Top Navigation Bar (Always visible) */}
      <Navigation />

      {/* 4. Floating Music Controller (Bottom Right) */}
      <MusicPlayer />

      {/* 5. Main Invitation Content */}
      <main id="mainWebsite">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
          <ScratchCard />
          <Countdown />
          <Families />
          <Story />
          <Events />
          <RSVP />
          <Footer />
        </motion.div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <WeddingApp />
    </MusicProvider>
  );
}
