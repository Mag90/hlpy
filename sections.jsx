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

const Nav = () => {
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
          <a className="nav-link" href="#about">Om oss</a>
          <a className="nav-link" href="#testimonial">Kunder</a>
          <a className="nav-link" href="#careers">Karriär</a>
        </div>
        <a className="nav-cta" href="#contact">Kontakta oss →</a>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="hero">
    <HeroCanvas />
    <div className="hero-plate">
      <div className="hero-plate-label">
        <span className="rec" />
        <span>REEL · 001 — hlpy studio</span>
      </div>
    </div>

    <div className="hero-inner">
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
    </div>

    <div className="hero-foot">
      <p className="hero-sub">
        Vi bygger kompletta AV- och IT-miljöer för företag som vill att tekniken
        ska försvinna i bakgrunden — och låta arbetet stå i centrum.
      </p>
      <div className="hero-scroll">
        <span>Scrolla</span>
        <span className="arrow">↓</span>
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
          <div className="eyebrow">02 — Vi erbjuder</div>
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

const Capability = () => (
  <section className="capability" id="about">
    <div className="capability-inner">
      <div className="reveal">
        <div className="eyebrow">03 — Om oss</div>
        <h3>
          Ett mindre team med<br />
          <em>större</em> omtanke.
        </h3>
        <p>
          Vi grundades 2021 med en enkel idé: att leverera AV- och IT-lösningar
          med samma närhet som en liten byrå, och samma bredd som en stor integratör.
          Sedan dess har vi växt stadigt — med uppdrag från start-ups till etablerade företag.
        </p>
        <div style={{
          marginTop: 36, paddingTop: 28,
          borderTop: '1px solid color-mix(in oklch, var(--cream) 15%, transparent)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '28px 20px',
        }}>
          {[
            { initials: 'LJ', name: 'Lukas Jung', role: 'VD / Grundare', bg: 'linear-gradient(135deg, oklch(0.82 0.09 15), oklch(0.52 0.22 15))' },
            { initials: 'MN', name: 'Mikael Näslund', role: 'COO', bg: 'linear-gradient(135deg, oklch(0.78 0.11 35), oklch(0.52 0.18 25))' },
            { initials: 'LW', name: 'Lukas Wallander', role: 'Sälj', bg: 'linear-gradient(135deg, oklch(0.80 0.10 55), oklch(0.55 0.16 35))' },
            { initials: 'JM', name: 'John Mandin', role: 'Tekniker', bg: 'linear-gradient(135deg, oklch(0.82 0.09 15), oklch(0.48 0.20 15))' },
            { initials: 'MB', name: 'Markus Baard', role: 'Tekniker', bg: 'linear-gradient(135deg, oklch(0.75 0.10 25), oklch(0.50 0.17 15))' },
            { initials: '+', name: 'Vi växer', role: 'Nästa kollega?', bg: 'transparent', dashed: true },
          ].map((m) => (
            <div key={m.initials} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
              <div style={{
                width: 72, height: 72, minWidth: 72, minHeight: 72,
                borderRadius: '50%',
                background: m.bg,
                border: m.dashed ? '1px dashed color-mix(in oklch, var(--cream) 30%, transparent)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--serif)', fontStyle: m.dashed ? 'normal' : 'italic',
                color: 'oklch(0.975 0.012 55)',
                fontSize: m.dashed ? 28 : 22,
                flexShrink: 0, flexGrow: 0,
              }}>{m.initials}</div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 14, letterSpacing: '-0.01em', color: 'var(--cream)', lineHeight: 1.2 }}>{m.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'color-mix(in oklch, var(--cream) 55%, transparent)', marginTop: 4 }}>{m.role}</div>
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
        <div className="eyebrow">04 — Vad kunderna säger</div>
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
                background: i === idx ? 'var(--rose)' : 'color-mix(in oklch, var(--rose) 30%, transparent)',
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

const Footer = () => (
  <footer className="footer" id="contact">
    <div className="footer-inner">
      <h2 className="footer-cta reveal" style={{ lineHeight: 1.2 }}>
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
          <a href="#">Mötesteknik</a>
          <a href="#">Videomöten</a>
          <a href="#">Digital signage</a>
          <a href="#">IT Lifecycle</a>
        </div>
        <div className="footer-col">
          <h4>Företaget</h4>
          <a href="#">Om oss</a>
          <a href="#">Karriär</a>
          <a href="#">Kontakt</a>
          <a href="#">Press</a>
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

const Process = () => (
  <section style={{
    padding: '160px var(--gutter) 140px',
    background: 'var(--cream)',
    borderTop: '1px solid color-mix(in oklch, var(--ink) 10%, transparent)',
  }} id="process">
    <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto' }}>

      {/* Header — same pattern as Services */}
      <div className="services-header reveal" style={{ marginBottom: 40 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="eyebrow">03 — Hur går det till</div>
          <h2 style={{
            fontFamily: 'var(--serif)', fontWeight: 300,
            fontSize: 'clamp(44px, 6.5vw, 96px)', lineHeight: 0.95,
            letterSpacing: '-0.025em', margin: '16px 0 0',
            fontVariationSettings: '"SOFT" 50, "opsz" 144',
            whiteSpace: 'nowrap',
          }}>En process i <em>tre</em> steg.</h2>
        </div>
      </div>

      {/* Cards */}
      <div className="reveal" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        borderTop: '1px solid color-mix(in oklch, var(--ink) 15%, transparent)',
        paddingTop: 40,
      }}>
        {[
          { num: '01', kicker: 'Avstämning', title: ['Vi lyssnar ', <em key="e">först</em>, '.'], desc: 'Digitalt eller fysiskt möte där vi går igenom era behov och tillsammans sätter en plan efter era krav och önskemål.' },
          { num: '02', kicker: 'Behovsanalys', title: ['Sen ', <em key="e">förstår</em>, ' vi.'], desc: 'Grundlig genomgång av hur ni arbetar idag — och hur ni vill arbeta imorgon. Ett förslag som motsvarar era förväntningar.' },
          { num: '03', kicker: 'Leverans', title: ['Sen ', <em key="e">levererar</em>, ' vi.'], desc: 'Våra egna tekniker installerar — med fokus på noggrannhet, precision och uppföljning. Inga underleverantörer.' },
        ].map((s) => (
          <div key={s.num} style={{
            background: 'var(--cream-2)',
            border: '1px solid color-mix(in oklch, var(--ink) 10%, transparent)',
            borderRadius: 8,
            padding: '40px 32px',
            display: 'flex', flexDirection: 'column', gap: 16,
            minHeight: 300,
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--rose)' }}>{s.num}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 'auto' }}>{s.kicker}</span>
            <h3 style={{
              fontFamily: 'var(--serif)', fontWeight: 300,
              fontSize: 'clamp(30px, 2.6vw, 40px)', lineHeight: 1,
              letterSpacing: '-0.02em', margin: 0,
              fontVariationSettings: '"SOFT" 50, "opsz" 96',
              color: 'var(--ink)',
            }}>{s.title}</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0 }}>{s.desc}</p>
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
