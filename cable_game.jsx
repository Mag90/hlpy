import React from 'react';

/* ========================================================================
   Scene constants
   ======================================================================== */
const VIEW_W = 1000;
const VIEW_H = 700;
const TRAY_Y = 600;
const HIT_MARGIN = 30; // px of forgiveness around device bbox
const FLASH_MS = 900;

const CABLE_DEFS = {
  hdmi:  { color: '#E8B4A8', label: 'HDMI' },
  usbc:  { color: '#7BA8C9', label: 'USB-C' },
  rj45:  { color: '#9CB892', label: 'Ethernet' },
  audio: { color: '#D4A574', label: '3.5mm' },
  power: { color: '#888888', label: 'Power' },
};

// Tray order (left to right) — same in every level
const TRAY_ORDER = ['hdmi', 'usbc', 'rj45', 'audio', 'power'];

const traySourcePos = (cableType) => {
  const idx = TRAY_ORDER.indexOf(cableType);
  const margin = 100;
  const step = (VIEW_W - 2 * margin) / (TRAY_ORDER.length - 1);
  return { x: margin + idx * step, y: TRAY_Y };
};

/* ========================================================================
   Levels — devices + their port slots (no labels until connected)
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
          { cableType: 'hdmi',  cx: 740, cy: 200 },
          { cableType: 'power', cx: 740, cy: 280 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Ljudbaren',
    sub: 'En ny enhet — gissa rätt portar.',
    devices: [
      {
        id: 'soundbar1', type: 'soundbar',
        x: 200, y: 240, w: 600, h: 100,
        ports: [
          { cableType: 'hdmi',  cx: 820, cy: 260 },
          { cableType: 'audio', cx: 820, cy: 300 },
          { cableType: 'power', cx: 820, cy: 340 },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Kameran',
    sub: 'Konferenskamera — andra portar än skärmen.',
    devices: [
      {
        id: 'camera1', type: 'camera',
        x: 360, y: 180, w: 280, h: 200,
        ports: [
          { cableType: 'usbc',  cx: 660, cy: 230 },
          { cableType: 'rj45',  cx: 660, cy: 280 },
          { cableType: 'power', cx: 660, cy: 330 },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Halva mötesrummet',
    sub: 'Två enheter — välj rätt enhet för varje kabel.',
    devices: [
      {
        id: 'display2', type: 'display',
        x: 60, y: 80, w: 360, h: 220,
        screenLabel: 'STANDBY',
        ports: [
          { cableType: 'hdmi',  cx: 440, cy: 160 },
          { cableType: 'power', cx: 440, cy: 240 },
        ],
      },
      {
        id: 'camera2', type: 'camera',
        x: 600, y: 160, w: 240, h: 200,
        ports: [
          { cableType: 'usbc',  cx: 860, cy: 220 },
          { cableType: 'rj45',  cx: 860, cy: 300 },
          { cableType: 'power', cx: 860, cy: 340 },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Fullt mötesrum',
    sub: 'Tre enheter, alla portar — kan ni ringa oss istället?',
    devices: [
      {
        id: 'display3', type: 'display',
        x: 60, y: 60, w: 340, h: 200,
        screenLabel: 'STANDBY',
        ports: [
          { cableType: 'hdmi',  cx: 420, cy: 130 },
          { cableType: 'power', cx: 420, cy: 210 },
        ],
      },
      {
        id: 'camera3', type: 'camera',
        x: 600, y: 70, w: 240, h: 180,
        ports: [
          { cableType: 'usbc',  cx: 860, cy: 130 },
          { cableType: 'rj45',  cx: 860, cy: 210 },
        ],
      },
      {
        id: 'mic1', type: 'mic',
        x: 360, y: 320, w: 280, h: 100,
        ports: [
          { cableType: 'audio', cx: 660, cy: 370 },
          { cableType: 'power', cx: 660, cy: 410 },
        ],
      },
    ],
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

const findDeviceUnder = (pt, devices) => {
  // 1) bbox + margin
  for (const d of devices) {
    if (
      pt.x >= d.x - HIT_MARGIN && pt.x <= d.x + d.w + HIT_MARGIN &&
      pt.y >= d.y - HIT_MARGIN && pt.y <= d.y + d.h + HIT_MARGIN
    ) {
      return d;
    }
  }
  // 2) fallback — within radius of any of the device's port positions (helps when port sits just outside the bbox, e.g. mic)
  for (const d of devices) {
    for (const p of d.ports) {
      if (Math.hypot(pt.x - p.cx, pt.y - p.cy) < 60) return d;
    }
  }
  return null;
};

const finalRec = (totalWrongs, totalRequired) => {
  if (totalWrongs === 0) return 'Felfritt. Imponerande — vi anställer er.';
  const ratio = totalWrongs / totalRequired;
  if (ratio <= 0.3) return 'Bra jobbat. Nästan proffsigt.';
  if (ratio <= 0.8) return 'Hyfsat. Vi rekommenderar professionell installation.';
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
        {screenLabel || 'STANDBY'}
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
  const grilleDots = [];
  for (let gx = x + 30; gx < x + w - 30; gx += 8) {
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
      <rect
        x={x + 14} y={y + 12}
        width={w - 28} height={h - 24}
        rx={6}
        fill="oklch(0.92 0.012 50)"
      />
      {grilleDots}
      <circle cx={x + w / 2} cy={cy} r={6} fill="oklch(0.20 0.012 250)" />
      <circle cx={x + w / 2} cy={cy} r={3} fill="oklch(0.72 0.14 65)" opacity="0.9" />
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
      <rect
        x={x} y={y}
        width={w} height={h}
        rx={10}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1.5"
      />
      <rect
        x={x + 12} y={y + 12}
        width={w - 24} height={h - 24}
        rx={6}
        fill="oklch(0.20 0.012 250)"
      />
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.25} fill="oklch(0.10 0.005 250)" />
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.20} fill="oklch(0.16 0.012 250)" stroke="oklch(0.40 0.012 250)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.10} fill="oklch(0.20 0.012 250)" />
      <circle cx={cx - 4} cy={cy - 4} r={Math.min(w, h) * 0.04} fill="oklch(0.85 0.06 220)" opacity="0.6" />
      <circle cx={x + w - 20} cy={y + 20} r={3} fill="oklch(0.72 0.16 145)" />
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
      <ellipse
        cx={cx} cy={cy}
        rx={w / 2} ry={h / 2}
        fill="oklch(0.96 0.012 50)"
        stroke="oklch(0.70 0.012 250)"
        strokeWidth="1.5"
      />
      <ellipse
        cx={cx} cy={cy}
        rx={(w / 2) - 14} ry={(h / 2) - 14}
        fill="oklch(0.20 0.012 250)"
      />
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
      <circle cx={cx - w * 0.32} cy={cy} r={3} fill="oklch(0.72 0.16 145)" />
    </g>
  );
};

const PortBoard = ({ device, isFilled }) => {
  if (!device.ports.length) return null;
  const xs = device.ports.map(p => p.cx);
  const ys = device.ports.map(p => p.cy);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const padX = 14;
  const padY = 18;
  const slotW = 16, slotH = 12;
  const labelGap = 22;

  const x = minX - slotW / 2 - padX;
  const y = minY - slotH / 2 - padY;
  const w = (maxX - minX) + slotW + padX * 2;
  const h = (maxY - minY) + slotH + padY * 2;

  return (
    <g>
      {/* Label above panel */}
      <text
        x={x + w / 2} y={y - 10}
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
        fontSize="9"
        fill="oklch(0.45 0.012 250)"
        letterSpacing="0.16em"
      >
        DRA SLADDARNA HIT
      </text>
      {/* Tick marks bracketing label */}
      <line x1={x + w / 2 - 80} y1={y - 7} x2={x + w / 2 - 70} y2={y - 7} stroke="oklch(0.55 0.012 250)" strokeWidth="0.8" />
      <line x1={x + w / 2 + 70} y1={y - 7} x2={x + w / 2 + 80} y2={y - 7} stroke="oklch(0.55 0.012 250)" strokeWidth="0.8" />
      {/* Panel chassis */}
      <rect
        x={x} y={y}
        width={w} height={h}
        rx={6}
        fill="oklch(0.92 0.010 250)"
        stroke="oklch(0.55 0.012 250)"
        strokeWidth="1"
      />
      {/* Inner inset */}
      <rect
        x={x + 4} y={y + 4}
        width={w - 8} height={h - 8}
        rx={4}
        fill="oklch(0.88 0.010 250)"
        stroke="oklch(0.65 0.012 250)"
        strokeWidth="0.5"
        strokeDasharray="0"
      />
      {/* Corner screw dots */}
      <circle cx={x + 7} cy={y + 7} r={1.4} fill="oklch(0.55 0.012 250)" />
      <circle cx={x + w - 7} cy={y + 7} r={1.4} fill="oklch(0.55 0.012 250)" />
      <circle cx={x + 7} cy={y + h - 7} r={1.4} fill="oklch(0.55 0.012 250)" />
      <circle cx={x + w - 7} cy={y + h - 7} r={1.4} fill="oklch(0.55 0.012 250)" />
    </g>
  );
};

