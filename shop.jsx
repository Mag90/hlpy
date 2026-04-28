import React from 'react';

const CATEGORIES = ['Alla', 'Kameror', 'Skärmar', 'Mikrofoner', 'Kablar', 'Möbler', 'Kontorsteknik'];

const PRODUCTS = [
  { id: 'p01', name: 'Logitech Rally Bar',           model: 'RALLY-BAR-G2',  cat: 'Kameror',       price: 28900, hue: 245 },
  { id: 'p02', name: 'Poly Studio E70',              model: 'STUDIO-E70',    cat: 'Kameror',       price: 24500, hue: 220 },
  { id: 'p03', name: 'Yealink MeetingBar A30',       model: 'MB-A30',        cat: 'Kameror',       price: 19900, hue: 200 },
  { id: 'p04', name: 'Samsung 65" Conference',       model: 'WAC-VM65B',     cat: 'Skärmar',       price: 14900, hue: 35 },
  { id: 'p05', name: 'LG 86" UltraWide',             model: 'UH5N-E',        cat: 'Skärmar',       price: 28900, hue: 25 },
  { id: 'p06', name: 'Sennheiser TC-M3',             model: 'TC-M3-WHITE',   cat: 'Mikrofoner',    price: 9990,  hue: 65 },
  { id: 'p07', name: 'Shure MXA920',                 model: 'MXA920-S',      cat: 'Mikrofoner',    price: 18500, hue: 80 },
  { id: 'p08', name: 'Logitech Tap',                 model: 'TAP-IP',        cat: 'Kontorsteknik', price: 8990,  hue: 15 },
  { id: 'p09', name: 'HDMI 2.1 8K Premium 5m',       model: 'HDMI-21-5M',    cat: 'Kablar',        price: 599,   hue: 15 },
  { id: 'p10', name: 'USB-C Aktiv 10m',              model: 'USBC-10M-A',    cat: 'Kablar',        price: 1290,  hue: 245 },
  { id: 'p11', name: 'Cat6A Skärmad 50m',            model: 'CAT6A-50',      cat: 'Kablar',        price: 890,   hue: 145 },
  { id: 'p12', name: 'Konferensbord 12 pers',        model: 'TABLE-12P',     cat: 'Möbler',        price: 28500, hue: 35 },
  { id: 'p13', name: 'Akustikpanel 1200x600',        model: 'ACOUST-1206',   cat: 'Möbler',        price: 1890,  hue: 25 },
  { id: 'p14', name: 'Konferensstol Ergonomisk',     model: 'CHAIR-ERGO',    cat: 'Möbler',        price: 4290,  hue: 15 },
  { id: 'p15', name: 'Bose Videobar VB1',            model: 'VB1-BLACK',     cat: 'Kameror',       price: 31900, hue: 245 },
  { id: 'p16', name: 'Crestron AirMedia',            model: 'AM-3000-WF',    cat: 'Kontorsteknik', price: 12900, hue: 200 },
];

const formatSEK = (n) => `${n.toLocaleString('sv-SE')} kr`;

const ProductImage = ({ hue }) => (
  <div
    className="product-image"
    style={{
      background: `linear-gradient(135deg, oklch(0.62 0.14 ${hue}), oklch(0.32 0.10 ${hue}))`,
    }}
  />
);

const ProductCard = ({ product, qtyInCart, onAdd }) => (
  <div className="product-card">
    <ProductImage hue={product.hue} />
    <div className="product-info">
      <div className="product-model">{product.model}</div>
      <div className="product-name">{product.name}</div>
      <div className="product-price-row">
        <div className="product-price">{formatSEK(product.price)}</div>
        <button
          className={`product-add ${qtyInCart > 0 ? 'added' : ''}`}
          onClick={() => onAdd(product.id)}
        >
          {qtyInCart > 0 ? `I varukorg · ${qtyInCart}` : 'Lägg till'}
        </button>
      </div>
    </div>
  </div>
);

const CartDrawer = ({ open, onClose, cart, onCheckout }) => {
  const items = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: PRODUCTS.find(p => p.id === id), qty }));
  const subtotal = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);

  return (
    <aside className={`cart-drawer ${open ? 'open' : ''}`}>
      <div className="cart-head">
        <h3>Varukorg</h3>
        <button className="cart-close" onClick={onClose} aria-label="Stäng">×</button>
      </div>
      <div className="cart-items">
        {items.length === 0 ? (
          <div className="cart-empty">Varukorgen är tom</div>
        ) : (
          items.map(({ product, qty }) => (
            <div key={product.id} className="cart-item">
              <div
                className="cart-item-image"
                style={{ background: `linear-gradient(135deg, oklch(0.62 0.14 ${product.hue}), oklch(0.32 0.10 ${product.hue}))` }}
              />
              <div>
                <div className="cart-item-name">{product.name}</div>
                <div className="cart-item-meta">{product.model} · {formatSEK(product.price)}</div>
              </div>
              <div className="cart-item-qty">×{qty}</div>
            </div>
          ))
        )}
      </div>
      <div className="cart-foot">
        <div className="cart-subtotal">
          <span className="label">Summa</span>
          <span className="total">{formatSEK(subtotal)}</span>
        </div>
        <button
          className="cart-checkout"
          onClick={onCheckout}
          disabled={items.length === 0}
          style={items.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        >
          Till kassan →
        </button>
        <div className="cart-demo-note">Demo · ingen riktig betalning</div>
      </div>
    </aside>
  );
};

