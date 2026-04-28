import React from 'react';

/* ========================================================================
   Scene constants
   ======================================================================== */
const VIEW_W = 1000;
const VIEW_H = 700;
const TRAY_Y = 580;
const HIT_DIST = 60;

const CABLE_DEFS = {
  hdmi:  { color: '#E8B4A8', label: 'HDMI' },
  usbc:  { color: '#7BA8C9', label: 'USB-C' },
  rj45:  { color: '#9CB892', label: 'Ethernet' },
  audio: { color: '#D4A574', label: '3.5mm' },
  power: { color: '#888888', label: 'Power' },
};

/* ========================================================================
   Levels — each defines its own devices + port positions + cables in tray
   ======================================================================== */
const LEVELS = [
  {
    id: 1,
    title: 'Skärmen',
    sub: 'Det enklaste fallet — börja här.',
    devices: [
      {
        id: 'display1', type: 'display',
        x: 280, y: 60, w: 440, h: 280,
        screenLabel: 'CONFERENCE BAR · STANDBY',
        ports: [
          { cableType: 'hdmi',  cx: 740, cy: 200, label: 'HDMI' },
          { cableType: 'power', cx: 740, cy: 280, label: 'POWER' },
        ],
      },
    ],
    cables: ['hdmi', 'power'],
  },
  {
    id: 2,
    title: 'Ljudbaren',
    sub: 'Tre kablar — en port till.',
    devices: [
      {
        id: 'soundbar1', type: 'soundbar',
        x: 200, y: 240, w: 600, h: 100,
        ports: [
          { cableType: 'hdmi',  cx: 820, cy: 260, label: 'HDMI ARC' },
          { cableType: 'audio', cx: 820, cy: 300, label: '3.5mm' },
          { cableType: 'power', cx: 820, cy: 340, label: 'POWER' },
        ],
      },
    ],
    cables: ['hdmi', 'audio', 'power'],
  },
  {
    id: 3,
    title: 'Kameran',
    sub: 'Konferenskamera — andra portar.',
    devices: [
      {
        id: 'camera1', type: 'camera',
        x: 360, y: 180, w: 280, h: 200,
        ports: [
          { cableType: 'usbc',  cx: 660, cy: 230, label: 'USB-C' },
          { cableType: 'rj45',  cx: 660, cy: 280, label: 'ETHERNET' },
          { cableType: 'power', cx: 660, cy: 330, label: 'POWER' },
        ],
      },
    ],
    cables: ['usbc', 'rj45', 'power'],
  },
  {
    id: 4,
    title: 'Halva mötesrummet',
    sub: 'Två enheter — välj rätt port på rätt enhet.',
    devices: [
      {
        id: 'display2', type: 'display',
        x: 60, y: 80, w: 360, h: 220,
        screenLabel: 'STANDBY',
        ports: [
          { cableType: 'hdmi',  cx: 440, cy: 160, label: 'HDMI' },
          { cableType: 'power', cx: 440, cy: 240, label: 'POWER' },
        ],
      },
      {
        id: 'camera2', type: 'camera',
        x: 600, y: 160, w: 240, h: 200,
        ports: [
          { cableType: 'usbc',  cx: 860, cy: 220, label: 'USB-C' },
          { cableType: 'rj45',  cx: 860, cy: 300, label: 'ETHERNET' },
        ],
      },
    ],
    cables: ['hdmi', 'power', 'usbc', 'rj45'],
  },
  {
    id: 5,
    title: 'Fullt mötesrum',
    sub: 'Hela uppsättningen — koppla allt rätt.',
    devices: [
      {
        id: 'display3', type: 'display',
        x: 60, y: 60, w: 340, h: 200,
        screenLabel: 'STANDBY',
        ports: [
          { cableType: 'hdmi',  cx: 420, cy: 130, label: 'HDMI' },
          { cableType: 'power', cx: 420, cy: 210, label: 'POWER' },
        ],
      },
      {
        id: 'camera3', type: 'camera',
        x: 600, y: 70, w: 240, h: 180,
        ports: [
          { cableType: 'usbc',  cx: 860, cy: 130, label: 'USB-C' },
          { cableType: 'rj45',  cx: 860, cy: 210, label: 'ETHERNET' },
        ],
      },
      {
        id: 'mic1', type: 'mic',
        x: 360, y: 340, w: 280, h: 100,
        ports: [
          { cableType: 'audio', cx: 660, cy: 390, label: '3.5mm' },
        ],
      },
    ],
    cables: ['hdmi', 'power', 'usbc', 'rj45', 'audio'],
  },
];

