import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { productsService } from '@/services/api'
import { useAddToCart } from '@/hooks/useCart'
import type { ProductFilters } from '@/types'

export default function CatalogPage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const [searchParams] = useSearchParams()
  const { mutate: addToCart } = useAddToCart()

  const filters: ProductFilters = {
    categoryId: categoryId ? Number(categoryId) : undefined,
    search: searchParams.get('search') ?? undefined,
    page: Number(searchParams.get('page') ?? 1),
    pageSize: 20,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getAll(filters),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {filters.search ? `Rezultate pentru "${filters.search}"` : 'Catalog produse'}
      </h1>

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
        <>
          <p className="text-sm text-gray-500">{data.totalCount} produse gasite</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((product) => (
              <div key={product.id} className="card p-4 group">
                <Link to={`/products/${product.id}`}>
                  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center mb-3 text-4xl group-hover:bg-gray-200 transition-colors">
                    {product.type === 'Electronics' ? '📱' : '🎧'}
                  </div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-brand line-clamp-2">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
                  <p className="text-brand font-bold mt-1">{product.price.toFixed(2)} RON</p>
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
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">Nu am gasit produse.</p>
        </div>
      )}
    </div>
  )
}
