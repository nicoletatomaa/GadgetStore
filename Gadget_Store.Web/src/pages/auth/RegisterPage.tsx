import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister()
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(form)
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Creeaza cont</h1>
          <p className="text-sm text-ink-muted mt-1">Inregistrare gratuita la GadgetStore.md</p>
        </div>

        <div className="card p-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-40" />
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">Prenume</label>
                  <input type="text" required value={form.firstName} onChange={set('firstName')}
                    className="input" placeholder="Ion" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">Nume</label>
                  <input type="text" required value={form.lastName} onChange={set('lastName')}
                    className="input" placeholder="Popescu" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" required value={form.email} onChange={set('email')}
                  className="input" placeholder="email@exemplu.md" />
              </div>
              <div>
                <label className="block text-xs font-mono text-ink-muted uppercase tracking-wider mb-1.5">Parola</label>
                <input type="password" required minLength={6} value={form.password} onChange={set('password')}
                  className="input" placeholder="Min. 6 caractere" />
              </div>
              <button type="submit" disabled={isPending} className="btn-primary w-full py-3 text-sm">
                {isPending ? 'Se creeaza contul...' : 'Creeaza cont →'}
              </button>
            </form>
            <div className="mt-6 pt-5 border-t border-edge text-center">
              <p className="text-sm text-ink-muted">
                Ai deja cont?{' '}
                <Link to="/login" className="text-brand hover:text-brand-light font-medium transition-colors">
                  Autentifica-te
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
