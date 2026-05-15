import { Link } from 'react-router-dom'

const sectionHeadStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
  fontWeight: 800,
  fontSize: '0.65rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.18)',
  marginBottom: '1rem',
}

const linkStyle: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.38)',
  textDecoration: 'none',
}

export default function Footer() {
  return (
    <footer
      className="border-t mt-16"
      style={{ background: '#0A0A0A', borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 bg-brand flex items-center justify-center shrink-0"
                style={{ borderRadius: '3px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H11L9 22L21 10H13L13 2Z" fill="#0A0A0A"/>
                </svg>
              </div>
              <span
                className="text-white"
                style={{
                  fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                }}
              >
                Gadget<span className="text-brand">Store</span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.6rem',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.18)',
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  .md
                </span>
              </span>
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.7 }}>
              Platforma ta de incredere pentru gadgeturi electronice de calitate. Livrare rapida in toata Moldova.
            </p>
          </div>

          {/* Navigare */}
          <div>
            <div style={sectionHeadStyle}>Navigare</div>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Acasa' },
                { to: '/catalog', label: 'Catalog' },
                { to: '/account/orders', label: 'Comenzile mele' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#BDFF00')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cont */}
          <div>
            <div style={sectionHeadStyle}>Cont</div>
            <ul className="space-y-2.5">
              {[
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Inregistrare' },
                { to: '/account/wishlist', label: 'Wishlist' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#BDFF00')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div style={sectionHeadStyle}>Contact</div>
            <ul className="space-y-2.5" style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)' }}>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(189,255,0,0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@gadgetstore.md
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(189,255,0,0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +373 79 000 000
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(189,255,0,0.5)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Chisinau, Moldova
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} GadgetStore.md — Toate drepturile rezervate.
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "'Barlow Condensed', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
            }}
          >
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            Livram in toata Moldova
          </span>
        </div>
      </div>
    </footer>
  )
}
