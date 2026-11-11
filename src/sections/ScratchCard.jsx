import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock3 } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import FlowerConfetti from '../components/invitation/FlowerConfetti';
import coverPlaqueSrc from '../assets/scratch_blush_card_cover.png';

export default function ScratchCard() {
  const canvasRef = useRef(null);
  const cardBoxRef = useRef(null);
  const coverImageRef = useRef(null);
  const [scratchState, setScratchState] = useState('idle'); // 'idle' | 'scratching' | 'revealed'
  const scratchStateRef = useRef(scratchState);
  scratchStateRef.current = scratchState;
  const initialTransparentCountRef = useRef(0);
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

  // Preload blush cover plaque image
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

  // Initialize Canvas with exact reference blush cover plaque
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const container = cardBoxRef.current || canvas.parentElement;
    const rect = container ? container.getBoundingClientRect() : canvas.getBoundingClientRect();
    const width = rect.width || 706;
    const height = rect.height || 210;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    if (width === 0 || height === 0) {
      requestAnimationFrame(initCanvas);
      return;
    }

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const renderCover = (img) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        let transparentCount = 0;
        const sampleStep = 24;
        for (let i = 3; i < pixels.length; i += sampleStep * 4) {
          if (pixels[i] === 0) transparentCount++;
        }
        initialTransparentCountRef.current = transparentCount;
      } catch (err) {}
    };

    if (coverImageRef.current && coverImageRef.current.complete) {
      renderCover(coverImageRef.current);
    } else {
      const tempImg = new Image();
      tempImg.src = coverPlaqueSrc;
      tempImg.onload = () => {
        coverImageRef.current = tempImg;
        if (scratchStateRef.current === 'idle' && canvasRef.current) {
          const freshCtx = canvasRef.current.getContext('2d', { willReadFrequently: true });
          if (freshCtx) {
            freshCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            freshCtx.drawImage(tempImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
            try {
              const imgData = freshCtx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
              const pixels = imgData.data;
              let transparentCount = 0;
              const sampleStep = 24;
              for (let i = 3; i < pixels.length; i += sampleStep * 4) {
                if (pixels[i] === 0) transparentCount++;
              }
              initialTransparentCountRef.current = transparentCount;
            } catch (err) {}
          }
        }
      };
    }
  }, []);

  useEffect(() => {
    initCanvas();

    const container = cardBoxRef.current;
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        if (scratchStateRef.current === 'idle') {
          initCanvas();
        }
      });
      resizeObserver.observe(container);
    }

    const handleResize = () => {
      if (scratchStateRef.current === 'idle') {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
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
      const scaleX = canvas.width / b.width;
      const scaleY = canvas.height / b.height;
      return {
        x: (clientX - b.left) * scaleX,
        y: (clientY - b.top) * scaleY,
        scale: scaleX,
      };
    };

    const scratch = (pos) => {
      if (scratchStateRef.current === 'revealed') return;
      ctx.globalCompositeOperation = 'destination-out';
      const brushRadius = 28 * (pos.scale || 1);

      if (lastPosRef.current) {
        ctx.lineWidth = brushRadius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, brushRadius, 0, Math.PI * 2);
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

        const baseline = initialTransparentCountRef.current;
        const totalCardPixels = Math.max(1, (total / sampleStep) - baseline);
        const scratchedPixels = Math.max(0, transparentCount - baseline);
        const pct = Math.min(100, Math.round((scratchedPixels / totalCardPixels) * 100));

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
        {/* 1. Top Lotus Line Divider Matching Reference */}
        <div className="std-top-rosette-line" aria-hidden="true">
          <span className="std-line-segment" />
          <svg className="std-center-rosette" viewBox="0 0 32 20" fill="none">
            <g fill="#A66816">
              <path d="M 16 2 C 14.8 5.5, 14.8 11.5, 16 15 C 17.2 11.5, 17.2 5.5, 16 2 Z" />
              <path d="M 15 5 C 12 8, 10.5 12, 13 15.5 C 14.5 12.5, 15 9, 15 5 Z" />
              <path d="M 17 5 C 20 8, 21.5 12, 19 15.5 C 17.5 12.5, 17 9, 17 5 Z" />
              <path d="M 13 9 C 9 11, 7 14, 10.5 16.5 C 12.5 14.5, 13.5 12, 13 9 Z" />
              <path d="M 19 9 C 23 11, 25 14, 21.5 16.5 C 19.5 14.5, 18.5 12, 19 9 Z" />
              <path d="M 11 16.5 C 14 18, 18 18, 21 16.5 C 19 17.2, 13 17.2, 11 16.5 Z" />
            </g>
          </svg>
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

        {/* Delicate Diamond Divider */}
        <div className="std-subtitle-diamond-line" aria-hidden="true">
          <span className="std-sub-flank-line" />
          <span className="std-center-diamond">◆</span>
          <span className="std-sub-flank-line" />
        </div>

        {/* Accessible announcement for Screen Readers */}
        <div className="sr-only" aria-live="polite">
          Save the Date: Thursday, 28th January 2027. Subha Wedding: 9:00 AM – 10:30 AM at Shri Umadri Mahal, Chennai.
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

            {/* Interactive Blush Scalloped Scratch Canvas */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                id="scratchCanvas"
                className="luxury-scratch-canvas"
                aria-label="Interactive romantic heritage blush scratch surface. Scratch to reveal the wedding date and venue."
              />
            )}


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
