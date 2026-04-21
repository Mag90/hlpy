import React from 'react';

const HeroCanvas = () => (
  <div className="hero-canvas" style={{ background: `
    radial-gradient(ellipse 80% 70% at 15% 30%, rgba(224,179,175,0.28) 0%, transparent 65%),
    radial-gradient(ellipse 70% 65% at 80% 65%, rgba(198,140,135,0.24) 0%, transparent 60%),
    radial-gradient(ellipse 65% 60% at 50% 15%, rgba(210,190,150,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 55% at 25% 80%, rgba(208,165,160,0.20) 0%, transparent 58%),
    radial-gradient(ellipse 68% 62% at 70% 20%, rgba(216,185,155,0.17) 0%, transparent 62%),
    radial-gradient(ellipse 55% 50% at 60% 85%, rgba(200,148,143,0.22) 0%, transparent 58%),
    linear-gradient(to bottom, rgba(253,248,242,0) 75%, rgba(244,236,224,0.18) 100%),
    rgb(253,248,242)
  `}} />
);

export default HeroCanvas;
