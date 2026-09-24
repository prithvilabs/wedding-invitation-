import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicProvider } from './context/MusicContext';
import EnvelopeFlapScene from './scenes/EnvelopeFlapScene';
import StaticBackground from './components/invitation/StaticBackground';
import FloatingRosePetals from './components/invitation/FloatingRosePetals';
import ContinuousRosePetalCascade from './components/invitation/ContinuousRosePetalCascade';
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
  const [sessionKey, setSessionKey] = useState(0);
  const [entranceOpened, setEntranceOpened] = useState(false);
  const [petalCascadeActive, setPetalCascadeActive] = useState(false);

  const handleEntranceComplete = () => {
    setEntranceOpened(true);
  };

  const handleTriggerCascade = () => {
    setPetalCascadeActive(true);
  };

  return (
    <div className="wedding-app-root">
      {/* 1. Cinematic 3D Envelope Flap Opening Experience */}
      <EnvelopeFlapScene
        key={`envelope-flap-${sessionKey}`}
        onComplete={handleEntranceComplete}
        onTriggerCascade={handleTriggerCascade}
      />

      {/* 2. Unified Continuous Rose Petal Cascade (Falls across entrance & persists over main site) */}
      <ContinuousRosePetalCascade active={petalCascadeActive} />

      {/* 3. Persistent Background Artwork Layer with progressive veil reveal */}
      <StaticBackground sessionKey={sessionKey} />

      {/* Ambient Rose Petal Animation */}
      <FloatingRosePetals />

      {/* 4. Top Navigation Bar (Visible after entrance completes) */}
      <Navigation isVisible={entranceOpened} />

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
