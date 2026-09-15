import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock3, CalendarDays } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';

export default function ScratchCard() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [scratchState, setScratchState] = useState('idle'); // 'idle' | 'scratching' | 'revealed'
  const [revealedPercent, setRevealedPercent] = useState(0);
  const isDrawingRef = useRef(false);
  const lastPercentCheckRef = useRef(0);
  const isRevealed = scratchState === 'revealed';

  // Initialize Canvas with layered antique gold foil texture & delicate traditional pattern
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 480;
    const height = rect.height || 250;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 1. Layered Antique Gold Foil Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#D4A843');
    goldGrad.addColorStop(0.18, '#F6DC96');
    goldGrad.addColorStop(0.42, '#B88026');
    goldGrad.addColorStop(0.68, '#F0CE7A');
    goldGrad.addColorStop(0.85, '#AD731C');
    goldGrad.addColorStop(1, '#F8E09B');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Traditional Micro-Pattern (Delicate champagne kolam dots)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.lineWidth = 1;
    for (let x = 16; x < width; x += 28) {
      for (let y = 16; y < height; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 3. Multi-layer Stationery Border Inset
    ctx.strokeStyle = 'rgba(169, 111, 24, 0.65)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    ctx.strokeStyle = 'rgba(248, 224, 155, 0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // 4. Subtle Gold Foil Typography drawn directly on canvas (scratches away naturally)
    ctx.fillStyle = '#3E0811';
    ctx.font = 'bold 13px "Cinzel", "DM Sans", serif';
    ctx.textAlign = 'center';
    ctx.fillText('SWIPE OR DRAG TO REVEAL', width / 2, height / 2 - 6);

    ctx.fillStyle = '#6E1D28';
    ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Touch / drag across to unveil our Muhurtham', width / 2, height / 2 + 15);
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      if (scratchState !== 'revealed') {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, scratchState]);

  // Scratch Drawing & 50% Threshold Check
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
        y: clientY - b.top
      };
    };

    const scratch = (pos) => {
      if (scratchState === 'revealed') return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 32, 0, Math.PI * 2);
      ctx.fill();

      if (scratchState === 'idle') {
        setScratchState('scratching');
      }
    };

    const checkRevealedPercentage = () => {
      if (scratchState === 'revealed') return;
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let transparentCount = 0;
        const total = pixels.length / 4;
        const sampleStep = 16;
        
        for (let i = 3; i < pixels.length; i += sampleStep * 4) {
          if (pixels[i] === 0) transparentCount++;
        }
        
        const pct = Math.min(100, Math.round((transparentCount / (total / sampleStep)) * 100));
        setRevealedPercent(pct);

        // HALF SCRATCH THRESHOLD: Trigger full reveal once ~50% is scratched
        if (pct >= 48) {
          setScratchState('revealed');
        }
      } catch (err) {}
    };

    // Unified Pointer Events for Desktop & Mobile
    const handlePointerDown = (e) => {
      if (scratchState === 'revealed') return;
      isDrawingRef.current = true;
      try {
        if (e.currentTarget.setPointerCapture) {
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      } catch (err) {}
      scratch(getPos(e));
    };

    const handlePointerMove = (e) => {
      if (!isDrawingRef.current || scratchState === 'revealed') return;
      e.preventDefault();
      scratch(getPos(e));

      // Throttled percent check
      const now = Date.now();
      if (now - lastPercentCheckRef.current > 90) {
        lastPercentCheckRef.current = now;
        checkRevealedPercentage();
      }
    };

    const handlePointerUp = (e) => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        try {
          if (e.currentTarget.releasePointerCapture) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
        checkRevealedPercentage();
      }
    };

    // Native Touch Event Listeners for smooth mobile swipe without page scroll
    const handleTouchStart = (e) => {
      if (scratchState === 'revealed') return;
      isDrawingRef.current = true;
      scratch(getPos(e));
    };

    const handleTouchMove = (e) => {
      if (!isDrawingRef.current || scratchState === 'revealed') return;
      e.preventDefault();
      scratch(getPos(e));

      const now = Date.now();
      if (now - lastPercentCheckRef.current > 90) {
        lastPercentCheckRef.current = now;
        checkRevealedPercentage();
      }
    };

    const handleTouchEnd = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        checkRevealedPercentage();
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
  }, [scratchState]);

  return (
    <AnimatedSection className="section-block muhurtham-floating-section" id="scratchSection">
      <div className="muhurtham-floating-container text-center">
        {/* Editorial Heading Stack */}
        <div className="muhurtham-heading-stack">
          <h2 className="muhurtham-display-title">SAVE THE DATE</h2>
          
          <div className="muhurtham-divider-flourish" aria-hidden="true">
            <span className="muhurtham-flourish-line" />
            <span className="muhurtham-flourish-node">❈ ❖ ❈</span>
            <span className="muhurtham-flourish-line" />
          </div>
          
          <p className="muhurtham-instruction-text">
            Drag or swipe across the golden stationery surface to unveil our auspicious Muhurtham
          </p>
        </div>

        {/* Accessible announcement for Screen Readers */}
        <div className="sr-only" aria-live="polite">
          Save the Date: Thursday, 28th January 2027. Subha Muhurtham: 9:00 AM – 10:30 AM at Shri Umadri Mahal, Chennai.
        </div>

        {/* Premium Luxury Gold Foil Stationery Card Object */}
        <motion.div
          ref={containerRef}
          className="luxury-scratch-card-wrapper"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.012 }}
        >
          <div className="luxury-stationery-card">
            {/* 1. Underlying Revealed Invitation Parchment Layer */}
            <div className="luxury-revealed-parchment" id="scratchRevealedLayer">
              <div className="parchment-inner-border">
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
                    <span>SAVE THE DATE</span>
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

            {/* 2. Interactive Gold Foil Canvas Surface with Framer Motion 50% Threshold Fade */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.canvas
                  ref={canvasRef}
                  id="scratchCanvas"
                  className="luxury-scratch-canvas"
                  aria-label="Interactive gold foil scratch surface. Swipe or drag to reveal wedding date and venue."
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 1.01,
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
                  }}
                />
              )}
            </AnimatePresence>

            {/* 3. Subtle Moving Foil Light Shimmer */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.div
                  className="foil-light-sheen"
                  initial={{ x: '-120%' }}
                  animate={{ x: '120%' }}
                  exit={{ opacity: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: 'linear',
                    repeatDelay: 1.5
                  }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
          </div>

          <p className="muhurtham-supporting-message">
            Thank you for being an irreplaceable part of our journey.
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

