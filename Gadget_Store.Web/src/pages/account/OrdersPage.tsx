import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ordersService } from '@/services/api'

const statusColor: Record<string, string> = {
  Pending:    'badge-yellow',
  Processing: 'badge-blue',
  Shipped:    'badge-blue',
  Delivered:  'badge-green',
  Cancelled:  'badge-red',
}

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersService.getMyOrders(),
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Comenzile mele</h1>
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="card p-4 h-20 animate-pulse bg-gray-100" />)}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/account/orders/${order.id}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="font-mono text-sm font-medium">#{order.id.slice(0,8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('ro-RO')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand">{order.totalAmount.toFixed(2)} MDL</p>
                <span className={statusColor[order.status] ?? 'badge-gray'}>{order.status}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">📭</p>
          <p>Nu ai plasate comenzi inca.</p>
          <Link to="/catalog" className="btn-primary inline-flex mt-4">Incepe cumparaturile</Link>
        </div>
      )}
    </div>
  )
}
