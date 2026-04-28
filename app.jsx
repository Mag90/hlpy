import React from 'react';
import { Nav, Hero, Marquee, Services, Process, Capability, Testimonial, Footer } from './sections.jsx';
import References from './references.jsx';
import CableGame from './cable_game.jsx';
import Shop from './shop.jsx';

/* ---------- Hero scroll signal ----------
   Hero uses a tall spacer with sticky-pinned content. Progress goes
   0 → 1 as the user scrolls through the pin range (spacer height − vh).
   After progress hits 1, the hero unpins and scrolls away normally. */
const useHeroScroll = () => {
  React.useEffect(() => {
    let raf = null;
    const update = () => {
      const heroEl = document.getElementById('hero');
      if (!heroEl) { raf = null; return; }
      const rect = heroEl.getBoundingClientRect();
      const vh = window.innerHeight;
      // Pin range = total hero height − one viewport (the sticky height)
      const pinRange = Math.max(1, rect.height - vh);
      const progress = Math.max(0, Math.min(1, -rect.top / pinRange));
      document.documentElement.style.setProperty('--hero-scroll', String(progress));
      raf = null;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
};

/* ---------- Tweaks panel (legacy edit-mode protocol) ---------- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "pinkIntensity": "balanced",
  "typeScale": "regular",
  "heroMood": "warm"
}/*EDITMODE-END*/;

const Tweaks = () => {
  const [open, setOpen] = React.useState(false);
  const [vals, setVals] = React.useState(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (vals.pinkIntensity === 'soft') {
      root.style.setProperty('--rose', 'oklch(0.66 0.14 15)');
      root.style.setProperty('--rose-deep', 'oklch(0.52 0.13 15)');
      root.style.setProperty('--rose-wash', 'oklch(0.96 0.025 15)');
    } else if (vals.pinkIntensity === 'bold') {
      root.style.setProperty('--rose', 'oklch(0.52 0.22 15)');
      root.style.setProperty('--rose-deep', 'oklch(0.38 0.19 15)');
      root.style.setProperty('--rose-wash', 'oklch(0.90 0.06 15)');
    } else {
      root.style.setProperty('--rose', 'oklch(0.58 0.19 15)');
      root.style.setProperty('--rose-deep', 'oklch(0.42 0.17 15)');
      root.style.setProperty('--rose-wash', 'oklch(0.93 0.04 15)');
    }
    const scale = vals.typeScale === 'large' ? 1.1 : vals.typeScale === 'small' ? 0.9 : 1;
    root.style.fontSize = `${16 * scale}px`;
  }, [vals]);

  const set = (key, value) => {
    const next = { ...vals, [key]: value };
    setVals(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  };

  const Option = ({ k, v, label }) => (
    <button
      className={`opt ${vals[k] === v ? 'active' : ''}`}
      onClick={() => set(k, v)}
    >{label}</button>
  );

  return (
    <div className={`tweaks ${open ? 'open' : ''}`}>
      <h5><span>Tweaks</span><span className="tag">HLPY · v2</span></h5>
      <div className="tweak-row">
        <label>Rose intensity</label>
        <div className="opts">
          <Option k="pinkIntensity" v="soft" label="Soft" />
          <Option k="pinkIntensity" v="balanced" label="Balanced" />
          <Option k="pinkIntensity" v="bold" label="Bold" />
        </div>
      </div>
      <div className="tweak-row">
        <label>Type scale</label>
        <div className="opts">
          <Option k="typeScale" v="small" label="S" />
          <Option k="typeScale" v="regular" label="M" />
          <Option k="typeScale" v="large" label="L" />
        </div>
      </div>
    </div>
  );
};

/* ---------- Reveal observer ---------- */
const useReveal = () => {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ---------- Section progress dots ---------- */
const PROGRESS_SECTIONS = [
  { id: 'hero',         label: 'Start' },
  { id: 'services',     label: 'Vi erbjuder' },
  { id: 'process',      label: 'Process' },
  { id: 'references',   label: 'Referenser' },
  { id: 'about',        label: 'Om oss' },
  { id: 'game',         label: 'Spelet' },
  { id: 'testimonial',  label: 'Kunder' },
  { id: 'contact',      label: 'Kontakt' },
];

const SectionProgress = () => {
  const [active, setActive] = React.useState('hero');

  React.useEffect(() => {
    const observers = [];
    const seen = {};
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { seen[e.target.id] = e.intersectionRatio; });
      // Pick the section with the highest intersection ratio
      let best = null;
      let bestRatio = 0;
      Object.entries(seen).forEach(([id, ratio]) => {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });
      if (best) setActive(best);
    }, { threshold: [0, 0.2, 0.5, 0.8, 1] });
    PROGRESS_SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    observers.push(io);
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const onDotClick = (e, id) => {
    e.preventDefault();
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="section-progress">
      {PROGRESS_SECTIONS.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={(e) => onDotClick(e, s.id)}
          className={`section-progress-dot ${active === s.id ? 'active' : ''}`}
        >
          <span className="label">{s.label}</span>
          <span className="pip" />
        </a>
      ))}
    </div>
  );
};

/* ---------- App ---------- */
const App = () => {
  useReveal();
  useHeroScroll();
  const [shopOpen, setShopOpen] = React.useState(false);

  return (
    <>
      <div className="marketing-site">
        <Nav onOpenShop={() => setShopOpen(true)} />
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <References />
        <Capability />
        <CableGame />
        <Testimonial />
        <Footer onOpenShop={() => setShopOpen(true)} />
        <SectionProgress />
        <Tweaks />
      </div>
      <Shop open={shopOpen} onClose={() => setShopOpen(false)} />
    </>
  );
};

export default App;