const Checkout = ({ cart, onBack }) => {
  const items = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: PRODUCTS.find(p => p.id === id), qty }));
  const subtotal = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const shipping = 295;
  const total = subtotal + shipping;

  return (
    <div style={{
      maxWidth: 720, margin: '0 auto', padding: '60px var(--gutter)',
      display: 'grid', gap: 40,
    }}>
      <div>
        <div className="section-num"><span className="accent">KASSA</span><span className="of">/ DEMO</span></div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 700,
          fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '-0.035em',
          lineHeight: 1, margin: '8px 0 0',
        }}>Kassa</h1>
      </div>

      <div style={{
        background: 'var(--cream-2)', border: '1px solid var(--hairline)',
        borderRadius: 8, padding: '24px 28px',
      }}>
        {items.map(({ product, qty }) => (
          <div key={product.id} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '12px 0', borderBottom: '1px solid var(--hairline)',
            fontSize: 14,
          }}>
            <span>{product.name} <span style={{ opacity: 0.6 }}>× {qty}</span></span>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>{formatSEK(product.price * qty)}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '12px 0', fontSize: 13, opacity: 0.7,
        }}>
          <span>Frakt</span>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>{formatSEK(shipping)}</span>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '16px 0 0', marginTop: 8,
          borderTop: '1px solid var(--hairline)',
          fontSize: 18,
        }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            alignSelf: 'center',
          }}>Totalt</span>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28 }}>{formatSEK(total)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        <input placeholder="E-post" style={{
          background: 'var(--cream-2)', border: '1px solid var(--hairline)',
          color: 'var(--ink)', padding: '14px 18px', borderRadius: 8, fontSize: 14,
          fontFamily: 'inherit',
        }} />
        <input placeholder="Adress" style={{
          background: 'var(--cream-2)', border: '1px solid var(--hairline)',
          color: 'var(--ink)', padding: '14px 18px', borderRadius: 8, fontSize: 14,
          fontFamily: 'inherit',
        }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <input placeholder="Postnummer" style={{
            background: 'var(--cream-2)', border: '1px solid var(--hairline)',
            color: 'var(--ink)', padding: '14px 18px', borderRadius: 8, fontSize: 14,
            fontFamily: 'inherit',
          }} />
          <input placeholder="Stad" style={{
            background: 'var(--cream-2)', border: '1px solid var(--hairline)',
            color: 'var(--ink)', padding: '14px 18px', borderRadius: 8, fontSize: 14,
            fontFamily: 'inherit',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onBack} className="game-btn secondary">← Tillbaka</button>
        <button
          className="game-btn primary"
          style={{ flex: 1, opacity: 0.5, cursor: 'not-allowed' }}
          disabled
        >
          Betala {formatSEK(total)} · DEMO
        </button>
      </div>
      <div style={{
        textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'color-mix(in oklch, var(--cream) 50%, transparent)',
      }}>
        Detta är en demo. Inga produkter levereras, ingen betalning genomförs.
      </div>
    </div>
  );
};

const Shop = ({ open, onClose }) => {
  const [activeCat, setActiveCat] = React.useState('Alla');
  const [search, setSearch] = React.useState('');
  const [cart, setCart] = React.useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [view, setView] = React.useState('grid'); // 'grid' | 'checkout'

  React.useEffect(() => {
    if (open) {
      document.body.classList.add('shop-open');
    } else {
      document.body.classList.remove('shop-open');
      // Reset checkout view when closing
      setView('grid');
      setDrawerOpen(false);
    }
    return () => document.body.classList.remove('shop-open');
  }, [open]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const filtered = PRODUCTS.filter(p => {
    if (activeCat !== 'Alla' && p.cat !== activeCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.model.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`shop-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="shop-bar">
        <a className="shop-bar-logo" href="#" onClick={(e) => { e.preventDefault(); setView('grid'); }}>hlpy /shop</a>
        {view === 'grid' && (
          <input
            className="shop-bar-search"
            placeholder="Sök produkter…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        {view === 'grid' && (
          <button className="shop-bar-cart" onClick={() => setDrawerOpen(true)}>
            Varukorg <span className="badge">{cartCount}</span>
          </button>
        )}
        <button className="shop-bar-close" onClick={onClose}>← Tillbaka till sajten</button>
      </div>

      {view === 'grid' && (
        <div className="shop-body">
          <aside className="shop-rail">
            <h4>Kategorier</h4>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`cat ${activeCat === c ? 'active' : ''}`}
                onClick={() => setActiveCat(c)}
              >
                {c}
              </button>
            ))}
          </aside>
          <main className="shop-grid">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                qtyInCart={cart[p.id] || 0}
                onAdd={addToCart}
              />
            ))}
          </main>
        </div>
      )}

      {view === 'checkout' && (
        <Checkout cart={cart} onBack={() => setView('grid')} />
      )}

      <CartDrawer
        open={drawerOpen && view === 'grid'}
        onClose={() => setDrawerOpen(false)}
        cart={cart}
        onCheckout={() => { setDrawerOpen(false); setView('checkout'); }}
      />
    </div>
  );
};

export default Shop;
