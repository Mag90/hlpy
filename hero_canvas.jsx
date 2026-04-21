// Ink diffusion animation — soft drifting color blobs like ink in water.
// Warm cream base, rose + amber radial gradients breathing slowly.
// No hard edges, no lines — pure organic warmth behind the hero text.

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

    // Each blob: position, size, color, drift speeds, phase offsets
    const blobs = [
      { bx: 0.15, by: 0.30, r: 0.55, hue: 15,  sat: 0.12, lit: 0.78, a: 0.18, sx: 0.022, sy: 0.016, px: 0.0,  py: 1.1  },
      { bx: 0.80, by: 0.65, r: 0.48, hue: 15,  sat: 0.16, lit: 0.62, a: 0.14, sx: 0.018, sy: 0.022, px: 1.4,  py: 0.5  },
      { bx: 0.50, by: 0.15, r: 0.42, hue: 65,  sat: 0.12, lit: 0.72, a: 0.10, sx: 0.014, sy: 0.018, px: 2.1,  py: 1.8  },
      { bx: 0.25, by: 0.80, r: 0.38, hue: 15,  sat: 0.10, lit: 0.70, a: 0.12, sx: 0.020, sy: 0.012, px: 0.7,  py: 2.6  },
      { bx: 0.70, by: 0.20, r: 0.45, hue: 30,  sat: 0.09, lit: 0.75, a: 0.09, sx: 0.016, sy: 0.020, px: 3.2,  py: 0.3  },
      { bx: 0.60, by: 0.85, r: 0.35, hue: 15,  sat: 0.14, lit: 0.65, a: 0.10, sx: 0.024, sy: 0.014, px: 1.9,  py: 3.1  },
    ];

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Pure cream base
      ctx.fillStyle = 'oklch(0.975 0.012 55)';
      ctx.fillRect(0, 0, w, h);

      // Draw each ink blob — slow sinusoidal drift
      blobs.forEach((b) => {
        const cx = (b.bx + Math.sin(t * b.sx + b.px) * 0.12) * w;
        const cy = (b.by + Math.cos(t * b.sy + b.py) * 0.10) * h;
        const rad = b.r * Math.max(w, h);
        // Breath — radius pulses very slowly
        const breath = 1 + Math.sin(t * 0.08 + b.px) * 0.12;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * breath);
        g.addColorStop(0,    `oklch(${b.lit} ${b.sat} ${b.hue} / ${b.a})`);
        g.addColorStop(0.35, `oklch(${b.lit} ${b.sat} ${b.hue} / ${b.a * 0.45})`);
        g.addColorStop(0.7,  `oklch(${b.lit} ${b.sat} ${b.hue} / ${b.a * 0.10})`);
        g.addColorStop(1,    `oklch(${b.lit} ${b.sat} ${b.hue} / 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      // Very faint vignette — warm bottom edge
      const vign = ctx.createLinearGradient(0, 0, 0, h);
      vign.addColorStop(0,    'oklch(0.975 0.012 55 / 0)');
      vign.addColorStop(0.75, 'oklch(0.975 0.012 55 / 0)');
      vign.addColorStop(1,    'oklch(0.94 0.022 45 / 0.18)');
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

window.HeroCanvas = HeroCanvas;
