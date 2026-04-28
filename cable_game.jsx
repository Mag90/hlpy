import React from 'react';

/* ---------- Scene constants (SVG userspace) ---------- */
const VIEW_W = 1000;
const VIEW_H = 700;

// Display panel rectangle (top half)
const PANEL = { x: 180, y: 80, w: 460, h: 280 };

// Ports — placed on right edge of the display
const PORTS = [
  { id: 'hdmi',  cx: 740, cy: 130, label: 'HDMI' },
  { id: 'usbc',  cx: 740, cy: 180, label: 'USB-C' },
  { id: 'rj45',  cx: 740, cy: 230, label: 'RJ45' },
  { id: 'audio', cx: 740, cy: 280, label: '3.5mm' },
  { id: 'power', cx: 740, cy: 330, label: 'POWER' },
];

// Cable definitions — anchor points along the bottom tray
const TRAY_Y = 580;
const CABLES = [
  { id: 'hdmi',  color: '#E8B4A8', label: 'HDMI',     correctPort: 'hdmi',  ax: 140 },
  { id: 'usbc',  color: '#7BA8C9', label: 'USB-C',    correctPort: 'usbc',  ax: 290 },
  { id: 'rj45',  color: '#9CB892', label: 'Ethernet', correctPort: 'rj45',  ax: 440 },
  { id: 'audio', color: '#D4A574', label: '3.5mm',    correctPort: 'audio', ax: 590 },
  { id: 'power', color: '#888888', label: 'Power',    correctPort: 'power', ax: 740 },
];

const HIT_DIST = 60;

/* ---------- Helpers ---------- */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const bezierPath = (start, end) => {
  // Control point sags below the midpoint, proportional to distance.
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  const d = dist(start, end);
  const sag = Math.min(80, d * 0.25);
  const cx = mx;
  const cy = my + sag;
  return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
};

const RECOMMENDATIONS = {
  5: 'Snyggt. Ni klarar er själva — eller låter ni HLPY göra jobbet snabbare?',
  4: 'Bra försök. En proffsig installation gör ändå skillnad.',
  3: 'Hyfsat. Vi rekommenderar professionell installation.',
  2: 'Det är därför vi finns. Låt oss ta hand om det.',
  1: 'Det är därför vi finns. Låt oss ta hand om det.',
  0: 'Det är därför vi finns. Låt oss ta hand om det.',
};

