import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/api'
import { Link } from 'react-router-dom'

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => ordersService.getMyOrders(),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Comenzi</h1>
      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <div key={i} className="card p-4 h-14 animate-pulse" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0,8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString('ro-RO')}</td>
                  <td className="px-4 py-3 font-medium text-brand">{o.totalAmount.toFixed(2)} RON</td>
                  <td className="px-4 py-3"><span className="badge-blue">{o.status}</span></td>
                  <td className="px-4 py-3">
                    <Link to={`/account/orders/${o.id}`} className="text-xs text-blue-600 hover:underline">Detalii</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
