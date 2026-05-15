import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister()
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(form)
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Barlow', sans-serif",
    background: '#FFFFFF',
    border: '1px solid #DDD8CE',
    borderRadius: '3px',
    color: '#111111',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#6B6455',
    marginBottom: '0.4rem',
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#F59E0B'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.12)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#DDD8CE'
    e.currentTarget.style.boxShadow = 'none'
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
        <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)',
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
              Înregistrare gratuită
            </p>
            <h2 className="text-white leading-none mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2.6rem', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Alătură-te<br/>
              <span className="text-brand">comunității</span>
            </h2>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Creează un cont în 30 de secunde și bucură-te de toate avantajele GadgetStore.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', text: 'Livrare gratuită peste 500 MDL' },
              { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', text: 'Priorități la ofertele speciale' },
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Garanție 2 ani pe toate produsele' },
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
              Cont nou
            </p>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#111111', lineHeight: 1 }}>
              Creează cont
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Prenume</label>
                <input
                  type="text" required value={form.firstName} onChange={set('firstName')}
                  placeholder="Ion"
                  className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Nume</label>
                <input
                  type="text" required value={form.lastName} onChange={set('lastName')}
                  placeholder="Popescu"
                  className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all"
                  style={inputStyle}
                  onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Adresă email</label>
              <input
                type="email" required value={form.email} onChange={set('email')}
                placeholder="exemplu@email.md"
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all"
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>

            <div>
              <label style={labelStyle}>Parolă</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required minLength={6}
                  value={form.password} onChange={set('password')}
                  placeholder="Minim 6 caractere"
                  className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-all pr-10"
                  style={inputStyle}
                  onFocus={handleFocus} onBlur={handleBlur}
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
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#A09880', marginTop: '0.35rem', letterSpacing: '0.04em' }}>
                Minim 6 caractere
              </p>
            </div>

            <button
              type="submit" disabled={isPending}
              className="w-full py-3 transition-all disabled:opacity-60"
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
              {isPending ? 'Se creează contul...' : 'Creează cont gratuit'}
            </button>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', color: '#A09880', textAlign: 'center', lineHeight: 1.5 }}>
              Prin înregistrare, ești de acord cu{' '}
              <span style={{ color: '#6B6455', textDecoration: 'underline', cursor: 'pointer' }}>
                termenii și condițiile
              </span>{' '}
              GadgetStore.md.
            </p>
          </form>

          {/* Separator + link logare */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid #DDD8CE' }}>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.875rem', color: '#6B6455', textAlign: 'center' }}>
              Ai deja cont?{' '}
              <Link to="/login" style={{ color: '#F59E0B', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D97706')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#F59E0B')}
              >
                Autentifică-te
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}
