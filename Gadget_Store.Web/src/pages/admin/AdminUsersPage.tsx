import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useUiStore } from '@/store/uiStore'

interface AdminUser {
  id: string; email: string; role: 'Customer' | 'Admin'
  firstName?: string; lastName?: string; phone?: string
  isActive: boolean; createdAt: string
}

function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUser[]>('/api/admin/users').then((r) => r.data),
  })
}

export default function AdminUsersPage() {
  const queryClient  = useQueryClient()
  const { addToast } = useUiStore()
  const [search, setSearch] = useState('')

  const { data: users, isLoading } = useAdminUsers()

  const { mutate: changeRole } = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.patch(`/api/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      addToast('Rol actualizat!', 'success')
    },
    onError: () => addToast('Eroare la schimbarea rolului.', 'error'),
  })

  const filtered = users?.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.email.toLowerCase().includes(q) ||
      (u.firstName ?? '').toLowerCase().includes(q) ||
      (u.lastName  ?? '').toLowerCase().includes(q)
    )
  }) ?? []

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Utilizatori</h1>
          <p className="text-xs font-mono text-ink-faint mt-0.5">{filtered.length} CONTURI</p>
        </div>
        <input type="search" placeholder="Cauta dupa email sau nume..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input text-sm py-2 w-64" />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="card h-14 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="text-4xl opacity-30">👥</div>
          <p className="font-display text-xl font-bold text-ink">
            {search ? 'Niciun utilizator gasit' : 'Nu exista utilizatori'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-edge bg-surface-raised">
              <tr>
                {['Utilizator', 'Email', 'Rol', 'Status', 'Inregistrat', 'Actiuni'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono text-ink-faint uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-surface-raised transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-surface-base text-xs font-bold shrink-0">
                        {u.firstName?.[0]?.toUpperCase() ?? u.email[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-ink">
                        {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold
                      ${u.role === 'Admin'
                        ? 'bg-brand-900 text-brand border border-brand/20'
                        : 'bg-blue-950 text-blue-400 border border-blue-800/50'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                      {u.isActive ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-faint text-xs font-mono">
                    {new Date(u.createdAt).toLocaleDateString('ro-MD')}
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.role}
                      onChange={(e) => changeRole({ id: u.id, role: e.target.value })}
                      className="text-xs bg-surface border border-edge rounded px-2 py-1 text-ink-muted cursor-pointer hover:border-brand transition-colors font-mono">
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
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
