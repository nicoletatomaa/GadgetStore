import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsService, reviewsService } from '@/services/api'
import { useAddToCart } from '@/hooks/useCart'

const DECORATOR_OPTIONS = [
  { key: 'Warranty', label: 'Garantie extinsa (+49 RON)', price: 49 },
  { key: 'GiftWrap', label: 'Ambalaj cadou (+15 RON)', price: 15 },
  { key: 'Insurance', label: 'Asigurare daune (+2%)', price: 0 },
]

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const [quantity, setQuantity] = useState(1)
  const [selectedDecorators, setSelectedDecorators] = useState<string[]>([])
  const { mutate: addToCart, isPending } = useAddToCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsService.getById(productId),
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsService.getByProduct(productId),
  })

  const toggleDecorator = (key: string) =>
    setSelectedDecorators((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    )

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-gray-200 h-64 rounded-xl" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    )
  }

  if (!product) return <p className="text-center py-16 text-gray-500">Produsul nu a fost gasit.</p>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Imagine */}
      <div className="bg-gray-100 rounded-2xl flex items-center justify-center text-8xl h-80">
        {product.type === 'Electronics' ? '📱' : '🎧'}
      </div>

      {/* Detalii */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        </div>

        <p className="text-3xl font-bold text-brand">{product.price.toFixed(2)} RON</p>

        <p className="text-sm">
          {product.stock > 0
            ? <span className="badge-green">In stoc ({product.stock} disponibile)</span>
            : <span className="badge-red">Stoc epuizat</span>
          }
        </p>

        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        )}

        {/* Decoratori */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Optiuni suplimentare:</p>
          {DECORATOR_OPTIONS.map((d) => (
            <label key={d.key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedDecorators.includes(d.key)}
                onChange={() => toggleDecorator(d.key)}
                className="w-4 h-4 text-brand rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-brand">{d.label}</span>
            </label>
          ))}
        </div>

        {/* Cantitate */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Cantitate:</label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 hover:bg-gray-100 text-lg">−</button>
            <span className="px-4 py-1 text-sm font-medium">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-1 hover:bg-gray-100 text-lg">+</button>
          </div>
        </div>

        <button
          onClick={() => addToCart({ productId: product.id, quantity, decorators: selectedDecorators })}
          disabled={product.stock === 0 || isPending}
          className="btn-primary w-full py-3 text-base"
        >
          {isPending ? 'Se adauga...' : 'Adauga in cos'}
        </button>
      </div>

      {/* Recenzii */}
      {reviews && reviews.length > 0 && (
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recenzii ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{r.userFirstName} {r.userLastName}</span>
                  <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
