import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ordersService } from '@/services/api'

const statusBadge: Record<string, string> = {
  Pending:    'bg-amber-950 text-amber-400 border border-amber-800/50',
  Processing: 'bg-blue-950 text-blue-400 border border-blue-800/50',
  Shipped:    'bg-indigo-950 text-indigo-400 border border-indigo-800/50',
  Delivered:  'bg-emerald-950 text-emerald-400 border border-emerald-800/50',
  Cancelled:  'bg-red-950 text-red-400 border border-red-800/50',
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersService.getMyOrders(),
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Comenzile mele</h1>
        <p className="text-xs font-mono text-ink-faint mt-0.5">
          {orders ? `${orders.length} COMENZI` : 'SE INCARCA...'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="card p-4 h-20 animate-pulse" />)}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/account/orders/${order.id}`}
              className="card p-4 flex items-center justify-between hover:border-brand/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all group">
              <div>
                <p className="font-mono text-sm font-bold text-ink group-hover:text-brand transition-colors">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-ink-faint font-mono mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('ro-MD')}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-mono font-bold text-brand">
                  {order.totalAmount.toFixed(2)}<span className="text-xs text-brand/60 ml-0.5">MDL</span>
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${statusBadge[order.status] ?? ''}`}>
                  {order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="text-5xl mb-2 opacity-30">📭</div>
          <h2 className="font-display text-xl font-bold text-ink">Nicio comanda inca</h2>
          <p className="text-sm text-ink-muted">Comenzile tale vor aparea aici dupa prima achizitie.</p>
          <Link to="/catalog" className="btn-primary inline-flex mt-2">Incepe cumparaturile</Link>
        </div>
      )}
    </div>
  )
}
