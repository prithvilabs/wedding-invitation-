/*
 * The ornamental card, in its two proportions. Every layer (paper, coating, border) is drawn
 * from the same outline, so they always line up, and the artwork is never stretched.
 */
export const SHAPES = {
  phone: {
    key: 'phone',
    w: 350,
    h: 300,
    path:
      'M62 7H288C298 7 306 12 309 21C322 22 333 33 333 48C341 58 344 102 344 150C344 198 341 242 333 252' +
      'C333 267 322 278 309 279C306 288 298 293 288 293H62C52 293 44 288 41 279C28 278 17 267 17 252' +
      'C9 242 6 198 6 150C6 102 9 58 17 48C17 33 28 22 41 21C44 12 52 7 62 7Z',
    flowers: [
      { x: 19, y: 200, w: 60 },
      { x: 331, y: 200, w: 60, flip: true }
    ],
    title: { lines: ['Scratch to Reveal', 'the Date'], size: 40, y: [118, 161], ornamentTop: 64, ornamentBottom: 188 },
    // the demonstration swipe, as a path the finger follows
    demo: [[108, 222], [242, 214], [116, 250], [236, 246]],
    demoWidth: 22,
    brush: 30
  },
  wide: {
    key: 'wide',
    w: 706,
    h: 244,
    path:
      'M96 6H610C622 6 631 12 634 22C650 23 664 36 666 54C688 64 699 92 699 122C699 152 688 180 666 190' +
      'C664 208 650 221 634 222C631 232 622 238 610 238H96C84 238 75 232 72 222C56 221 42 208 40 190' +
      'C18 180 7 152 7 122C7 92 18 64 40 54C42 36 56 23 72 22C75 12 84 6 96 6Z',
    flowers: [
      { x: 36, y: 66, w: 92 },
      { x: 670, y: 66, w: 92, flip: true }
    ],
    title: { lines: ['Scratch to Reveal the Date'], size: 50, y: [124], ornamentTop: 58, ornamentBottom: 160 },
    demo: [[262, 190], [438, 180], [276, 212], [430, 208]],
    demoWidth: 24,
    brush: 36
  }
};

const FONT = '"Alex Brush", "Great Vibes", cursive';
export const loadTitleFont = () =>
  document.fonts?.load ? document.fonts.load(`40px ${FONT}`, 'Scratch to Reveal') : Promise.resolve();

