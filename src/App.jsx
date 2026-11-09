import React, { useEffect, useRef, useState } from 'react';
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
import CurtainOpening from './components/opening/CurtainOpening';

// The opening plays once per visit (per browser tab session).
const OPENING_SEEN_KEY = 'prh-invitation-opened';

function hasSeenOpening() {
  try {
    return window.sessionStorage.getItem(OPENING_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markOpeningSeen() {
  try {
    window.sessionStorage.setItem(OPENING_SEEN_KEY, '1');
  } catch {
    // Storage unavailable (private mode etc.): the opening simply shows again next load.
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function WeddingApp() {
  const { playMusic } = useMusic();
  // Curtains play once per visit, and never for reduced-motion users
  const [showCurtains, setShowCurtains] = useState(() => !hasSeenOpening() && !prefersReducedMotion());
  // Camera push after the curtains: 'held' (waiting behind them) -> 'zoom' -> 'none'
  const [entrance, setEntrance] = useState(() => (showCurtains ? 'held' : 'none'));

  useEffect(() => {
    if (!showCurtains) return;
    // Always reveal the hero, not a scroll position restored from a previous load
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, [showCurtains]);

  // Music starts on the visitor's first touch/click: the curtain touch when the
  // curtains are shown, otherwise the first touch/click anywhere on the page.
  const musicStartedRef = useRef(false);
  const startMusic = () => {
    if (musicStartedRef.current) return;
    musicStartedRef.current = true;
    playMusic();
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      // Already started by the curtains: don't fight a later pause on the music player
      if (musicStartedRef.current) return;
      musicStartedRef.current = true;
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
    <>
      {/* The existing website is rendered from the start, behind the curtains */}
      <MainWebsite entrance={entrance} onEntered={() => setEntrance('none')} />

      {/* One-time silk curtain overlay: waits for a touch, then opens.
          Marked as seen only once actually opened. Its completion callback
          starts the camera push into the homepage. */}
      {showCurtains && (
        <CurtainOpening
          // Music starts with the touch that opens the curtains
          onOpen={startMusic}
          onDone={() => {
            markOpeningSeen();
            setShowCurtains(false);
            setEntrance('zoom');
          }}
        />
      )}
    </>
  );
}

// Post-curtain camera push: content travels forward from slightly smaller to its
// natural size. Only <main> moves; the fixed backdrop stays still (depth), and the
// fixed nav / music player / petals live outside <main>, so they're unaffected.
const ENTRANCE_FROM = 0.92;
const ENTRANCE_DURATION = 1.5;
const EASE_DOLLY = [0.22, 0.61, 0.36, 1]; // gentle start, long soft settle, no overshoot

function MainWebsite({ entrance = 'none', onEntered }) {
  // Scale around the centre of the visible viewport (main is much taller than the screen)
  const [origin] = useState(() => `50% ${Math.round(window.innerHeight / 2)}px`);

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
      <motion.main
        id="mainWebsite"
        style={entrance === 'none' ? undefined : { transformOrigin: origin }}
        initial={entrance === 'held' ? { scale: ENTRANCE_FROM } : false}
        animate={entrance === 'held' ? { scale: ENTRANCE_FROM } : { scale: 1 }}
        transition={entrance === 'zoom' ? { duration: ENTRANCE_DURATION, ease: EASE_DOLLY } : { duration: 0 }}
        onAnimationComplete={() => {
          if (entrance === 'zoom') onEntered?.();
        }}
      >
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
      </motion.main>
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
