import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex">

      {/* ── Panou stânga — branding ──────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 relative overflow-hidden"
        style={{ background: '#0A0A0A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Grid decorativ */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '48px 48px',
        }} />
        {/* Glow */}
        <div className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)',
        }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand flex items-center justify-center shrink-0" style={{ borderRadius: '3px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14H11L9 22L21 10H13L13 2Z" fill="#0A0A0A"/>
            </svg>
          </div>
          <span className="text-white font-bold tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Gadget<span className="text-brand">Store</span>
            <span className="text-white/25" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', fontWeight: 400, textTransform: 'none' }}>.md</span>
          </span>
        </div>

        {/* Conținut central */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-brand mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Bun revenit
            </p>
            <h2 className="text-white leading-none mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.6rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Contul tău<br/>
              <span className="text-brand">GadgetStore</span>
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Acces la comenzi, wishlist, oferte exclusive și livrare rapidă în toată Moldova.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Istoric comenzi complet' },
              { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', text: 'Wishlist personalizat' },
              { icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z', text: 'Reduceri exclusive membri' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <svg className="w-4 h-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer panou */}
        <div className="relative z-10">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
            © 2025 GADGETSTORE.MD
          </p>
        </div>
      </div>

      {/* ── Panou dreapta — formular ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: '#F7F4EF' }}>
        <div className="w-full max-w-sm">

          {/* Header formular */}
          <div className="mb-8">
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A09880', marginBottom: '0.5rem' }}>
              Autentificare
            </p>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#111111', lineHeight: 1 }}>
              Intră în cont
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6455', marginBottom: '0.4rem' }}>
                Adresă email
              </label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="exemplu@email.md"
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  background: '#FFFFFF',
                  border: '1px solid #DDD8CE',
                  borderRadius: '3px',
                  color: '#111111',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.12)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#DDD8CE'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6455', marginBottom: '0.4rem' }}>
                Parolă
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all pr-10"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    background: '#FFFFFF',
                    border: '1px solid #DDD8CE',
                    borderRadius: '3px',
                    color: '#111111',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.12)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#DDD8CE'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#A09880' }}
                >
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isPending}
              className="w-full py-3 text-sm font-bold transition-all disabled:opacity-60"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: isPending ? '#D97706' : '#F59E0B',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: '3px',
                cursor: isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {isPending ? 'Se conectează...' : 'Autentifică-te'}
            </button>
          </form>

          {/* Separator + link înregistrare */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #DDD8CE' }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: '#6B6455', textAlign: 'center' }}>
              Nu ai cont?{' '}
              <Link to="/register" style={{ color: '#F59E0B', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D97706')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#F59E0B')}
              >
                Creează cont gratuit
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
