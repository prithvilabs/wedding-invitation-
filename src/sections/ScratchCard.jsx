import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock3, CalendarDays } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import FlowerConfetti from '../components/invitation/FlowerConfetti';
import coverPlaqueSrc from '../assets/scratch_gold_card_cover.png';
import handArrowSrc from '../assets/scratch_swipe_hand_arrow.png';

export default function ScratchCard() {
  const canvasRef = useRef(null);
  const cardBoxRef = useRef(null);
  const coverImageRef = useRef(null);
  const [scratchState, setScratchState] = useState('idle'); // 'idle' | 'scratching' | 'revealed'
  const scratchStateRef = useRef(scratchState);
  scratchStateRef.current = scratchState;
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef(null);
  const lastPercentCheckRef = useRef(0);
  const isRevealed = scratchState === 'revealed';

  // Trigger celebration flower confetti when revealed
  useEffect(() => {
    if (isRevealed) {
      if (cardBoxRef.current) {
        const rect = cardBoxRef.current.getBoundingClientRect();
        setConfettiOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
      setShowConfetti(true);
    }
  }, [isRevealed]);

  // Preload golden cover plaque image
  useEffect(() => {
    const img = new Image();
    img.src = coverPlaqueSrc;
    img.onload = () => {
      coverImageRef.current = img;
      if (scratchStateRef.current === 'idle') {
        initCanvas();
      }
    };
  }, []);

  // Initialize Canvas with exact reference golden cover plaque
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const container = cardBoxRef.current || canvas.parentElement;
    const width = container ? container.offsetWidth : (canvas.offsetWidth || 677);
    const height = container ? container.offsetHeight : (canvas.offsetHeight || 266);
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    if (width === 0 || height === 0) {
      requestAnimationFrame(initCanvas);
      return;
    }

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.scale(dpr, dpr);

    if (coverImageRef.current && coverImageRef.current.complete) {
      ctx.drawImage(coverImageRef.current, 0, 0, width, height);
    } else {
      const tempImg = new Image();
      tempImg.src = coverPlaqueSrc;
      tempImg.onload = () => {
        coverImageRef.current = tempImg;
        if (scratchStateRef.current === 'idle' && canvasRef.current) {
          const freshCtx = canvasRef.current.getContext('2d', { willReadFrequently: true });
          if (freshCtx) {
            freshCtx.drawImage(tempImg, 0, 0, width, height);
          }
        }
      };
    }
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      if (scratchStateRef.current === 'idle') {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Scratch Drawing & 38% Threshold Check (Unified Pointer & Touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const getPos = (e) => {
      const b = canvas.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      return {
        x: clientX - b.left,
        y: clientY - b.top,
      };
    };

    const scratch = (pos) => {
      if (scratchStateRef.current === 'revealed') return;
      ctx.globalCompositeOperation = 'destination-out';

      if (lastPosRef.current) {
        ctx.lineWidth = 58;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 29, 0, Math.PI * 2);
        ctx.fill();
      }

      lastPosRef.current = pos;

      if (scratchStateRef.current === 'idle') {
        setScratchState('scratching');
      }
    };

    const checkRevealedPercentage = (isEnding = false) => {
      if (scratchStateRef.current === 'revealed') return;
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let transparentCount = 0;
        const total = pixels.length / 4;
        const sampleStep = 24;

        for (let i = 3; i < pixels.length; i += sampleStep * 4) {
          if (pixels[i] === 0) transparentCount++;
        }

        const pct = Math.min(100, Math.round((transparentCount / (total / sampleStep)) * 100));

        // Responsive threshold: Reveal once 38% scratched, or 25% on pointer up/release
        if (pct >= 38 || (isEnding && pct >= 25)) {
          setScratchState('revealed');
        }
      } catch (err) {}
    };

    // Unified Pointer Events for Desktop
    const handlePointerDown = (e) => {
      if (scratchStateRef.current === 'revealed') return;
      isDrawingRef.current = true;
      try {
        if (e.currentTarget.setPointerCapture) {
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      } catch (err) {}
      const pos = getPos(e);
      lastPosRef.current = pos;
      scratch(pos);
    };

    const handlePointerMove = (e) => {
      if (!isDrawingRef.current || scratchStateRef.current === 'revealed') return;
      e.preventDefault();
      scratch(getPos(e));

      const now = Date.now();
      if (now - lastPercentCheckRef.current > 80) {
        lastPercentCheckRef.current = now;
        checkRevealedPercentage(false);
      }
    };

    const handlePointerUp = (e) => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        lastPosRef.current = null;
        try {
          if (e.currentTarget.releasePointerCapture) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
        checkRevealedPercentage(true);
      }
    };

    // Native Touch Event Listeners for smooth mobile swipe without page scroll
    const handleTouchStart = (e) => {
      if (scratchStateRef.current === 'revealed') return;
      isDrawingRef.current = true;
      const pos = getPos(e);
      lastPosRef.current = pos;
      scratch(pos);
    };

    const handleTouchMove = (e) => {
      if (!isDrawingRef.current || scratchStateRef.current === 'revealed') return;
      e.preventDefault();
      scratch(getPos(e));

      const now = Date.now();
      if (now - lastPercentCheckRef.current > 80) {
        lastPercentCheckRef.current = now;
        checkRevealedPercentage(false);
      }
    };

    const handleTouchEnd = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        lastPosRef.current = null;
        checkRevealedPercentage(true);
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <AnimatedSection className="section-block muhurtham-floating-section" id="scratchSection">
      {/* Full-screen celebratory flower confetti burst on reveal */}
      <FlowerConfetti
        active={showConfetti}
        origin={confettiOrigin}
        onComplete={() => setShowConfetti(false)}
      />

      <div className="muhurtham-floating-container text-center">
        {/* 1. Top Rosette Line Divider Matching Reference */}
        <div className="std-top-rosette-line" aria-hidden="true">
          <span className="std-line-segment" />
          <span className="std-node-dot" />
          <svg className="std-center-rosette" viewBox="0 0 24 24" fill="none">
            <g fill="#B88A42">
              <path d="M 12 2 C 12.5 5.5, 13 7.5, 15.5 7.5 C 13 7.5, 12.5 9.5, 12 13 C 11.5 9.5, 11 7.5, 8.5 7.5 C 11 7.5, 11.5 5.5, 12 2 Z" />
              <path d="M 12 22 C 12.5 18.5, 13 16.5, 15.5 16.5 C 13 16.5, 12.5 14.5, 12 11 C 11.5 14.5, 11 16.5, 8.5 16.5 C 11 16.5, 11.5 18.5, 12 22 Z" />
              <path d="M 2 12 C 5.5 12.5, 7.5 13, 7.5 15.5 C 7.5 13, 9.5 12.5, 13 12 C 9.5 11.5, 7.5 11, 7.5 8.5 C 7.5 11, 5.5 11.5, 2 12 Z" />
              <path d="M 22 12 C 18.5 12.5, 16.5 13, 16.5 15.5 C 16.5 13, 14.5 12.5, 11 12 C 14.5 11.5, 16.5 11, 16.5 8.5 C 16.5 11, 18.5 11.5, 22 12 Z" />
              <circle cx="12" cy="12" r="2" fill="#FAF1DE" stroke="#B88A42" strokeWidth="0.8" />
            </g>
          </svg>
          <span className="std-node-dot" />
          <span className="std-line-segment" />
        </div>

        {/* 2. SAVE THE DATE Heading Row with Flanking Gold Lines */}
        <div className="std-title-row">
          <span className="std-flank-line" aria-hidden="true" />
          <h2 className="std-main-heading">SAVE THE DATE</h2>
          <span className="std-flank-line" aria-hidden="true" />
        </div>

        {/* 3. Subtitle Text */}
        <p className="std-subtitle-text">
          A new chapter begins, and we would be honoured to have you with us as we step into forever.
        </p>

        {/* Accessible announcement for Screen Readers */}
        <div className="sr-only" aria-live="polite">
          Save the Date: Thursday, 28th January 2027. Subha Muhurtham: 9:00 AM – 10:30 AM at Shri Umadri Mahal, Chennai.
        </div>

        {/* 4. Exact Golden Scratch-to-Reveal Card Plaque */}
        <motion.div
          className="luxury-scratch-card-wrapper"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="luxury-stationery-card" ref={cardBoxRef}>
            {/* Underlying Revealed Invitation Parchment Layer */}
            <div className="luxury-revealed-parchment" id="scratchRevealedLayer">
              <div className="parchment-inner-border">
                {/* 4 Corner Botanical Flourishes */}
                <div className="card-corner-flourish corner-tl" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <g fill="#A66816">
                      <path d="M 6 6 C 14 10, 18 16, 22 22 C 16 18, 10 14, 6 6 Z" />
                      <path d="M 22 22 C 25 25, 27 28, 28 30 C 26 29, 23 27, 20 24 Z" />
                      <path d="M 12 8 C 18 8, 24 11, 26 13 C 22 14, 16 13, 12 8 Z" />
                      <path d="M 8 12 C 8 18, 11 24, 13 26 C 14 22, 13 16, 8 12 Z" />
                      <path d="M 25 10 C 28 8, 32 9, 34 11 C 31 12, 28 13, 25 10 Z" />
                      <path d="M 10 25 C 8 28, 9 32, 11 34 C 12 31, 13 28, 10 25 Z" />
                    </g>
                  </svg>
                </div>
                <div className="card-corner-flourish corner-tr" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <g fill="#A66816">
                      <path d="M 6 6 C 14 10, 18 16, 22 22 C 16 18, 10 14, 6 6 Z" />
                      <path d="M 22 22 C 25 25, 27 28, 28 30 C 26 29, 23 27, 20 24 Z" />
                      <path d="M 12 8 C 18 8, 24 11, 26 13 C 22 14, 16 13, 12 8 Z" />
                      <path d="M 8 12 C 8 18, 11 24, 13 26 C 14 22, 13 16, 8 12 Z" />
                      <path d="M 25 10 C 28 8, 32 9, 34 11 C 31 12, 28 13, 25 10 Z" />
                      <path d="M 10 25 C 8 28, 9 32, 11 34 C 12 31, 13 28, 10 25 Z" />
                    </g>
                  </svg>
                </div>
                <div className="card-corner-flourish corner-bl" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <g fill="#A66816">
                      <path d="M 6 6 C 14 10, 18 16, 22 22 C 16 18, 10 14, 6 6 Z" />
                      <path d="M 22 22 C 25 25, 27 28, 28 30 C 26 29, 23 27, 20 24 Z" />
                      <path d="M 12 8 C 18 8, 24 11, 26 13 C 22 14, 16 13, 12 8 Z" />
                      <path d="M 8 12 C 8 18, 11 24, 13 26 C 14 22, 13 16, 8 12 Z" />
                      <path d="M 25 10 C 28 8, 32 9, 34 11 C 31 12, 28 13, 25 10 Z" />
                      <path d="M 10 25 C 8 28, 9 32, 11 34 C 12 31, 13 28, 10 25 Z" />
                    </g>
                  </svg>
                </div>
                <div className="card-corner-flourish corner-br" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <g fill="#A66816">
                      <path d="M 6 6 C 14 10, 18 16, 22 22 C 16 18, 10 14, 6 6 Z" />
                      <path d="M 22 22 C 25 25, 27 28, 28 30 C 26 29, 23 27, 20 24 Z" />
                      <path d="M 12 8 C 18 8, 24 11, 26 13 C 22 14, 16 13, 12 8 Z" />
                      <path d="M 8 12 C 8 18, 11 24, 13 26 C 14 22, 13 16, 8 12 Z" />
                      <path d="M 25 10 C 28 8, 32 9, 34 11 C 31 12, 28 13, 25 10 Z" />
                      <path d="M 10 25 C 8 28, 9 32, 11 34 C 12 31, 13 28, 10 25 Z" />
                    </g>
                  </svg>
                </div>

                <motion.div
                  className="parchment-content-stack"
                  initial={{ opacity: 0.9, scale: 0.98, y: 4 }}
                  animate={isRevealed ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                  } : {
                    opacity: 0.9,
                    scale: 0.98,
                    y: 4
                  }}
                >
                  <div className="revealed-header-badge">
                    <CalendarDays size={13} strokeWidth={1.75} className="revealed-badge-icon" />
                    <span>SUBHA MUHURTHAM</span>
                  </div>

                  <h3 className="revealed-main-date">
                    Thursday, 28th January 2027
                  </h3>

                  <div className="revealed-muhurtham-row">
                    <Clock3 size={14} strokeWidth={1.75} className="revealed-clock-icon" />
                    <span>9:00 AM – 10:30 AM</span>
                  </div>

                  <div className="revealed-venue-row">
                    <MapPin size={14} strokeWidth={1.75} className="revealed-map-icon" />
                    <span>Shri Umadri Mahal, Chennai</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Interactive Gold Plaque Scratch Canvas */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.canvas
                  ref={canvasRef}
                  id="scratchCanvas"
                  className="luxury-scratch-canvas"
                  aria-label="Interactive champagne-gold scratch surface. Swipe or drag to reveal wedding date and venue."
                  initial={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
                  }}
                />
              )}
            </AnimatePresence>

            {/* Subtle Animated Swipe Indicator Hand + Curved Arrow (Fades out when scratching begins) */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.div
                  className="scratch-swipe-indicator"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: scratchState === 'idle' ? 1 : 0,
                    transition: { duration: 0.3 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  aria-hidden="true"
                >
                  <motion.div
                    className="scratch-swipe-hand-cluster"
                    animate={
                      scratchState === 'idle'
                        ? { x: [-7, 7, -7] }
                        : { x: 0 }
                    }
                    transition={{
                      repeat: scratchState === 'idle' ? Infinity : 0,
                      duration: 1.8,
                      ease: 'easeInOut',
                    }}
                  >
                    <img
                      src={handArrowSrc}
                      alt=""
                      className="scratch-swipe-hand-img"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. Bottom Thank-You Message with Flanking Gold Lines */}
          <div className="std-bottom-message-row">
            <span className="std-bottom-line" aria-hidden="true" />
            <p className="std-bottom-message">
              Thank you for being an irreplaceable part of our journey.
            </p>
            <span className="std-bottom-line" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
