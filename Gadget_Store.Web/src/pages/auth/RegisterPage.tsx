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
    <div className="max-w-md mx-auto mt-10">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Creeaza cont</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
              <input type="text" required value={form.firstName} onChange={set('firstName')} className="input" placeholder="Ion" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
              <input type="text" required value={form.lastName} onChange={set('lastName')} className="input" placeholder="Popescu" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={set('email')} className="input" placeholder="email@exemplu.ro" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parola</label>
            <input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input" placeholder="Min. 6 caractere" />
          </div>
          <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
            {isPending ? 'Se creeaza contul...' : 'Creeaza cont'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Ai deja cont?{' '}
          <Link to="/login" className="text-brand hover:underline font-medium">Autentifica-te</Link>
        </p>
      </div>
    </div>
  )
}

