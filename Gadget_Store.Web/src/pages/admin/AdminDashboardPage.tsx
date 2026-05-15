import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api'
import { Link } from 'react-router-dom'

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 60_000,
  })

  const cards = stats ? [
    { label: 'Vanzari azi', value: `${stats.salesToday.toFixed(2)} MDL`, icon: '💰', color: 'text-green-600' },
    { label: 'Comenzi noi', value: stats.newOrders, icon: '📦', color: 'text-blue-600' },
    { label: 'Stoc critic', value: stats.criticalStock, icon: '⚠️', color: 'text-yellow-600' },
    { label: 'Utilizatori noi', value: stats.newUsers, icon: '👤', color: 'text-brand' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <span className="badge-blue">Admin</span>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="card p-4">
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="card p-4 h-24 animate-pulse" />)}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Gestionare produse', href: '/admin/products', icon: '📱' },
          { label: 'Gestionare comenzi', href: '/admin/orders', icon: '📋' },
          { label: 'Gestionare utilizatori', href: '/admin/users', icon: '👥' },
        ].map((item) => (
          <Link key={item.label} to={item.href} className="card p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">{item.icon}</span>
            <span className="font-medium text-gray-800">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
