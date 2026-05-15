import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/api'

const statusBadge: Record<string, string> = {
  Pending:    'bg-amber-950 text-amber-400 border border-amber-800/50',
  Processing: 'bg-blue-950 text-blue-400 border border-blue-800/50',
  Shipped:    'bg-indigo-950 text-indigo-400 border border-indigo-800/50',
  Delivered:  'bg-emerald-950 text-emerald-400 border border-emerald-800/50',
  Cancelled:  'bg-red-950 text-red-400 border border-red-800/50',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="animate-pulse card p-8 h-64" />

  if (!order) return (
    <div className="text-center py-16 space-y-3">
      <p className="text-4xl opacity-30">📋</p>
      <p className="font-display text-xl font-bold text-ink">Comanda negasita</p>
      <Link to="/account/orders" className="btn-secondary inline-flex">Inapoi la comenzi</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <Link to="/account/orders" className="text-xs font-mono text-ink-faint hover:text-ink transition-colors flex items-center gap-1">
        ← Comenzile mele
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">
            Comanda #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs font-mono text-ink-faint mt-0.5">
            {new Date(order.createdAt).toLocaleString('ro-MD')}
          </p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded font-mono font-semibold ${statusBadge[order.status] ?? ''}`}>
          {order.status}
        </span>
      </div>

      <div className="card p-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative z-10 space-y-2 text-sm">
          <p className="text-xs font-mono text-ink-faint uppercase tracking-widest mb-3">Detalii livrare</p>
          <div className="flex justify-between">
            <span className="text-ink-muted">Regiune</span>
            <span className="font-mono text-ink">{order.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Adresa</span>
            <span className="font-mono text-ink text-right">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}
            </span>
          </div>
        </div>
      </div>

      <div className="card p-4 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="relative z-10 space-y-3">
          <p className="text-xs font-mono text-ink-faint uppercase tracking-widest">Produse</p>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink-muted">{item.productName} &times; {item.quantity}</span>
              <span className="font-mono font-semibold text-ink">
                {(item.finalPrice * item.quantity).toFixed(2)} MDL
              </span>
            </div>
          ))}
          <div className="border-t border-edge pt-3 space-y-1.5">
            <div className="flex justify-between text-sm text-ink-muted">
              <span>Subtotal</span><span className="font-mono">{order.subtotal.toFixed(2)} MDL</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-emerald-400">
                <span>Discount</span><span className="font-mono">-{order.discountAmount.toFixed(2)} MDL</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-ink-muted">
              <span>Taxa</span><span className="font-mono">{order.taxAmount.toFixed(2)} MDL</span>
            </div>
            <div className="flex justify-between text-sm text-ink-muted">
              <span>Livrare</span><span className="font-mono">{order.shippingCost.toFixed(2)} MDL</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-edge pt-2">
              <span className="text-ink">Total</span>
              <span className="font-mono text-brand">
                {order.totalAmount.toFixed(2)}<span className="text-sm text-brand/60 ml-0.5">MDL</span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
