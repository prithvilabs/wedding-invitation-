import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';
import TempleEntranceScene from './scenes/TempleEntranceScene';
import StaticBackground from './components/invitation/StaticBackground';
import FloatingRosePetals from './components/invitation/FloatingRosePetals';
import Navigation from './components/layout/Navigation';
import MusicPlayer from './components/layout/MusicPlayer';
import ScratchCard from './sections/ScratchCard';
import Countdown from './sections/Countdown';
import Families from './sections/Families';
import Story from './sections/Story';
import Events from './sections/Events';
import RSVP from './sections/RSVP';
import Footer from './sections/Footer';

function WeddingApp() {
  const [sessionKey, setSessionKey] = useState(0);
  const [showTempleEntrance, setShowTempleEntrance] = useState(true);

  const handleEntranceComplete = () => {
    setShowTempleEntrance(false);
  };

  return (
    <div className="wedding-app-root">
      {/* 1. Scene 1 — Cinematic Temple Entrance (diya, bells, doors, golden light, reveal) */}
      <AnimatePresence mode="wait">
        {showTempleEntrance && (
          <TempleEntranceScene
            key={`temple-entrance-${sessionKey}`}
            onComplete={handleEntranceComplete}
          />
        )}
      </AnimatePresence>

      {/* 2. Persistent Background Artwork Layer with progressive veil reveal */}
      <StaticBackground sessionKey={sessionKey} />

      {/* Reusable Continuous Photorealistic Rose Petal Animation */}
      <FloatingRosePetals />

      {/* 3. Top Navigation Bar (Visible after the temple entrance completes) */}
      <Navigation isVisible={!showTempleEntrance} />

      {/* 4. Floating Music Controller (Global Audio Controller) */}
      <MusicPlayer />

      {/* 5. Main Invitation Content */}
      <main id="mainWebsite">
        {/* Seamlessly Flowing Wedding Sections */}
        <motion.div
          key={`sections-${sessionKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
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

export default function App() {
  return (
    <MusicProvider>
      <WeddingApp />
    </MusicProvider>
  );
}
