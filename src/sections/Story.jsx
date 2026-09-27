import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';

// Authentic Editorial Paper & Botanical Sprig Assets
import deckledCardBg from '../assets/story/deckled_card_bg.png';
import botanicalSprig from '../assets/story/botanical_sprig.png';

// High-resolution Retina Polaroid Assets
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
    y: 108.6,
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

  // 7 milestones: original 6 + 2026 Engagement milestone
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
      sprig: null
    },
    {
      id: 'first-hi',
      row: 1,
      badgeIcon: '📷',
      badgeText: '2022',
      title: 'THE FIRST "HI"',
      description: "A little curiosity turned into an Instagram request. A simple 'Hi' was sent, gently opening the door to countless conversations.",
      polaroid: polaroid2022,
      polaroidSide: 'right',
      polaroidAlt: 'Just a "Hi"...',
      sprig: 'sprig-c2'
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
      sprig: 'sprig-c3'
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
      sprig: 'sprig-c4'
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
      sprig: 'sprig-c5'
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
      sprig: 'sprig-c6'
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
      sprig: 'sprig-c7'
    }
  ];

  const renderCard = (item, idx = 0) => (
    <motion.div
      key={item.id}
      className={`story-deckle-card story-card-${item.id} polaroid-${item.polaroidSide} ${item.id === 'engaged' ? 'card-engaged-highlight' : ''}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: idx * 0.1 }}
    >
      {/* Botanical Floral & Leaf Sprig sprouting organically around box */}
      {item.sprig && (
        <div className={`story-card-sprig ${item.sprig}`} aria-hidden="true">
          <img src={botanicalSprig} alt="" className="sprig-leaf-img" loading="lazy" />
        </div>
      )}

      {/* Authentic Torn Deckled Edge Handmade Cotton Paper Background */}
      <img
        src={deckledCardBg}
        alt=""
        className="story-deckled-paper-bg"
        aria-hidden="true"
      />

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
          <div className="story-card-flourish" aria-hidden="true">
            <span className="flourish-line"></span>
            <span className="flourish-rosette">𑁍</span>
            <span className="flourish-line"></span>
          </div>
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
  );

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
              d="M -20 108.6 L 358 108.6 L 412 108.6 L 769 108.6 L 821 108.6 L 1140 108.6 C 1195 108.6, 1205 165, 1150 195 C 990 215, 790 215, 590 215 C 380 215, 130 215, 30 245 C -25 270, -15 310, 35 321.7 L 358 321.7 L 412 321.7 L 769 321.7 L 821 321.7 L 1140 321.7 C 1200 321.7, 1175 425, 985 475 C 840 515, 760 534.2, 680 534.2 L 460 534.2"
              fill="none"
              stroke="url(#flightPathGrad)"
              strokeWidth="2.2"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />

            {/* Static Milestone Markers along the Flight Route */}
            {/* Marker 1 (between Card 1 & 2): ⊙ */}
            <g transform="translate(385, 108.6)">
              <circle cx="0" cy="0" r="7.5" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.6" />
              <circle cx="0" cy="0" r="3" fill="#C99738" />
            </g>

            {/* Marker 2 (between Card 2 & 3): ♡ Heart in gold ring */}
            <g transform="translate(795, 108.6)">
              <circle cx="0" cy="0" r="8.5" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.6" />
              <path
                d="M 0 -2.5 C -1.5 -5, -4.5 -4, -4 -1.5 C -3.5 1, 0 3.5, 0 4.2 C 0 3.5, 3.5 1, 4 -1.5 C 4.5 -4, 1.5 -5, 0 -2.5 Z"
                fill="#8E2A36"
                transform="scale(0.85)"
              />
            </g>

            {/* Airplane Stamp near Card 3 */}
            <g transform="translate(835, 78) rotate(-22)" opacity="0.45">
              <path
                d="M12 2C11.5 2 11 2.5 11 4V10L4 13.5V15.5L11 13V17L9 18.5V20L12 19L15 20V18.5L13 17V13L20 15.5V13.5L13 10V4C13 2.5 12.5 2 12 2Z"
                fill="#C99738"
                transform="scale(0.75)"
              />
            </g>

            {/* Marker in middle loop: ✦ */}
            <text x="590" y="219" textAnchor="middle" fill="#C99738" fontSize="13" fontWeight="bold">✦</text>

            {/* Marker in left return loop: ✦ */}
            <text x="30" y="285" textAnchor="middle" fill="#C99738" fontSize="12" fontWeight="bold">✦</text>

            {/* Marker 3 (between Card 4 & 5): ⊙ */}
            <g transform="translate(385, 321.7)">
              <circle cx="0" cy="0" r="7.5" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.6" />
              <circle cx="0" cy="0" r="3" fill="#C99738" />
            </g>

            {/* Marker 4 (between Card 5 & 6): 📍 Location Pin */}
            <g transform="translate(795, 321.7)">
              <circle cx="0" cy="0" r="8" fill="#FAF4E8" stroke="#C99738" strokeWidth="1.4" />
              <path
                d="M0 -4.5 C -2.5 -4.5, -4 -3, -4 -0.5 C -4 2, 0 5, 0 5 C 0 5, 4 2, 4 -0.5 C 4 -3, 2.5 -4.5, 0 -4.5 Z"
                fill="#C99738"
                transform="scale(0.85) translate(0, -1)"
              />
              <circle cx="0" cy="-1.8" r="1.2" fill="#FAF4E8" />
            </g>

            {/* Marker on swoop to 2026 Engagement: ✦ */}
            <text x="890" y="505" textAnchor="middle" fill="#C99738" fontSize="13" fontWeight="bold">✦</text>

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
              {milestones.filter(m => m.row === 1).map((item, idx) => renderCard(item, idx))}
            </div>

            {/* ROW 2 (Cards 4, 5, 6) */}
            <div className="story-cards-row row-2">
              {milestones.filter(m => m.row === 2).map((item, idx) => renderCard(item, idx))}
            </div>

            {/* ROW 3 (Card 7: 2026 We Got Engaged, centered) */}
            <div className="story-cards-row row-3-engaged">
              {milestones.filter(m => m.row === 3).map((item) => renderCard(item, 0))}
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
            {/* Left Golden Olive Branch with slender pointed leaves */}
            <div className="story-olive-branch branch-left" aria-hidden="true">
              <svg width="72" height="96" viewBox="0 0 75 95" fill="none">
                <path d="M68 90 C56 70, 42 42, 18 10" stroke="#C28E35" strokeWidth="1.3" strokeLinecap="round" />
                {/* Terminal tip leaf */}
                <path d="M18 10 C14 6, 14 2, 19 3 C23 7, 21 11, 18 10 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="18" y1="10" x2="17" y2="3" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 1 */}
                <path d="M22 21 C14 17, 10 13, 14 10 C18 10, 21 16, 22 21 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="22" y1="21" x2="13" y2="11" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M27 25 C34 19, 39 17, 40 21 C39 26, 31 27, 27 25 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="27" y1="25" x2="39" y2="19" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 2 */}
                <path d="M32 37 C22 31, 17 26, 22 23 C26 23, 30 31, 32 37 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="32" y1="37" x2="20" y2="24" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M38 41 C46 34, 53 31, 53 36 C51 42, 43 43, 38 41 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="38" y1="41" x2="52" y2="34" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 3 */}
                <path d="M44 55 C33 48, 27 43, 33 39 C37 40, 42 48, 44 55 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="44" y1="55" x2="30" y2="41" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M50 59 C59 51, 67 48, 66 54 C63 60, 55 61, 50 59 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="50" y1="59" x2="65" y2="51" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 4 */}
                <path d="M56 71 C46 64, 41 60, 46 56 C50 57, 54 65, 56 71 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="56" y1="71" x2="44" y2="58" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M61 74 C70 66, 76 64, 76 69 C73 75, 66 76, 61 74 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="61" y1="74" x2="75" y2="67" stroke="#C28E35" strokeWidth="0.7" />
              </svg>
            </div>

            {/* Reflection Text */}
            <div className="story-reflection-text-wrap">
              <p className="story-reflection-body">
                We grew in different places, under different skies, and on completely<br />
                opposite schedules. Strangely, we never grew away from each other.<br />
                After years of counting miles, days and hours, we're finally done with the countdown.<br />
                <span className="reflection-closing">This is the chapter where we stay.</span>
              </p>
            </div>

            {/* Right Golden Olive Branch (mirrored) */}
            <div className="story-olive-branch branch-right" aria-hidden="true">
              <svg width="72" height="96" viewBox="0 0 75 95" fill="none" style={{ transform: 'scaleX(-1)' }}>
                <path d="M68 90 C56 70, 42 42, 18 10" stroke="#C28E35" strokeWidth="1.3" strokeLinecap="round" />
                {/* Terminal tip leaf */}
                <path d="M18 10 C14 6, 14 2, 19 3 C23 7, 21 11, 18 10 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="18" y1="10" x2="17" y2="3" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 1 */}
                <path d="M22 21 C14 17, 10 13, 14 10 C18 10, 21 16, 22 21 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="22" y1="21" x2="13" y2="11" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M27 25 C34 19, 39 17, 40 21 C39 26, 31 27, 27 25 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="27" y1="25" x2="39" y2="19" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 2 */}
                <path d="M32 37 C22 31, 17 26, 22 23 C26 23, 30 31, 32 37 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="32" y1="37" x2="20" y2="24" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M38 41 C46 34, 53 31, 53 36 C51 42, 43 43, 38 41 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="38" y1="41" x2="52" y2="34" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 3 */}
                <path d="M44 55 C33 48, 27 43, 33 39 C37 40, 42 48, 44 55 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="44" y1="55" x2="30" y2="41" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M50 59 C59 51, 67 48, 66 54 C63 60, 55 61, 50 59 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="50" y1="59" x2="65" y2="51" stroke="#C28E35" strokeWidth="0.7" />
                {/* Pair 4 */}
                <path d="M56 71 C46 64, 41 60, 46 56 C50 57, 54 65, 56 71 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="56" y1="71" x2="44" y2="58" stroke="#C28E35" strokeWidth="0.7" />
                <path d="M61 74 C70 66, 76 64, 76 69 C73 75, 66 76, 61 74 Z" stroke="#C28E35" strokeWidth="1.0" fill="rgba(250, 238, 220, 0.4)" />
                <line x1="61" y1="74" x2="75" y2="67" stroke="#C28E35" strokeWidth="0.7" />
              </svg>
            </div>
          </div>

          {/* 4. Golden Heart Divider Line */}
          <div className="story-reflection-heart-divider" aria-hidden="true">
            <span className="reflection-divider-line"></span>
            <div className="reflection-golden-heart">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                <defs>
                  <linearGradient id="heartGold3D" x1="0.2" y1="0" x2="0.8" y2="1">
                    <stop offset="0%" stopColor="#FFECA0" />
                    <stop offset="35%" stopColor="#D4A143" />
                    <stop offset="70%" stopColor="#A6701C" />
                    <stop offset="100%" stopColor="#633906" />
                  </linearGradient>
                  <filter id="heartShadowFilter" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#3B1204" floodOpacity="0.32" />
                  </filter>
                </defs>
                <path
                  d="M10 16.5 C9.5 16.5, 1.5 10.5, 1.5 5 C1.5 2.2, 3.8 0.5, 6.5 0.5 C8.2 0.5, 9.4 1.4, 10 2.2 C10.6 1.4, 11.8 0.5, 13.5 0.5 C16.2 0.5, 18.5 2.2, 18.5 5 C18.5 10.5, 10.5 16.5, 10 16.5 Z"
                  fill="url(#heartGold3D)"
                  stroke="#7A4B06"
                  strokeWidth="0.6"
                  filter="url(#heartShadowFilter)"
                />
                <path
                  d="M5 3.2 C3.8 4.2, 3.8 5.6, 4.4 6.8"
                  stroke="#FFFDF5"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </div>
            <span className="reflection-divider-line"></span>
          </div>

          {/* 5. Couple Names */}
          <div className="story-signature-names">
            <span>PRITHVI RAJ</span>
            <span className="signature-cross">✕</span>
            <span>HARSHINI</span>
          </div>

          {/* 6. 2027 Flanked by Hairline Rules */}
          <div className="story-signature-year-divider">
            <span className="year-divider-line"></span>
            <span className="story-signature-year">2027</span>
            <span className="year-divider-line"></span>
          </div>

          {/* 7. Mandala Rosette Ornament */}
          <div className="story-signature-rosette" aria-hidden="true">
            <svg width="30" height="30" viewBox="-13 -13 26 26" fill="none">
              <defs>
                <radialGradient id="mandalaCoreGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="60%" stopColor="#D4A843" />
                  <stop offset="100%" stopColor="#8A5B0F" />
                </radialGradient>
              </defs>
              {/* 8 Radial Petals */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <ellipse cx="0" cy="-5.2" rx="2.0" ry="2.8" stroke="#AC3B44" strokeWidth="1.0" fill="rgba(245, 230, 220, 0.45)" />
                  <circle cx="0" cy="-9.2" r="1.0" fill="#AC3B44" />
                </g>
              ))}
              {/* Center Core */}
              <circle cx="0" cy="0" r="2.6" fill="url(#mandalaCoreGrad)" stroke="#8A5B0F" strokeWidth="0.6" />
              <circle cx="0" cy="0" r="1.1" fill="#FAF4E8" />
            </svg>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
