import React from 'react';

const REFERENCES = [
  { id: '01', name: 'Helio Slussen',     district: 'Stockholm', stage: 'BEFORE',     hue: 245 },
  { id: '02', name: 'Helio Slussen',     district: 'Stockholm', stage: '3D RENDER', hue: 35 },
  { id: '03', name: 'Helio Slussen',     district: 'Stockholm', stage: 'AFTER',      hue: 15 },
  { id: '04', name: 'Trivector System',  district: 'Lund',      stage: 'BEFORE',     hue: 245 },
  { id: '05', name: 'Trivector System',  district: 'Lund',      stage: 'INSTALL',    hue: 65 },
  { id: '06', name: 'Trivector System',  district: 'Lund',      stage: 'AFTER',      hue: 15 },
];

const References = () => (
  <section className="references" id="references">
    <div className="references-inner">
      <div className="references-header reveal">
        <div>
          <div className="section-num">
            <span className="accent">04</span>
            <span className="of">/ OF 08</span>
            <span>· Referenser</span>
          </div>
          <h2 style={{ marginTop: 16 }}>Från första skiss till <em>färdig miljö</em>.</h2>
        </div>
        <p>
          Varje uppdrag dokumenteras i tre steg: utgångsläge, 3D-visualisering och
          slutresultat. Så ser ni exakt vad ni får — innan ett enda kabel dras.
        </p>
      </div>

      <div className="references-grid reveal">
        {REFERENCES.map((r) => (
          <article
            key={r.id}
            className="reference-card"
            style={{ background: `linear-gradient(135deg, oklch(0.62 0.14 ${r.hue}), oklch(0.32 0.10 ${r.hue}))` }}
          >
            <div className="reference-plate" />
            <div className="reference-stage">
              <span>{r.id} / hlpy</span>
              <span>{r.stage}</span>
            </div>
            <div className="reference-caption">
              {r.name}
              <span className="district">{r.district}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default References;