/* ========================================================================
   Helpers
   ======================================================================== */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const bezierPath = (start, end) => {
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  const d = dist(start, end);
  const sag = Math.min(80, d * 0.25);
  return `M ${start.x} ${start.y} Q ${mx} ${my + sag} ${end.x} ${end.y}`;
};

const trayPosForIndex = (idx, count) => {
  const margin = 140;
  if (count === 1) return { x: VIEW_W / 2, y: TRAY_Y };
  const step = (VIEW_W - 2 * margin) / (count - 1);
  return { x: margin + idx * step, y: TRAY_Y };
};

const initLevelCables = (level) =>
  level.cables.map((cableType, i) => ({
    id: `${cableType}-${i}`,
    cableType,
    state: 'idle',
    end: { x: trayPosForIndex(i, level.cables.length).x, y: TRAY_Y - 40 },
  }));

const flatPorts = (level) =>
  level.devices.flatMap(d => d.ports.map(p => ({ ...p, deviceId: d.id })));

const finalRec = (total, max) => {
  const pct = total / max;
  if (pct === 1)    return 'Du är professionell. Vi anställer dig.';
  if (pct >= 0.82)  return 'Bra jobbat. Men HLPY är snabbare.';
  if (pct >= 0.5)   return 'Vi rekommenderar professionell installation.';
  return 'Det är därför vi finns. Låt oss ta hand om det.';
};

/* ========================================================================
   Device shape components
   ======================================================================== */
const DisplayShape = ({ device }) => {
  const { x, y, w, h, screenLabel } = device;
  const cx = x + w / 2;
  return (
    <g>
      {/* Camera bar above */}
      <rect
        x={x + w * 0.27} y={y - 24}
        width={w * 0.46} height={20}
        rx={4}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1"
      />
      <circle
        cx={cx} cy={y - 14}
        r={5}
        fill="oklch(0.20 0.012 250)"
        stroke="oklch(0.58 0.19 15)"
        strokeWidth="1.2"
      />
      {/* Display panel */}
      <rect
        x={x} y={y}
        width={w} height={h}
        rx={6}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1.5"
      />
      {/* Inset screen */}
      <rect
        x={x + 16} y={y + 16}
        width={w - 32} height={h - 32}
        rx={3}
        fill="oklch(0.20 0.012 250)"
      />
      {/* Screen content */}
      <text
        x={cx} y={y + h / 2 + 4}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="11"
        fill="oklch(0.72 0.14 65 / 0.85)"
        letterSpacing="0.2em"
      >
        {screenLabel || 'CONFERENCE BAR · STANDBY'}
      </text>
      <circle cx={x + w - 30} cy={y + 30} r={4} fill="oklch(0.72 0.14 65)" opacity="0.9" />
      {/* Stand */}
      <rect x={cx - 4} y={y + h} width={8} height={Math.min(50, 700 - (y + h) - 200)} fill="oklch(0.92 0.012 50)" stroke="oklch(0.70 0.012 250)" strokeWidth="0.8" />
      <rect x={cx - 80} y={y + h + Math.min(50, 700 - (y + h) - 200)} width={160} height={6} rx={2} fill="oklch(0.92 0.012 50)" stroke="oklch(0.70 0.012 250)" strokeWidth="0.8" />
    </g>
  );
};

