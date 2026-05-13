import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { authService } from '@/services/api'

export default function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const { itemCount, toggleCart } = useCartStore()
  const { searchQuery, setSearchQuery } = useUiStore()

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken') ?? ''
    try { await authService.logout(refreshToken) } catch { /* ignoram erori la logout */ }
    clearAuth()
    navigate('/login')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`)
  }

  const count = itemCount()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-brand shrink-0">
            ⚡ Gadget Store
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <input
              type="search"
              placeholder="Cauta produse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input text-sm"
            />
          </form>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link to="/catalog" className="hover:text-brand transition-colors">Catalog</Link>
            {isAuthenticated && user?.role === 'Admin' && (
              <Link to="/admin" className="hover:text-brand transition-colors">Admin</Link>
            )}
          </nav>

          {/* Auth + Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                <Link to="/account/profile" className="text-sm text-gray-600 hover:text-brand hidden md:block">
                  {user?.firstName}
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 hidden md:block">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-3 py-1.5">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-3 py-1.5">Inregistrare</Link>
              </>
            )}

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cos de cumparaturi"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
