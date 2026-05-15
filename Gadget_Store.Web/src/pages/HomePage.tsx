import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsService, catalogService } from '@/services/api'
import CategorySidebar from '@/components/ui/CategorySidebar'

function ProductImage({ imageUrl, type, name }: { imageUrl?: string; type: string; name: string }) {
  const [broken, setBroken] = useState(false)
  const fallback = type === 'Electronics' ? '📱' : '🎧'
  if (imageUrl && !broken)
    return <img src={imageUrl} alt={name} className="w-full h-full object-contain p-2" onError={() => setBroken(true)} />
  return <span className="text-4xl">{fallback}</span>
}

const FEATURES = [
  { num: '01', title: 'Livrare 24h', sub: 'in Chisinau', desc: 'Comenzile plasate pana la 14:00 ajung in aceasi zi' },
  { num: '02', title: 'Garantie 2 ani', sub: 'producator', desc: 'Toate produsele vin cu garantie oficiala de producator' },
  { num: '03', title: 'Suport 24/7', sub: 'non-stop', desc: 'Echipa noastra este disponibila non-stop pentru tine' },
]

const displayStyle = (size?: string, weight?: number): React.CSSProperties => ({
  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
  fontWeight: weight ?? 800,
  fontSize: size,
  letterSpacing: '-0.015em',
  textTransform: 'uppercase',
  lineHeight: 1,
})

const monoStyle = (size?: string): React.CSSProperties => ({
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 500,
  fontSize: size,
})

export default function HomePage() {
  const { data: catalog } = useQuery({
    queryKey: ['catalog-nav'],
    queryFn: () => catalogService.getCategories(),
  })

  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getAll({ pageSize: 8, sortBy: 'popular' }),
  })

  return (
    <div className="flex w-full" style={{ minHeight: 'calc(100vh - 80px)' }}>

      {/* ── Dark sidebar ───────────────────────────────────────────── */}
      <div className="hidden md:block shrink-0" style={{ width: 270 }}>
        <CategorySidebar categories={catalog ?? []} />
      </div>

      {/* ── Right: all content ────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Hero banner */}
        <section
          className="relative overflow-hidden"
          style={{ background: '#0A0A0A', minHeight: 280 }}
        >
          {/* Subtle grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: [
              'linear-gradient(rgba(189,255,0,0.04) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(189,255,0,0.04) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '40px 40px',
          }} />
          {/* Glow */}
          <div className="absolute pointer-events-none" style={{
            right: '5%', bottom: '-10%', width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(189,255,0,0.07) 0%, transparent 65%)',
          }} />

          <div className="relative z-10 px-8 py-12 md:py-16 max-w-3xl animate-slide-up">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-slow" />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(189,255,0,0.6)',
              }}>
                Gadget Store &middot; Chisinau, Moldova
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-white animate-slide-up-d1"
              style={{ ...displayStyle('clamp(2.4rem, 5vw, 4rem)', 900), marginBottom: '0.1em' }}>
              Gadgeturi de top,
            </h1>
            <h1 className="text-brand animate-slide-up-d1"
              style={{ ...displayStyle('clamp(2.4rem, 5vw, 4rem)', 900), marginBottom: '1.5rem' }}>
              preturi imbatabile
            </h1>

            <p style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 420,
              lineHeight: 1.7,
              marginBottom: '2rem',
            }} className="animate-slide-up-d2">
              Smartphone-uri, laptopuri, accesorii — livrare rapida in Chisinau si toata Moldova
            </p>

            <div className="flex gap-3 flex-wrap animate-slide-up-d2">
              <Link to="/catalog" className="btn-primary px-7 py-3">
                Exploreaza catalogul
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-7 py-3 transition-all"
                style={{
                  ...displayStyle(undefined, 800),
                  fontSize: '0.78rem',
                  borderRadius: '3px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#BDFF00'; e.currentTarget.style.borderColor = 'rgba(189,255,0,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                Creeaza cont gratuit
              </Link>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(189,255,0,0.3) 50%, transparent 100%)' }} />
        </section>

        {/* Content area — warm bg */}
        <div className="flex-1 px-6 py-8 space-y-10" style={{ background: '#F7F4EF' }}>

          {/* Featured products */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <div className="section-title">Produse populare</div>
                <p className="section-subtitle">Cele mai vandute produse din magazin</p>
              </div>
              <Link
                to="/catalog"
                className="mb-6 transition-colors"
                style={{ ...displayStyle('0.72rem', 800), letterSpacing: '0.08em', color: '#BDFF00' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#96CC00')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#BDFF00')}
              >
                Vezi toate →
              </Link>
            </div>

            {featured ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {featured.items.map((product) => (
                  <Link key={product.id} to={`/products/${product.id}`} className="card-hover group">
                    <div className="h-40 flex items-center justify-center overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #F7F4EF 0%, #EDE8E0 100%)' }}>
                      <ProductImage imageUrl={product.imageUrl} type={product.type} name={product.name} />
                    </div>
                    <div className="p-3">
                      <p className="group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-1"
                        style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: '#111111' }}>
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
          <section style={{ borderTop: '1px solid #E8E3D8', paddingTop: '2.5rem' }}>
            <div className="section-title mb-1">De ce GadgetStore.md?</div>
            <p className="section-subtitle">Cumparaturi online simple, rapide si sigure</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="card p-6">
                  <div className="text-brand mb-3" style={monoStyle('0.68rem')}>{f.num}</div>
                  <h3 style={{ ...displayStyle('1.1rem', 800), color: '#111111', marginBottom: '0.2em' }}>{f.title}</h3>
                  <p style={{ ...displayStyle('0.72rem', 700), letterSpacing: '0.06em', color: '#8A8578', marginBottom: '0.6rem' }}>{f.sub}</p>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', color: '#8A8578', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* CTA Banner */}
        <section className="relative overflow-hidden" style={{ background: '#0A0A0A' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: [
              'linear-gradient(rgba(189,255,0,0.03) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(189,255,0,0.03) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '40px 40px',
          }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(189,255,0,0.25) 50%, transparent 100%)' }} />

          <div className="relative z-10 px-8 py-16 text-center">
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: '1rem',
            }}>
              Nu ai cont inca?
            </p>
            <h2 className="text-white" style={{ ...displayStyle('clamp(2rem, 4vw, 3.2rem)', 900), marginBottom: '0.1em' }}>
              Inregistreaza-te
            </h2>
            <h2 className="text-brand" style={{ ...displayStyle('clamp(2rem, 4vw, 3.2rem)', 900), marginBottom: '2rem' }}>
              si primesti reduceri exclusive
            </h2>
            <Link to="/register" className="btn-primary px-10 py-3.5">
              Creeaza cont gratuit
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
