import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpeningVideo from './components/invitation/OpeningVideo';
import StaticBackground from './components/invitation/StaticBackground';
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

export default function App() {
  const [sessionKey, setSessionKey] = useState(0);
  const [showVideoIntro, setShowVideoIntro] = useState(true);

  const handleVideoComplete = () => {
    setShowVideoIntro(false);
  };

  const handleEnterWebsite = () => {
    const scratchSection = document.getElementById('scratchSection');
    if (scratchSection) {
      scratchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplay = () => {
    setShowVideoIntro(true);
    setSessionKey((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="wedding-app-root">
      {/* 1. Cinematic Opening Video Intro Layer */}
      <AnimatePresence mode="wait">
        {showVideoIntro && (
          <OpeningVideo
            key={`video-intro-${sessionKey}`}
            onComplete={handleVideoComplete}
            onFallback={handleVideoComplete}
          />
        )}
      </AnimatePresence>

      {/* 2. Persistent Background Artwork Layer with progressive veil reveal */}
      <StaticBackground sessionKey={sessionKey} />

      {/* 3. Top Navigation Bar (Visible after video intro or immediately when navigating) */}
      <Navigation isVisible={!showVideoIntro} />

      {/* 4. Floating Music Controller (Mangala Vathiyam / Tambura Drone) */}
      <MusicPlayer />

      {/* 5. Main Invitation Content */}
      <main id="mainWebsite">
        {/* Hero Section (Contains Left/Right Animated Names, Weds, Crest & CTA) */}
        <Hero
          key={`hero-${sessionKey}`}
          onExplore={handleEnterWebsite}
          onReplay={handleReplay}
        />

        {/* Seamlessly Flowing Wedding Sections */}
        <motion.div
          key={`sections-${sessionKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 2.8 }}
        >
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
