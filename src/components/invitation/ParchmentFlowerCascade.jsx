import React, { useEffect, useRef } from 'react';

/**
 * Pre-render Bougainvillea Bracts & Jasmine Sprites
 * Uses offscreen canvases for ultra-fast GPU blitting and buttery smooth 60fps drift.
 */
let cachedSprites = null;

function getCascadeSprites() {
  if (cachedSprites) return cachedSprites;

  const sprites = {};

  // 1. Soft-focus Pink Bougainvillea Bracts (3 color variations)
  const bougainvilleaColors = [
    { fill: '#f472b6', edge: '#ec4899', vein: '#db2777' }, // vibrant rose
    { fill: '#fbcfe8', edge: '#f472b6', vein: '#e11d48' }, // soft blush
    { fill: '#e11d48', edge: '#be123c', vein: '#9f1239' }, // deep cerise
  ];

  bougainvilleaColors.forEach((palette, idx) => {
    const c = document.createElement('canvas');
    c.width = 110;
    c.height = 110;
    const ctx = c.getContext('2d');
    const cx = 55, cy = 55, s = 45;

    // Soft-focus subtle shadow
    ctx.shadowColor = 'rgba(225, 29, 72, 0.28)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // Organic heart/oval shaped bougainvillea bract
    ctx.fillStyle = palette.fill;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.55);
    ctx.bezierCurveTo(cx + s * 0.48, cy - s * 0.35, cx + s * 0.45, cy + s * 0.35, cx, cy + s * 0.52);
    ctx.bezierCurveTo(cx - s * 0.45, cy + s * 0.35, cx - s * 0.48, cy - s * 0.35, cx, cy - s * 0.55);
    ctx.fill();

    // Delicate translucent center vein
    ctx.shadowBlur = 0;
    ctx.strokeStyle = palette.vein;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.45);
    ctx.quadraticCurveTo(cx + 2, cy, cx, cy + s * 0.42);
    ctx.stroke();

    sprites[`bougainvillea-${idx}`] = c;
  });

  // 2. White Jasmine Blossom (8-petal Mogra with golden pistil)
  const cJasmine = document.createElement('canvas');
  cJasmine.width = 120;
  cJasmine.height = 120;
  const ctxJ = cJasmine.getContext('2d');
  const jx = 60, jy = 60, js = 48;

  ctxJ.shadowColor = 'rgba(60, 20, 25, 0.22)';
  ctxJ.shadowBlur = 5;
  ctxJ.shadowOffsetY = 2;

  // Outer 4 petals
  ctxJ.fillStyle = '#ffffff';
  for (let petal = 0; petal < 4; petal++) {
    ctxJ.save();
    ctxJ.translate(jx, jy);
    ctxJ.rotate((petal * Math.PI) / 2);
    ctxJ.beginPath();
    ctxJ.moveTo(0, 0);
    ctxJ.bezierCurveTo(js * 0.28, -js * 0.15, js * 0.28, -js * 0.45, 0, -js * 0.5);
    ctxJ.bezierCurveTo(-js * 0.28, -js * 0.45, -js * 0.28, -js * 0.15, 0, 0);
    ctxJ.fill();
    ctxJ.restore();
  }

  // Inner 4 petals offset by 45 degrees
  ctxJ.fillStyle = '#fdfaf5';
  for (let petal = 0; petal < 4; petal++) {
    ctxJ.save();
    ctxJ.translate(jx, jy);
    ctxJ.rotate((petal * Math.PI) / 2 + Math.PI / 4);
    ctxJ.beginPath();
    ctxJ.moveTo(0, 0);
    ctxJ.bezierCurveTo(js * 0.24, -js * 0.12, js * 0.24, -js * 0.38, 0, -js * 0.42);
    ctxJ.bezierCurveTo(-js * 0.24, -js * 0.38, -js * 0.24, -js * 0.12, 0, 0);
    ctxJ.fill();
    ctxJ.restore();
  }

  // Golden center pistil
  ctxJ.shadowBlur = 0;
  ctxJ.fillStyle = '#dfb35a';
  ctxJ.beginPath();
  ctxJ.arc(jx, jy, js * 0.08, 0, Math.PI * 2);
  ctxJ.fill();
  sprites['jasmine-mogra'] = cJasmine;

  // 3. Star Jasmine Floret
  const cStar = document.createElement('canvas');
  cStar.width = 100;
  cStar.height = 100;
  const ctxS = cStar.getContext('2d');
  const sx = 50, sy = 50, ss = 40;

  ctxS.shadowColor = 'rgba(60, 20, 25, 0.2)';
  ctxS.shadowBlur = 4;
  ctxS.fillStyle = '#ffffff';
  ctxS.beginPath();
  for (let petal = 0; petal < 5; petal++) {
    const a = (petal * Math.PI * 2) / 5;
    const px = sx + Math.cos(a) * (ss * 0.42);
    const py = sy + Math.sin(a) * (ss * 0.42);
    ctxS.ellipse(px, py, ss * 0.24, ss * 0.13, a, 0, Math.PI * 2);
  }
  ctxS.fill();

  ctxS.shadowBlur = 0;
  ctxS.fillStyle = '#dfb35a';
  ctxS.beginPath();
  ctxS.arc(sx, sy, ss * 0.08, 0, Math.PI * 2);
  ctxS.fill();
  sprites['jasmine-star'] = cStar;

  // 4. Single Curved Jasmine Petal
  const cPetal = document.createElement('canvas');
  cPetal.width = 80;
  cPetal.height = 80;
  const ctxP = cPetal.getContext('2d');
  ctxP.shadowColor = 'rgba(60, 20, 25, 0.18)';
  ctxP.shadowBlur = 4;
  ctxP.fillStyle = '#ffffff';
  ctxP.beginPath();
  ctxP.moveTo(40, 12);
  ctxP.bezierCurveTo(58, 28, 62, 54, 40, 68);
  ctxP.bezierCurveTo(18, 54, 22, 28, 40, 12);
  ctxP.fill();
  sprites['jasmine-petal'] = cPetal;

  cachedSprites = sprites;
  return sprites;
}

