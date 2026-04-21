import React from 'react';
// Ink diffusion animation — soft drifting color blobs like ink in water.
// Warm cream base, rose + amber radial gradients breathing slowly.
// No hard edges, no lines — pure organic warmth behind the hero text.

// Convert oklch to [r, g, b] (0–255) once at init so the draw loop
// never parses color strings — Firefox is slow at oklch in canvas.
function oklchToRgb(l, c, h) {
  const hRad = h * Math.PI / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
  const lc = l_ ** 3, mc = m_ ** 3, sc = s_ ** 3;
  const toSRGB = x => {
    x = Math.max(0, Math.min(1, x));
    return Math.round((x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055) * 255);
  };
  return [
    toSRGB(+4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc),
    toSRGB(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc),
    toSRGB(-0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc),
  ];
}

const HeroCanvas = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pre-compute rgb once — never parse oklch strings in the draw loop
    const blobs = [
      { bx: 0.15, by: 0.30, r: 0.55, hue: 15, sat: 0.15, lit: 0.75, a: 0.28, sx: 0.030, sy: 0.022, px: 0.0, py: 1.1 },
      { bx: 0.80, by: 0.65, r: 0.48, hue: 15, sat: 0.18, lit: 0.60, a: 0.24, sx: 0.024, sy: 0.030, px: 1.4, py: 0.5 },
      { bx: 0.50, by: 0.15, r: 0.42, hue: 65, sat: 0.14, lit: 0.70, a: 0.18, sx: 0.020, sy: 0.026, px: 2.1, py: 1.8 },
      { bx: 0.25, by: 0.80, r: 0.38, hue: 15, sat: 0.13, lit: 0.68, a: 0.20, sx: 0.028, sy: 0.018, px: 0.7, py: 2.6 },
      { bx: 0.70, by: 0.20, r: 0.45, hue: 30, sat: 0.12, lit: 0.73, a: 0.17, sx: 0.022, sy: 0.028, px: 3.2, py: 0.3 },
      { bx: 0.60, by: 0.85, r: 0.35, hue: 15, sat: 0.17, lit: 0.63, a: 0.22, sx: 0.034, sy: 0.020, px: 1.9, py: 3.1 },
    ].map(b => ({ ...b, rgb: oklchToRgb(b.lit, b.sat, b.hue) }));

    const CREAM = `rgba(253, 248, 242, 1)`;
    const VIGN  = `rgba(244, 236, 224, 0.18)`;

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.fillStyle = CREAM;
      ctx.fillRect(0, 0, w, h);

      blobs.forEach((b) => {
        const cx = (b.bx + Math.sin(t * b.sx + b.px) * 0.12) * w;
        const cy = (b.by + Math.cos(t * b.sy + b.py) * 0.10) * h;
        const rad = b.r * Math.max(w, h);
        const breath = 1 + Math.sin(t * 0.08 + b.px) * 0.12;
        const [r, g, bl] = b.rgb;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * breath);
        grad.addColorStop(0,    `rgba(${r},${g},${bl},${b.a})`);
        grad.addColorStop(0.35, `rgba(${r},${g},${bl},${b.a * 0.45})`);
        grad.addColorStop(0.7,  `rgba(${r},${g},${bl},${b.a * 0.10})`);
        grad.addColorStop(1,    `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      const vign = ctx.createLinearGradient(0, 0, 0, h);
      vign.addColorStop(0,    `rgba(253,248,242,0)`);
      vign.addColorStop(0.75, `rgba(253,248,242,0)`);
      vign.addColorStop(1,    VIGN);
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" />;
};

export default HeroCanvas;
