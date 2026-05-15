import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { wishlistService } from '@/services/api'
import { useUiStore } from '@/store/uiStore'

export default function WishlistPage() {
  const queryClient = useQueryClient()
  const { addToast } = useUiStore()

  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.get(),
  })

  const { mutate: remove } = useMutation({
    mutationFn: (productId: string) => wishlistService.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const { mutate: moveToCart } = useMutation({
    mutationFn: (productId: string) => wishlistService.moveToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      addToast('Produs mutat in cos!', 'success')
    },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Wishlist</h1>
        <p className="text-xs font-mono text-ink-faint mt-0.5">
          {items ? `${items.length} PRODUSE SALVATE` : 'SE INCARCA...'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="card p-4 h-32 animate-pulse" />)}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 space-y-3 hover:border-brand/30 transition-all group">
              <Link to={`/products/${item.productId}`} className="block space-y-1">
                <p className="font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">
                  {item.productName}
                </p>
                <p className="font-mono font-bold text-brand">
                  {item.productPrice.toFixed(2)}<span className="text-xs text-brand/60 ml-0.5">MDL</span>
                </p>
                <p className="text-xs font-mono">
                  {item.productStock > 0
                    ? <span className="text-emerald-400">In stoc</span>
                    : <span className="text-red-400">Stoc epuizat</span>}
                </p>
              </Link>
              <div className="flex gap-2">
                <button onClick={() => moveToCart(item.productId)} disabled={item.productStock === 0}
                  className="btn-primary flex-1 text-sm py-1.5">
                  🛒 Muta in cos
                </button>
                <button onClick={() => remove(item.productId)}
                  className="btn-secondary text-sm py-1.5 px-3 text-red-400 hover:text-red-300">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="text-5xl mb-2 opacity-40">❤️</div>
          <h2 className="font-display text-xl font-bold text-ink">Wishlist-ul tau este gol</h2>
          <p className="text-sm text-ink-muted">Salveaza produsele preferate pentru mai tarziu.</p>
          <Link to="/catalog" className="btn-primary inline-flex mt-2">Descopera produse</Link>
        </div>
      )}
    </div>
  )
}
