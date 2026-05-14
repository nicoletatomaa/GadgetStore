import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/5 mt-16">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="10" fill="url(#fLg)"/>
                <path d="M21 5L10 19.5H18.5L16 31L27 16.5H18.5L21 5Z" fill="white" fillOpacity="0.95"/>
                <defs>
                  <linearGradient id="fLg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B5CF6"/>
                    <stop offset="100%" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-base font-bold text-white">
                Gadget<span className="text-violet-400">Store</span><span className="text-cyan-400 text-xs">.md</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Platforma ta de incredere pentru gadgeturi electronice de calitate. Livrare rapida in toata Moldova.
            </p>
          </div>

          {/* Navigare */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">Navigare</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Acasa</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Comenzile mele</Link></li>
            </ul>
          </div>

          {/* Cont */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">Cont</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Inregistrare</Link></li>
              <li><Link to="/account/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@gadgetstore.md
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +373 79 000 000
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-brand-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Chisinau, Moldova
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} GadgetStore.md — Toate drepturile rezervate.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Livram in toata Moldova
          </span>
        </div>
      </div>
    </footer>
  )
}

