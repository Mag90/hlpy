import React from 'react';
import logoImage from './HLPY_Logo_Transparent.avif';
import HeroCanvas from './hero_canvas.jsx';
import WireframeCanvas from './wireframe_canvas.jsx';
// Main sections: Nav, Hero, Marquee, Services, Capability, Testimonial, Footer, Tweaks.

const SERVICES = [
  { num: "01", name: "Mötesteknik", tag: "AV / Rooms", caption: "Installation — Teams Room, Stockholm" },
  { num: "02", name: "Videomöten", tag: "Teams · Zoom · Meet", caption: "BYOD-uppsättning, huvudkontor" },
  { num: "03", name: "Arbetsplatsteknik", tag: "Hardware", caption: "Laptops, headsets, skärmar" },
  { num: "04", name: "Digital signage", tag: "Displays", caption: "Entré-skärm, lobbyinstallation" },
  { num: "05", name: "Kontorsmöblering", tag: "Interior", caption: "Mötesrum, komplett lösning" },
  { num: "06", name: "Konsultation", tag: "Advisory", caption: "Inventering & projektledning" },
  { num: "07", name: "Da & CaaS", tag: "Content", caption: "Annonssäljning & innehåll" },
  { num: "08", name: "IT Lifecycle", tag: "Circular", caption: "Återköp & cirkulär ekonomi" },
];

const Nav = ({ onOpenShop }) => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-logo" aria-label="HLPY">
        <img src={logoImage} alt="HLPY" className="logo-image nav-logo-image" />
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="nav-links">
          <a className="nav-link" href="#services">Vi erbjuder</a>
          <a className="nav-link" href="#references">Referenser</a>
          <a className="nav-link" href="#about">Om oss</a>
          <a className="nav-link" href="#game">Spel</a>
          <button type="button" className="nav-link" onClick={onOpenShop}>Shop</button>
        </div>
        <a className="nav-cta" href="#contact">Kontakta oss →</a>
      </div>
    </nav>
  );
};

