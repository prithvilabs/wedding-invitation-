import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { Plane, MapPin } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';

export default function Story() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Scroll Progress across the compact cinematic story section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 85%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001
  });

  const [planeState, setPlaneState] = useState({
    percentX: 50,
    percentY: 2.5,
    angle: 90
  });

  // Check user motion preferences
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Compute exact coordinates and tangent angle along the SVG curved flight path
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (prefersReducedMotion) return;

    const path = pathRef.current;
    if (path && path.getTotalLength) {
      const totalLen = path.getTotalLength();
      const currentLen = Math.max(0.1, Math.min(totalLen * latest, totalLen - 0.5));

      const p1 = path.getPointAtLength(currentLen);
      const lookAhead = Math.min(totalLen, currentLen + 6);
      const p2 = path.getPointAtLength(lookAhead);

      // Tangent direction angle
      const rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const deg = (rad * 180) / Math.PI + 90;

      setPlaneState({
        percentX: (p1.x / 800) * 100,
        percentY: (p1.y / 2000) * 100,
        angle: deg
      });
    }
  });

  // Initial path point calculation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathRef.current && pathRef.current.getTotalLength) {
        const p0 = pathRef.current.getPointAtLength(0);
        const p1 = pathRef.current.getPointAtLength(6);
        const deg = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI + 90;
        setPlaneState({
          percentX: (p0.x / 800) * 100,
          percentY: (p0.y / 2000) * 100,
          angle: deg
        });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedSection className="section-block story-compact-journey-section" id="story">
      <div className="story-compact-container" ref={sectionRef}>
        {/* 1. Header: A JOURNEY ACROSS DISTANCE — OUR STORY */}
        <div className="editorial-heading-stack text-center story-compact-header">
          <motion.div
            className="story-journey-pill"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Plane size={13} strokeWidth={1.75} className="story-pill-icon" />
            <span>A JOURNEY ACROSS DISTANCE</span>
          </motion.div>

          <motion.h2
            className="editorial-main-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            OUR STORY
          </motion.h2>

          <div className="gold-divider-flourish" aria-hidden="true">
            <span className="flourish-line" />
            <span className="flourish-node">❈ ❖ ❈</span>
            <span className="flourish-line" />
          </div>
        </div>

        {/* 2. Starting Point: INDIA / CHENNAI */}
        <motion.div
          className="flight-origin-node text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="origin-marker-chip">
            <div className="origin-gold-dot">
              <MapPin size={13} strokeWidth={2.2} className="origin-pin-svg" />
            </div>
            <div className="origin-text-stack">
              <span className="origin-title">INDIA</span>
              <span className="origin-sub">CHENNAI · 2021</span>
            </div>
          </div>
        </motion.div>

        {/* 3. Interactive Flight Route Track & Sequence */}
        <div className="flight-compact-track-stage">
          {/* Continuous Gold SVG Flight Route */}
          <svg
            className="flight-compact-route-svg"
            viewBox="0 0 800 2000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="flightGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4A843" />
                <stop offset="35%" stopColor="#F6DC96" />
                <stop offset="70%" stopColor="#B88026" />
                <stop offset="100%" stopColor="#E0B859" />
              </linearGradient>
            </defs>

            {/* Background Faint Dashed Route Guide */}
            <path
              d="M 400 50 C 250 150, 220 250, 270 360 C 330 480, 580 580, 530 700 C 490 820, 370 890, 390 960 C 410 1020, 440 1070, 420 1140 C 390 1210, 360 1250, 380 1330 C 410 1440, 220 1460, 270 1580 C 320 1720, 400 1820, 400 1920"
              fill="none"
              stroke="rgba(207, 160, 73, 0.22)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />

            {/* Progressive Gold Route Drawing */}
            <motion.path
              ref={pathRef}
              d="M 400 50 C 250 150, 220 250, 270 360 C 330 480, 580 580, 530 700 C 490 820, 370 890, 390 960 C 410 1020, 440 1070, 420 1140 C 390 1210, 360 1250, 380 1330 C 410 1440, 220 1460, 270 1580 C 320 1720, 400 1820, 400 1920"
              fill="none"
              stroke="url(#flightGoldGrad)"
              strokeWidth="3.2"
              strokeDasharray="8 8"
              strokeLinecap="round"
              style={{
                pathLength: prefersReducedMotion ? 1 : smoothProgress
              }}
            />

            {/* Destination Milestone Dots */}
            <circle cx="270" cy="360" r="5.5" fill="#D4A843" stroke="#FFF7E0" strokeWidth="2" />
            <circle cx="530" cy="700" r="5.5" fill="#D4A843" stroke="#FFF7E0" strokeWidth="2" />
            <circle cx="390" cy="960" r="4.8" fill="#D4A843" stroke="#FFF7E0" strokeWidth="1.8" />
            <circle cx="420" cy="1140" r="4.8" fill="#D4A843" stroke="#FFF7E0" strokeWidth="1.8" />
            <circle cx="380" cy="1330" r="4.8" fill="#D4A843" stroke="#FFF7E0" strokeWidth="1.8" />
            <circle cx="270" cy="1580" r="5.5" fill="#D4A843" stroke="#FFF7E0" strokeWidth="2" />
            <circle cx="400" cy="1920" r="6" fill="#102F2C" stroke="#D4A843" strokeWidth="2.5" />
          </svg>

          {/* Traveling Vector Airplane */}
          {!prefersReducedMotion && (
            <div
              className="flight-airplane-scroller"
              style={{
                left: `${planeState.percentX}%`,
                top: `${planeState.percentY}%`,
                transform: `translate(-50%, -50%) rotate(${planeState.angle}deg)`
              }}
              aria-hidden="true"
            >
              <div className="airplane-scroller-inner">
                <svg
                  className="airplane-vector-icon"
                  viewBox="0 0 48 48"
                  width="32"
                  height="32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse cx="24" cy="42" rx="10" ry="3" fill="rgba(36, 7, 13, 0.28)" />
                  <path
                    d="M24 4C22 4 20.5 6 20.5 10.5V25L6 32.5V36.5L20.5 30.5V39.5L15.5 42.5V45L24 42.5L32.5 45V42.5L27.5 39.5V30.5L42 36.5V32.5L27.5 25V10.5C27.5 6 26 4 24 4Z"
                    fill="url(#planeGold)"
                    stroke="#734B0B"
                    strokeWidth="1"
                  />
                  <path d="M22 8C22 7.2 22.9 6.5 24 6.5C25.1 6.5 26 7.2 26 8V12H22V8Z" fill="#102F2C" />
                  <defs>
                    <linearGradient id="planeGold" x1="6" y1="4" x2="42" y2="45">
                      <stop offset="0%" stopColor="#FFF9E6" />
                      <stop offset="30%" stopColor="#F5D485" />
                      <stop offset="70%" stopColor="#D4A64A" />
                      <stop offset="100%" stopColor="#8A5B0F" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}

          {/* Sequential Timeline Stops & Milestones */}
          <div className="story-stops-flow">
            {/* STOP 1: 2021 — THE BEGINNING */}
            <motion.div
              className="story-stop-item stop-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="story-stop-narrative">
                <div className="story-stop-year-badge">
                  <span className="stop-gold-bullet">✦</span>
                  <span className="stop-year-text">2021</span>
                </div>
                <h3 className="story-stop-title">THE BEGINNING</h3>
                <p className="story-stop-desc">
                  A mutual friend. One introduction. And a first impression that said far more than words ever could.
                </p>
              </div>

              <motion.div
                className="story-stop-photo-dock"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ transform: 'rotate(-2.2deg)' }}
                whileHover={{ scale: 1.03, rotate: 0, transition: { duration: 0.3 } }}
              >
                <div className="travel-photo-frame">
                  <img
                    src="assets/couple_traditional.jpg"
                    alt="Prithvi and Harshini in Chennai traditional attire"
                    className="travel-photo-img"
                    loading="lazy"
                  />
                  <div className="travel-photo-caption">
                    <span>CHENNAI · DECEMBER 2021</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* STOP 2: 2022 — THE FIRST "HI" (with micro Instagram DM memory) */}
            <motion.div
              className="story-stop-item stop-right"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="story-stop-narrative">
                <div className="story-stop-year-badge">
                  <span className="stop-gold-bullet">✦</span>
                  <span className="stop-year-text">2022</span>
                </div>
                <h3 className="story-stop-title">THE FIRST "HI"</h3>
                <p className="story-stop-desc">
                  A little curiosity turned into an Instagram request. A simple ‘Hi’ was sent, gently opening the door to countless conversations.
                </p>

                {/* Authentic Micro Instagram DM Memory Snippet */}
                <div className="micro-dm-memory" aria-label="First Instagram DM exchange">
                  <div className="micro-dm-pill dm-sent">
                    <span>Hi</span>
                  </div>
                  <div className="micro-dm-pill dm-received">
                    <span>Hi</span>
                  </div>
                </div>
              </div>

              <motion.div
                className="story-stop-photo-dock"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ transform: 'rotate(2.2deg)' }}
                whileHover={{ scale: 1.03, rotate: 0, transition: { duration: 0.3 } }}
              >
                <div className="travel-photo-frame">
                  <img
                    src="assets/panel3_story_bg.jpg"
                    alt="Prithvi and Harshini sharing a laugh during golden hour"
                    className="travel-photo-img"
                    loading="lazy"
                  />
                  <div className="travel-photo-caption">
                    <span>CHENNAI &amp; BEYOND · 2022</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* COMPACT CINEMATIC MILESTONE SEQUENCE: MOMENTS TOGETHER (ONE UNIFIED PANEL) */}
            <motion.div
              className="story-moments-unified-panel"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Panel Header */}
              <div className="moments-panel-header">
                <span className="moments-panel-star">✦</span>
                <span className="moments-panel-eyebrow">MOMENTS TOGETHER</span>
                <span className="moments-panel-star">✦</span>
              </div>

              {/* Continuous Internal Timeline connecting all 3 moments */}
              <div className="moments-timeline-spine">
                {/* 1. Started Dating */}
                <motion.div
                  className="timeline-milestone-step"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="milestone-marker-column">
                    <div className="milestone-gold-node">
                      <span className="node-star">✦</span>
                    </div>
                    <div className="milestone-connector-line" />
                  </div>

                  <div className="milestone-content-block">
                    <h4 className="milestone-title">STARTED DATING</h4>
                    <p className="milestone-quote">
                      “From the first conversations to something more meaningful — our story slowly became ours.”
                    </p>
                  </div>
                </motion.div>

                {/* 2. Travelling Together (Chennai -> Bengaluru) */}
                <motion.div
                  className="timeline-milestone-step"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="milestone-marker-column">
                    <div className="milestone-gold-node">
                      <span className="node-star">✦</span>
                    </div>
                    <div className="milestone-connector-line" />
                  </div>

                  <div className="milestone-content-block">
                    <span className="milestone-sub-eyebrow">CHENNAI → BENGALURU</span>
                    <h4 className="milestone-title">TRAVELLING TOGETHER</h4>
                    <p className="milestone-quote">
                      “Exploring Chennai and Bengaluru, one journey and one memory at a time.”
                    </p>
                  </div>
                </motion.div>

                {/* 3. Trips & Memories */}
                <motion.div
                  className="timeline-milestone-step last-milestone-step"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="milestone-marker-column">
                    <div className="milestone-gold-node">
                      <span className="node-star">✦</span>
                    </div>
                  </div>

                  <div className="milestone-content-block">
                    <span className="milestone-sub-eyebrow">MEMORIES &amp; ADVENTURES</span>
                    <h4 className="milestone-title">TRIPS &amp; MEMORIES</h4>
                    <p className="milestone-quote">
                      “New places, little adventures, endless laughter — collecting moments we’ll always remember.”
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* STOP 3: 2023 — ACROSS OCEANS */}
            <motion.div
              className="story-stop-item stop-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="story-stop-narrative">
                <div className="story-stop-year-badge">
                  <span className="stop-gold-bullet">✦</span>
                  <span className="stop-year-text">2023</span>
                </div>
                <h3 className="story-stop-title">ACROSS OCEANS</h3>
                <p className="story-stop-desc">
                  8,000 miles across time zones as she moved to Boston for her higher education. Oceans apart, yet growing closer with every passing day.
                </p>
              </div>

              <motion.div
                className="story-stop-photo-dock"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ transform: 'rotate(-2.0deg)' }}
                whileHover={{ scale: 1.03, rotate: 0, transition: { duration: 0.3 } }}
              >
                <div className="travel-photo-frame">
                  <img
                    src="assets/couple_reception.jpg"
                    alt="Prithvi and Harshini together celebrating"
                    className="travel-photo-img"
                    loading="lazy"
                  />
                  <div className="travel-photo-caption">
                    <span>BOSTON &amp; BEYOND · 2023</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 4. Final Destination Union Conclusion */}
        <motion.div
          className="flight-destination-node text-center"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.85 }}
        >
          <div className="destination-arrival-box">
            <p className="destination-quote">
              “We grew in different places, under different skies, and on completely opposite schedules. Strangely, we never grew away from each other. After years of counting miles, days and hours, we're finally done with the countdown. This is the chapter where we stay.”
            </p>

            <div className="destination-union-tag">
              <span className="union-names">PRITHVI RAJ</span>
              <span className="union-cross">×</span>
              <span className="union-names">HARSHINI</span>
              <span className="union-divider">·</span>
              <span className="union-year">2027</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
