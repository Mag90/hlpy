import React from 'react';

/**
 * Hero backdrop — layered "studio blueprint" composition:
 *  1. Deep vertical gradient base (cool studio → warmer towards bottom)
 *  2. Faint blueprint of a conference room AV setup in rose tones
 *  3. A large soft rose glow moment top-right
 *  4. Subtle technical grid overlay
 */
const HeroCanvas = () => (
  <div
    className="hero-canvas"
    style={{
      background: `
        radial-gradient(ellipse 60% 55% at 85% 15%, rgba(220, 100, 110, 0.22) 0%, transparent 55%),
        radial-gradient(ellipse 50% 45% at 10% 85%, rgba(180, 90, 105, 0.16) 0%, transparent 60%),
        linear-gradient(180deg, oklch(0.13 0.012 250) 0%, oklch(0.16 0.014 270) 100%)
      `,
    }}
  >
    {/* Technical grid */}
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="oklch(0.50 0.04 15 / 0.10)" strokeWidth="0.6" />
        </pattern>
        <pattern id="hero-grid-fine" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="oklch(0.45 0.03 15 / 0.05)" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#hero-grid-fine)" />
      <rect width="1600" height="900" fill="url(#hero-grid)" />

      {/* Blueprint of an AV setup, lower-right area */}
      <g
        stroke="oklch(0.78 0.13 15 / 0.28)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Camera bar above */}
        <rect x="1080" y="380" width="280" height="20" rx="4" />
        <circle cx="1220" cy="390" r="6" />
        {/* Display panel */}
        <rect x="1040" y="410" width="360" height="220" rx="6" />
        <rect x="1054" y="424" width="332" height="192" rx="2" />
        {/* Inner screen marks */}
        <line x1="1054" y1="520" x2="1386" y2="520" strokeDasharray="2 6" opacity="0.5" />
        <text x="1054" y="640" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="oklch(0.78 0.13 15 / 0.35)" letterSpacing="0.18em">MOUNT · 2200MM AFF</text>

        {/* Stand */}
        <line x1="1220" y1="630" x2="1220" y2="700" />
        <line x1="1160" y1="700" x2="1280" y2="700" />

        {/* Ports / labels */}
        <circle cx="1410" cy="450" r="3" />
        <text x="1418" y="453" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="oklch(0.78 0.13 15 / 0.4)" letterSpacing="0.16em">HDMI</text>
        <circle cx="1410" cy="475" r="3" />
        <text x="1418" y="478" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="oklch(0.78 0.13 15 / 0.4)" letterSpacing="0.16em">USB-C</text>
        <circle cx="1410" cy="500" r="3" />
        <text x="1418" y="503" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="oklch(0.78 0.13 15 / 0.4)" letterSpacing="0.16em">RJ45</text>
        <circle cx="1410" cy="525" r="3" />
        <text x="1418" y="528" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="oklch(0.78 0.13 15 / 0.4)" letterSpacing="0.16em">3.5MM</text>

        {/* Dimension lines */}
        <g opacity="0.6">
          <line x1="1040" y1="660" x2="1400" y2="660" strokeWidth="0.5" />
          <line x1="1040" y1="655" x2="1040" y2="665" strokeWidth="0.5" />
          <line x1="1400" y1="655" x2="1400" y2="665" strokeWidth="0.5" />
          <text x="1220" y="678" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="oklch(0.78 0.13 15 / 0.4)" letterSpacing="0.14em">3600 MM</text>
        </g>

        {/* Cable curves toward bottom-right corner */}
        <path d="M 1410 525 C 1450 540, 1480 600, 1500 700" />
        <path d="M 1410 500 C 1460 530, 1500 590, 1530 720" />
      </g>

      {/* Coordinate marker top-left */}
      <g
        stroke="oklch(0.85 0.06 15 / 0.32)"
        strokeWidth="0.8"
        fill="none"
      >
        <line x1="60" y1="100" x2="60" y2="160" />
        <line x1="60" y1="100" x2="120" y2="100" />
        <text x="68" y="155" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="oklch(0.85 0.06 15 / 0.45)" letterSpacing="0.16em" stroke="none">N 59°20'</text>
        <text x="68" y="115" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="oklch(0.85 0.06 15 / 0.45)" letterSpacing="0.16em" stroke="none">E 17°56'</text>
      </g>

      {/* Section dividers — cinematic guides */}
      <line x1="0" y1="225" x2="1600" y2="225" stroke="oklch(0.60 0.06 15 / 0.10)" strokeWidth="0.5" />
      <line x1="0" y1="675" x2="1600" y2="675" stroke="oklch(0.60 0.06 15 / 0.10)" strokeWidth="0.5" />
      <line x1="200" y1="0" x2="200" y2="900" stroke="oklch(0.60 0.06 15 / 0.06)" strokeWidth="0.5" />
      <line x1="1400" y1="0" x2="1400" y2="900" stroke="oklch(0.60 0.06 15 / 0.06)" strokeWidth="0.5" />
    </svg>
  </div>
);

export default HeroCanvas;