const HeroStage = () => (
  <div className="hero-stage">
    <svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet" className="hero-stage-svg">
      <defs>
        <linearGradient id="display-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.22 0.012 250)" />
          <stop offset="100%" stopColor="oklch(0.16 0.012 250)" />
        </linearGradient>
        <linearGradient id="bezel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.96 0.012 50)" />
          <stop offset="100%" stopColor="oklch(0.88 0.014 50)" />
        </linearGradient>
        <filter id="device-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="20" stdDeviation="20" floodColor="oklch(0.20 0.05 30)" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Camera bar above */}
      <g filter="url(#device-shadow)">
        <rect x="320" y="50" width="260" height="22" rx="6" fill="url(#bezel-grad)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.8" />
        <circle cx="450" cy="61" r="4" fill="oklch(0.18 0.012 250)" />
        <circle cx="450" cy="61" r="2" fill="oklch(0.58 0.19 15)" />
        <circle cx="380" cy="61" r="1.2" fill="oklch(0.50 0.012 250)" />
        <circle cx="520" cy="61" r="1.2" fill="oklch(0.50 0.012 250)" />
      </g>

      {/* Display panel */}
      <g filter="url(#device-shadow)" className="hero-display">
        <rect x="180" y="80" width="540" height="320" rx="12" fill="url(#bezel-grad)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.8" />
        <rect x="196" y="96" width="508" height="288" rx="6" fill="url(#display-grad)" />
        {/* Screen content — abstract meeting UI */}
        <g>
          {/* Top bar mock */}
          <rect x="216" y="116" width="120" height="6" rx="3" fill="oklch(0.45 0.012 250 / 0.6)" />
          <circle className="hero-led" cx="680" cy="119" r="4" fill="oklch(0.72 0.16 145 / 0.9)" />
          <text className="hero-live" x="650" y="123" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="oklch(0.65 0.012 250)" textAnchor="end">LIVE</text>
          {/* Three video tiles */}
          <rect className="hero-tile" data-i="0" x="216" y="140" width="148" height="92" rx="4" fill="oklch(0.30 0.018 30 / 0.8)" />
          <rect className="hero-tile" data-i="1" x="376" y="140" width="148" height="92" rx="4" fill="oklch(0.32 0.022 35 / 0.8)" />
          <rect className="hero-tile" data-i="2" x="536" y="140" width="148" height="92" rx="4" fill="oklch(0.28 0.020 30 / 0.8)" />
          {/* Avatars in tiles */}
          <circle className="hero-tile" data-i="0" cx="290" cy="186" r="14" fill="oklch(0.55 0.08 30)" />
          <circle className="hero-tile" data-i="1" cx="450" cy="186" r="14" fill="oklch(0.62 0.06 25)" />
          <circle className="hero-tile" data-i="2" cx="610" cy="186" r="14" fill="oklch(0.50 0.10 35)" />
          {/* Bottom info */}
          <rect x="216" y="248" width="180" height="6" rx="3" fill="oklch(0.50 0.012 250 / 0.5)" />
          <rect x="216" y="262" width="100" height="5" rx="2.5" fill="oklch(0.40 0.012 250 / 0.4)" />
          {/* Action bar */}
          <rect x="216" y="340" width="468" height="32" rx="16" fill="oklch(0.22 0.012 250)" />
          <circle cx="332" cy="356" r="10" fill="oklch(0.30 0.012 250)" />
          <circle cx="372" cy="356" r="10" fill="oklch(0.30 0.012 250)" />
          <circle cx="412" cy="356" r="10" fill="oklch(0.30 0.012 250)" />
          <circle cx="452" cy="356" r="10" fill="oklch(0.58 0.19 15)" />
          <circle cx="492" cy="356" r="10" fill="oklch(0.30 0.012 250)" />
          <circle cx="532" cy="356" r="10" fill="oklch(0.30 0.012 250)" />
        </g>
      </g>

      {/* Stand */}
      <g>
        <rect x="445" y="400" width="10" height="50" rx="2" fill="oklch(0.88 0.012 50)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.6" />
        <rect x="370" y="448" width="160" height="8" rx="3" fill="oklch(0.88 0.012 50)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.6" />
        <ellipse cx="450" cy="465" rx="220" ry="16" fill="oklch(0.20 0.05 30 / 0.10)" />
      </g>

      {/* Floating peripheral devices around the display.
          Each periph is wrapped in an outer <g> for CSS transforms (boot+parallax)
          while the inner <g> retains the SVG positioning transform. */}
      {/* Microphone (left) */}
      <g className="periph periph-mic">
        <g filter="url(#device-shadow)" transform="translate(60, 220) rotate(-8)">
          <ellipse cx="0" cy="0" rx="46" ry="22" fill="url(#bezel-grad)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="14" fill="oklch(0.20 0.012 250)" />
          <circle cx="0" cy="0" r="10" fill="oklch(0.32 0.012 250)" />
          <circle cx="-32" cy="-12" r="2" fill="oklch(0.72 0.16 145)" />
        </g>
      </g>

      {/* Speaker (right) */}
      <g className="periph periph-speaker">
        <g filter="url(#device-shadow)" transform="translate(820, 240) rotate(6)">
          <rect x="-30" y="-50" width="60" height="100" rx="6" fill="url(#bezel-grad)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.8" />
          <circle cx="0" cy="-25" r="14" fill="oklch(0.20 0.012 250)" />
          <circle cx="0" cy="-25" r="9" fill="oklch(0.32 0.012 250)" />
          <circle cx="0" cy="20" r="8" fill="oklch(0.20 0.012 250)" />
          <circle cx="0" cy="20" r="5" fill="oklch(0.32 0.012 250)" />
        </g>
      </g>

      {/* Touch panel (bottom-left) */}
      <g className="periph periph-touchpanel">
        <g filter="url(#device-shadow)" transform="translate(140, 410) rotate(-4)">
          <rect x="-50" y="-32" width="100" height="64" rx="6" fill="url(#bezel-grad)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.8" />
          <rect x="-44" y="-26" width="88" height="52" rx="3" fill="oklch(0.20 0.012 250)" />
          <rect x="-36" y="-18" width="40" height="6" rx="3" fill="oklch(0.58 0.19 15 / 0.85)" />
          <rect x="-36" y="-6" width="60" height="4" rx="2" fill="oklch(0.50 0.012 250 / 0.6)" />
          <rect x="-36" y="4" width="50" height="4" rx="2" fill="oklch(0.50 0.012 250 / 0.6)" />
          <circle cx="22" cy="14" r="6" fill="oklch(0.58 0.19 15)" />
        </g>
      </g>

      {/* Keyboard / laptop (bottom-right) */}
      <g className="periph periph-laptop">
        <g filter="url(#device-shadow)" transform="translate(740, 420) rotate(5)">
          <rect x="-60" y="-40" width="120" height="76" rx="4" fill="url(#bezel-grad)" stroke="oklch(0.78 0.012 250)" strokeWidth="0.8" />
          <rect x="-54" y="-34" width="108" height="58" rx="2" fill="oklch(0.20 0.012 250)" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <rect key={i} x={-50 + i * 10} y="-30" width="8" height="8" rx="1" fill="oklch(0.32 0.012 250)" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <rect key={i} x={-50 + i * 10} y="-18" width="8" height="8" rx="1" fill="oklch(0.32 0.012 250)" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <rect key={i} x={-50 + i * 10} y="-6" width="8" height="8" rx="1" fill="oklch(0.32 0.012 250)" />
          ))}
          <rect x="-30" y="14" width="50" height="6" rx="1" fill="oklch(0.32 0.012 250)" />
        </g>
      </g>

      {/* Connection lines between elements (faint) */}
      <g className="hero-conns" stroke="oklch(0.58 0.19 15 / 0.18)" strokeWidth="0.8" strokeDasharray="2 4" fill="none">
        <path className="hero-conn" data-i="0" d="M 110 220 Q 145 200 196 240" />
        <path className="hero-conn" data-i="1" d="M 790 240 Q 750 200 704 240" />
        <path className="hero-conn" data-i="2" d="M 190 410 Q 250 380 280 380" />
        <path className="hero-conn" data-i="3" d="M 680 420 Q 640 380 620 380" />
      </g>
    </svg>

    {/* Floating spec cards */}
    <div className="hero-spec-card hero-spec-card--tl">
      <div className="hero-spec-card__label">Mount Height</div>
      <div className="hero-spec-card__value">2200 <span>MM AFF</span></div>
    </div>
    <div className="hero-spec-card hero-spec-card--tr">
      <div className="hero-spec-card__label">Support</div>
      <div className="hero-spec-card__value">24<span>H</span></div>
      <div className="hero-spec-card__sub">Response time</div>
    </div>
    <div className="hero-spec-card hero-spec-card--br">
      <div className="hero-spec-card__label">Plattformar</div>
      <div className="hero-spec-card__value hero-spec-card__value--small">Teams · Zoom · Meet</div>
    </div>
  </div>
);

