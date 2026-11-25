import React, { useId } from 'react';

/*
 * The three celebration illustrations, drawn as gilded line-and-wash vignettes:
 *   pavilion (Pre-Wedding Reception), mandap (Wedding Ceremony), lamps (Post-Wedding Reception).
 * All share a 240 x 210 box, the same gold and the same blossoms.
 */
const LINE = '#8f5f1d';

function Defs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f8e7b8" />
        <stop offset="45%" stopColor="#dcb563" />
        <stop offset="100%" stopColor="#a8742a" />
      </linearGradient>
      <linearGradient id={`${id}pillar`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#b98532" />
        <stop offset="35%" stopColor="#fbeec8" />
        <stop offset="70%" stopColor="#dcb563" />
        <stop offset="100%" stopColor="#9c6a22" />
      </linearGradient>
      <linearGradient id={`${id}cloth`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f6c9c4" />
        <stop offset="100%" stopColor="#d9838a" />
      </linearGradient>
      <radialGradient id={`${id}glow`}>
        <stop offset="0%" stopColor="#ffe6a8" stopOpacity="0.95" />
        <stop offset="60%" stopColor="#ffd9a0" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}petal`}>
        <stop offset="0%" stopColor="#b93a54" />
        <stop offset="55%" stopColor="#e58a98" />
        <stop offset="100%" stopColor="#f7cdcb" />
      </radialGradient>
      <radialGradient id={`${id}petalW`}>
        <stop offset="0%" stopColor="#eab0a4" />
        <stop offset="55%" stopColor="#fbe7dc" />
        <stop offset="100%" stopColor="#fffaf2" />
      </radialGradient>
      <linearGradient id={`${id}flame`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff3c4" />
        <stop offset="50%" stopColor="#ffc24f" />
        <stop offset="100%" stopColor="#e9762b" />
      </linearGradient>
    </defs>
  );
}

function Leaf({ x, y, a, s = 1 }) {
  return (
    <path
      d="M0 0C4 -5 12 -6 17 -1C12 4 5 4 0 0Z"
      fill="#8d9a68"
      stroke="#66744a"
      strokeWidth="0.5"
      transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}
    />
  );
}

function Bloom({ id, x, y, r = 8, white = false }) {
  const fill = `url(#${id}${white ? 'petalW' : 'petal'})`;
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy={-r * 0.58}
          rx={r * 0.5}
          ry={r * 0.64}
          fill={fill}
          stroke="#b5606e"
          strokeWidth="0.35"
          strokeOpacity="0.6"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r={r * 0.2} fill="#e7b64e" stroke={LINE} strokeWidth="0.4" />
    </g>
  );
}

/** A cluster of blooms and leaves sitting at the foot of a scene */
function Posy({ id, x, y, flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <Leaf x={-4} y={-3} a={-150} s={1.1} />
      <Leaf x={10} y={-8} a={-70} />
      <Leaf x={16} y={0} a={-12} s={1.2} />
      <Leaf x={-8} y={4} a={170} s={0.9} />
      <Bloom id={id} x={-2} y={-2} r={10} />
      <Bloom id={id} x={13} y={1} r={8} white />
      <Bloom id={id} x={4} y={-15} r={6.5} white />
      <Bloom id={id} x={-14} y={4} r={5.5} white />
    </g>
  );
}

function Flame({ id, x, y, s = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="13" cy="-6" fill={`url(#${id}glow)`} />
      <path
        className="evt-flame"
        style={{ animationDelay: `${delay}s` }}
        d="M0 0C-4.4 -3 -3.6 -8 0 -14C3.6 -8 4.4 -3 0 0Z"
        fill={`url(#${id}flame)`}
      />
    </g>
  );
}

/** A turned pillar with a base and capital */
function Pillar({ id, x, top, bottom, w = 8 }) {
  const h = bottom - top;
  return (
    <g stroke={LINE} strokeWidth="0.7">
      <rect x={x - w / 2} y={top + 6} width={w} height={h - 12} fill={`url(#${id}pillar)`} />
      <rect x={x - w * 0.85} y={top} width={w * 1.7} height="6" rx="1" fill={`url(#${id}gold)`} />
      <rect x={x - w * 0.85} y={bottom - 6} width={w * 1.7} height="6" rx="1" fill={`url(#${id}gold)`} />
      <ellipse cx={x} cy={top + h * 0.36} rx={w * 0.72} ry="3" fill={`url(#${id}gold)`} />
      <ellipse cx={x} cy={top + h * 0.66} rx={w * 0.72} ry="3" fill={`url(#${id}gold)`} />
    </g>
  );
}