const DeviceShape = ({ device, highlight }) => {
  const inner = (() => {
    switch (device.type) {
      case 'display':  return <DisplayShape  device={device} />;
      case 'soundbar': return <SoundbarShape device={device} />;
      case 'camera':   return <CameraShape   device={device} />;
      case 'mic':      return <MicShape      device={device} />;
      default: return null;
    }
  })();
  return (
    <g>
      {/* Hover highlight ring — neutral, doesn't reveal correctness */}
      {highlight && (
        <rect
          x={device.x - 14} y={device.y - 14}
          width={device.w + 28} height={device.h + 28}
          rx={14}
          fill="none"
          stroke="oklch(0.58 0.19 15)"
          strokeWidth="1.4"
          strokeDasharray="6 4"
          opacity="0.65"
          style={{ transition: 'opacity 0.2s' }}
        />
      )}
      {inner}
    </g>
  );
};

/* ========================================================================
   Main component
   ======================================================================== */
const CableGame = () => {
  const svgRef = React.useRef(null);

  const [currentLevelIdx, setCurrentLevelIdx] = React.useState(0);
  const [connections, setConnections]         = React.useState([]); // [{ id, cableType, deviceId, portIdx, cx, cy }]
  const [drag, setDrag]                       = React.useState(null); // { cableType, end: {x,y}, pointerId }
  const [wrongFlash, setWrongFlash]           = React.useState(null); // { cableType, end: {x,y} }
  const [wrongAttempts, setWrongAttempts]     = React.useState(0);
  const [levelWrongs, setLevelWrongs]         = React.useState([]);
  const [showResult, setShowResult]           = React.useState(false);
  const [hoveredDeviceId, setHoveredDeviceId] = React.useState(null);

  const level = LEVELS[currentLevelIdx];
  const isLastLevel = currentLevelIdx === LEVELS.length - 1;

  const totalPorts = React.useMemo(
    () => level.devices.reduce((acc, d) => acc + d.ports.length, 0),
    [level],
  );
  const filledPorts = connections.length;
  const isLevelComplete = filledPorts === totalPorts && totalPorts > 0;

  // When level completes, save score + show result
  React.useEffect(() => {
    if (isLevelComplete && !showResult) {
      const timer = setTimeout(() => {
        setLevelWrongs(prev => {
          const next = [...prev];
          next[currentLevelIdx] = wrongAttempts;
          return next;
        });
        setShowResult(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLevelComplete, showResult, currentLevelIdx, wrongAttempts]);

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

  /* ---- Drag handlers ---- */
  const onSourcePointerDown = (e, cableType) => {
    if (drag || wrongFlash || showResult) return;
    e.stopPropagation();
    if (e.target.setPointerCapture) {
      try { e.target.setPointerCapture(e.pointerId); } catch {}
    }
    const pt = svgPoint(e);
    setDrag({ cableType, end: pt, pointerId: e.pointerId });
  };

  const onSvgPointerMove = (e) => {
    if (!drag) return;
    const pt = svgPoint(e);
    setDrag(d => (d ? { ...d, end: pt } : d));
    const hit = findDeviceUnder(pt, level.devices);
    setHoveredDeviceId(hit?.id || null);
  };

  const onSvgPointerUp = () => {
    if (!drag) return;
    const dropPt = drag.end;
    const cableType = drag.cableType;

    const device = findDeviceUnder(dropPt, level.devices);

    if (device) {
      // Does this device accept this cable type?
      const accepts = device.ports.some(p => p.cableType === cableType);
      // Already a connection of this cable type to this device?
      const alreadyConnected = connections.some(
        c => c.deviceId === device.id && c.cableType === cableType
      );

      if (accepts && !alreadyConnected) {
        // Find nearest unfilled slot on the device (by distance to drop point)
        const filledKeys = new Set(
          connections
            .filter(c => c.deviceId === device.id)
            .map(c => `${c.cx},${c.cy}`)
        );
        let nearestSlot = null;
        let nearestD = Infinity;
        for (const port of device.ports) {
          const key = `${port.cx},${port.cy}`;
          if (filledKeys.has(key)) continue;
          const d = Math.hypot(dropPt.x - port.cx, dropPt.y - port.cy);
          if (d < nearestD) { nearestD = d; nearestSlot = port; }
        }

        if (nearestSlot) {
          const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          setConnections(prev => [...prev, {
            id, cableType, deviceId: device.id,
            cx: nearestSlot.cx, cy: nearestSlot.cy,
          }]);
          setDrag(null);
          setHoveredDeviceId(null);
          return;
        }
      }

      // Wrong drop on device — flash on the device
      setWrongFlash({ cableType, end: dropPt });
      setWrongAttempts(w => w + 1);
      setDrag(null);
      setHoveredDeviceId(null);
      setTimeout(() => setWrongFlash(null), FLASH_MS);
      return;
    }

    // Dropped on empty space — no flash, no penalty (cancel)
    setDrag(null);
    setHoveredDeviceId(null);
  };

  /* ---- Level transitions ---- */
  const advanceLevel = () => {
    if (isLastLevel) return;
    setCurrentLevelIdx(currentLevelIdx + 1);
    setConnections([]);
    setShowResult(false);
    setWrongAttempts(0);
    setWrongFlash(null);
    setHoveredDeviceId(null);
  };

  const replayLevel = () => {
    setConnections([]);
    setShowResult(false);
    setWrongAttempts(0);
    setWrongFlash(null);
    setHoveredDeviceId(null);
  };

  const restartGame = () => {
    setCurrentLevelIdx(0);
    setConnections([]);
    setLevelWrongs([]);
    setWrongAttempts(0);
    setShowResult(false);
    setWrongFlash(null);
    setHoveredDeviceId(null);
  };

  /* ---- Derived for rendering ---- */
  const allLevelsComplete = isLastLevel && showResult;
  const totalWrongs = levelWrongs.reduce((a, b) => a + (b || 0), 0);
  const totalPossible = LEVELS.reduce((a, l) => a + l.devices.reduce((dd, d) => dd + d.ports.length, 0), 0);

  /* ---- Highlights for devices during drag ---- */
  const deviceHighlight = (device) => {
    if (!drag) return null;
    return hoveredDeviceId === device.id ? 'hover' : null;
  };

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
            Fem nivåer. Alla kablar finns alltid tillgängliga — det gäller att veta
            vad varje enhet behöver. Fel försök räknas. Vi räknar dem.
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
          <div className="game-level-stats">
            <span className="game-level-stat-label">Felförsök</span>
            <span className="game-level-stat-value">{wrongAttempts}</span>
          </div>
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
              <DeviceShape key={d.id} device={d} highlight={deviceHighlight(d)} />
            ))}

            {/* Port boards — generic panel grouping the slots per device */}
            {level.devices.map(d => (
              <PortBoard key={`board-${d.id}`} device={d} />
            ))}

            {/* Empty port slots — show locations + count, no labels */}
            {level.devices.flatMap(d =>
              d.ports.map((p, i) => {
                const filled = connections.some(c => c.deviceId === d.id && c.cx === p.cx && c.cy === p.cy);
                return (
                  <rect
                    key={`slot-${d.id}-${i}`}
                    x={p.cx - 8} y={p.cy - 6}
                    width={16} height={12}
                    rx={1.5}
                    fill="oklch(0.18 0.012 250)"
                    stroke="oklch(0.60 0.012 250)"
                    strokeWidth="1"
                    opacity={filled ? 0 : 1}
                  />
                );
              })
            )}

            {/* Connected cables — cords from tray sources to ports */}
            {connections.map((conn) => {
              const def = CABLE_DEFS[conn.cableType];
              const start = traySourcePos(conn.cableType);
              const end = { x: conn.cx, y: conn.cy };
              return (
                <g key={`conn-${conn.id}`}>
                  <path
                    d={bezierPath(start, end)}
                    fill="none"
                    stroke={def.color}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                  {/* Connector head */}
                  <rect
                    x={end.x - 11} y={end.y - 7}
                    width={22} height={14}
                    rx={2}
                    fill={def.color}
                    stroke="oklch(0.78 0.16 145)"
                    strokeWidth="2"
                  />
                  <circle
                    cx={end.x} cy={end.y}
                    r={20}
                    fill="none"
                    stroke="oklch(0.78 0.16 145)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  {/* Port label revealed on connection */}
                  <text
                    x={end.x + 18} y={end.y + 3.5}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="9"
                    fill="oklch(0.45 0.012 250)"
                    letterSpacing="0.15em"
                  >
                    {def.label.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* Wrong-flash cable — briefly shown red, then disappears */}
            {wrongFlash && (() => {
              const def = CABLE_DEFS[wrongFlash.cableType];
              const start = traySourcePos(wrongFlash.cableType);
              const end = wrongFlash.end;
              return (
                <g className="wrong-flash">
                  <path
                    d={bezierPath(start, end)}
                    fill="none"
                    stroke="oklch(0.58 0.22 25)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <rect
                    x={end.x - 11} y={end.y - 7}
                    width={22} height={14}
                    rx={2}
                    fill="oklch(0.58 0.22 25)"
                    stroke="oklch(0.40 0.18 25)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={end.x} y={end.y - 18}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="10"
                    fill="oklch(0.55 0.20 25)"
                    letterSpacing="0.16em"
                  >
                    PASSAR EJ
                  </text>
                </g>
              );
            })()}

            {/* Active drag — cord from source to cursor */}
            {drag && (() => {
              const def = CABLE_DEFS[drag.cableType];
              const start = traySourcePos(drag.cableType);
              const end = drag.end;
              return (
                <g style={{ pointerEvents: 'none' }}>
                  <path
                    d={bezierPath(start, end)}
                    fill="none"
                    stroke={def.color}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                  <rect
                    x={end.x - 11} y={end.y - 7}
                    width={22} height={14}
                    rx={2}
                    fill={def.color}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1"
                  />
                </g>
              );
            })()}

            {/* Tray base line + label */}
            <line
              x1={60} y1={TRAY_Y + 32}
              x2={VIEW_W - 60} y2={TRAY_Y + 32}
              stroke="oklch(0.65 0.012 250)"
              strokeWidth="1"
            />
            <text
              x={60} y={TRAY_Y + 56}
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fill="oklch(0.45 0.012 250)"
              letterSpacing="0.18em"
            >
              KABEL-LÅDA · ALLA KABLAR ALLTID TILLGÄNGLIGA
            </text>

            {/* Tray sources — fixed, always draggable */}
            {TRAY_ORDER.map((cableType) => {
              const def = CABLE_DEFS[cableType];
              const pos = traySourcePos(cableType);
              return (
                <g
                  key={`source-${cableType}`}
                  className="cable-head"
                  onPointerDown={(e) => onSourcePointerDown(e, cableType)}
                  style={{ cursor: 'grab', touchAction: 'none' }}
                >
                  {/* Label above source */}
                  <text
                    x={pos.x} y={pos.y - 22}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="9"
                    fill="oklch(0.45 0.012 250)"
                    letterSpacing="0.14em"
                  >
                    {def.label.toUpperCase()}
                  </text>
                  {/* Source socket */}
                  <rect
                    x={pos.x - 18} y={pos.y - 6}
                    width={36} height={32}
                    rx={4}
                    fill="oklch(0.92 0.012 50)"
                    stroke="oklch(0.65 0.012 250)"
                    strokeWidth="1"
                  />
                  {/* Connector head sitting on socket */}
                  <rect
                    x={pos.x - 13} y={pos.y - 1}
                    width={26} height={20}
                    rx={3}
                    fill={def.color}
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="1"
                  />
                  {/* Small dots indicating it's pluggable */}
                  <circle cx={pos.x - 5} cy={pos.y + 9} r={1} fill="rgba(0,0,0,0.35)" />
                  <circle cx={pos.x + 5} cy={pos.y + 9} r={1} fill="rgba(0,0,0,0.35)" />
                </g>
              );
            })}
          </svg>

          {/* Per-level result modal */}
          {!allLevelsComplete && (
            <div className={`game-result ${showResult ? 'visible' : ''}`}>
              <div className="level-kicker">Nivå {currentLevelIdx + 1} — {level.title}</div>
              <div className="score">
                {wrongAttempts === 0 ? 'Felfritt!' : `${wrongAttempts} fel`}
              </div>
              <div className="recommend">
                {wrongAttempts === 0
                  ? 'Inga felaktiga försök. Snyggt.'
                  : wrongAttempts <= 2
                    ? 'Bra. Bara några bom.'
                    : 'Det blev några bom på vägen.'}
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
              <div className="level-kicker">Slutresultat — alla 5 nivåer klara</div>
              <div className="score">{totalWrongs} fel</div>
              <div className="recommend">{finalRec(totalWrongs, totalPossible)}</div>
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
