import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { authService } from '@/services/api'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="url(#lg1)"/>
        <path d="M21 5L10 19.5H18.5L16 31L27 16.5H18.5L21 5Z" fill="white" fillOpacity="0.95"/>
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6"/>
            <stop offset="100%" stopColor="#06B6D4"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-lg font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
        Gadget<span className="text-violet-300">Store</span>
        <span className="text-accent text-xs font-semibold ml-0.5">.md</span>
      </span>
    </Link>
  )
}

export default function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const { itemCount } = useCartStore()
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
    <header className="bg-slate-900 sticky top-0 z-40 border-b border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-16 gap-4">
          <Logo />

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Cauta produse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand/60 transition-colors"
              />
            </div>
          </form>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-300">
            <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            {isAuthenticated && user?.role === 'Admin' && (
              <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
            )}
          </nav>

          {/* Auth + Cart */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account/profile"
                  className="hidden md:flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-sm text-gray-400 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10 hidden md:block">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-1.5 text-xs">
                  Inregistrare
                </Link>
              </>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/account/wishlist" className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              aria-label="Cos de cumparaturi"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

