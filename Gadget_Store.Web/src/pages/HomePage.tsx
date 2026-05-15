import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsService, catalogService } from '@/services/api'

const CATEGORY_ICONS: Record<string, string> = {
  'Telefoane':  '📱',
  'Laptopuri':  '💻',
  'Tablete':    '📟',
  'Audio':      '🎧',
  'Gaming':     '🎮',
  'Accesorii':  '🔌',
  'Camere':     '📷',
  'TV':         '📺',
  'Smartwatch': '⌚',
  'default':    '📦',
}

const FEATURES = [
  {
    num: '01',
    title: 'Livrare 24h',
    detail: 'in Chisinau',
    desc: 'Comenzile plasate pana la 14:00 ajung in aceasi zi',
  },
  {
    num: '02',
    title: 'Garantie 2 ani',
    detail: 'producator',
    desc: 'Toate produsele vin cu garantie oficiala de producator',
  },
  {
    num: '03',
    title: 'Suport 24/7',
    detail: 'non-stop',
    desc: 'Echipa noastra este disponibila non-stop pentru tine',
  },
]

const STATS = [
  { value: '500+', label: 'Produse' },
  { value: '10K+', label: 'Clienti' },
  { value: '4.9',  label: 'Rating' },
]

const displayStyle = (size?: string, weight?: number): React.CSSProperties => ({
  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
  fontWeight: weight ?? 800,
  fontSize: size,
  lineHeight: 1,
  letterSpacing: '-0.015em',
  textTransform: 'uppercase',
})

const monoStyle = (size?: string): React.CSSProperties => ({
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 500,
  fontSize: size,
})

