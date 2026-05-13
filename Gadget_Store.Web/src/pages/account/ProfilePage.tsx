import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profilul meu</h1>
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge-blue text-xs">{user?.role}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Comenzile mele', href: '/account/orders', icon: '📦' },
          { label: 'Wishlist', href: '/account/wishlist', icon: '❤️' },
          { label: 'Setari cont', href: '/account/profile', icon: '⚙️' },
        ].map((item) => (
          <Link key={item.label} to={item.href} className="card p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-gray-700">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