const Hero = () => (
  <section className="hero" id="hero">
    {/* Outer spacer drives scroll distance for the pinned animation */}
    <div className="hero-pinned">
      <HeroCanvas />

      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-eyebrow-row">
            <span className="dot" />
            <span>Stockholm — Sedan 2021</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span>AV & IT för moderna arbetsplatser</span>
          </div>
          <h1>
            Mötesteknik<br />
            som bara <em>fungerar</em>.
          </h1>
          <p className="hero-sub">
            Vi bygger kompletta AV- och IT-miljöer för företag som vill att tekniken
            ska försvinna i bakgrunden — och låta arbetet stå i centrum.
          </p>
          <div className="hero-progress-hint">
            <span className="hero-progress-label">Scrolla för att bygga rummet</span>
            <span className="hero-progress-bar"><span className="hero-progress-fill" /></span>
          </div>
        </div>

        <div className="hero-stage-wrap">
          <HeroStage />
        </div>
      </div>

      <div className="hero-foot">
        <div className="hero-scroll">
          <span>Scrolla</span>
          <span className="arrow">↓</span>
        </div>
      </div>
    </div>
  </section>
);

const Marquee = () => {
  const items = [
    "Möteslösningar", "Teams Rooms", "Cirkulär IT",
    "Digital signage", "Arbetsplatsteknik", "Zoom Rooms",
    "Kontorsdesign", "Da & CaaS",
  ];
  const renderGroup = (k) => items.map((x, i) => (
    <span key={`${k}-${i}`} className="marquee-item">
      {x}<span className="sep" />
    </span>
  ));
  return (
    <div className="marquee">
      <div className="marquee-track">
        {renderGroup('a')}{renderGroup('b')}
      </div>
    </div>
  );
};

