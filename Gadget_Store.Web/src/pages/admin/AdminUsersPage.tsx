import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { useUiStore } from '@/store/uiStore'

interface AdminUser {
  id: string
  email: string
  role: 'Customer' | 'Admin'
  firstName?: string
  lastName?: string
  phone?: string
  isActive: boolean
  createdAt: string
}

function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUser[]>('/api/admin/users').then((r) => r.data),
  })
}

export default function AdminUsersPage() {
  const queryClient     = useQueryClient()
  const { addToast }    = useUiStore()
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
        <h1 className="text-2xl font-bold">Utilizatori</h1>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Cauta dupa email sau nume..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-sm py-2 w-64"
          />
          <span className="text-sm text-gray-400">
            {filtered.length} utilizatori
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-4 h-14 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">рџ'Ґ</p>
          <p>{search ? 'Nu s-au gasit utilizatori pentru aceasta cautare.' : 'Nu exista utilizatori.'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Utilizator</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Inregistrat</th>
                <th className="px-4 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.firstName?.[0]?.toUpperCase() ?? u.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">
                        {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : 'вЂ"'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? 'badge-green' : 'badge-red'}>
                      {u.isActive ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole({ id: u.id, role: e.target.value })}
                      className="text-xs border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer hover:border-brand"
                    >
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

