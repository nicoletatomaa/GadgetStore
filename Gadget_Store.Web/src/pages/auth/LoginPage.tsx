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
    <div className="max-w-md mx-auto mt-10">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Autentificare</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="email@exemplu.ro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parola</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input"
              placeholder="вЂўвЂўвЂўвЂўвЂўвЂўвЂўвЂў"
            />
          </div>
          <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5">
            {isPending ? 'Se conecteaza...' : 'Autentificare'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Nu ai cont?{' '}
          <Link to="/register" className="text-brand hover:underline font-medium">Inregistreaza-te</Link>
        </p>
      </div>
    </div>
  )
}