/** Small repeatable "random" numbers, so the coating looks the same on every redraw */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function lotus(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  [-68, 68, -36, 36, 0].forEach((deg) => {
    ctx.save();
    ctx.rotate((deg * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-r * 0.42, -r * 0.4, -r * 0.3, -r * 0.85, 0, -r * 1.15);
    ctx.bezierCurveTo(r * 0.3, -r * 0.85, r * 0.42, -r * 0.4, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

function ornament(ctx, cx, y, half, gap) {
  ctx.beginPath();
  ctx.moveTo(cx - half, y);
  ctx.lineTo(cx - gap, y);
  ctx.moveTo(cx + gap, y);
  ctx.lineTo(cx + half, y);
  ctx.stroke();
  [-1, 1].forEach((side) => {
    const x = cx + side * gap;
    ctx.beginPath();
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x, y - 3);
    ctx.lineTo(x + 3, y);
    ctx.lineTo(x, y + 3);
    ctx.fill();
  });
}

/** Print the champagne-rose coating. `ctx` is already scaled to the shape's own units. */
export function drawCoating(ctx, shape) {
  const { w, h, title } = shape;
  const cx = w / 2;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  ctx.clip(new Path2D(shape.path));

  // satin champagne-rose base
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, '#dca28c');
  base.addColorStop(0.22, '#f3cdaa');
  base.addColorStop(0.46, '#e2ab92');
  base.addColorStop(0.66, '#f6d6b4');
  base.addColorStop(1, '#d1937f');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // woven lattice of tiny lotus buds
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = 'rgba(255, 244, 220, 0.3)';
  ctx.beginPath();
  for (let x = -h; x < w + h; x += 26) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.moveTo(x, 0);
    ctx.lineTo(x - h, h);
  }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 246, 226, 0.26)';
  ctx.strokeStyle = 'rgba(138, 78, 46, 0.2)';
  ctx.lineWidth = 0.4;
  for (let row = 0, y = 13; y < h + 13; y += 13, row++) {
    for (let x = row % 2 ? 0 : 13; x < w + 13; x += 26) if (row % 2) lotus(ctx, x, y + 4, 5);
  }

  // fine metallic grain
  const rnd = seeded(11);
  for (let i = 0; i < w * h * 0.018; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(255,250,232,0.28)' : 'rgba(120,64,38,0.12)';
    ctx.fillRect(rnd() * w, rnd() * h, 0.9, 0.9);
  }

  // a soft light in the middle keeps the lettering easy to read
  const light = ctx.createRadialGradient(cx, h * 0.46, 10, cx, h * 0.46, w * 0.44);
  light.addColorStop(0, 'rgba(255, 238, 208, 0.85)');
  light.addColorStop(0.6, 'rgba(252, 226, 188, 0.45)');
  light.addColorStop(1, 'rgba(252, 226, 188, 0)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);

  // ornaments and lettering
  ctx.strokeStyle = '#8f5a22';
  ctx.fillStyle = '#8f5a22';
  ctx.lineWidth = 1;
  ornament(ctx, cx, title.ornamentTop, 92, 20);
  ornament(ctx, cx, title.ornamentBottom, 70, 14);
  [[0, 3.4], [-7, 1.5], [7, 1.5]].forEach(([dx, r]) => {
    ctx.beginPath();
    ctx.arc(cx + dx, title.ornamentBottom, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = 'rgba(122, 28, 48, 0.85)';
  ctx.strokeStyle = 'rgba(255, 240, 214, 0.9)';
  ctx.lineWidth = 0.6;
  lotus(ctx, cx, title.ornamentTop + 5, 12);
  ctx.fillStyle = '#520c1c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${title.size}px ${FONT}`;
  title.lines.forEach((line, i) => ctx.fillText(line, cx, title.y[i]));
  ctx.restore();
}

/** Rub the coating away along a stroke (a list of [x, y] in the shape's units) */
export function eraseStroke(ctx, shape, points) {
  if (!points.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // a soft outer edge, then a clean core: like rubbing off a printed coating
  [[2, 0.35], [1.72, 1]].forEach(([width, alpha]) => {
    ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
    ctx.lineWidth = shape.brush * width;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    if (points.length === 1) ctx.lineTo(points[0][0] + 0.01, points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * How much has been scratched: a coarse grid over the card, ticked off as the brush passes.
 * No pixels are ever read back, so this costs almost nothing on a phone.
 */
export function createProgressGrid(shape) {
  const CELL = 9;
  const cols = Math.ceil(shape.w / CELL);
  const rows = Math.ceil(shape.h / CELL);
  const probe = document.createElement('canvas').getContext('2d');
  const outline = new Path2D(shape.path);
  const state = new Uint8Array(cols * rows); // 0 outside, 1 covered, 2 scratched
  let total = 0;
  let done = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (probe.isPointInPath(outline, (c + 0.5) * CELL, (r + 0.5) * CELL)) {
        state[r * cols + c] = 1;
        total++;
      }
    }
  }
  const reach = shape.brush * 0.9;
  return {
    mark([x1, y1], [x2, y2]) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len2 = dx * dx + dy * dy;
      const c0 = Math.max(0, Math.floor((Math.min(x1, x2) - reach) / CELL));
      const c1 = Math.min(cols - 1, Math.floor((Math.max(x1, x2) + reach) / CELL));
      const r0 = Math.max(0, Math.floor((Math.min(y1, y2) - reach) / CELL));
      const r1 = Math.min(rows - 1, Math.floor((Math.max(y1, y2) + reach) / CELL));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const i = r * cols + c;
          if (state[i] !== 1) continue;
          const px = (c + 0.5) * CELL - x1;
          const py = (r + 0.5) * CELL - y1;
          const t = len2 ? Math.min(1, Math.max(0, (px * dx + py * dy) / len2)) : 0;
          const ex = px - t * dx;
          const ey = py - t * dy;
          if (ex * ex + ey * ey <= reach * reach) {
            state[i] = 2;
            done++;
          }
        }
      }
    },
    fraction: () => (total ? done / total : 0)
  };
}
