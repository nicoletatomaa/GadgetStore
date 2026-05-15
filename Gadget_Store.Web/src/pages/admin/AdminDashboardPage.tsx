import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/api'
import { Link } from 'react-router-dom'

const labelStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
  fontWeight: 700,
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 60_000,
  })

  const cards = stats ? [
    { label: 'Vanzari azi',    value: `${stats.salesToday.toFixed(2)} MDL`, color: 'text-emerald-600' },
    { label: 'Comenzi noi',   value: stats.newOrders,    color: 'text-blue-600' },
    { label: 'Stoc critic',   value: stats.criticalStock, color: 'text-amber-600' },
    { label: 'Utilizatori noi', value: stats.newUsers,   color: 'text-brand' },
  ] : []

  const navItems = [
    { label: 'Produse',    href: '/admin/products',   icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/></svg>
    )},
    { label: 'Comenzi',   href: '/admin/orders',      icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
    )},
    { label: 'Categorii', href: '/admin/categories',  icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
    )},
    { label: 'Utilizatori', href: '/admin/users',     icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2rem', color: '#111111', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Dashboard Admin
          </h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#8A8578' }}>
            Gadget Store · Panel administrare
          </p>
        </div>
        <span className="badge-blue">Admin</span>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="card p-5">
              <p className={`text-2xl font-bold mb-1 ${c.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {c.value}
              </p>
              <p style={{ ...labelStyle, color: '#8A8578' }}>{c.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="card p-5 h-20 animate-pulse" />)}
        </div>
      )}

      {/* Nav cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="card-hover p-5 flex items-center gap-3 group"
          >
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0 transition-colors"
              style={{ background: '#F7F4EF', borderRadius: '3px', color: '#8A8578' }}
              onMouseEnter={(e) => {
                (e.currentTarget.parentElement as HTMLElement).style.borderColor = '#BDFF00'
              }}
            >
              {item.icon}
            </div>
            <span
              className="group-hover:text-brand transition-colors"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.02em' }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
