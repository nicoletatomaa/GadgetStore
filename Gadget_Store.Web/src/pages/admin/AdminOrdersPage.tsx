import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'
import { useUiStore } from '@/store/uiStore'
import type { OrderStatus } from '@/types'

interface AdminOrderRow {
  id: string; status: OrderStatus; region: string
  subtotal: number; discountAmount: number; taxAmount: number
  shippingCost: number; totalAmount: number; createdAt: string; itemsCount: number
}

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const statusBadge: Record<OrderStatus, string> = {
  Pending:    'bg-amber-950 text-amber-400 border border-amber-800/50',
  Processing: 'bg-blue-950 text-blue-400 border border-blue-800/50',
  Shipped:    'bg-indigo-950 text-indigo-400 border border-indigo-800/50',
  Delivered:  'bg-emerald-950 text-emerald-400 border border-emerald-800/50',
  Cancelled:  'bg-red-950 text-red-400 border border-red-800/50',
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
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Comenzi</h1>
          <p className="text-xs font-mono text-ink-faint mt-0.5">{reportData?.total ?? 0} COMENZI TOTAL</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="card h-14 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl opacity-30">📋</div>
          <p className="font-display text-xl font-bold text-ink">Nu exista comenzi inca</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-edge bg-surface-raised">
              <tr>
                {['ID Comanda', 'Data', 'Produse', 'Regiune', 'Total', 'Status', 'Actiuni'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono text-ink-faint uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-ink">#{o.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-faint text-xs font-mono">
                    {new Date(o.createdAt).toLocaleDateString('ro-MD')}
                  </td>
                  <td className="px-4 py-3 text-ink-muted font-mono text-xs">{o.itemsCount} buc.</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-surface-raised border border-edge px-2 py-0.5 rounded text-ink-muted">
                      {o.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-brand">{o.totalAmount.toFixed(2)} MDL</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${statusBadge[o.status] ?? ''}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select value={o.status}
                        onChange={(e) => updateStatus({ id: o.id, status: e.target.value })}
                        className="text-xs bg-surface border border-edge rounded px-2 py-1 text-ink-muted cursor-pointer hover:border-brand transition-colors font-mono">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Link to={`/account/orders/${o.id}`}
                        className="text-xs font-mono text-accent hover:text-accent-dark transition-colors">
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