const ServicePreview = ({ pos, visible, service }) => {
  if (!service) return null;
  // Stylized placeholder — gradient plate with mono caption
  const hue = 15 + (parseInt(service.num) * 6);
  return (
    <div
      className={`service-preview ${visible ? 'visible' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
        background: `linear-gradient(135deg, oklch(0.82 0.09 ${hue}), oklch(0.58 0.19 ${hue}))`,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, oklch(1 0 0 / 0.06) 0 2px, transparent 2px 12px)`,
      }} />
      <div style={{
        position: 'absolute', top: 14, left: 14, right: 14,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'oklch(1 0 0 / 0.85)',
      }}>
        <span>{service.num} / hlpy</span>
        <span>photo placeholder</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 14, left: 14, right: 14,
        fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18,
        color: 'oklch(1 0 0 / 0.95)', lineHeight: 1.2,
      }}>
        {service.caption}
      </div>
    </div>
  );
};

const Services = () => {
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <section className="services" id="services">
      <div className="services-header reveal">
        <div>
          <div className="section-num">
            <span className="accent">02</span>
            <span className="of">/ OF 08</span>
            <span>· Vi erbjuder</span>
          </div>
          <h2>Åtta områden.<br />Ett <em>helhetsgrepp</em>.</h2>
        </div>
        <p>
          Från första behovsanalys till drift, underhåll och cirkulär återtagning —
          vi hanterar hela kedjan så att ni kan fokusera på er verksamhet.
          Inget klassiskt leverantörsförhållande. En partner.
        </p>
      </div>

      <div className="service-list reveal" onMouseMove={onMove}>
        {SERVICES.map((s, i) => (
          <div
            key={s.num}
            className="service-row"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <span className="num">{s.num}</span>
            <span className="name">{s.name}</span>
            <span className="tag">{s.tag}</span>
            <span className="arrow">→</span>
          </div>
        ))}
      </div>

      <ServicePreview
        pos={pos}
        visible={hoverIdx !== null}
        service={hoverIdx !== null ? SERVICES[hoverIdx] : null}
      />
    </section>
  );
};

const TEAM = [
  { initials: 'LJ', name: 'Lukas Jung', role: 'VD / Grundare', bg: 'linear-gradient(135deg, oklch(0.82 0.09 15), oklch(0.52 0.22 15))' },
  { initials: 'MN', name: 'Mikael Näslund', role: 'COO', bg: 'linear-gradient(135deg, oklch(0.78 0.11 35), oklch(0.52 0.18 25))' },
  { initials: 'LW', name: 'Lukas Wallander', role: 'Sälj', bg: 'linear-gradient(135deg, oklch(0.80 0.10 55), oklch(0.55 0.16 35))' },
  { initials: 'JM', name: 'John Mandin', role: 'Tekniker', bg: 'linear-gradient(135deg, oklch(0.82 0.09 15), oklch(0.48 0.20 15))' },
  { initials: 'MB', name: 'Markus Baard', role: 'Tekniker', bg: 'linear-gradient(135deg, oklch(0.75 0.10 25), oklch(0.50 0.17 15))' },
  { initials: '+', name: 'Vi växer', role: 'Nästa kollega?', dashed: true },
];