function Finial({ id, x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={`url(#${id}gold)`} stroke={LINE} strokeWidth="0.7">
      <path d="M-7 0C-7 -6 7 -6 7 0Z" />
      <ellipse cy="-7.5" rx="4.6" ry="4" />
      <path d="M-2.4 -11C-2.4 -16 0 -18 0 -24C0 -18 2.4 -16 2.4 -11Z" />
    </g>
  );
}

/** Swags of cloth between two points */
function Swags({ id, x1, x2, y, n, depth = 12 }) {
  const step = (x2 - x1) / n;
  return Array.from({ length: n }, (_, i) => {
    const a = x1 + step * i;
    const b = a + step;
    const mid = (a + b) / 2;
    return (
      <g key={i}>
        <path d={`M${a} ${y}Q${mid} ${y + depth * 2} ${b} ${y}Z`} fill={`url(#${id}cloth)`} stroke="#b5606e" strokeWidth="0.5" />
        <path d={`M${a + step * 0.18} ${y}Q${mid} ${y + depth * 1.2} ${b - step * 0.18} ${y}`} fill="none" stroke="#fff1ea" strokeWidth="0.7" opacity="0.8" />
        <path d={`M${a} ${y}Q${mid} ${y + depth * 2} ${b} ${y}`} fill="none" stroke="#dcb563" strokeWidth="1.2" />
      </g>
    );
  });
}

/** A hanging string of flowers */
function Strand({ x, y, n, gap = 5, a = '#e8a23b', b = '#fff8ec', r = 2.5 }) {
  return Array.from({ length: n }, (_, i) => (
    <circle key={i} cx={x} cy={y + i * gap} r={r} fill={i % 2 ? b : a} stroke={LINE} strokeOpacity="0.35" strokeWidth="0.4" />
  ));
}

function Pavilion({ id }) {
  const gold = `url(#${id}gold)`;
  return (
    <>
      <circle cx="120" cy="112" r="92" fill={`url(#${id}glow)`} opacity="0.75" />
      <g stroke={LINE} strokeWidth="0.8">
        <path d="M36 178H204L212 190H28Z" fill="#f5e2c4" />
        <path d="M30 190H210V197H30Z" fill={gold} />
        <path d="M46 168H194V178H46Z" fill={gold} />
      </g>
      <path d="M62 112H178V168H62Z" fill="#fff1d6" opacity="0.7" />
      <Pillar id={id} x={92} top={110} bottom={168} w={5} />
      <Pillar id={id} x={148} top={110} bottom={168} w={5} />
      <path d="M104 168V140C104 128 136 128 136 140V168Z" fill="#ffe7b4" stroke="#dcb563" strokeWidth="1" />
      <g stroke={LINE} strokeWidth="0.8">
        <path d="M100 168H140L152 203H88Z" fill="#fbeedb" />
        <path d="M98 175H142M95 182H145M93 189H147M90 196H150" fill="none" />
      </g>
      <Pillar id={id} x={58} top={108} bottom={170} w={9} />
      <Pillar id={id} x={182} top={108} bottom={170} w={9} />
      <Swags id={id} x1={50} x2={190} y={111} n={5} depth={9} />
      <Strand x={78} y={122} n={5} gap={4.6} a="#d9838a" r={2.1} />
      <Strand x={162} y={122} n={5} gap={4.6} a="#d9838a" r={2.1} />
      <g fill={gold} stroke={LINE} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M34 110C42 106 46 98 50 92H190C194 98 198 106 206 110L198 112H42Z" />
        <path d="M58 92C66 88 70 80 74 74H166C170 80 174 88 182 92Z" />
        <path d="M80 74C84 54 102 46 120 38C138 46 156 54 160 74Z" />
      </g>
      <g fill="none" stroke={LINE} strokeWidth="0.6" opacity="0.75">
        <path d="M88 72C92 58 106 50 120 42C134 50 148 58 152 72M104 73C106 60 112 52 120 44C128 52 134 60 136 73M120 42V74" />
        {Array.from({ length: 15 }, (_, i) => (
          <path key={i} d={`M${60 + i * 8} 98C${60 + i * 8} 104 ${68 + i * 8} 104 ${68 + i * 8} 98`} />
        ))}
        <path d="M84 82H156M82 86H158" />
      </g>
      <Finial id={id} x={120} y={40} />
      <Finial id={id} x={40} y={108} s={0.5} />
      <Finial id={id} x={200} y={108} s={0.5} />
      <Posy id={id} x={40} y={184} />
      <Posy id={id} x={200} y={184} flip />
    </>
  );
}

