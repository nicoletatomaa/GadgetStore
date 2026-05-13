import { Link } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useCartQuery, useRemoveFromCart, useUndoCart } from '@/hooks/useCart'

export default function CartPage() {
  const { isLoading } = useCartQuery()
  const { items, subtotal, canUndo } = useCartStore()
  const { mutate: removeItem, isPending: removing } = useRemoveFromCart()
  const { mutate: undoCart, isPending: undoing } = useUndoCart()

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-3 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4 h-20 bg-gray-100" />
        ))}
        <div className="card p-4 h-28 bg-gray-100" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-6xl">🛒</p>
        <h2 className="text-xl font-semibold text-gray-700">Cosul tau este gol</h2>
        <Link to="/catalog" className="btn-primary inline-flex">Continua cumparaturile</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cosul meu</h1>
        {canUndo && (
          <button onClick={() => undoCart()} className="btn-secondary text-sm flex items-center gap-1">
            ↩ Anuleaza ultima actiune
          </button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex items-center gap-4">
            <div className="bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center text-2xl shrink-0">
              📦
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{item.productName}</p>
              {item.decorators.length > 0 && (
                <p className="text-xs text-gray-500">{item.decorators.join(', ')}</p>
              )}
              <p className="text-sm text-gray-500">Cantitate: {item.quantity}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-brand">{(item.finalPrice * item.quantity).toFixed(2)} RON</p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{subtotal().toFixed(2)} RON</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Livrare</span>
          <span>se calculeaza la checkout</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>Total estimat</span>
          <span className="text-brand">{subtotal().toFixed(2)} RON</span>
        </div>
        <Link to="/checkout" className="btn-primary w-full mt-4 text-center block">
          Continua spre Checkout
        </Link>
      </div>
    </div>
  )
}