const Capability = () => (
  <section className="capability" id="about">
    <div className="capability-inner">
      <div className="reveal">
        <div className="section-num">
          <span className="accent">05</span>
          <span className="of">/ OF 08</span>
          <span>· Om oss</span>
        </div>
        <h3>
          Ett mindre team med<br />
          <em>större</em> omtanke.
        </h3>
        <p>
          Vi grundades 2021 med en enkel idé: att leverera AV- och IT-lösningar
          med samma närhet som en liten byrå, och samma bredd som en stor integratör.
          Sedan dess har vi växt stadigt — med uppdrag från start-ups till etablerade företag.
        </p>
        <div className="team-list">
          {TEAM.map((m) => (
            <div key={m.initials} className="team-member">
              <div
                className={`team-avatar${m.dashed ? ' team-avatar-add' : ''}`}
                style={m.dashed ? undefined : { background: m.bg }}
              >
                {m.initials}
              </div>
              <div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="capability-visual reveal">
        <WireframeCanvas />
        <div className="caption">
          <span>Live render — Conference bar / 02</span>
        </div>
      </div>
    </div>
  </section>
);

const TESTIMONIALS = [
  {
    initials: 'N',
    quote: <>
      "Från hlpy får jag alltid <em>bra och adekvat rådgivning</em> inför inköp
      och installationer. Leveransen och uppföljningen efteråt är precis så bra
      som man kan önska sig."
    </>,
    name: 'Niklas Unnhem',
    role: 'VD — Trivector System',
  },
  {
    initials: 'J',
    quote: <>
      "Vi köper hårdvara och installationstjänster till våra konferensrum från hlpy
      och har en <em>bra dialog från början</em> när det gäller förslag på och val av utrustning.
      Sedan sköter de leverans och installation utan någon större insats från oss."
    </>,
    name: 'Johan Tirfing',
    role: 'IT ansvarig — Toyota Material Handling',
  },
];

const Testimonial = () => {
  const [idx, setIdx] = React.useState(0);
  const [fading, setFading] = React.useState(false);

  const goTo = (next) => {
    if (next === idx) return;
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 260);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % TESTIMONIALS.length);
        setFading(false);
      }, 260);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <section className="testimonial" id="testimonial">
      <div className="testimonial-inner">
        <div className="section-num">
          <span className="accent">07</span>
          <span className="of">/ OF 08</span>
          <span>· Vad kunderna säger</span>
        </div>
        <blockquote
          className="testimonial-quote"
          style={{ transition: 'opacity 0.26s ease', opacity: fading ? 0 : 1 }}
        >
          {t.quote}
        </blockquote>
        <div
          className="testimonial-attr"
          style={{ transition: 'opacity 0.26s ease', opacity: fading ? 0 : 1 }}
        >
          <div className="testimonial-avatar">{t.initials}</div>
          <div>
            <div className="testimonial-name">{t.name}</div>
            <div className="testimonial-role">{t.role}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 40 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 28 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                background: i === idx ? 'var(--amber)' : 'color-mix(in oklch, var(--cream) 30%, transparent)',
                transition: 'width 0.3s ease, background 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenShop }) => (
  <footer className="footer" id="contact">
    <div className="footer-inner">
      <h2 className="footer-cta reveal">
        Låt oss bygga något<br />
        <em>bättre.</em> <a href="mailto:hej@hlpy.se">hej@hlpy.se →</a>
      </h2>

      <div className="footer-grid">
        <div className="footer-col">
          <div className="footer-logo">
            <img src={logoImage} alt="HLPY" className="logo-image footer-logo-image" />
          </div>
          <p style={{ color: 'var(--ink-mute)', maxWidth: '32ch', fontSize: 13 }}>
            Smart, komplett AV & IT för moderna arbetsplatser. Bromma, Stockholm.
          </p>
        </div>
        <div className="footer-col">
          <h4>Tjänster</h4>
          <a href="#services">Mötesteknik</a>
          <a href="#services">Videomöten</a>
          <a href="#services">Digital signage</a>
          <a href="#services">IT Lifecycle</a>
        </div>
        <div className="footer-col">
          <h4>Företaget</h4>
          <a href="#about">Om oss</a>
          <a href="#references">Referenser</a>
          <button type="button" onClick={onOpenShop} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit', textAlign: 'left', display: 'block', marginBottom: 6 }}>Webbshop</button>
          <a href="#game">Spelet</a>
        </div>
        <div className="footer-col">
          <h4>Kontakt</h4>
          <p>hej@hlpy.se</p>
          <p>08 — 000 00 00</p>
          <p>Ulvsundavägen 178B</p>
          <p>168 67 Bromma</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 HLPY AB — Org.nr 559282-9823</span>
        <span>Making conferencing simple ✦</span>
      </div>
    </div>
  </footer>
);