function BananaLeaf({ x, y, flip }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} stroke="#5f7045" strokeWidth="0.6">
      <path d="M0 94C-2 60 0 30 4 6" fill="none" stroke="#8d9a68" strokeWidth="4" strokeLinecap="round" />
      <path d="M3 30C-14 22 -22 4 -18 -16C-6 -6 2 10 3 30Z" fill="#93a56b" />
      <path d="M4 22C8 2 18 -10 30 -14C28 4 18 18 4 22Z" fill="#a5b47c" />
      <path d="M3 42C-10 42 -24 36 -28 22C-15 20 -4 28 3 42Z" fill="#82955c" />
      <path d="M4 16C0 -4 4 -20 10 -30C16 -16 12 2 4 16Z" fill="#b1be88" />
    </g>
  );
}

function Mandap({ id }) {
  const gold = `url(#${id}gold)`;
  return (
    <>
      <circle cx="120" cy="116" r="92" fill={`url(#${id}glow)`} opacity="0.75" />
      <BananaLeaf x={36} y={92} />
      <BananaLeaf x={204} y={92} flip />
      <g stroke={LINE} strokeWidth="0.8">
        <path d="M38 184H202L210 198H30Z" fill="#f5e2c4" />
        <path d="M46 174H194V184H46Z" fill={gold} />
      </g>
      <path d="M62 96H178V174H62Z" fill="#fff1d6" opacity="0.55" />
      {[80, 92, 104, 136, 148, 160].map((x, i) => (
        <g key={x} opacity="0.85">
          <Strand x={x} y={100} n={i % 2 ? 9 : 11} gap={4.4} r={1.9} a={i % 2 ? '#d9838a' : '#e8a23b'} />
        </g>
      ))}
      <Pillar id={id} x={58} top={92} bottom={176} w={10} />
      <Pillar id={id} x={182} top={92} bottom={176} w={10} />
      {/* gopuram-style crown */}
      <g fill={gold} stroke={LINE} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M40 94L48 80H192L200 94Z" />
        <path d="M62 80L70 66H170L178 80Z" />
        <path d="M84 66L90 54H150L156 66Z" />
        <path d="M100 54C102 42 138 42 140 54Z" />
      </g>
      <g fill="none" stroke={LINE} strokeWidth="0.6" opacity="0.75">
        {[62, 80, 98, 116, 134, 152, 170].map((x) => (
          <path key={x} d={`M${x} 92V86A4 4 0 0 1 ${x + 8} 86V92`} />
        ))}
        {[80, 98, 116, 134, 152].map((x) => (
          <path key={x} d={`M${x} 79V74A4 4 0 0 1 ${x + 8} 74V79`} />
        ))}
        <path d="M98 64V60A3 3 0 0 1 104 60V64M117 64V60A3 3 0 0 1 123 60V64M136 64V60A3 3 0 0 1 142 60V64" />
      </g>
      <Finial id={id} x={120} y={46} s={0.9} />
      <Finial id={id} x={94} y={55} s={0.45} />
      <Finial id={id} x={146} y={55} s={0.45} />
      {/* marigold and jasmine garland across the front */}
      {Array.from({ length: 31 }, (_, i) => {
        const t = i / 30;
        const x = 54 + 132 * t;
        const y = 98 + Math.abs(Math.sin(t * Math.PI * 3)) * 11;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3.4"
            fill={['#fff6e6', '#f0a640', '#e8862f'][i % 3]}
            stroke={LINE}
            strokeOpacity="0.4"
            strokeWidth="0.4"
          />
        );
      })}
      <Strand x={66} y={106} n={10} gap={5} r={2.6} />
      <Strand x={174} y={106} n={10} gap={5} r={2.6} />
      {/* the sacred fire, and a kalasam either side */}
      <g stroke={LINE} strokeWidth="0.8">
        <path d="M102 174L108 160H132L138 174Z" fill={gold} />
        <path d="M106 160H134V156H106Z" fill="#f3d79a" />
      </g>
      <Flame id={id} x={113} y={157} s={0.95} />
      <Flame id={id} x={127} y={157} s={0.95} delay={-0.8} />
      <Flame id={id} x={120} y={156} s={1.35} delay={-0.4} />
      {[84, 156].map((x) => (
        <g key={x} transform={`translate(${x} 174)`} stroke={LINE} strokeWidth="0.7">
          <path d="M0 -18L-7 -27M0 -18V-30M0 -18L7 -27" stroke="#6f8050" strokeWidth="2.4" strokeLinecap="round" />
          <circle cy="-21" r="4.4" fill="#b88a4a" />
          <path d="M-8 -2C-11 -12 -6 -15 -5 -18H5C6 -15 11 -12 8 -2Z" fill={gold} />
          <path d="M-9 0H9V-3H-9Z" fill="#f3d79a" />
        </g>
      ))}
      <Posy id={id} x={46} y={190} />
      <Posy id={id} x={194} y={190} flip />
    </>
  );
}

