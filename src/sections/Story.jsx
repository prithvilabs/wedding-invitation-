import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';

// Authentic Polaroid assets cropped directly from the editorial design
import polaroid2021 from '../assets/story/polaroid_2021.png';
import polaroid2022 from '../assets/story/polaroid_2022.png';
import polaroidDating from '../assets/story/polaroid_dating.png';
import polaroidTravelling from '../assets/story/polaroid_travelling.png';
import polaroidMemories from '../assets/story/polaroid_memories.png';
import polaroidOceans from '../assets/story/polaroid_across_oceans.png';
import polaroidEngaged from '../assets/story/polaroid_engaged.png';

export default function Story() {
  const flightPathRef = useRef(null);
  const [planePos, setPlanePos] = useState({
    x: -20,
    y: 115,
    angle: 90,
    opacity: 1
  });

  // Continuous silky-smooth live flight animation loop across the milestone boxes
  useEffect(() => {
    let animationFrameId;
    let startTime = null;
    const duration = 24000; // 24 seconds for an elegant, leisurely flight across all milestones

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      const path = flightPathRef.current;
      if (path && path.getTotalLength) {
        const totalLen = path.getTotalLength();
        const currentLen = totalLen * progress;
        const p1 = path.getPointAtLength(currentLen);

        // Lookahead point for calculating exact tangent angle along curve
        const lookAhead = Math.min(totalLen, currentLen + 5);
        const p2 = path.getPointAtLength(lookAhead);

        const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        // Plane vector artwork points UP (north at -90deg), so adding 90 aligns nose with velocity vector
        const angleDeg = (angleRad * 180) / Math.PI + 90;

        // Smooth subtle fade at journey loop wrap-around
        const opacity = progress < 0.03 ? progress / 0.03 : progress > 0.97 ? (1 - progress) / 0.03 : 1;

        setPlanePos({
          x: p1.x,
          y: p1.y,
          angle: angleDeg,
          opacity
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 7 milestones: original 6 + new 2026 Engagement milestone
  const milestones = [
    {
      id: 'beginning',
      row: 1,
      badgeIcon: '👥',
      badgeText: '2021',
      title: 'THE BEGINNING',
      description: 'A mutual friend. One introduction. And a first impression that said far more than words ever could.',
      polaroid: polaroid2021,
      polaroidSide: 'left',
      polaroidAlt: 'It started with a mutual friend',
      flourish: '✦'
    },
    {
      id: 'first-hi',
      row: 1,
      badgeIcon: '📷',
      badgeText: '2022',
      title: 'THE FIRST "HI"',
      description: 'A little curiosity turned into an Instagram request. A simple \'Hi\' was sent, gently opening the door to countless conversations.',
      polaroid: polaroid2022,
      polaroidSide: 'right',
      polaroidAlt: 'Just a "Hi"...',
      flourish: '✦'
    },
    {
      id: 'dating',
      row: 1,
      badgeIcon: '♡',
      badgeText: 'MOMENTS TOGETHER',
      title: 'STARTED DATING',
      description: 'From the first conversations to something more meaningful — our story slowly became ours.',
      polaroid: polaroidDating,
      polaroidSide: 'right',
      polaroidAlt: 'Same hearts, new chapter',
      flourish: '✦'
    },
    {
      id: 'travelling',
      row: 2,
      badgeIcon: '📍',
      badgeText: 'CHENNAI ➔ BENGALURU',
      title: 'TRAVELLING TOGETHER',
      description: 'Exploring Chennai and Bengaluru, one journey and one memory at a time.',
      polaroid: polaroidTravelling,
      polaroidSide: 'left',
      polaroidAlt: 'Different cities, same us',
      flourish: '✦'
    },
    {
      id: 'memories',
      row: 2,
      badgeIcon: '📷',
      badgeText: 'MEMORIES & ADVENTURES',
      title: 'TRIPS & MEMORIES',
      description: 'New places, little adventures, endless laughter, collecting moments we’ll always remember.',
      polaroid: polaroidMemories,
      polaroidSide: 'right',
      polaroidAlt: 'More stamps, more memories',
      flourish: '✦'
    },
    {
      id: 'oceans',
      row: 2,
      badgeIcon: '✈',
      badgeText: '2023',
      title: 'ACROSS OCEANS',
      description: '8,000 miles across time zones as she moved to Boston for her higher education. Oceans apart, yet growing closer with every passing day.',
      polaroid: polaroidOceans,
      polaroidSide: 'right',
      polaroidAlt: 'Different skies, same moon',
      flourish: '✦'
    },
    {
      id: 'engaged',
      row: 3,
      badgeIcon: '💍',
      badgeText: '2026',
      title: 'WE GOT ENGAGED',
      description: 'With hearts full of love, blessings from our families, and a promise for a lifetime, we took the step towards forever.',
      polaroid: polaroidEngaged,
      polaroidSide: 'right',
      polaroidAlt: 'We got engaged',
      flourish: '✦'
    }
  ];

  return (
    <AnimatedSection className="section-block story-editorial-section" id="story">
      <div className="story-editorial-container">
        {/* 1. Header: A JOURNEY ACROSS DISTANCE — OUR STORY */}
        <div className="story-editorial-header text-center">
          <motion.div
            className="story-eyebrow-line"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow-flourish">❦</span>
            <span className="eyebrow-text">A JOURNEY ACROSS DISTANCE</span>
            <span className="eyebrow-flourish">❦</span>
          </motion.div>

          <motion.h2
            className="story-main-title"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            OUR STORY
          </motion.h2>

          <motion.p
            className="story-main-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            Two hearts, one conversation,<br />
            and a beautiful journey.
          </motion.p>

          <div className="story-header-rosette" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.6 8.4L20 7L15.6 12L20 17L13.6 15.6L12 22L10.4 15.6L4 17L8.4 12L4 7L10.4 8.4L12 2Z"
                fill="#C89938"
              />
              <circle cx="12" cy="12" r="2.5" fill="#FAF4E8" stroke="#8A5B0F" strokeWidth="0.7" />
            </svg>
          </div>
        </div>

        {/* 2. Interactive Milestone Cards Stage with Live Flying Airplane */}
        <div className="story-cards-stage">
          {/* Continuous Gold Dashed Flight Path Overlay */}
          <svg
            className="story-flight-path-svg"
            viewBox="0 0 1180 750"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="flightPathGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C99738" />
                <stop offset="35%" stopColor="#E5BE6B" />
                <stop offset="70%" stopColor="#B37D22" />
                <stop offset="100%" stopColor="#D9AA47" />
              </linearGradient>

              <linearGradient id="livePlaneGoldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF7E0" />
                <stop offset="30%" stopColor="#F5D485" />
                <stop offset="70%" stopColor="#D4A64A" />
                <stop offset="100%" stopColor="#8A5B0F" />
              </linearGradient>

              <filter id="planeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3B0C15" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Seamless Dashed Flight Route Curve */}
            <path
              ref={flightPathRef}
              className="flight-route-path"
              d="M -20 115 L 350 115 L 415 115 L 765 115 L 830 115 L 1140 115 C 1195 115, 1205 180, 1150 215 C 990 238, 790 236, 590 237 C 380 238, 130 236, 20 270 C -35 295, -20 345, 30 360 L 350 360 L 415 360 L 765 360 L 830 360 L 1140 360 C 1200 360, 1180 470, 990 525 C 850 565, 760 595, 680 605 L 460 605"
              fill="none"
              stroke="url(#flightPathGrad)"
              strokeWidth="2.2"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />

            {/* Static Milestone Markers along the Flight Route */}
            {/* Marker 1 (between Card 1 & 2): ⊙ */}
            <g transform="translate(382, 115)">
              <circle cx="0" cy="0" r="7.5" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.6" />
              <circle cx="0" cy="0" r="3" fill="#C99738" />
            </g>

            {/* Marker 2 (between Card 2 & 3): ♡ Heart in gold ring */}
            <g transform="translate(798, 115)">
              <circle cx="0" cy="0" r="8.5" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.6" />
              <path
                d="M 0 -2.5 C -1.5 -5, -4.5 -4, -4 -1.5 C -3.5 1, 0 3.5, 0 4.2 C 0 3.5, 3.5 1, 4 -1.5 C 4.5 -4, 1.5 -5, 0 -2.5 Z"
                fill="#8E2A36"
                transform="scale(0.85)"
              />
            </g>

            {/* Airplane Stamp near Card 3 */}
            <g transform="translate(840, 85) rotate(-22)" opacity="0.45">
              <path
                d="M12 2C11.5 2 11 2.5 11 4V10L4 13.5V15.5L11 13V17L9 18.5V20L12 19L15 20V18.5L13 17V13L20 15.5V13.5L13 10V4C13 2.5 12.5 2 12 2Z"
                fill="#C99738"
                transform="scale(0.75)"
              />
            </g>

            {/* Marker in middle loop: ✦ */}
            <text x="590" y="242" textAnchor="middle" fill="#C99738" fontSize="13" fontWeight="bold">✦</text>

            {/* Marker in left return loop: ✦ */}
            <text x="32" y="315" textAnchor="middle" fill="#C99738" fontSize="12" fontWeight="bold">✦</text>

            {/* Marker 3 (between Card 4 & 5): ⊙ */}
            <g transform="translate(382, 360)">
              <circle cx="0" cy="0" r="7.5" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.6" />
              <circle cx="0" cy="0" r="3" fill="#C99738" />
            </g>

            {/* Marker 4 (between Card 5 & 6): 📍 Location Pin */}
            <g transform="translate(798, 360)">
              <circle cx="0" cy="0" r="8" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.4" />
              <path
                d="M0 -4.5 C -2.5 -4.5, -4 -3, -4 -0.5 C -4 2, 0 5, 0 5 C 0 5, 4 2, 4 -0.5 C 4 -3, 2.5 -4.5, 0 -4.5 Z"
                fill="#C99738"
                transform="scale(0.85) translate(0, -1)"
              />
              <circle cx="0" cy="-1.8" r="1.2" fill="#FAF4E8" />
            </g>

            {/* Marker on swoop to 2026 Engagement: ✦ */}
            <text x="900" y="555" textAnchor="middle" fill="#C99738" fontSize="13" fontWeight="bold">✦</text>

            {/* Live Traveling Airplane Icon */}
            <g
              transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle})`}
              className="story-live-airplane-group"
              style={{ opacity: planePos.opacity }}
            >
              {/* Soft ground shadow under plane */}
              <ellipse cx="0" cy="4" rx="7" ry="2.5" fill="rgba(35, 10, 15, 0.3)" filter="blur(1.2px)" />

              {/* Gold Vector Airplane */}
              <g transform="translate(-13, -13) scale(0.64)" filter="url(#planeShadow)">
                <path
                  d="M21 3C20 3 19 4 19 6.5V17L7 22.5V25.5L19 21.5V28L15 30.5V32.5L21 31L27 32.5V30.5L23 28V21.5L35 25.5V22.5L23 17V6.5C23 4 22 3 21 3Z"
                  fill="url(#livePlaneGoldGrad)"
                  stroke="#7A4B06"
                  strokeWidth="0.8"
                />
                <circle cx="21" cy="7" r="1.5" fill="#4A121A" />
              </g>
            </g>
          </svg>

          {/* Cards Grid */}
          <div className="story-cards-grid">
            {/* ROW 1 (Cards 1, 2, 3) */}
            <div className="story-cards-row row-1">
              {milestones.filter(m => m.row === 1).map((item, idx) => (
                <motion.div
                  key={item.id}
                  className={`story-deckle-card story-card-${item.id} polaroid-${item.polaroidSide}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: idx * 0.1 }}
                >
                  <div className="story-card-body">
                    {item.polaroidSide === 'left' && (
                      <div className="story-polaroid-anchor tilt-left">
                        <img
                          src={item.polaroid}
                          alt={item.polaroidAlt}
                          className="story-polaroid-frame-img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="story-card-narrative">
                      <div className="story-narrative-badge">
                        <span className="badge-icon">{item.badgeIcon}</span>
                        <span className="badge-text">{item.badgeText}</span>
                      </div>
                      <h3 className="story-narrative-title">{item.title}</h3>
                      <p className="story-narrative-desc">{item.description}</p>
                      {item.flourish && (
                        <div className="story-narrative-flourish" aria-hidden="true">
                          {item.flourish}
                        </div>
                      )}
                    </div>

                    {item.polaroidSide === 'right' && (
                      <div className="story-polaroid-anchor tilt-right">
                        <img
                          src={item.polaroid}
                          alt={item.polaroidAlt}
                          className="story-polaroid-frame-img"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ROW 2 (Cards 4, 5, 6) */}
            <div className="story-cards-row row-2">
              {milestones.filter(m => m.row === 2).map((item, idx) => (
                <motion.div
                  key={item.id}
                  className={`story-deckle-card story-card-${item.id} polaroid-${item.polaroidSide}`}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: idx * 0.1 }}
                >
                  <div className="story-card-body">
                    {item.polaroidSide === 'left' && (
                      <div className="story-polaroid-anchor tilt-left">
                        <img
                          src={item.polaroid}
                          alt={item.polaroidAlt}
                          className="story-polaroid-frame-img"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="story-card-narrative">
                      <div className="story-narrative-badge">
                        <span className="badge-icon">{item.badgeIcon}</span>
                        <span className="badge-text">{item.badgeText}</span>
                      </div>
                      <h3 className="story-narrative-title">{item.title}</h3>
                      <p className="story-narrative-desc">{item.description}</p>
                      {item.flourish && (
                        <div className="story-narrative-flourish" aria-hidden="true">
                          {item.flourish}
                        </div>
                      )}
                    </div>

                    {item.polaroidSide === 'right' && (
                      <div className="story-polaroid-anchor tilt-right">
                        <img
                          src={item.polaroid}
                          alt={item.polaroidAlt}
                          className="story-polaroid-frame-img"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ROW 3 (Card 7: 2026 We Got Engaged, centered) */}
            <div className="story-cards-row row-3-engaged">
              {milestones.filter(m => m.row === 3).map((item) => (
                <motion.div
                  key={item.id}
                  className={`story-deckle-card story-card-${item.id} polaroid-${item.polaroidSide} card-engaged-highlight`}
                  initial={{ opacity: 0, scale: 0.96, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.75 }}
                >
                  <div className="story-card-body">
                    <div className="story-card-narrative">
                      <div className="story-narrative-badge">
                        <span className="badge-icon">{item.badgeIcon}</span>
                        <span className="badge-text">{item.badgeText}</span>
                      </div>
                      <h3 className="story-narrative-title">{item.title}</h3>
                      <p className="story-narrative-desc">{item.description}</p>
                      <div className="story-narrative-flourish" aria-hidden="true">
                        ✦
                      </div>
                    </div>

                    <div className="story-polaroid-anchor tilt-right">
                      <img
                        src={item.polaroid}
                        alt={item.polaroidAlt}
                        className="story-polaroid-frame-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Reflection Quote Flanked by Golden Olive Branches */}
        <motion.div
          className="story-bottom-reflection"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="story-reflection-cluster">
            {/* Left Golden Olive Branch */}
            <div className="story-olive-branch branch-left" aria-hidden="true">
              <svg width="65" height="95" viewBox="0 0 65 95" fill="none">
                <path d="M54 90 C42 68, 30 45, 12 12" stroke="#C99738" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M46 74 C38 66, 40 56, 50 62 C48 70, 46 74, 46 74 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M38 58 C28 53, 26 42, 37 46 C35 53, 38 58, 38 58 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M28 40 C19 34, 22 23, 32 28 C29 36, 28 40, 28 40 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M16 22 C8 17, 13 7, 22 13 C20 19, 16 22, 16 22 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M12 12 C7 6, 9 1, 16 4 C14 8, 12 12, 12 12 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Reflection Text */}
            <div className="story-reflection-text-wrap">
              <p className="story-reflection-body">
                We grew in different places, under different skies, and on completely opposite schedules. Strangely, we never grew away from each other.<br />
                After years of counting miles, days and hours, we're finally done with the countdown.<br />
                <span className="reflection-closing">This is the chapter where we stay.</span>
              </p>
            </div>

            {/* Right Golden Olive Branch */}
            <div className="story-olive-branch branch-right" aria-hidden="true">
              <svg width="65" height="95" viewBox="0 0 65 95" fill="none">
                <path d="M11 90 C23 68, 35 45, 53 12" stroke="#C99738" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M19 74 C27 66, 25 56, 15 62 C17 70, 19 74, 19 74 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M27 58 C37 53, 39 42, 28 46 C30 53, 27 58, 27 58 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M37 40 C46 34, 43 23, 33 28 C36 36, 37 40, 37 40 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M49 22 C57 17, 52 7, 43 13 C45 19, 49 22, 49 22 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
                <path d="M53 12 C58 6, 56 1, 49 4 C51 8, 53 12, 53 12 Z" fill="#D4A843" fillOpacity="0.92" stroke="#B37D22" strokeWidth="0.5" />
              </svg>
            </div>
          </div>

          {/* Couple Names & Year Signature */}
          <div className="story-signature-block">
            <div className="story-signature-names">
              <span>PRITHVI RAJ</span>
              <span className="signature-cross">✕</span>
              <span>HARSHINI</span>
            </div>
            <div className="story-signature-year">2027</div>
            <div className="story-signature-rosette" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#C99738">
                <path d="M12 2L13.5 8.5L20 7L15.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L8.5 12L4 7L10.5 8.5L12 2Z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
