import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Bun revenit!</h1>
          <p className="text-sm text-ink-muted mt-1">Autentifica-te in contul tau GadgetStore</p>
        </div>

        <div className="card p-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input" placeholder="email@exemplu.md" />
              </div>
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">Parola</label>
                <input type="password" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm">
                {isPending ? 'Se conecteaza...' : 'Autentificare →'}
              </button>
            </form>
            <div className="mt-6 pt-5 border-t border-edge text-center">
              <p className="text-sm text-ink-muted">
                Nu ai cont?{' '}
                <Link to="/register" className="text-brand hover:text-brand-light font-medium transition-colors">
                  Creeaza cont gratuit
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
