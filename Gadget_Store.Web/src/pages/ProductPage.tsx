import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService, reviewsService, wishlistService } from '@/services/api'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import type { CreateReviewRequest } from '@/types'

const DECORATOR_OPTIONS = [
  { key: 'Warranty',  label: 'Garantie extinsa',   description: '+24 luni garantie',      price: 49  },
  { key: 'GiftWrap',  label: 'Ambalaj cadou',       description: 'Ambalaj festiv inclus',  price: 15  },
  { key: 'Insurance', label: 'Asigurare daune',     description: 'Protectie completa 1 an', pct: 0.02 },
]

type Tab = 'description' | 'reviews'

export default function ProductPage() {
  const { id: productId = '' } = useParams<{ id: string }>()
  const queryClient      = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const { addToast }     = useUiStore()

  const [quantity, setQuantity]                 = useState(1)
  const [selectedDecorators, setSelectedDecorators] = useState<string[]>([])
  const [tab, setTab]                           = useState<Tab>('description')
  const [inWishlist, setInWishlist]             = useState(false)
  const [reviewForm, setReviewForm]             = useState<CreateReviewRequest>({ rating: 5, comment: '' })

  const { mutate: addToCart, isPending: addingToCart } = useAddToCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn:  () => productsService.getById(productId),
    enabled:  !!productId,
  })

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', productId],
    queryFn:  () => reviewsService.getByProduct(productId),
    enabled:  !!productId,
  })

  const { mutate: toggleWishlist, isPending: wishlistPending } = useMutation({
    mutationFn: () => inWishlist ? wishlistService.remove(productId) : wishlistService.add(productId),
    onSuccess: () => {
      setInWishlist((prev) => !prev)
      addToast(inWishlist ? 'Eliminat din wishlist' : 'Adaugat in wishlist!', 'success')
    },
    onError: () => addToast('Autentifica-te pentru a folosi wishlist-ul.', 'error'),
  })

  const { mutate: submitReview, isPending: submittingReview } = useMutation({
    mutationFn: () => reviewsService.create(productId, reviewForm),
    onSuccess: () => {
      setReviewForm({ rating: 5, comment: '' })
      refetchReviews()
      addToast('Recenzie adaugata!', 'success')
    },
    onError: () => addToast('Eroare la adaugarea recenziei.', 'error'),
  })

  const toggleDecorator = (key: string) =>
    setSelectedDecorators((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    )

  const decoratorExtra = selectedDecorators.reduce((sum, key) => {
    const d = DECORATOR_OPTIONS.find((x) => x.key === key)
    if (!d) return sum
    if (d.price) return sum + d.price
    if (d.pct && product) return sum + product.price * d.pct
    return sum
  }, 0)

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-gray-200 h-64 rounded-xl" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
    )
  }

  if (!product) return (
    <div className="text-center py-16 space-y-3">
      <p className="text-5xl">❓</p>
      <p className="text-gray-500">Produsul nu a fost gasit.</p>
      <Link to="/catalog" className="btn-secondary inline-flex">Inapoi la catalog</Link>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagine */}
        <div className="bg-gray-100 rounded-2xl flex items-center justify-center text-8xl h-80">
          {product.type === 'Electronics' ? '📱' : '🎧'}
        </div>

        {/* Detalii */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{product.brand}</span>
              {product.categoryName && (
                <span className="text-xs text-gray-300">·</span>
              )}
              {avgRating && (
                <span className="text-xs text-yellow-500">★ {avgRating} ({reviews?.length})</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          </div>

          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-brand">
              {(product.price + decoratorExtra).toFixed(2)} RON
            </p>
            {decoratorExtra > 0 && (
              <p className="text-sm text-gray-400 mb-1 line-through">{product.price.toFixed(2)} RON</p>
            )}
          </div>

          <p className="text-sm">
            {product.stock > 0
              ? <span className="badge-green">In stoc ({product.stock} disponibile)</span>
              : <span className="badge-red">Stoc epuizat</span>}
          </p>

          {/* Optiuni Decorator pattern */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Optiuni suplimentare <span className="text-xs text-gray-400 font-normal">(Decorator pattern)</span></p>
            {DECORATOR_OPTIONS.map((d) => (
              <label key={d.key} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-colors
                ${selectedDecorators.includes(d.key) ? 'border-brand bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={selectedDecorators.includes(d.key)}
                  onChange={() => toggleDecorator(d.key)}
                  className="w-4 h-4 text-brand rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{d.label}</p>
                  <p className="text-xs text-gray-500">{d.description}</p>
                </div>
                <span className="text-sm font-medium text-brand">
                  {d.price ? `+${d.price} RON` : `+${((d.pct ?? 0) * 100).toFixed(0)}%`}
                </span>
              </label>
            ))}
          </div>

          {/* Cantitate */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Cantitate:</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1.5 hover:bg-gray-100 text-lg leading-none">−</button>
              <span className="px-4 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-1.5 hover:bg-gray-100 text-lg leading-none">+</button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToCart({ productId: product.id, quantity, decorators: selectedDecorators })}
              disabled={product.stock === 0 || addingToCart}
              className="btn-primary flex-1 py-3 text-base"
            >
              {addingToCart ? 'Se adauga...' : 'Adauga in cos'}
            </button>
            <button
              onClick={() => toggleWishlist()}
              disabled={wishlistPending}
              title={isAuthenticated ? (inWishlist ? 'Elimina din wishlist' : 'Adauga in wishlist') : 'Autentifica-te'}
              className={`px-4 py-3 rounded-lg border-2 transition-colors text-xl
                ${inWishlist ? 'border-red-400 bg-red-50 text-red-500' : 'border-gray-300 hover:border-red-300 text-gray-400 hover:text-red-400'}`}
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-gray-200">
          {([['description', 'Descriere'], ['reviews', `Recenzii (${reviews?.length ?? 0})`]] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px
                ${tab === t ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Descriere */}
        {tab === 'description' && (
          <div className="py-4">
            {product.description
              ? <p className="text-gray-600 leading-relaxed">{product.description}</p>
              : <p className="text-gray-400 italic">Nu exista descriere pentru acest produs.</p>}
          </div>
        )}

        {/* Tab: Recenzii */}
        {tab === 'reviews' && (
          <div className="py-4 space-y-4">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-800">{r.userFirstName} {r.userLastName}</span>
                        {r.isVerified && <span className="text-xs badge-green">Cumparator verificat</span>}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('ro-RO')}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Nu exista recenzii inca. Fii primul!</p>
            )}

            {/* Formular recenzie */}
            {isAuthenticated ? (
              <div className="card p-4 space-y-3">
                <h3 className="font-semibold text-sm">Adauga o recenzie</h3>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                        className={`text-2xl transition-colors ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="input w-full"
                  rows={3}
                  placeholder="Scrie parerea ta despre produs..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                />
                <button
                  onClick={() => submitReview()}
                  disabled={submittingReview || !reviewForm.comment}
                  className="btn-primary text-sm py-2 disabled:opacity-50"
                >
                  {submittingReview ? 'Se trimite...' : 'Trimite recenzie'}
                </button>
              </div>
            ) : (
              <div className="card p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Autentifica-te pentru a lasa o recenzie</p>
                <Link to="/login" className="btn-secondary text-sm">Autentificare</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