export default function HomePage() {
  const { data: catalog } = useQuery({
    queryKey: ['catalog'],
    queryFn: () => catalogService.getTree(),
  })

  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getAll({ pageSize: 8, sortBy: 'popular' }),
  })

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#0A0A0A', minHeight: '420px' }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(189,255,0,0.04) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(189,255,0,0.04) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '40px 40px',
          }}
        />
        {/* Lime radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: '-8%',
            bottom: '-20%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(189,255,0,0.07) 0%, transparent 65%)',
          }}
        />

        <div className="container mx-auto px-4 max-w-7xl relative z-10 py-24 md:py-32">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-7 animate-slide-up">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-slow" />
            <span
              className="text-brand/60"
              style={{
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Gadget Store &middot; Chisinau, Moldova
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-white animate-slide-up-d1"
            style={{
              ...displayStyle('clamp(3.2rem, 7.5vw, 5.8rem)', 900),
              marginBottom: '0.15em',
            }}
          >
            Gadgeturi de top,
          </h1>
          <h1
            className="text-brand animate-slide-up-d1"
            style={{
              ...displayStyle('clamp(3.2rem, 7.5vw, 5.8rem)', 900),
              marginBottom: '2rem',
            }}
          >
            Preturi imbatabile
          </h1>

          {/* Subtitle */}
          <p
            className="animate-slide-up-d2"
            style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.38)',
              maxWidth: '460px',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
            }}
          >
            Smartphone-uri, laptopuri, accesorii — livrare rapida in Chisinau si toata Moldova
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap animate-slide-up-d2">
            <Link to="/catalog" className="btn-primary px-8 py-3">
              Exploreaza catalogul
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 transition-all"
              style={{
                ...displayStyle(undefined, 800),
                fontSize: '0.78rem',
                borderRadius: '3px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#BDFF00'
                e.currentTarget.style.borderColor = 'rgba(189,255,0,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              Creeaza cont gratuit
            </Link>
          </div>
        </div>

        {/* Bottom separator line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(189,255,0,0.35) 50%, transparent 100%)' }}
        />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <div style={{ background: '#F7F4EF', borderBottom: '1px solid #E8E3D8' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-3" style={{ borderLeft: '1px solid #E8E3D8' }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                className="py-5 px-6 flex items-center gap-3"
                style={{ borderRight: '1px solid #E8E3D8' }}
              >
                <span className="text-brand" style={monoStyle('1.6rem')}>{s.value}</span>
                <span
                  style={{
                    ...displayStyle('0.72rem', 700),
                    color: '#8A8578',
                    letterSpacing: '0.1em',
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Categorii */}
        {catalog && catalog.length > 0 && (
          <section className="py-12">
            <div className="flex items-baseline gap-3 mb-6">
              <div className="section-title">Categorii</div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', color: '#8A8578' }}>
                {catalog.length} disponibile
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {catalog.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog/${cat.id}`}
                  className="card-hover p-4 text-center group"
                >
                  <div className="text-2xl mb-2">
                    {CATEGORY_ICONS[cat.name] ?? CATEGORY_ICONS['default']}
                  </div>
                  <p
                    className="group-hover:text-brand transition-colors leading-tight"
                    style={{ ...displayStyle('0.72rem', 700), letterSpacing: '0.05em', color: '#3D3B36' }}
                  >
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Produse populare */}
        <section className="py-12" style={{ borderTop: '1px solid #E8E3D8' }}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="section-title">Produse populare</div>
              <p className="section-subtitle">Cele mai vandute produse din magazin</p>
            </div>
            <Link
              to="/catalog"
              className="text-brand transition-colors mb-6"
              style={{ ...displayStyle('0.75rem', 800), letterSpacing: '0.07em' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#96CC00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#BDFF00')}
            >
              Vezi toate →
            </Link>
          </div>

          {featured ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.items.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="card-hover group"
                >
                  <div
                    className="h-40 flex items-center justify-center text-4xl"
                    style={{ background: 'linear-gradient(135deg, #F7F4EF 0%, #EDE8E0 100%)' }}
                  >
                    {product.type === 'Electronics' ? '📱' : '🎧'}
                  </div>
                  <div className="p-3">
                    <p
                      className="group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-1"
                      style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: '#111111' }}
                    >
                      {product.name}
                    </p>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', color: '#A09880', marginBottom: '0.5rem' }}>
                      {product.brand}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-brand" style={monoStyle('0.95rem')}>
                        {product.price.toFixed(0)} MDL
                      </p>
                      <span className={product.stock > 0 ? 'badge-green' : 'badge-red'}>
                        {product.stock > 0 ? 'In stoc' : 'Epuizat'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-40 mb-3 rounded-sm" style={{ background: '#EDE8E0' }} />
                  <div className="h-3 rounded-sm mb-2" style={{ background: '#EDE8E0' }} />
                  <div className="h-3 rounded-sm w-2/3 mb-3" style={{ background: '#EDE8E0' }} />
                  <div className="h-4 rounded-sm w-1/2" style={{ background: '#EDE8E0' }} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* De ce noi */}
        <section className="py-12" style={{ borderTop: '1px solid #E8E3D8' }}>
          <div className="section-title mb-1">De ce GadgetStore.md?</div>
          <p className="section-subtitle">Cumparaturi online simple, rapide si sigure</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="text-brand mb-4" style={monoStyle('0.7rem')}>
                  {f.num}
                </div>
                <h3
                  style={{ ...displayStyle('1.15rem', 800), marginBottom: '0.25rem', color: '#111111' }}
                >
                  {f.title}
                </h3>
                <p style={{ ...displayStyle('0.78rem', 700), color: '#8A8578', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                  {f.detail}
                </p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', color: '#8A8578', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(189,255,0,0.03) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(189,255,0,0.03) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '40px 40px',
          }}
        />
        {/* Top separator */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(189,255,0,0.25) 50%, transparent 100%)' }}
        />

        <div className="container mx-auto px-4 max-w-7xl py-24 text-center relative z-10">
          <p
            style={{
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: '1rem',
            }}
          >
            Nu ai cont inca?
          </p>
          <h2
            className="text-white"
            style={{ ...displayStyle('clamp(2.5rem, 5vw, 4.2rem)', 900), marginBottom: '0.1em' }}
          >
            Inregistreaza-te
          </h2>
          <h2
            className="text-brand"
            style={{ ...displayStyle('clamp(2.5rem, 5vw, 4.2rem)', 900), marginBottom: '2.5rem' }}
          >
            si primesti reduceri exclusive
          </h2>
          <Link to="/register" className="btn-primary px-10 py-4">
            Creeaza cont gratuit
          </Link>
        </div>
      </section>

    </div>
  )
}
