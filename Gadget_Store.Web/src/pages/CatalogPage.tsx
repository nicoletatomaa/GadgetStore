import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { productsService, catalogService } from '@/services/api'
import { useAddToCart } from '@/hooks/useCart'
import CategorySidebar from '@/components/ui/CategorySidebar'
import type { ProductFilters } from '@/types'

function ProductImage({ imageUrl, type, name }: { imageUrl?: string; type: string; name: string }) {
  const [broken, setBroken] = useState(false)
  const fallback = type === 'Electronics' ? '📱' : '🎧'
  if (imageUrl && !broken)
    return <img src={imageUrl} alt={name} className="w-full h-full object-contain p-2" onError={() => setBroken(true)} />
  return <span className="text-4xl">{fallback}</span>
}

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Popularitate' },
  { value: 'newest',     label: 'Cele mai noi' },
  { value: 'price_asc',  label: 'Pret crescator' },
  { value: 'price_desc', label: 'Pret descrescator' },
]

const monoStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 500,
}

const displayStyle = (size?: string): React.CSSProperties => ({
  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
  fontWeight: 800,
  fontSize: size,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
})

export default function CatalogPage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { mutate: addToCart } = useAddToCart()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')
  const [inStock,  setInStock]  = useState(searchParams.get('inStock') === 'true')
  const [sortBy,   setSortBy]   = useState<ProductFilters['sortBy']>(
    (searchParams.get('sortBy') as ProductFilters['sortBy']) ?? 'popular'
  )

  const page = Number(searchParams.get('page') ?? 1)

  const filters: ProductFilters = {
    categoryId: categoryId ? Number(categoryId) : undefined,
    search:     searchParams.get('search') ?? undefined,
    minPrice:   minPrice ? Number(minPrice) : undefined,
    maxPrice:   maxPrice ? Number(maxPrice) : undefined,
    inStock:    inStock || undefined,
    sortBy,
    page,
    pageSize: 20,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn:  () => productsService.getAll(filters),
  })

  const { data: categories } = useQuery({
    queryKey: ['catalog-nav'],
    queryFn:  () => catalogService.getCategories(),
  })

  const applyFilters = () => {
    const params: Record<string, string> = { page: '1' }
    if (searchParams.get('search')) params.search = searchParams.get('search')!
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    if (inStock)  params.inStock  = 'true'
    if (sortBy)   params.sortBy   = sortBy
    setSearchParams(params)
  }

  const resetFilters = () => {
    setMinPrice(''); setMaxPrice(''); setInStock(false); setSortBy('popular')
    const params: Record<string, string> = { page: '1' }
    if (searchParams.get('search')) params.search = searchParams.get('search')!
    setSearchParams(params)
  }

  const goToPage = (p: number) => {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(p) })
  }

  const hasActiveFilters = minPrice || maxPrice || inStock
  const activeCatName = categories?.find((c) =>
    String(c.id) === categoryId ||
    c.children?.some((s) => String(s.id) === categoryId)
  )?.name ?? ''

  return (
    <div className="flex w-full" style={{ minHeight: 'calc(100vh - 80px)' }}>

      {/* ── Left: dark sidebar ─────────────────────────────────────── */}
      <div className="shrink-0 hidden md:flex flex-col" style={{ width: 270 }}>
        <CategorySidebar
          categories={categories ?? []}
          activeCategoryId={categoryId}
        />

        {/* Filters panel attached under sidebar */}
        <div
          className="flex-1 space-y-5 p-5"
          style={{ background: '#111111', borderRight: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Pret */}
          <div>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: '0.6rem',
            }}>
              Pret (MDL)
            </p>
            <div className="flex gap-2">
              <input
                type="number" placeholder="Min" value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#BDFF00'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(189,255,0,0.1)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
              />
              <input
                type="number" placeholder="Max" value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#BDFF00'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(189,255,0,0.1)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          {/* In stoc */}
          <label
            className="flex items-center gap-2.5 cursor-pointer"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}
          >
            <input
              type="checkbox" checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 accent-brand"
            />
            Doar produse in stoc
          </label>

          <div className="space-y-2 pt-1">
            <button onClick={applyFilters} className="btn-primary w-full py-2">
              Aplica filtre
            </button>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="w-full py-2 text-white/40 hover:text-white/80 transition-colors"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                }}
              >
                Reseteaza filtrele
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Right: products ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 style={{ ...displayStyle('1.75rem'), color: '#111111', marginBottom: '0.1em' }}>
              {filters.search
                ? `Rezultate pentru "${filters.search}"`
                : activeCatName || 'Catalog produse'}
            </h1>
            {data && (
              <p style={{ ...monoStyle, fontSize: '0.72rem', color: '#8A8578' }}>
                {data.totalCount} produse
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8578' }}>
              Sorteaza:
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as ProductFilters['sortBy'])
                setSearchParams({ ...Object.fromEntries(searchParams.entries()), sortBy: e.target.value, page: '1' })
              }}
              className="input py-1.5 pr-8 w-auto text-sm"
              style={{ minWidth: 160 }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile quick filters */}
        <div className="flex md:hidden items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 cursor-pointer text-sm" style={{ color: '#3D3B36' }}>
            <input type="checkbox" checked={inStock}
              onChange={(e) => { setInStock(e.target.checked); applyFilters() }}
              className="w-4 h-4 accent-brand" />
            In stoc
          </label>
          <button onClick={applyFilters} className="btn-primary text-xs px-3 py-1.5">Filtreaza</button>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-40 rounded-sm mb-3" style={{ background: '#EDE8E0' }} />
                <div className="h-3 rounded-sm mb-2" style={{ background: '#EDE8E0' }} />
                <div className="h-3 rounded-sm w-1/2" style={{ background: '#EDE8E0' }} />
              </div>
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((product) => (
              <div key={product.id} className="card group flex flex-col transition-all duration-150"
                style={{ cursor: 'default' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#BDFF00'
                  e.currentTarget.style.boxShadow = '0 0 0 1px #BDFF00, 0 8px 24px rgba(0,0,0,0.07)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E8E3D8'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <Link to={`/products/${product.id}`} className="flex-1">
                  <div className="h-44 flex items-center justify-center overflow-hidden"
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
                      <p className="text-brand" style={monoStyle}>{product.price.toFixed(0)} MDL</p>
                      <span className={product.stock > 0 ? 'badge-green' : 'badge-red'}>
                        {product.stock > 0 ? 'In stoc' : 'Epuizat'}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-3 pb-3">
                  <button
                    onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                    disabled={product.stock === 0}
                    className="btn-primary w-full py-2 disabled:opacity-40"
                  >
                    {product.stock > 0 ? 'Adauga in cos' : 'Stoc epuizat'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#8A8578', marginBottom: '1rem' }}>
              [ 0 produse gasite ]
            </p>
            <p style={{ ...displayStyle('1.5rem'), color: '#111111', marginBottom: '0.5rem' }}>Nu am gasit produse</p>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: '#8A8578', marginBottom: '1.5rem' }}>
              Incearca sa modifici filtrele sau cauta altceva
            </p>
            <button onClick={resetFilters} className="btn-secondary">Sterge filtrele</button>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => goToPage(page - 1)} disabled={page === 1}
              className="btn-secondary px-4 py-1.5 disabled:opacity-30">
              ← Anterioara
            </button>
            <div className="flex gap-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === data.totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === 'ellipsis' ? (
                    <span key={`e${i}`} className="px-2 py-1 text-sm" style={{ color: '#8A8578' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className="px-3 py-1.5 text-sm transition-all"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: p === page ? 800 : 600,
                        fontSize: '0.85rem',
                        borderRadius: '3px',
                        background: p === page ? '#BDFF00' : 'transparent',
                        color: p === page ? '#111111' : '#3D3B36',
                        border: p === page ? '1px solid #BDFF00' : '1px solid #E8E3D8',
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>
            <button onClick={() => goToPage(page + 1)} disabled={page === data.totalPages}
              className="btn-secondary px-4 py-1.5 disabled:opacity-30">
              Urmatoarea →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
