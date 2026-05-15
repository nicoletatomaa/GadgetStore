import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { authService } from '@/services/api'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      {/* Lime square with lightning bolt */}
      <div
        className="w-9 h-9 bg-brand flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-light"
        style={{ borderRadius: '3px' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H11L9 22L21 10H13L13 2Z" fill="#0A0A0A"/>
        </svg>
      </div>
      <span
        className="text-white leading-none"
        style={{
          fontFamily: "'Barlow Condensed', system-ui, sans-serif",
          fontWeight: 900,
          fontSize: '1.15rem',
          letterSpacing: '-0.01em',
          textTransform: 'uppercase',
        }}
      >
        Gadget<span className="text-brand">Store</span>
        <span
          className="text-white/25"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}
        >
          .md
        </span>
      </span>
    </Link>
  )
}

const navLabelStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
  fontWeight: 800,
  fontSize: '0.75rem',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
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
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: '#0A0A0A', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-16 gap-4">
          <Logo />

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Cauta produse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm text-white placeholder-white/25
                           focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '3px',
                  fontFamily: "'Barlow', sans-serif",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#BDFF00'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(189,255,0,0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </form>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/catalog"
              className="text-white/45 hover:text-brand transition-colors"
              style={navLabelStyle}
            >
              Catalog
            </Link>
            {isAuthenticated && user?.role === 'Admin' && (
              <Link
                to="/admin"
                className="text-brand/60 hover:text-brand transition-colors"
                style={navLabelStyle}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Auth + Cart */}
          <div className="flex items-center gap-1 shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account/profile"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 transition-colors"
                  style={{ ...navLabelStyle, color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block px-2 py-1.5 transition-colors"
                  style={{ ...navLabelStyle, color: 'rgba(255,255,255,0.25)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-3 py-1.5 transition-colors"
                  style={{ ...navLabelStyle, color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-4 py-1.5">
                  Inregistrare
                </Link>
              </>
            )}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/account/wishlist"
                className="relative p-2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#BDFF00')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              aria-label="Cos de cumparaturi"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-brand text-[#0A0A0A] flex items-center justify-center"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '0.6rem',
                    letterSpacing: '0',
                    width: '18px',
                    height: '18px',
                    borderRadius: '2px',
                  }}
                >
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