/* ---------- Component ---------- */
const CableGame = () => {
  const svgRef = React.useRef(null);
  const trayAnchor = React.useCallback(
    (cableId) => {
      const c = CABLES.find(c => c.id === cableId);
      return { x: c.ax, y: TRAY_Y };
    },
    [],
  );

  const initialState = () =>
    CABLES.map(c => ({ id: c.id, state: 'idle', end: { x: c.ax, y: TRAY_Y - 40 } }));

  const [cables, setCables] = React.useState(initialState);
  const [dragging, setDragging] = React.useState(null); // { id, pointerId }
  const [showResult, setShowResult] = React.useState(false);
  const [hoveredPort, setHoveredPort] = React.useState(null);

  // Track number of finished cables (correct or wrong attempts that locked)
  const placedCount = cables.filter(c => c.state === 'connected' || c.state === 'wrong-locked').length;
  const correctCount = cables.filter((c, i) => c.state === 'connected' && c.id === CABLES[i].correctPort).length;

  React.useEffect(() => {
    if (placedCount === CABLES.length && !showResult) {
      const timer = setTimeout(() => setShowResult(true), 600);
      return () => clearTimeout(timer);
    }
  }, [placedCount, showResult]);

  /* Convert client coords → SVG userspace */
  const svgPoint = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    const transformed = pt.matrixTransform(inv);
    return { x: transformed.x, y: transformed.y };
  };

  const updateCable = (id, partial) => {
    setCables(prev => prev.map(c => (c.id === id ? { ...c, ...partial } : c)));
  };

  const onCablePointerDown = (e, cableId) => {
    const cable = cables.find(c => c.id === cableId);
    if (!cable || cable.state === 'connected' || cable.state === 'wrong-locked') return;
    e.stopPropagation();
    if (e.target.setPointerCapture) {
      try { e.target.setPointerCapture(e.pointerId); } catch {}
    }
    const pt = svgPoint(e);
    setDragging({ id: cableId, pointerId: e.pointerId });
    updateCable(cableId, { state: 'dragging', end: pt });
  };

  const onSvgPointerMove = (e) => {
    if (!dragging) return;
    const pt = svgPoint(e);
    updateCable(dragging.id, { end: pt });

    // Detect hovered port for visual telegraph
    let nearPort = null;
    let nearestD = HIT_DIST + 20;
    for (const p of PORTS) {
      const d = Math.hypot(pt.x - p.cx, pt.y - p.cy);
      if (d < nearestD) {
        nearestD = d;
        nearPort = p.id;
      }
    }
    setHoveredPort(nearPort);
  };

  const animateSnapBack = (cableId) => {
    const startEnd = cables.find(c => c.id === cableId)?.end || { x: 0, y: 0 };
    const target = { x: trayAnchor(cableId).x, y: TRAY_Y - 40 };
    const startTime = performance.now();
    const duration = 320;
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const nx = startEnd.x + (target.x - startEnd.x) * ease;
      const ny = startEnd.y + (target.y - startEnd.y) * ease;
      updateCable(cableId, { end: { x: nx, y: ny } });
      if (t < 1) requestAnimationFrame(step);
      else updateCable(cableId, { state: 'idle', end: target });
    };
    requestAnimationFrame(step);
  };

  const onSvgPointerUp = (e) => {
    if (!dragging) return;
    const cable = cables.find(c => c.id === dragging.id);
    const cableDef = CABLES.find(c => c.id === dragging.id);
    if (!cable || !cableDef) {
      setDragging(null);
      setHoveredPort(null);
      return;
    }
    // Find nearest port within HIT_DIST
    let hit = null;
    let nearestD = HIT_DIST;
    for (const p of PORTS) {
      const d = Math.hypot(cable.end.x - p.cx, cable.end.y - p.cy);
      if (d < nearestD) {
        nearestD = d;
        hit = p;
      }
    }
    setDragging(null);
    setHoveredPort(null);

    if (hit && hit.id === cableDef.correctPort) {
      updateCable(dragging.id, { state: 'connected', end: { x: hit.cx, y: hit.cy } });
    } else if (hit) {
      // Wrong port — lock cable to that port (counts toward placed) but mark wrong
      updateCable(dragging.id, { state: 'wrong-flash', end: { x: hit.cx, y: hit.cy } });
      setTimeout(() => updateCable(dragging.id, { state: 'wrong-locked' }), 360);
    } else {
      updateCable(dragging.id, { state: 'snapping-back' });
      animateSnapBack(dragging.id);
    }
  };

  const reset = () => {
    setCables(initialState());
    setShowResult(false);
    setHoveredPort(null);
  };

  /* ---------- Render ---------- */
  return (
    <section className="game" id="game">
      <div className="game-inner">
        <div className="game-header reveal">
          <div>
            <div className="section-num">
              <span className="accent">06</span>
              <span className="of">/ OF 08</span>
              <span>· Testa själv</span>
            </div>
            <h2 style={{ marginTop: 16 }}>Tror du att du <em>kan</em> kabla?</h2>
          </div>
          <p>
            Dra varje kabel till rätt port på skärmen. Vi räknar dina rätta svar
            och berättar om ni klarar er själva — eller borde ringa oss.
          </p>
        </div>

        <div className="game-stage reveal">
          <svg
            ref={svgRef}
            className="game-svg"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            onPointerMove={onSvgPointerMove}
            onPointerUp={onSvgPointerUp}
            onPointerLeave={onSvgPointerUp}
          >
            {/* Background grid lines for "studio" feel */}
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(60,40,40,0.06)" strokeWidth="1" />
              </pattern>
              <radialGradient id="glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%"  stopColor="oklch(0.58 0.19 15 / 0.10)" />
                <stop offset="100%" stopColor="oklch(0.58 0.19 15 / 0)" />
              </radialGradient>
            </defs>
            <rect width={VIEW_W} height={VIEW_H} fill="url(#gridPattern)" />
            <ellipse cx={VIEW_W / 2} cy={VIEW_H / 2} rx={VIEW_W * 0.5} ry={VIEW_H * 0.45} fill="url(#glow)" />

            {/* Display panel */}
            <g>
              <rect
                x={PANEL.x} y={PANEL.y}
                width={PANEL.w} height={PANEL.h}
                rx={6}
                fill="oklch(0.96 0.012 50)"
                stroke="oklch(0.70 0.012 250)"
                strokeWidth="1.5"
              />
              {/* Inset screen */}
              <rect
                x={PANEL.x + 16} y={PANEL.y + 16}
                width={PANEL.w - 32} height={PANEL.h - 32}
                rx={3}
                fill="oklch(0.20 0.012 250)"
              />
              {/* Screen content — abstract */}
              <text
                x={PANEL.x + PANEL.w / 2} y={PANEL.y + PANEL.h / 2}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="11"
                fill="oklch(0.72 0.14 65 / 0.85)"
                letterSpacing="0.2em"
              >
                CONFERENCE BAR · STANDBY
              </text>
              <circle cx={PANEL.x + PANEL.w - 30} cy={PANEL.y + 30} r={4} fill="oklch(0.72 0.14 65)" opacity="0.9" />

              {/* Camera bar above */}
              <rect
                x={PANEL.x + PANEL.w * 0.25}
                y={PANEL.y - 24}
                width={PANEL.w * 0.5}
                height={20}
                rx={4}
                fill="oklch(0.96 0.012 50)"
                stroke="oklch(0.70 0.012 250)"
                strokeWidth="1"
              />
              <circle
                cx={PANEL.x + PANEL.w / 2} cy={PANEL.y - 14}
                r={5}
                fill="oklch(0.20 0.012 250)"
                stroke="oklch(0.58 0.19 15)"
                strokeWidth="1.2"
              />

              {/* Stand */}
              <rect x={PANEL.x + PANEL.w / 2 - 4} y={PANEL.y + PANEL.h} width={8} height={50} fill="oklch(0.92 0.012 50)" stroke="oklch(0.70 0.012 250)" strokeWidth="0.8" />
              <rect x={PANEL.x + PANEL.w / 2 - 80} y={PANEL.y + PANEL.h + 50} width={160} height={6} rx={2} fill="oklch(0.92 0.012 50)" stroke="oklch(0.70 0.012 250)" strokeWidth="0.8" />
            </g>

            {/* Ports */}
            {PORTS.map((p) => {
              const draggedCable = dragging ? CABLES.find(c => c.id === dragging.id) : null;
              const isCorrectTarget = draggedCable && draggedCable.correctPort === p.id;
              const isHovered = hoveredPort === p.id && dragging;
              const ringColor = isHovered && isCorrectTarget
                ? 'oklch(0.62 0.16 145)'
                : (isHovered ? 'oklch(0.58 0.19 15)' : 'oklch(0.65 0.012 250)');
              return (
                <g key={p.id}>
                  {/* Pulsing hit ring while dragging */}
                  {dragging && (
                    <circle
                      cx={p.cx} cy={p.cy}
                      r={isHovered ? 26 : 18}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth={isHovered ? 1.6 : 1}
                      opacity={isHovered ? 0.85 : 0.4}
                      style={{ transition: 'r 0.2s, stroke 0.2s, opacity 0.2s' }}
                    />
                  )}
                  {/* Port body */}
                  <rect
                    x={p.cx - 8} y={p.cy - 6}
                    width={16} height={12}
                    rx={1.5}
                    fill="oklch(0.18 0.012 250)"
                    stroke="oklch(0.60 0.012 250)"
                    strokeWidth="1"
                  />
                  {/* Port label */}
                  <text
                    x={p.cx + 18} y={p.cy + 3.5}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="9"
                    fill="oklch(0.45 0.012 250)"
                    letterSpacing="0.15em"
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}

            {/* Tray base line */}
            <line
              x1={80} y1={TRAY_Y + 30}
              x2={VIEW_W - 80} y2={TRAY_Y + 30}
              stroke="oklch(0.65 0.012 250)"
              strokeWidth="1"
            />
            <text
              x={80} y={TRAY_Y + 56}
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fill="oklch(0.45 0.012 250)"
              letterSpacing="0.18em"
            >
              KABEL-LÅDA · DRA UPP TILL RÄTT PORT
            </text>

            {/* Cables — render cords first, then connector heads on top */}
            {cables.map((cable, i) => {
              const def = CABLES[i];
              const start = trayAnchor(cable.id);
              const end = cable.end;
              const isWrong = cable.state === 'wrong-flash' || cable.state === 'wrong-locked';
              const cordColor = isWrong ? 'oklch(0.58 0.22 25)' : def.color;
              return (
                <path
                  key={`cord-${cable.id}`}
                  d={bezierPath(start, end)}
                  fill="none"
                  stroke={cordColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                  opacity={cable.state === 'idle' ? 0.85 : 1}
                />
              );
            })}

            {/* Tray slots and connector heads */}
            {cables.map((cable, i) => {
              const def = CABLES[i];
              const start = trayAnchor(cable.id);
              const end = cable.end;
              const isConnected = cable.state === 'connected';
              const isWrong = cable.state === 'wrong-flash' || cable.state === 'wrong-locked';
              const isDragging = cable.state === 'dragging';

              return (
                <g key={`cable-${cable.id}`}>
                  {/* Tray socket */}
                  <rect
                    x={start.x - 16} y={start.y - 4}
                    width={32} height={28}
                    rx={3}
                    fill="oklch(0.92 0.012 50)"
                    stroke="oklch(0.65 0.012 250)"
                    strokeWidth="1"
                  />
                  <text
                    x={start.x} y={start.y + 50}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="9"
                    fill="oklch(0.45 0.012 250)"
                    letterSpacing="0.12em"
                  >
                    {def.label}
                  </text>

                  {/* Connector head */}
                  <g
                    className={`cable-head ${isDragging ? 'dragging' : ''} ${isConnected ? 'connected' : ''}`}
                    onPointerDown={(e) => onCablePointerDown(e, cable.id)}
                    style={{ touchAction: 'none' }}
                  >
                    <rect
                      x={end.x - 11} y={end.y - 7}
                      width={22} height={14}
                      rx={2}
                      fill={isWrong ? 'oklch(0.58 0.22 25)' : def.color}
                      stroke={isConnected ? 'oklch(0.78 0.16 145)' : 'rgba(0,0,0,0.3)'}
                      strokeWidth={isConnected ? 2 : 1}
                      style={{ transition: isConnected ? 'stroke 0.3s' : 'none' }}
                    />
                    {/* Confirmation ring on connect */}
                    {isConnected && (
                      <circle
                        cx={end.x} cy={end.y}
                        r={20}
                        fill="none"
                        stroke="oklch(0.78 0.16 145)"
                        strokeWidth="1"
                        opacity="0.5"
                      />
                    )}
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Result overlay */}
          <div className={`game-result ${showResult ? 'visible' : ''}`}>
            <div className="score">{correctCount} / {CABLES.length}</div>
            <div className="recommend">{RECOMMENDATIONS[correctCount]}</div>
            <div className="actions">
              <a className="game-btn primary" href="#contact">Boka kostnadsfri konsultation →</a>
              <button className="game-btn secondary" onClick={reset}>Spela igen</button>
            </div>
          </div>
        </div>

        {/* Mobile fallback */}
        <div className="game-mobile-fallback">
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, marginBottom: 12, color: 'var(--rose)', textTransform: 'none' }}>Spela på dator</div>
          <div>Mobilen blir trång. Öppna sajten på datorn för fullupplevelsen.</div>
        </div>
      </div>
    </section>
  );
};

export default CableGame;
