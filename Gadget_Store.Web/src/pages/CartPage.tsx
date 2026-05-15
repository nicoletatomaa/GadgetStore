import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useCartQuery, useRemoveFromCart, useUndoCart } from '@/hooks/useCart'

export default function CartPage() {
  const { isLoading } = useCartQuery()
  const { items, subtotal, canUndo } = useCartStore()
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart()
  const { mutate: undoCart,   isPending: undoing  } = useUndoCart()

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-3 animate-pulse">
        <div className="h-8 bg-surface-raised rounded w-1/3" />
        {[1, 2, 3].map((i) => <div key={i} className="card p-4 h-20" />)}
        <div className="card p-4 h-28" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="text-6xl mb-2">🛒</div>
        <h2 className="font-display text-xl font-bold text-ink">Cosul tau este gol</h2>
        <p className="text-sm text-ink-muted">Adauga produse din catalog pentru a incepe.</p>
        <Link to="/catalog" className="btn-primary inline-flex mt-2">Continua cumparaturile</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Cosul meu</h1>
          <p className="text-xs font-mono text-ink-faint mt-0.5">{items.length} PRODUSE</p>
        </div>
        {canUndo && (
          <button onClick={() => undoCart()} disabled={undoing}
            className="btn-secondary text-sm flex items-center gap-1.5 disabled:opacity-50">
            ↩ Anuleaza ultima actiune
          </button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex items-center gap-4 hover:border-brand/20 transition-colors">
            <div className="bg-surface-raised rounded-xl w-14 h-14 flex items-center justify-center text-2xl shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 grid-lines opacity-30" />
              <span className="relative z-10">📦</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink truncate">{item.productName}</p>
              {item.decorators.length > 0 && (
                <p className="text-xs text-ink-faint font-mono">{item.decorators.join(' · ')}</p>
              )}
              <p className="text-xs text-ink-muted mt-0.5">Cantitate: {item.quantity}</p>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <p className="font-mono font-bold text-brand">
                {(item.finalPrice * item.quantity).toFixed(2)}
                <span className="text-xs text-brand/60 ml-0.5">MDL</span>
              </p>
              <button onClick={() => removeItem(item.id)} disabled={removing}
                className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 block">
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative z-10 space-y-3">
          <h2 className="text-xs font-mono text-ink-faint uppercase tracking-widest">Sumar comanda</h2>
          <div className="flex justify-between text-sm text-ink-muted">
            <span>Subtotal</span>
            <span className="font-mono">{subtotal().toFixed(2)} MDL</span>
          </div>
          <div className="flex justify-between text-sm text-ink-faint">
            <span>Livrare</span>
            <span className="font-mono">se calculeaza la checkout</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-edge pt-3">
            <span className="text-ink">Total estimat</span>
            <span className="font-mono text-brand">
              {subtotal().toFixed(2)}<span className="text-xs text-brand/60 ml-0.5">MDL</span>
            </span>
          </div>
          <Link to="/checkout" className="btn-primary w-full mt-2 text-center block py-3">
            Continua spre Checkout →
          </Link>
        </div>
      </div>

    </div>
  )
}
