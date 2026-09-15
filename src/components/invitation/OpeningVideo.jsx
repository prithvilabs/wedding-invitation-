import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import openingVideo from '../../assets/wedding-opening.mp4';
import envelopePoster from '../../assets/envelope_frame_1.jpg';

export default function OpeningVideo({ onComplete, onFallback }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleStartPlay = () => {
    if (!videoRef.current) return;
    
    setHasStarted(true);
    setIsPlaying(true);

    try {
      videoRef.current.currentTime = 0;
    } catch (e) {
      console.warn('Could not reset currentTime:', e);
    }

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Video playback requires user gesture or muted audio:', err);
        // Retry with muted if browser autoplay policy restricts unmuted playback
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch((e) => {
            console.error('Video playback failed completely:', e);
            setVideoError(true);
            if (onFallback) onFallback();
          });
        }
      });
    }
  };

  const handleVideoEnded = () => {
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 400);
  };

  const handleError = (e) => {
    console.warn('Video failed to load, falling back to invitation:', e);
    setVideoError(true);
    if (onFallback) {
      onFallback();
    }
  };

  if (videoError) {
    return null;
  }

  return (
    <motion.div
      className="opening-video-stage fullscreen-video-stage"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        filter: 'blur(8px)',
        transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
      }}
    >
      {/* Fullscreen Video Background */}
      <div
        className={`fullscreen-video-wrapper ${!hasStarted ? 'cursor-pointer' : ''}`}
        onClick={!hasStarted ? handleStartPlay : undefined}
      >
        <video
          ref={videoRef}
          src={openingVideo}
          poster={envelopePoster}
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          onError={handleError}
          className="fullscreen-cinematic-video"
        />
      </div>

      {/* Elegant "TAP TO OPEN INVITATION" button floating over the video */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            className="fullscreen-opening-btn-dock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10, transition: { duration: 0.35 } }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              type="button"
              id="tapToOpenBtn"
              className="tap-to-open-btn fullscreen-tap-btn"
              onClick={handleStartPlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              TAP TO OPEN INVITATION
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button in top corner */}
      <motion.button
        type="button"
        className="video-skip-btn"
        onClick={handleVideoEnded}
        initial={{ opacity: 0 }}
        animate={{ opacity: hasStarted ? 0.9 : 0.65 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        aria-label="Skip opening video"
      >
        <span>Skip to Invitation</span>
        <ArrowUpRight size={14} strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}
