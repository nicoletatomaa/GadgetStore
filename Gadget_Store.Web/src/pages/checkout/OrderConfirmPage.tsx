import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/api'

export default function OrderConfirmPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getById(orderId!),
    enabled: !!orderId,
  })

  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-6">

      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-950 border border-emerald-800/50 shadow-[0_0_32px_rgba(16,185,129,0.2)]">
        <span className="text-4xl">✅</span>
      </div>

      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Comanda plasata!</h1>
        <p className="text-ink-muted mt-2">
          Numarul comenzii:{' '}
          <span className="font-mono font-bold text-brand">{orderId?.slice(0, 8).toUpperCase()}</span>
        </p>
      </div>

      {order && (
        <div className="card p-5 text-left space-y-2 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-20" />
          <div className="relative z-10 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Total</span>
              <span className="font-mono font-bold text-brand">
                {order.totalAmount.toFixed(2)}<span className="text-xs text-brand/60 ml-0.5">MDL</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Status</span>
              <span className="font-mono text-amber-400">{order.status}</span>
            </div>
            {order.payment?.method && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Metoda plata</span>
                <span className="font-mono text-ink">{order.payment.method}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link to="/account/orders" className="btn-secondary">📋 Comenzile mele</Link>
        <Link to="/catalog" className="btn-primary">Continua cumparaturile →</Link>
      </div>

    </div>
  )
}
