import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'
import { useUiStore } from '@/store/uiStore'
import type { OrderStatus } from '@/types'

interface AdminOrderRow {
  id: string
  status: OrderStatus
  region: string
  subtotal: number
  discountAmount: number
  taxAmount: number
  shippingCost: number
  totalAmount: number
  createdAt: string
  itemsCount: number
}

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const statusBadge: Record<OrderStatus, string> = {
  Pending:    'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-indigo-100 text-indigo-700',
  Delivered:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const queryClient  = useQueryClient()
  const { addToast } = useUiStore()

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get<{ data: AdminOrderRow[]; total: number }>('/api/admin/reports/sales', {
      params: { pageSize: 50 },
    }).then((r) => r.data),
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      addToast('Status actualizat!', 'success')
    },
    onError: () => addToast('Eroare la actualizarea statusului.', 'error'),
  })

  const orders = reportData?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comenzi</h1>
        <span className="text-sm text-gray-400">{reportData?.total ?? 0} comenzi total</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="card p-4 h-14 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">рџ"‹</p>
          <p>Nu exista comenzi inca.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">ID Comanda</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Produse</th>
                <th className="px-4 py-3 font-medium">Regiune</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-medium text-gray-700">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(o.createdAt).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.itemsCount} produse</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{o.region}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-brand">{o.totalAmount.toFixed(2)} MDL</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[o.status] ?? ''}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus({ id: o.id, status: e.target.value })}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer hover:border-brand"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Link
                        to={`/account/orders/${o.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Detalii
                      </Link>
                    </div>
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