const SoundbarShape = ({ device }) => {
  const { x, y, w, h } = device;
  const cy = y + h / 2;
  // Speaker grille dot pattern
  const grilleDots = [];
  const grilleStart = x + 30;
  const grilleEnd = x + w - 30;
  for (let gx = grilleStart; gx < grilleEnd; gx += 8) {
    for (let gy = y + 18; gy < y + h - 18; gy += 8) {
      grilleDots.push(<circle key={`${gx}-${gy}`} cx={gx} cy={gy} r={1.4} fill="oklch(0.55 0.012 250)" />);
    }
  }
  return (
    <g>
      <rect
        x={x} y={y}
        width={w} height={h}
        rx={10}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1.5"
      />
      {/* Inner panel */}
      <rect
        x={x + 14} y={y + 12}
        width={w - 28} height={h - 24}
        rx={6}
        fill="oklch(0.92 0.012 50)"
      />
      {grilleDots}
      {/* Center indicator */}
      <circle cx={x + w / 2} cy={cy} r={6} fill="oklch(0.20 0.012 250)" />
      <circle cx={x + w / 2} cy={cy} r={3} fill="oklch(0.72 0.14 65)" opacity="0.9" />
      {/* End caps */}
      <rect x={x + 8} y={y + 8} width={6} height={h - 16} rx={3} fill="oklch(0.85 0.012 250)" />
      <rect x={x + w - 14} y={y + 8} width={6} height={h - 16} rx={3} fill="oklch(0.85 0.012 250)" />
    </g>
  );
};

const CameraShape = ({ device }) => {
  const { x, y, w, h } = device;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      {/* Body */}
      <rect
        x={x} y={y}
        width={w} height={h}
        rx={10}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1.5"
      />
      {/* Front face */}
      <rect
        x={x + 12} y={y + 12}
        width={w - 24} height={h - 24}
        rx={6}
        fill="oklch(0.20 0.012 250)"
      />
      {/* Lens */}
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.25} fill="oklch(0.10 0.005 250)" />
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.20} fill="oklch(0.16 0.012 250)" stroke="oklch(0.40 0.012 250)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.10} fill="oklch(0.20 0.012 250)" />
      <circle cx={cx - 4} cy={cy - 4} r={Math.min(w, h) * 0.04} fill="oklch(0.85 0.06 220)" opacity="0.6" />
      {/* Status LED */}
      <circle cx={x + w - 20} cy={y + 20} r={3} fill="oklch(0.72 0.16 145)" />
      {/* Mic dots along the bottom */}
      {[0.25, 0.5, 0.75].map((p) => (
        <circle key={p} cx={x + w * p} cy={y + h - 18} r={1.5} fill="oklch(0.55 0.012 250)" />
      ))}
    </g>
  );
};

const MicShape = ({ device }) => {
  const { x, y, w, h } = device;
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      {/* Outer disc */}
      <ellipse
        cx={cx} cy={cy}
        rx={w / 2} ry={h / 2}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1.5"
      />
      {/* Grille ring */}
      <ellipse
        cx={cx} cy={cy}
        rx={(w / 2) - 14} ry={(h / 2) - 14}
        fill="oklch(0.20 0.012 250)"
      />
      {/* Grille dot pattern */}
      {(() => {
        const dots = [];
        const rxg = (w / 2) - 18;
        const ryg = (h / 2) - 18;
        for (let dx = -rxg; dx <= rxg; dx += 9) {
          for (let dy = -ryg; dy <= ryg; dy += 9) {
            const inside = (dx * dx) / (rxg * rxg) + (dy * dy) / (ryg * ryg) <= 1;
            if (inside) dots.push(<circle key={`${dx}-${dy}`} cx={cx + dx} cy={cy + dy} r={1.4} fill="oklch(0.40 0.012 250)" />);
          }
        }
        return dots;
      })()}
      {/* Status LED */}
      <circle cx={cx - w * 0.32} cy={cy} r={3} fill="oklch(0.72 0.16 145)" />
    </g>
  );
};

const DeviceShape = ({ device }) => {
  switch (device.type) {
    case 'display':  return <DisplayShape  device={device} />;
    case 'soundbar': return <SoundbarShape device={device} />;
    case 'camera':   return <CameraShape   device={device} />;
    case 'mic':      return <MicShape      device={device} />;
    default: return null;
  }
};

/* ========================================================================
   Main component
   ======================================================================== */
