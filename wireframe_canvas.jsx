// Rotating wireframe — a stylized AV device (simplified conference display / camera bar).
// Pure canvas 3D projection, no libs. Drifts slowly, responds to mouse parallax.

const WireframeCanvas = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t0 = performance.now();
    let mouseX = 0.5, mouseY = 0.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', onMove);

    // Build a display panel: wide thin box + camera bar + speaker grid.
    // Each object is a collection of line segments in local space.
    const buildDevice = () => {
      const segs = [];
      // Display — wide rectangular slab (panel)
      const panelW = 2.6, panelH = 1.5, panelD = 0.15;
      const addBox = (x, y, z, w, h, d, group) => {
        const hx = w/2, hy = h/2, hz = d/2;
        const v = [
          [-hx,-hy,-hz],[hx,-hy,-hz],[hx,hy,-hz],[-hx,hy,-hz],
          [-hx,-hy,hz],[hx,-hy,hz],[hx,hy,hz],[-hx,hy,hz],
        ].map(p => [p[0]+x, p[1]+y, p[2]+z]);
        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7],
        ];
        edges.forEach(([a,b]) => segs.push({ a: v[a], b: v[b], group }));
      };
      addBox(0, 0, 0, panelW, panelH, panelD, 'panel');
      // Screen face inset (extra rectangle slightly forward)
      const inset = 0.1;
      addBox(0, 0, panelD/2 + 0.005, panelW - inset*2, panelH - inset*2, 0.002, 'screen');
      // Camera bar above
      addBox(0, panelH/2 + 0.12, 0.05, panelW * 0.55, 0.14, 0.14, 'cam');
      // Little camera lens — small cube centered on cam bar
      addBox(0, panelH/2 + 0.12, 0.13, 0.18, 0.18, 0.06, 'lens');
      // Stand / base
      addBox(0, -panelH/2 - 0.4, 0, 0.12, 0.5, 0.12, 'stand');
      addBox(0, -panelH/2 - 0.72, 0, 0.9, 0.06, 0.5, 'base');
      return segs;
    };
    const device = buildDevice();

    const project = (p, rx, ry, w, h) => {
      // rotate around Y then X
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      let [x, y, z] = p;
      // Y rot
      let x1 = cosY * x + sinY * z;
      let z1 = -sinY * x + cosY * z;
      // X rot
      let y1 = cosX * y - sinX * z1;
      let z2 = sinX * y + cosX * z1;
      // Perspective
      const fov = 5.5;
      const scale = 1 / (fov - z2) * 4.5;
      const px = w/2 + x1 * scale * Math.min(w, h) * 0.24;
      const py = h/2 - y1 * scale * Math.min(w, h) * 0.24;
      return [px, py, z2];
    };

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.fillStyle = 'oklch(0.18 0.02 30)';
      ctx.fillRect(0, 0, w, h);

      // Subtle rose glow behind device
      const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.6);
      g.addColorStop(0, 'oklch(0.42 0.17 15 / 0.35)');
      g.addColorStop(1, 'oklch(0.42 0.17 15 / 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Rotation driven by time + mouse parallax
      const ry = t * 0.18 + (mouseX - 0.5) * 0.6;
      const rx = 0.1 + (mouseY - 0.5) * 0.3;

      // Group colors
      const colors = {
        panel: 'oklch(0.95 0.02 55 / 0.85)',
        screen: 'oklch(0.58 0.19 15 / 0.85)',
        cam: 'oklch(0.82 0.09 15 / 0.75)',
        lens: 'oklch(0.58 0.19 15 / 0.95)',
        stand: 'oklch(0.95 0.02 55 / 0.6)',
        base: 'oklch(0.95 0.02 55 / 0.6)',
      };

      ctx.lineWidth = 1.1;
      ctx.lineCap = 'round';

      device.forEach(seg => {
        const [ax, ay, az] = project(seg.a, rx, ry, w, h);
        const [bx, by, bz] = project(seg.b, rx, ry, w, h);
        ctx.strokeStyle = colors[seg.group] || 'oklch(0.95 0.02 55 / 0.6)';
        if (seg.group === 'screen' || seg.group === 'lens') ctx.lineWidth = 1.6;
        else ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      });

      // Scanning line across the screen face — evokes "coming online"
      const scanProgress = (t * 0.3) % 1;
      const sy = -0.75 + scanProgress * 1.5;
      const [p1x, p1y] = project([-1.2, sy, 0.08], rx, ry, w, h);
      const [p2x, p2y] = project([1.2, sy, 0.08], rx, ry, w, h);
      ctx.strokeStyle = 'oklch(0.72 0.14 65 / 0.6)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={ref} />;
};

window.WireframeCanvas = WireframeCanvas;
