import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { productsService, catalogService } from '@/services/api'
import { useAddToCart } from '@/hooks/useCart'
import type { ProductFilters } from '@/types'

const SORT_OPTIONS = [
  { value: 'popular',   label: 'Popularitate' },
  { value: 'newest',    label: 'Cele mai noi' },
  { value: 'price_asc', label: 'Pret crescator' },
  { value: 'price_desc',label: 'Pret descrescator' },
]

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
    pageSize:   20,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn:  () => productsService.getAll(filters),
  })

  const { data: categories } = useQuery({
    queryKey: ['catalog'],
    queryFn:  () => catalogService.getTree(),
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
    setMinPrice('')
    setMaxPrice('')
    setInStock(false)
    setSortBy('popular')
    const params: Record<string, string> = { page: '1' }
    if (searchParams.get('search')) params.search = searchParams.get('search')!
    setSearchParams(params)
  }

  const goToPage = (p: number) => {
    const params = Object.fromEntries(searchParams.entries())
    setSearchParams({ ...params, page: String(p) })
  }

  const hasActiveFilters = minPrice || maxPrice || inStock

  return (
    <div className="flex gap-6">
      {/* Sidebar filtre */}
      <aside className="hidden md:block w-56 shrink-0 space-y-5">
        {/* Categorii */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Categorii</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                to="/catalog"
                className={`block px-2 py-1 rounded hover:text-brand ${!categoryId ? 'text-brand font-medium' : 'text-gray-600'}`}
              >
                Toate produsele
              </Link>
            </li>
            {categories?.map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/catalog/${cat.id}`}
                  className={`block px-2 py-1 rounded hover:text-brand ${String(categoryId) === String(cat.id) ? 'text-brand font-medium' : 'text-gray-600'}`}
                >
                  {cat.name}
                </Link>
                {cat.children?.length > 0 && (
                  <ul className="ml-3 mt-1 space-y-1">
                    {cat.children.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`/catalog/${sub.id}`}
                          className={`block px-2 py-0.5 rounded text-xs hover:text-brand ${String(categoryId) === String(sub.id) ? 'text-brand font-medium' : 'text-gray-500'}`}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Pret */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Pret (RON)</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input text-sm py-1.5 px-2 w-full"
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input text-sm py-1.5 px-2 w-full"
              min={0}
            />
          </div>
        </div>

        {/* Disponibilitate */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Disponibilitate</h3>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 text-brand rounded"
            />
            Doar produse in stoc
          </label>
        </div>

        <div className="space-y-2">
          <button onClick={applyFilters} className="btn-primary w-full text-sm py-2">
            Aplica filtre
          </button>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="btn-secondary w-full text-sm py-2">
              Reseteaza
            </button>
          )}
        </div>
      </aside>

      {/* Continut principal */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">
            {filters.search ? `Rezultate pentru "${filters.search}"` : 'Catalog produse'}
            {data && <span className="text-sm font-normal text-gray-400 ml-2">({data.totalCount} produse)</span>}
          </h1>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Sorteaza:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as ProductFilters['sortBy'])
                const params = Object.fromEntries(searchParams.entries())
                setSearchParams({ ...params, sortBy: e.target.value, page: '1' })
              }}
              className="input text-sm py-1.5 pr-8 w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtre mobile rapide */}
        <div className="flex md:hidden items-center gap-2 flex-wrap text-sm">
          <label className="flex items-center gap-1 cursor-pointer text-gray-600">
            <input type="checkbox" checked={inStock} onChange={(e) => { setInStock(e.target.checked); applyFilters() }}
              className="w-3.5 h-3.5 text-brand rounded" />
            In stoc
          </label>
          <button onClick={applyFilters} className="btn-primary text-xs px-3 py-1">Filtreaza</button>
        </div>

        {/* Grid produse */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-200 h-40 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((product) => (
              <div key={product.id} className="card p-4 group flex flex-col">
                <Link to={`/products/${product.id}`} className="flex-1">
                  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-3 text-4xl group-hover:bg-gray-200 transition-colors">
                    {product.type === 'Electronics' ? '📱' : '🎧'}
                  </div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-brand line-clamp-2">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
                  <p className="text-brand font-bold mt-1">{product.price.toFixed(2)} RON</p>
                  <p className="text-xs mt-0.5">
                    {product.stock > 0
                      ? <span className="text-green-600">In stoc</span>
                      : <span className="text-red-500">Stoc epuizat</span>}
                  </p>
                </Link>
                <button
                  onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                  disabled={product.stock === 0}
                  className="btn-primary w-full mt-3 text-sm py-1.5 disabled:opacity-50"
                >
                  {product.stock > 0 ? 'Adauga in cos' : 'Stoc epuizat'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">Nu am gasit produse</p>
            <p className="text-sm mt-1">Incearca sa modifici filtrele sau cauta altceva</p>
            <button onClick={resetFilters} className="btn-secondary mt-4">Sterge filtrele</button>
          </div>
        )}

        {/* Paginare */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
            >
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
                    <span key={`e${i}`} className="px-2 py-1 text-sm text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p as number)}
                      className={`px-3 py-1.5 text-sm rounded-lg ${
                        p === page ? 'bg-brand text-white font-medium' : 'btn-secondary'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === data.totalPages}
              className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Urmatoarea →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