const CableGame = () => {
  const svgRef = React.useRef(null);

  const [currentLevelIdx, setCurrentLevelIdx] = React.useState(0);
  const [levelScores, setLevelScores]         = React.useState([]);
  const [cables, setCables]                   = React.useState(() => initLevelCables(LEVELS[0]));
  const [dragging, setDragging]               = React.useState(null);
  const [showResult, setShowResult]           = React.useState(false);
  const [hoveredPort, setHoveredPort]         = React.useState(null);

  const level = LEVELS[currentLevelIdx];
  const ports = React.useMemo(() => flatPorts(level), [level]);
  const isLastLevel = currentLevelIdx === LEVELS.length - 1;

  const trayAnchor = React.useCallback(
    (cableId) => {
      const idx = cables.findIndex(c => c.id === cableId);
      return trayPosForIndex(idx, cables.length);
    },
    [cables],
  );

  const placedCount = cables.filter(c =>
    c.state === 'connected' || c.state === 'wrong-locked'
  ).length;

  const correctCount = cables.filter(c => c.state === 'connected').length;

  // When level completes, save score + show result
  React.useEffect(() => {
    if (placedCount === cables.length && cables.length > 0 && !showResult) {
      const timer = setTimeout(() => {
        setLevelScores(prev => {
          const next = [...prev];
          next[currentLevelIdx] = correctCount;
          return next;
        });
        setShowResult(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [placedCount, cables.length, showResult, currentLevelIdx, correctCount]);

  /* ---- Coord conversion ---- */
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

  /* ---- Drag handlers ---- */
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

    let nearPort = null;
    let nearestD = HIT_DIST + 20;
    for (const p of ports) {
      const d = Math.hypot(pt.x - p.cx, pt.y - p.cy);
      if (d < nearestD) {
        nearestD = d;
        nearPort = p;
      }
    }
    setHoveredPort(nearPort ? `${nearPort.deviceId}-${nearPort.cableType}` : null);
  };

  const animateSnapBack = (cableId) => {
    const startEnd = cables.find(c => c.id === cableId)?.end || { x: 0, y: 0 };
    const target = { ...trayAnchor(cableId), y: TRAY_Y - 40 };
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

  const onSvgPointerUp = () => {
    if (!dragging) return;
    const cable = cables.find(c => c.id === dragging.id);
    if (!cable) {
      setDragging(null);
      setHoveredPort(null);
      return;
    }

    let hit = null;
    let nearestD = HIT_DIST;
    for (const p of ports) {
      const d = Math.hypot(cable.end.x - p.cx, cable.end.y - p.cy);
      if (d < nearestD) {
        nearestD = d;
        hit = p;
      }
    }

    setDragging(null);
    setHoveredPort(null);

    if (hit && hit.cableType === cable.cableType) {
      updateCable(dragging.id, { state: 'connected', end: { x: hit.cx, y: hit.cy } });
    } else if (hit) {
      updateCable(dragging.id, { state: 'wrong-flash', end: { x: hit.cx, y: hit.cy } });
      setTimeout(() => updateCable(dragging.id, { state: 'wrong-locked' }), 360);
    } else {
      updateCable(dragging.id, { state: 'snapping-back' });
      animateSnapBack(dragging.id);
    }
  };

  /* ---- Level transitions ---- */
  const advanceLevel = () => {
    if (isLastLevel) return;
    const next = currentLevelIdx + 1;
    setCurrentLevelIdx(next);
    setCables(initLevelCables(LEVELS[next]));
    setShowResult(false);
    setHoveredPort(null);
  };

  const replayLevel = () => {
    setCables(initLevelCables(level));
    setShowResult(false);
    setHoveredPort(null);
  };

  const restartGame = () => {
    setCurrentLevelIdx(0);
    setLevelScores([]);
    setCables(initLevelCables(LEVELS[0]));
    setShowResult(false);
    setHoveredPort(null);
  };

  /* ---- Derived for rendering ---- */
  const allLevelsComplete = isLastLevel && showResult;
  const totalScore = levelScores.reduce((a, b) => a + (b || 0), 0);
  const totalPossible = LEVELS.reduce((a, l) => a + l.cables.length, 0); // 17

  /* ---- Render ---- */
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
            Fem nivåer, en utmaning. Dra varje kabel till rätt port på rätt enhet.
            Vi räknar dina rätta svar och berättar om ni klarar er själva — eller borde ringa oss.
          </p>
        </div>

        {/* Level header */}
        <div className="game-level-header reveal">
          <div className="game-level-meta">
            <span className="game-level-num">Nivå {currentLevelIdx + 1} av {LEVELS.length}</span>
            <span className="game-level-divider">·</span>
            <span className="game-level-title">{level.title}</span>
          </div>
          <p className="game-level-sub">{level.sub}</p>
          <div className="game-level-pips">
            {LEVELS.map((_, i) => (
              <span
                key={i}
                className={`game-level-pip ${
                  i < currentLevelIdx ? 'done' :
                  i === currentLevelIdx ? 'active' : ''
                }`}
              />
            ))}
          </div>
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

            {/* Devices */}
            {level.devices.map(d => (
              <DeviceShape key={d.id} device={d} />
            ))}

            {/* Ports */}
            {ports.map((p) => {
              const draggedCable = dragging ? cables.find(c => c.id === dragging.id) : null;
              const isCorrectTarget = draggedCable && draggedCable.cableType === p.cableType;
              const portKey = `${p.deviceId}-${p.cableType}`;
              const isHovered = hoveredPort === portKey && !!dragging;
              const ringColor = isHovered && isCorrectTarget
                ? 'oklch(0.62 0.16 145)'
                : (isHovered ? 'oklch(0.58 0.19 15)' : 'oklch(0.65 0.012 250)');
              return (
                <g key={portKey}>
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
                  <rect
                    x={p.cx - 8} y={p.cy - 6}
                    width={16} height={12}
                    rx={1.5}
                    fill="oklch(0.18 0.012 250)"
                    stroke="oklch(0.60 0.012 250)"
                    strokeWidth="1"
                  />
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

            {/* Cords first (behind heads) */}
            {cables.map((cable) => {
              const def = CABLE_DEFS[cable.cableType];
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

            {/* Tray sockets + connector heads */}
            {cables.map((cable) => {
              const def = CABLE_DEFS[cable.cableType];
              const start = trayAnchor(cable.id);
              const end = cable.end;
              const isConnected = cable.state === 'connected';
              const isWrong = cable.state === 'wrong-flash' || cable.state === 'wrong-locked';
              const isDragging = cable.state === 'dragging';

              return (
                <g key={`cable-${cable.id}`}>
                  <text
                    x={start.x} y={start.y - 16}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="9"
                    fill="oklch(0.45 0.012 250)"
                    letterSpacing="0.14em"
                  >
                    {def.label.toUpperCase()}
                  </text>
                  <rect
                    x={start.x - 16} y={start.y - 4}
                    width={32} height={28}
                    rx={3}
                    fill="oklch(0.92 0.012 50)"
                    stroke="oklch(0.65 0.012 250)"
                    strokeWidth="1"
                  />
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

          {/* Per-level result modal */}
          {!allLevelsComplete && (
            <div className={`game-result ${showResult ? 'visible' : ''}`}>
              <div className="level-kicker">Nivå {currentLevelIdx + 1} — {level.title}</div>
              <div className="score">{correctCount} / {cables.length}</div>
              <div className="recommend">
                {correctCount === cables.length
                  ? 'Allt rätt. Bra jobbat.'
                  : correctCount > 0
                    ? 'Hyfsat. Nästa nivå väntar.'
                    : 'Det blev tufft. Ge inte upp.'}
              </div>
              <div className="actions">
                <button className="game-btn primary" onClick={advanceLevel}>Nästa nivå →</button>
                <button className="game-btn secondary" onClick={replayLevel}>Spela igen</button>
              </div>
            </div>
          )}

          {/* Final cumulative result modal */}
          {allLevelsComplete && (
            <div className="game-result visible">
              <div className="level-kicker">Slutresultat</div>
              <div className="score">{totalScore} / {totalPossible}</div>
              <div className="recommend">{finalRec(totalScore, totalPossible)}</div>
              <div className="actions">
                <a className="game-btn primary" href="#contact">Boka kostnadsfri konsultation →</a>
                <button className="game-btn secondary" onClick={restartGame}>Börja om</button>
              </div>
            </div>
          )}
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
