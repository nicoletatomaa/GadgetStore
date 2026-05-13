import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productsService, catalogService } from '@/services/api'

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
    <div className="space-y-10">
      {/* Hero */}
      <section className="bg-gradient-to-r from-brand to-brand-dark rounded-2xl p-10 text-white text-center">
        <h1 className="text-4xl font-bold mb-3">Gadgeturi de top, la preturi imbatabile</h1>
        <p className="text-blue-100 mb-6 text-lg">Smartphone-uri, laptopuri, accesorii — totul intr-un loc</p>
        <Link to="/catalog" className="bg-white text-brand font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
          Exploreaza catalogul
        </Link>
      </section>

      {/* Categorii */}
      {catalog && catalog.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Categorii</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {catalog.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog/${cat.id}`}
                className="card p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="text-3xl mb-2">📦</div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-brand">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produse recomandate */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Produse populare</h2>
        {featured ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.items.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="card p-4 hover:shadow-md transition-shadow group">
                <div className="bg-gray-100 rounded-lg h-36 flex items-center justify-center mb-3 text-4xl">
                  {product.type === 'Electronics' ? '📱' : '🎧'}
                </div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-brand line-clamp-2">{product.name}</p>
                <p className="text-brand font-bold mt-1">{product.price.toFixed(2)} RON</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {product.stock > 0 ? <span className="text-green-600">In stoc</span> : <span className="text-red-500">Stoc epuizat</span>}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-36 mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
