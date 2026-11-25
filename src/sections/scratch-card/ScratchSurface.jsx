import React, { useEffect, useRef } from 'react';
import { createProgressGrid, drawCoating, eraseStroke, loadTitleFont } from './plaque';

const MAX_SPARKS = 36;

/**
 * Layer 2: the coating the guest scratches off.
 *   - one set of Pointer Events covers mouse, finger and pen
 *   - strokes are kept in the card's own units, so a resize redraws them exactly
 *   - drawing happens once per frame however fast the finger moves
 */
export default function ScratchSurface({ shape, sparkles, onStart, onProgress }) {
  const coatRef = useRef(null);
  const sparkRef = useRef(null);
  const callbacks = useRef({});
  callbacks.current = { onStart, onProgress };

  useEffect(() => {
    const canvas = coatRef.current;
    const ctx = canvas.getContext('2d');
    const sparkCanvas = sparkRef.current;
    const sparkCtx = sparkCanvas?.getContext('2d');
    const grid = createProgressGrid(shape);
    const strokes = []; // finished and current strokes, in the shape's units
    const sparks = [];
    let current = null;
    let drawnTo = 0; // points of the current stroke already on the canvas
    let activePointer = null;
    let frame = 0;
    let alive = true;

    const fitCanvas = (el, context) => {
      const { clientWidth: cw, clientHeight: ch } = el;
      if (!cw || !ch) return false; // not laid out yet; the ResizeObserver calls again
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const pw = Math.round(cw * dpr);
      const ph = Math.round(ch * dpr);
      if (el.width !== pw || el.height !== ph) {
        el.width = pw;
        el.height = ph;
      }
      context.setTransform(pw / shape.w, 0, 0, ph / shape.h, 0, 0);
      return true;
    };

    const redraw = () => {
      if (!alive || !fitCanvas(canvas, ctx)) return;
      drawCoating(ctx, shape);
      strokes.forEach((points) => eraseStroke(ctx, shape, points));
      drawnTo = current ? current.length : 0;
      if (sparkCtx) fitCanvas(sparkCanvas, sparkCtx);
    };

    redraw();
    // the lettering uses a web font: print it again once that has arrived
    loadTitleFont().then(redraw, () => {});
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);

    const toCard = (e) => {
      const box = canvas.getBoundingClientRect();
      return [((e.clientX - box.left) / box.width) * shape.w, ((e.clientY - box.top) / box.height) * shape.h];
    };

    const addSparks = ([x, y]) => {
      if (!sparkCtx || sparks.length > MAX_SPARKS) return;
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.9;
        sparks.push({
          x: x + Math.cos(angle) * shape.brush * 0.7,
          y: y + Math.sin(angle) * shape.brush * 0.7,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.35,
          r: 1 + Math.random() * 2.1,
          life: 1,
          tone: Math.random() > 0.35 ? '#fff0c2' : '#e9b55c'
        });
      }
    };

    const drawSparks = () => {
      sparkCtx.clearRect(0, 0, shape.w, shape.h);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03;
        s.life -= 0.032;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const r = s.r * (0.5 + s.life);
        sparkCtx.globalAlpha = s.life;
        sparkCtx.fillStyle = s.tone;
        sparkCtx.beginPath();
        sparkCtx.moveTo(s.x, s.y - r * 1.8);
        sparkCtx.quadraticCurveTo(s.x, s.y, s.x + r * 1.8, s.y);
        sparkCtx.quadraticCurveTo(s.x, s.y, s.x, s.y + r * 1.8);
        sparkCtx.quadraticCurveTo(s.x, s.y, s.x - r * 1.8, s.y);
        sparkCtx.quadraticCurveTo(s.x, s.y, s.x, s.y - r * 1.8);
        sparkCtx.fill();
      }
      sparkCtx.globalAlpha = 1;
    };

    const tick = () => {
      frame = 0;
      if (current && drawnTo < current.length) {
        const from = Math.max(0, drawnTo - 1);
        eraseStroke(ctx, shape, current.slice(from));
        for (let i = Math.max(0, drawnTo - 1); i < current.length; i++) {
          grid.mark(current[Math.max(0, i - 1)], current[i]);
        }
        addSparks(current[current.length - 1]);
        drawnTo = current.length;
        callbacks.current.onProgress(grid.fraction());
      }
      if (sparks.length) {
        drawSparks();
        schedule();
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onDown = (e) => {
      if (activePointer !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
      activePointer = e.pointerId;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* the pointer has already gone */
      }
      current = [toCard(e)];
      strokes.push(current);
      drawnTo = 0;
      callbacks.current.onStart();
      schedule();
    };
    const onMove = (e) => {
      if (e.pointerId !== activePointer) return;
      const events = e.getCoalescedEvents?.() ?? [];
      (events.length ? events : [e]).forEach((step) => current.push(toCard(step)));
      schedule();
    };
    const onUp = (e) => {
      if (e.pointerId !== activePointer) return;
      if (frame) {
        cancelAnimationFrame(frame);
        tick();
      }
      activePointer = null;
      current = null;
    };
    // Older iPhones ignore touch-action in places: keep the page still while scratching
    const holdPage = (e) => {
      if (e.cancelable) e.preventDefault();
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('touchmove', holdPage, { passive: false });
    return () => {
      alive = false;
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('touchmove', holdPage);
    };
  }, [shape]);

  return (
    <>
      <canvas
        ref={coatRef}
        id="scratchCanvas"
        className="sc-coat"
        role="img"
        aria-label="A champagne coating covers the wedding date. Scratch to reveal it."
      />
      {sparkles && <canvas ref={sparkRef} className="sc-sparks" aria-hidden="true" />}
    </>
  );
}
