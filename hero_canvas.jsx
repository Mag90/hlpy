import React from 'react';

/**
 * Hero backdrop — bright, ui.com-style.
 * Subtle dot grid + faint rose glow + warm cream base.
 */
const HeroCanvas = () => (
  <div
    className="hero-canvas"
    style={{
      background: `
        radial-gradient(ellipse 70% 60% at 80% 20%, oklch(0.88 0.06 15 / 0.35) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 15% 85%, oklch(0.85 0.05 65 / 0.20) 0%, transparent 65%),
        linear-gradient(180deg, oklch(0.985 0.008 60) 0%, oklch(0.965 0.014 50) 100%)
      `,
    }}
  >
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="hero-dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="oklch(0.50 0.04 15 / 0.15)" />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#hero-dots)" />
    </svg>
  </div>
);

export default HeroCanvas;