/** A traditional brass kuthuvilakku; origin at the middle of its foot */
function Kuthuvilakku({ id, x, y, s = 1, wicks = 5 }) {
  const gold = `url(#${id}pillar)`;
  const span = wicks > 3 ? 33 : 31;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill={gold} stroke={LINE} strokeWidth="0.9" strokeLinejoin="round">
        <path d="M-34 0C-34 -8 -22 -10 -12 -14H12C22 -10 34 -8 34 0Z" />
        <path d="M-24 -13C-22 -20 -12 -22 -8 -26H8C12 -22 22 -20 24 -13Z" />
        <path d="M-5 -26C-9 -34 -4 -40 -4 -46H4C4 -40 9 -34 5 -26Z" />
        <ellipse cy="-47" rx="9" ry="3.6" />
        <path d="M-4 -50C-8 -58 -3 -66 -3 -74H3C3 -66 8 -58 4 -50Z" />
        <ellipse cy="-75" rx="8" ry="3.4" />
        <path d="M-4 -78C-7 -84 -3 -90 -3 -96H3C3 -90 7 -84 4 -78Z" />
      </g>
      <path d="M-24 -4H24M-16 -17H16" stroke={LINE} strokeWidth="0.6" opacity="0.6" fill="none" />
      {/* oil bowl */}
      <path d="M-38 -110C-34 -98 -16 -95 0 -95C16 -95 34 -98 38 -110Z" fill={gold} stroke={LINE} strokeWidth="0.9" />
      <ellipse cy="-110" rx="38" ry="6" fill={`url(#${id}gold)`} stroke={LINE} strokeWidth="0.9" />
      <ellipse cy="-110" rx="29" ry="3.6" fill={LINE} opacity="0.45" />
      {/* centre stem and finial */}
      <g fill={gold} stroke={LINE} strokeWidth="0.9">
        <path d="M-4 -110C-6 -118 -2 -122 -2 -128H2C2 -122 6 -118 4 -110Z" />
        <ellipse cy="-129" rx="6" ry="2.6" />
        <path d="M-7 -131C-9 -140 -3 -143 0 -152C3 -143 9 -140 7 -131Z" />
        <circle cy="-153" r="2.2" />
      </g>
      {Array.from({ length: wicks }, (_, i) => {
        const t = (i / (wicks - 1)) * 2 - 1;
        if (Math.abs(t) < 0.05) return null; // the stem stands here
        return <Flame key={i} id={id} x={t * span} y={-111 + (1 - Math.abs(t)) * 4} s={1.05} delay={-i * 0.35} />;
      })}
    </g>
  );
}

function Lamps({ id }) {
  return (
    <>
      <circle cx="120" cy="96" r="94" fill={`url(#${id}glow)`} opacity="0.85" />
      <path d="M24 193C60 183 180 183 216 193C180 204 60 204 24 193Z" fill="#f3dcbf" stroke="#dcb563" strokeWidth="0.8" />
      <Kuthuvilakku id={id} x={50} y={190} s={0.62} wicks={3} />
      <Kuthuvilakku id={id} x={190} y={190} s={0.62} wicks={3} />
      <Kuthuvilakku id={id} x={120} y={194} s={1.1} wicks={5} />
      {/* garland on the tall lamp */}
      {Array.from({ length: 15 }, (_, i) => {
        const t = (i / 14) * Math.PI;
        return (
          <circle
            key={i}
            cx={120 - Math.cos(t) * 15}
            cy={106 + Math.sin(t) * 30}
            r="3"
            fill={i % 2 ? '#fff6e6' : '#e58a98'}
            stroke="#b5606e"
            strokeWidth="0.4"
          />
        );
      })}
      <Posy id={id} x={84} y={195} />
      <Posy id={id} x={156} y={195} flip />
      <Bloom id={id} x={24} y={193} r={6} white />
      <Bloom id={id} x={216} y={193} r={6} white />
    </>
  );
}

const SCENES = { pavilion: Pavilion, mandap: Mandap, lamps: Lamps };

export default function EventIllustration({ art, className }) {
  const id = `ev${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const Scene = SCENES[art] || Pavilion;
  return (
    <svg className={className} viewBox="14 8 212 200" aria-hidden="true" focusable="false">
      <Defs id={id} />
      <Scene id={id} />
    </svg>
  );
}
