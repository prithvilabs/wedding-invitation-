const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function buildMasterBackground() {
  const width = 1920;
  const height = 1080;

  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Sky Gradient: Warm blush, champagne, golden hour sunset -->
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#dfb8ad" />
        <stop offset="30%" stop-color="#ecc6b5" />
        <stop offset="60%" stop-color="#f8dcce" />
        <stop offset="85%" stop-color="#fce7db" />
        <stop offset="100%" stop-color="#fdf4ec" />
      </linearGradient>

      <!-- Golden Hour Sun Glow -->
      <radialGradient id="sunGlow" cx="72%" cy="60%" r="50%">
        <stop offset="0%" stop-color="#fff8eb" stop-opacity="0.95" />
        <stop offset="15%" stop-color="#ffd599" stop-opacity="0.65" />
        <stop offset="40%" stop-color="#f8ab90" stop-opacity="0.35" />
        <stop offset="75%" stop-color="#f37a88" stop-opacity="0" />
      </radialGradient>

      <!-- Lake Water Gradient -->
      <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#8d7285" />
        <stop offset="40%" stop-color="#aa8a98" />
        <stop offset="75%" stop-color="#cda8a0" />
        <stop offset="100%" stop-color="#dfbbb0" />
      </linearGradient>

      <!-- Mountain Silhouettes with Atmospheric Haze -->
      <linearGradient id="mountainGrad1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#826478" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#af8995" stop-opacity="0.35" />
      </linearGradient>

      <linearGradient id="mountainGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#64445c" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#966c7b" stop-opacity="0.5" />
      </linearGradient>

      <!-- Terrace Stone Gradient -->
      <linearGradient id="terraceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d8c5ba" />
        <stop offset="30%" stop-color="#ebdcd2" />
        <stop offset="70%" stop-color="#f5eae2" />
        <stop offset="100%" stop-color="#e8d9cf" />
      </linearGradient>

      <!-- Terrace Reflection Glow -->
      <radialGradient id="terraceReflection" cx="68%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fff1d6" stop-opacity="0.4" />
        <stop offset="50%" stop-color="#ffd599" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#ebdcd2" stop-opacity="0" />
      </radialGradient>

      <!-- Clean Central Spotlight Scrim (Ensures text pops with 100% legibility) -->
      <radialGradient id="centerScrim" cx="50%" cy="40%" r="42%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45" />
        <stop offset="50%" stop-color="#faf2ea" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#f5e4d8" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- 1. Sky Base -->
    <rect width="${width}" height="${height}" fill="url(#skyGrad)" />

    <!-- 2. Sunset Sun Glow -->
    <circle cx="1380" cy="650" r="360" fill="url(#sunGlow)" />

    <!-- 3. Distant Mountain Ridge 1 (Far haze) -->
    <path d="M 0 650 Q 350 620 700 655 T 1400 630 Q 1700 600 1920 640 L 1920 780 L 0 780 Z" fill="url(#mountainGrad1)" />

    <!-- 4. Mid Mountain Ridge 2 -->
    <path d="M 0 680 Q 280 650 620 675 T 1250 660 Q 1580 630 1920 670 L 1920 800 L 0 800 Z" fill="url(#mountainGrad2)" />

    <!-- 5. Calm Lake Water -->
    <rect y="690" width="${width}" height="140" fill="url(#lakeGrad)" opacity="0.9" />
    <ellipse cx="1380" cy="730" rx="220" ry="32" fill="#fff2d6" opacity="0.55" />

    <!-- 6. Marble Terrace Balustrade / Ledge -->
    <path d="M 0 770 Q 960 755 1920 770 L 1920 810 Q 960 795 0 810 Z" fill="#c6b5a9" />
    <path d="M 0 780 Q 960 765 1920 780 L 1920 800 Q 960 785 0 800 Z" fill="#f5ebe3" />

    <!-- 7. Terrace Marble Floor -->
    <path d="M 0 800 Q 960 785 1920 800 L 1920 1080 L 0 1080 Z" fill="url(#terraceGrad)" />
    <rect y="800" width="${width}" height="280" fill="url(#terraceReflection)" />

    <!-- 8. Central Negative Space Clean Scrim (Spacious & uncluttered) -->
    <ellipse cx="960" cy="440" rx="580" ry="360" fill="url(#centerScrim)" />

    <!-- 9. Left Framing: Sheer Flowing Ivory Drapery & Bougainvillea -->
    <g id="leftFraming">
      <!-- Sheer curtain fold 1 -->
      <path d="M -40 0 C 80 200, 160 500, 90 900 C 60 1000, 20 1080, -20 1080 Z" fill="#ffffff" opacity="0.45" />
      <path d="M -10 0 C 110 250, 180 550, 120 920 C 80 1020, 40 1080, 0 1080 Z" fill="#fcf8f3" opacity="0.65" />
      <path d="M 0 0 C 90 200, 130 450, 70 850 L 0 850 Z" fill="#fffdfa" opacity="0.8" />

      <!-- Hanging Brass Glass Lanterns (Left Side Only) -->
      <g transform="translate(160, 140)">
        <line x1="0" y1="-140" x2="0" y2="0" stroke="#8a6d3b" stroke-width="2" />
        <rect x="-25" y="0" width="50" height="85" rx="6" fill="none" stroke="#bfa15f" stroke-width="3" />
        <rect x="-21" y="4" width="42" height="77" rx="4" fill="#fff9e6" opacity="0.35" />
        <!-- Candle glow -->
        <circle cx="0" cy="48" r="28" fill="#ffb347" opacity="0.45" />
        <rect x="-7" y="40" width="14" height="28" rx="3" fill="#ffeed1" />
        <path d="M 0 30 Q 5 36 0 42 Q -5 36 0 30 Z" fill="#ff8c00" />
      </g>

      <g transform="translate(270, 220)">
        <line x1="0" y1="-220" x2="0" y2="0" stroke="#8a6d3b" stroke-width="2" />
        <rect x="-22" y="0" width="44" height="75" rx="5" fill="none" stroke="#bfa15f" stroke-width="3" />
        <rect x="-18" y="4" width="36" height="67" rx="3" fill="#fff9e6" opacity="0.35" />
        <circle cx="0" cy="42" r="24" fill="#ffb347" opacity="0.45" />
        <rect x="-6" y="35" width="12" height="24" rx="2" fill="#ffeed1" />
        <path d="M 0 26 Q 4 32 0 37 Q -4 32 0 26 Z" fill="#ff8c00" />
      </g>

      <!-- Lush Floral Bougainvillea & White Roses on Upper Left -->
      <g transform="translate(0, -20)">
        <path d="M 0 30 Q 180 80, 360 140" stroke="#4a3c31" stroke-width="6" fill="none" />
        <path d="M 60 70 Q 240 120, 420 220" stroke="#4a3c31" stroke-width="4" fill="none" />
        
        <circle cx="120" cy="60" r="24" fill="#d84b76" opacity="0.9" />
        <circle cx="145" cy="75" r="20" fill="#e8658b" opacity="0.9" />
        <circle cx="200" cy="90" r="26" fill="#d84b76" opacity="0.88" />
        <circle cx="235" cy="110" r="22" fill="#f28da9" opacity="0.92" />
        <circle cx="300" cy="130" r="25" fill="#e8658b" opacity="0.9" />
        <circle cx="340" cy="150" r="20" fill="#f7a6bc" opacity="0.85" />
        <circle cx="380" cy="180" r="18" fill="#d84b76" opacity="0.85" />

        <ellipse cx="160" cy="50" rx="16" ry="8" fill="#556b2f" transform="rotate(25 160 50)" />
        <ellipse cx="260" cy="90" rx="18" ry="9" fill="#4e632b" transform="rotate(-15 260 90)" />
        <ellipse cx="330" cy="120" rx="15" ry="8" fill="#5d7535" transform="rotate(35 330 120)" />
      </g>

      <!-- Terrace Floor Floral Cluster (Left Corner Only) -->
      <g transform="translate(80, 840)">
        <ellipse cx="80" cy="60" rx="120" ry="40" fill="#d64573" opacity="0.4" />
        <circle cx="60" cy="40" r="35" fill="#ffffff" opacity="0.95" />
        <circle cx="110" cy="30" r="30" fill="#fce4ec" opacity="0.95" />
        <circle cx="40" cy="65" r="28" fill="#e8658b" opacity="0.9" />
        <circle cx="130" cy="60" r="26" fill="#d84b76" opacity="0.85" />
        
        <!-- Floor Lantern -->
        <rect x="160" y="-10" width="55" height="95" rx="6" fill="none" stroke="#bfa15f" stroke-width="4" />
        <rect x="165" y="-5" width="45" height="85" fill="#fff9e6" opacity="0.4" />
        <circle cx="187" cy="45" r="35" fill="#ffb347" opacity="0.55" />
        <rect x="180" y="35" width="15" height="35" rx="3" fill="#fff5e0" />
      </g>
    </g>

    <!-- 10. Right Framing: Olive Branch, Bougainvillea & Lantern (Right Edge Only) -->
    <g id="rightFraming">
      <g transform="translate(1500, -30)">
        <path d="M 420 30 Q 240 90, 60 160" stroke="#4a3c31" stroke-width="5" fill="none" />
        <circle cx="320" cy="70" r="26" fill="#d84b76" opacity="0.88" />
        <circle cx="270" cy="95" r="22" fill="#f28da9" opacity="0.9" />
        <circle cx="180" cy="125" r="25" fill="#e8658b" opacity="0.85" />
        <circle cx="120" cy="150" r="20" fill="#f7a6bc" opacity="0.85" />
        <circle cx="70" cy="175" r="16" fill="#d84b76" opacity="0.8" />

        <ellipse cx="220" cy="100" rx="16" ry="8" fill="#4e632b" transform="rotate(20 220 100)" />
        <ellipse cx="140" cy="135" rx="15" ry="8" fill="#5d7535" transform="rotate(-25 140 135)" />
      </g>

      <!-- Right Floor Floral Urn & Lantern -->
      <g transform="translate(1640, 830)">
        <circle cx="90" cy="40" r="38" fill="#ffffff" opacity="0.95" />
        <circle cx="40" cy="50" r="32" fill="#fce4ec" opacity="0.9" />
        <circle cx="120" cy="65" r="28" fill="#d84b76" opacity="0.88" />
        <rect x="-40" y="0" width="48" height="85" rx="5" fill="none" stroke="#bfa15f" stroke-width="3.5" />
        <rect x="-36" y="4" width="40" height="77" fill="#fff9e6" opacity="0.4" />
        <circle cx="-16" cy="45" r="30" fill="#ffb347" opacity="0.55" />
        <rect x="-22" y="36" width="13" height="30" rx="2" fill="#fff5e0" />
      </g>
    </g>

    <!-- 11. Delicate Floating Rose Petals (Subtle ambient) -->
    <g id="ambientPetals" opacity="0.85">
      <ellipse cx="460" cy="320" rx="9" ry="6" fill="#d84b76" transform="rotate(42 460 320)" />
      <ellipse cx="580" cy="240" rx="8" ry="5" fill="#e8658b" transform="rotate(-35 580 240)" />
      <ellipse cx="1340" cy="290" rx="10" ry="7" fill="#d84b76" transform="rotate(25 1340 290)" />
      <ellipse cx="1520" cy="450" rx="8" ry="5" fill="#f28da9" transform="rotate(-45 1520 450)" />
      <ellipse cx="380" cy="540" rx="9" ry="6" fill="#d84b76" transform="rotate(15 380 540)" />
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svg);
  const outPathSrc = path.resolve('src/assets/editorial-terrace-backdrop.webp');
  const outPathPublic = path.resolve('public/assets/editorial-terrace-backdrop.webp');

  fs.mkdirSync(path.dirname(outPathSrc), { recursive: true });
  fs.mkdirSync(path.dirname(outPathPublic), { recursive: true });

  await sharp(svgBuffer)
    .webp({ quality: 95 })
    .toFile(outPathSrc);

  await sharp(svgBuffer)
    .webp({ quality: 95 })
    .toFile(outPathPublic);

  console.log('EDITORIAL TERRACE BACKDROP GENERATED SUCCESSFULLY!');
}

buildMasterBackground().catch(console.error);