/**
 * ParchmentFlowerCascade Component
 * Slow, majestic, unhurried cascade of pink bougainvillea and white jasmine blossoms
 * that float outward and downward from the center behind the lifting seal.
 */
export default function ParchmentFlowerCascade({ active, origin, onComplete }) {
  const canvasRef = useRef(null);
  const animIdRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sprites = getCascadeSprites();

    const width = (canvas.width = document.documentElement.clientWidth || window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const originX = origin?.x ?? width / 2;
    const originY = origin?.y ?? height * 0.48;

    // 65 particles: 55% Pink Bougainvillea, 45% White Jasmine
    const particles = [];
    const TOTAL_PARTICLES = 68;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const rand = Math.random();
      let spriteKey;

      if (rand < 0.22) {
        spriteKey = 'bougainvillea-0';
      } else if (rand < 0.40) {
        spriteKey = 'bougainvillea-1';
      } else if (rand < 0.55) {
        spriteKey = 'bougainvillea-2';
      } else if (rand < 0.78) {
        spriteKey = 'jasmine-mogra';
      } else if (rand < 0.90) {
        spriteKey = 'jasmine-star';
      } else {
        spriteKey = 'jasmine-petal';
      }

      // Initial gentle puff outward from behind the seal
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 2.8;

      particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.7 - (0.8 + Math.random() * 1.6), // gentle puff upward
        spriteKey,
        size:
          spriteKey.startsWith('bougainvillea')
            ? 22 + Math.random() * 16
            : spriteKey === 'jasmine-mogra'
            ? 24 + Math.random() * 14
            : 18 + Math.random() * 12,
        rotZ: Math.random() * Math.PI * 2,
        baseRotZ: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.035,
        rotX: Math.random() * Math.PI * 2,
        rotXSpeed: (Math.random() - 0.5) * 0.05,
        rotY: Math.random() * Math.PI * 2,
        rotYSpeed: (Math.random() - 0.5) * 0.045,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.02 + Math.random() * 0.02,
        swayAmp: 1.4 + Math.random() * 2.0,
        // Fluid, unhurried, slow aerodynamic drift
        gravity: 0.038 + Math.random() * 0.025,
        drag: 0.982,
        terminalVy: 1.3 + Math.random() * 0.8, // slow & graceful
        delay: Math.floor(Math.random() * 30), // staggered release from seal
        alpha: 1,
        age: 0,
        lifeSpan: 260 + Math.random() * 50,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      let activeCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (frame < p.delay) {
          activeCount++;
          continue;
        }

        p.age++;

        // Aerodynamic drag & buoyant terminal fall
        p.vx *= p.drag;
        p.vy = Math.min(p.terminalVy, p.vy + p.gravity);

        // Soft sinusoidal breeze sway
        const windSway = Math.sin(p.swayPhase + frame * p.swaySpeed) * p.swayAmp;

        p.x += p.vx + windSway * 0.45;
        p.y += p.vy;

        // 3D tumbling rotation
        p.rotZ += p.rotSpeed;
        p.rotX += p.rotXSpeed;
        p.rotY += p.rotYSpeed;

        // Settling behavior at bottom: gentle deceleration as it reaches bottom
        if (p.y > height - 70) {
          p.vy *= 0.92;
          p.vx *= 0.92;
        }

        // Graceful fade out in the final 60 frames
        const fadeStart = p.lifeSpan - 60;
        if (p.age > fadeStart) {
          p.alpha = Math.max(0, 1 - (p.age - fadeStart) / 60);
        }

        if (p.alpha <= 0 || p.y > height + 40) {
          continue;
        }

        activeCount++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotZ);

        // 3D foreshortening
        const scaleX = Math.cos(p.rotX);
        const scaleY = Math.sin(p.rotY);
        ctx.scale(Math.abs(scaleX) > 0.08 ? scaleX : 0.08, Math.abs(scaleY) > 0.08 ? scaleY : 0.08);
        ctx.globalAlpha = p.alpha;

        const sprite = sprites[p.spriteKey];
        if (sprite) {
          const s = p.size;
          ctx.drawImage(sprite, -s / 2, -s / 2, s, s);
        }

        ctx.restore();
      }

      if (activeCount > 0) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, [active, origin, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="parchment-flower-cascade-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10005,
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'contents',
      }}
    />
  );
}