const PROCESS_STEPS = [
  { num: '01', kicker: 'Avstämning', title: ['Vi lyssnar ', <em key="e">först</em>, '.'], desc: 'Digitalt eller fysiskt möte där vi går igenom era behov och tillsammans sätter en plan efter era krav och önskemål.' },
  { num: '02', kicker: 'Behovsanalys', title: ['Sen ', <em key="e">förstår</em>, ' vi.'], desc: 'Grundlig genomgång av hur ni arbetar idag — och hur ni vill arbeta imorgon. Ett förslag som motsvarar era förväntningar.' },
  { num: '03', kicker: 'Leverans', title: ['Sen ', <em key="e">levererar</em>, ' vi.'], desc: 'Våra egna tekniker installerar — med fokus på noggrannhet, precision och uppföljning. Inga underleverantörer.' },
];

const Process = () => (
  <section className="process-section" id="process">
    <div className="process-section-inner">
      <div className="services-header reveal" style={{ marginBottom: 40 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="section-num">
            <span className="accent">03</span>
            <span className="of">/ OF 08</span>
            <span>· Hur går det till</span>
          </div>
          <h2 style={{ marginTop: 16 }}>En process i <em>tre</em> steg.</h2>
        </div>
      </div>

      <div className="process-grid reveal">
        {PROCESS_STEPS.map((s) => (
          <div key={s.num} className="process-card">
            <span className="process-num">{s.num}</span>
            <span className="process-kicker">{s.kicker}</span>
            <h3 className="process-card-title">{s.title}</h3>
            <p className="process-card-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Partners = () => (
  <section style={{
    background: 'oklch(0.18 0.02 30)',
    padding: 'clamp(80px, 12vw, 160px) var(--gutter)',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Faint rose glow */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 20% 50%, oklch(0.58 0.19 15 / 0.12), transparent 65%)',
    }} />
    <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'oklch(0.975 0.012 55 / 0.4)', marginBottom: 32,
      }}>— En tanke att ta med sig</div>
      <blockquote style={{
        fontFamily: 'var(--serif)', fontWeight: 300,
        fontSize: 'clamp(32px, 5vw, 76px)',
        lineHeight: 1.05, letterSpacing: '-0.02em',
        margin: 0, color: 'oklch(0.975 0.012 55)',
        fontVariationSettings: '"SOFT" 60, "opsz" 144',
        maxWidth: '22ch', textWrap: 'balance',
      }}>
        Vi hanterar helheten — så att ni kan{' '}
        <em style={{
          fontStyle: 'italic', color: 'oklch(0.82 0.09 15)',
          fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144',
        }}>fokusera på er verksamhet</em>.
      </blockquote>
    </div>
  </section>
);

export { Nav, Hero, Marquee, Services, Capability, Testimonial, Footer, Process, Partners };
