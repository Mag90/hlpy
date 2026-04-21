import React from 'react';
// Tweaks panel + reveal-on-scroll observer + edit-mode protocol.

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
    // announce only after listener is wired
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Apply CSS var changes based on values
  React.useEffect(() => {
    const root = document.documentElement;
    // Pink intensity
    if (vals.pinkIntensity === 'soft') {
      root.style.setProperty('--rose',      'oklch(0.66 0.14 15)');
      root.style.setProperty('--rose-deep', 'oklch(0.52 0.13 15)');
      root.style.setProperty('--rose-wash', 'oklch(0.96 0.025 15)');
    } else if (vals.pinkIntensity === 'bold') {
      root.style.setProperty('--rose',      'oklch(0.52 0.22 15)');
      root.style.setProperty('--rose-deep', 'oklch(0.38 0.19 15)');
      root.style.setProperty('--rose-wash', 'oklch(0.90 0.06 15)');
    } else {
      root.style.setProperty('--rose',      'oklch(0.58 0.19 15)');
      root.style.setProperty('--rose-deep', 'oklch(0.42 0.17 15)');
      root.style.setProperty('--rose-wash', 'oklch(0.93 0.04 15)');
    }
    // Hero mood — cream tint
    if (vals.heroMood === 'cool') {
      root.style.setProperty('--cream',   'oklch(0.975 0.008 240)');
      root.style.setProperty('--cream-2', 'oklch(0.955 0.012 240)');
    } else if (vals.heroMood === 'dark') {
      root.style.setProperty('--cream',   'oklch(0.96 0.012 55)');
      root.style.setProperty('--cream-2', 'oklch(0.93 0.018 50)');
    } else {
      root.style.setProperty('--cream',   'oklch(0.975 0.012 55)');
      root.style.setProperty('--cream-2', 'oklch(0.955 0.018 50)');
    }
    // Type scale
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
      <h5><span>Tweaks</span><span className="tag">HLPY · v1</span></h5>
      <div className="tweak-row">
        <label>Rose intensity</label>
        <div className="opts">
          <Option k="pinkIntensity" v="soft" label="Soft" />
          <Option k="pinkIntensity" v="balanced" label="Balanced" />
          <Option k="pinkIntensity" v="bold" label="Bold" />
        </div>
      </div>
      <div className="tweak-row">
        <label>Hero mood</label>
        <div className="opts">
          <Option k="heroMood" v="warm" label="Warm" />
          <Option k="heroMood" v="cool" label="Cool" />
          <Option k="heroMood" v="dark" label="Muted" />
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

// Reveal observer — adds .in to any .reveal element
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

const App = () => {
  useReveal();
  return (
    <>
      <window.Nav />
      <window.Hero />
      <window.Marquee />
      <window.Services />
      <window.Process />
      <window.Capability />
      <window.Testimonial />
      <window.Footer />
      <Tweaks />
    </>
  );
};

window.App = App;
