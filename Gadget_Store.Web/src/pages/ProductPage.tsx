import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function ProductImage({ imageUrl, type, name }: { imageUrl?: string; type: string; name: string }) {
  const [broken, setBroken] = useState(false)
  const fallback = type === 'Electronics' ? '📱' : '🎧'
  if (imageUrl && !broken) {
    return <img src={imageUrl} alt={name} className="w-full h-full object-contain p-6"
      onError={() => setBroken(true)} />
  }
  return <span className="text-8xl opacity-40">{fallback}</span>
}

import { useQuery, useMutation } from '@tanstack/react-query'
import { productsService, reviewsService, wishlistService } from '@/services/api'
import { useAddToCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import type { CreateReviewRequest } from '@/types'

const DECORATOR_OPTIONS = [
  { key: 'Warranty',  label: 'Garantie extinsa',    description: '+24 luni garantie',       price: 49  },
  { key: 'GiftWrap',  label: 'Ambalaj cadou',        description: 'Ambalaj festiv inclus',   price: 15  },
  { key: 'Insurance', label: 'Asigurare daune',      description: 'Protectie completa 1 an', pct: 0.02 },
]

type Tab = 'description' | 'reviews'

export default function ProductPage() {
  const { id: productId = '' } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthStore()
  const { addToast }        = useUiStore()

  const [quantity, setQuantity]                     = useState(1)
  const [selectedDecorators, setSelectedDecorators] = useState<string[]>([])
  const [tab, setTab]                               = useState<Tab>('description')
  const [inWishlist, setInWishlist]                 = useState(false)
  const [reviewForm, setReviewForm]                 = useState<CreateReviewRequest>({ rating: 5, comment: '' })

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
        <div className="bg-surface-raised h-72 rounded-2xl" />
        <div className="h-8 bg-surface-raised rounded w-2/3" />
        <div className="h-6 bg-surface-raised rounded w-1/4" />
      </div>
    )
  }

  if (!product) return (
    <div className="text-center py-20 space-y-3">
      <p className="text-5xl opacity-30">❓</p>
      <p className="font-display text-xl font-bold text-ink">Produs negasit</p>
      <p className="text-sm text-ink-muted">Produsul cautat nu exista sau a fost eliminat.</p>
      <Link to="/catalog" className="btn-secondary inline-flex mt-2">Inapoi la catalog</Link>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">

        {/* Imagine */}
        <div className="bg-surface-raised border border-edge rounded-2xl flex items-center justify-center h-80 overflow-hidden relative">
          <div className="absolute inset-0 grid-lines opacity-30" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <ProductImage imageUrl={product.imageUrl} type={product.type} name={product.name} />
          </div>
        </div>

        {/* Detalii */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-ink-faint uppercase tracking-wider">{product.brand}</span>
              {avgRating && (
                <>
                  <span className="text-ink-faint">·</span>
                  <span className="text-xs text-amber-400 font-mono">★ {avgRating} ({reviews?.length})</span>
                </>
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">{product.name}</h1>
          </div>

          <div className="flex items-end gap-3">
            <p className="font-display text-3xl font-extrabold text-brand">
              {(product.price + decoratorExtra).toFixed(2)}
              <span className="text-lg text-brand/60 ml-1">MDL</span>
            </p>
            {decoratorExtra > 0 && (
              <p className="text-sm text-ink-faint mb-1 line-through font-mono">{product.price.toFixed(2)} MDL</p>
            )}
          </div>

          <div>
            {product.stock > 0
              ? <span className="badge-green">In stoc ({product.stock} disponibile)</span>
              : <span className="badge-red">Stoc epuizat</span>}
          </div>

          {/* Optiuni suplimentare */}
          <div className="space-y-2">
            <p className="text-xs font-mono text-ink-faint uppercase tracking-widest">Optiuni suplimentare</p>
            {DECORATOR_OPTIONS.map((d) => (
              <label key={d.key} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all
                ${selectedDecorators.includes(d.key)
                  ? 'border-brand bg-brand/5'
                  : 'border-edge hover:border-brand/30 hover:bg-surface-raised'}`}>
                <input type="checkbox" checked={selectedDecorators.includes(d.key)}
                  onChange={() => toggleDecorator(d.key)}
                  className="w-4 h-4 accent-[#F59E0B] rounded" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{d.label}</p>
                  <p className="text-xs text-ink-muted">{d.description}</p>
                </div>
                <span className="text-sm font-mono font-bold text-brand">
                  {d.price ? `+${d.price} MDL` : `+${((d.pct ?? 0) * 100).toFixed(0)}%`}
                </span>
              </label>
            ))}
          </div>

          {/* Cantitate */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-ink-muted uppercase tracking-wider">Cantitate</label>
            <div className="flex items-center border border-edge rounded-lg overflow-hidden">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 hover:bg-surface-raised text-ink transition-colors text-lg leading-none">−</button>
              <span className="px-4 py-1.5 text-sm font-mono font-bold text-ink min-w-[2.5rem] text-center border-x border-edge">
                {quantity}
              </span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1.5 hover:bg-surface-raised text-ink transition-colors text-lg leading-none">+</button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToCart({ productId: product.id, quantity, decorators: selectedDecorators })}
              disabled={product.stock === 0 || addingToCart}
              className="btn-primary flex-1 py-3 text-base"
            >
              {addingToCart ? 'Se adauga...' : '🛒 Adauga in cos'}
            </button>
            <button
              onClick={() => toggleWishlist()}
              disabled={wishlistPending}
              title={isAuthenticated ? (inWishlist ? 'Elimina din wishlist' : 'Adauga in wishlist') : 'Autentifica-te'}
              className={`px-4 py-3 rounded-xl border-2 transition-all text-xl
                ${inWishlist
                  ? 'border-red-400 bg-red-950/30 text-red-400'
                  : 'border-edge hover:border-red-400/50 text-ink-faint hover:text-red-400'}`}
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="flex border-b border-edge">
          {([['description', 'Descriere'], ['reviews', `Recenzii (${reviews?.length ?? 0})`]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-mono font-medium border-b-2 transition-colors -mb-px uppercase tracking-wide
                ${tab === t ? 'border-brand text-brand' : 'border-transparent text-ink-faint hover:text-ink-muted'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="py-5">
            {product.description
              ? <p className="text-ink-muted leading-relaxed">{product.description}</p>
              : <p className="text-ink-faint italic">Nu exista descriere pentru acest produs.</p>}
          </div>
        )}

        {tab === 'reviews' && (
          <div className="py-5 space-y-4">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-ink">{r.userFirstName} {r.userLastName}</span>
                        {r.isVerified && <span className="badge-green text-[10px]">Verificat</span>}
                      </div>
                      <span className="text-xs text-ink-faint font-mono">
                        {new Date(r.createdAt).toLocaleDateString('ro-MD')}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < r.rating ? 'text-amber-400' : 'text-edge'}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-ink-muted">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ink-faint italic py-4">Nu exista recenzii inca. Fii primul!</p>
            )}

            {isAuthenticated ? (
              <div className="card p-5 space-y-4">
                <h3 className="text-xs font-mono text-ink-faint uppercase tracking-widest">Adauga recenzie</h3>
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                        className={`text-2xl transition-colors ${star <= reviewForm.rating ? 'text-amber-400' : 'text-edge hover:text-amber-300'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea className="input w-full" rows={3} placeholder="Scrie parerea ta despre produs..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))} />
                <button onClick={() => submitReview()} disabled={submittingReview || !reviewForm.comment}
                  className="btn-primary text-sm py-2 disabled:opacity-50">
                  {submittingReview ? 'Se trimite...' : 'Trimite recenzie →'}
                </button>
              </div>
            ) : (
              <div className="card p-5 text-center space-y-3">
                <span className="text-3xl">✍️</span>
                <p className="text-sm text-ink-muted">Autentifica-te pentru a lasa o recenzie</p>
                <Link to="/login" className="btn-secondary text-sm inline-flex">Autentificare</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
