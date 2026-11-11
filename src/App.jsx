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

// The curtains play on every load, refresh and revisit: no stored "seen" state.
// Always start at the top, not at a scroll position restored from a previous load.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function WeddingApp() {
  const { playMusic, pauseMusic } = useMusic();
  // Curtains play on every page load (skipped only for reduced-motion users)
  const [showCurtains, setShowCurtains] = useState(() => !prefersReducedMotion());
  const [curtainKey, setCurtainKey] = useState(0);
  // Camera push after the curtains: 'held' (waiting behind them) -> 'zoom' -> 'none'
  const [entrance, setEntrance] = useState(() => (showCurtains ? 'held' : 'none'));

  // Music starts on the visitor's first touch/click: the curtain touch when the
  // curtains are shown, otherwise the first touch/click anywhere on the page.
  const musicStartedRef = useRef(false);

  // Mobile Safari / Chrome can restore this page from the back/forward cache
  // without reloading it. Treat that as a revisit: close the curtains again,
  // stop the music, and let the next curtain touch start it.
  useEffect(() => {
    const onPageShow = (e) => {
      if (!e.persisted || prefersReducedMotion()) return;
      pauseMusic();
      musicStartedRef.current = false;
      window.scrollTo(0, 0);
      setEntrance('held');
      setShowCurtains(true);
      setCurtainKey((k) => k + 1);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [pauseMusic]);
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
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [playMusic]);

  return (
    <>
      {/* The existing website is rendered from the start, behind the curtains */}
      <MainWebsite entrance={entrance} onEntered={() => setEntrance('none')} />

      {/* Silk curtain overlay on every load: waits for a touch, then opens.
          Its completion callback starts the camera push into the homepage. */}
      {showCurtains && (
        <CurtainOpening
          key={curtainKey}
          // Music starts with the touch that opens the curtains
          onOpen={startMusic}
          onDone={() => {
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

const MainWebsite = React.memo(function MainWebsite({ entrance = 'none', onEntered }) {
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
});

export default function App() {
  return (
    <MusicProvider>
      <WeddingApp />
    </MusicProvider>
  );
}
