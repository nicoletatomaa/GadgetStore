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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/>
      </svg>
    ),
    title: 'Livrare 24h in Chisinau',
    desc:  'Comenzile plasate pana la 14:00 ajung in aceasi zi',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: 'Garantie 2 ani',
    desc:  'Toate produsele vin cu garantie oficiala de producator',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
    title: 'Suport 24/7',
    desc:  'Echipa noastra este disponibila non-stop pentru tine',
  },
]

const STATS = [
  { value: '500+', label: 'Produse' },
  { value: '10K+', label: 'Clienti' },
  { value: '4.9 ★', label: 'Rating' },
]

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
    <div className="space-y-12">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl hero-gradient animate-gradient-x bg-animate min-h-[360px] flex items-center p-10 md:p-14">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-brand/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute -bottom-12 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

        <div className="absolute top-10 right-[18%] text-5xl opacity-20 animate-float pointer-events-none select-none" style={{ animationDelay: '0s' }}>📱</div>
        <div className="absolute top-16 right-[8%]  text-4xl opacity-15 animate-float-slow pointer-events-none select-none" style={{ animationDelay: '1.5s' }}>💻</div>
        <div className="absolute bottom-10 right-[14%] text-4xl opacity-20 animate-float pointer-events-none select-none" style={{ animationDelay: '3s' }}>🎧</div>
        <div className="absolute bottom-16 right-[4%]  text-3xl opacity-15 animate-float-slow pointer-events-none select-none" style={{ animationDelay: '0.5s' }}>⌚</div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-white/80 mb-5 animate-fade-in-up">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Livrare gratuita in toata Moldova la comenzi peste 500 MDL
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up-d1">
            Gadgeturi de top,<br />
            <span className="text-gradient">preturi imbatabile</span>
          </h1>

          <p className="text-slate-300 text-lg mb-8 animate-fade-in-up-d2">
            Smartphone-uri, laptopuri, accesorii — livrare rapida in Chisinau si toata Moldova
          </p>

          <div className="flex gap-3 flex-wrap animate-fade-in-up-d2">
            <Link
              to="/catalog"
              className="bg-white text-brand font-bold px-8 py-3 rounded-xl hover:bg-violet-50 transition-all hover:scale-105 shadow-xl text-sm"
            >
              Exploreaza catalogul
            </Link>
            <Link
              to="/register"
              className="glass text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              Creeaza cont gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-2xl font-extrabold text-brand">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Categorii */}
      {catalog && catalog.length > 0 && (
        <section>
          <h2 className="section-title">Categorii</h2>
          <p className="section-subtitle">Gaseste produsul dorit dupa categorie</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {catalog.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog/${cat.id}`}
                className="card p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="text-3xl mb-2">
                  {CATEGORY_ICONS[cat.name] ?? CATEGORY_ICONS['default']}
                </div>
                <p className="text-xs font-semibold text-gray-700 group-hover:text-brand transition-colors leading-tight">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produse populare */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h2 className="section-title">Produse populare</h2>
          <Link to="/catalog" className="text-sm text-brand hover:text-brand-dark font-semibold transition-colors">
            Vezi toate →
          </Link>
        </div>
        <p className="section-subtitle">Cele mai vandute produse din magazin</p>

        {featured ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.items.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="bg-gradient-to-br from-slate-50 to-violet-50 h-40 flex items-center justify-center text-5xl">
                  {product.type === 'Electronics' ? '📱' : '🎧'}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-brand font-bold">{product.price.toFixed(0)} MDL</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      product.stock > 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
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
                <div className="bg-gray-200 rounded-lg h-40 mb-3" />
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* De ce noi */}
      <section>
        <h2 className="section-title text-center">De ce GadgetStore.md?</h2>
        <p className="section-subtitle text-center">Cumparaturi online simple, rapide si sigure</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-brand/40 via-transparent to-accent/30 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-2">Nu ai cont inca?</p>
          <h3 className="text-2xl font-bold text-white mb-4">
            Inregistreaza-te si primesti<br />
            <span className="text-gradient">reduceri exclusive</span>
          </h3>
          <Link
            to="/register"
            className="inline-flex bg-white text-brand font-bold px-8 py-3 rounded-xl hover:bg-violet-50 transition-all hover:scale-105 shadow-xl text-sm"
          >
            Creeaza cont gratuit
          </Link>
        </div>
      </section>

    </div>
  )
}
