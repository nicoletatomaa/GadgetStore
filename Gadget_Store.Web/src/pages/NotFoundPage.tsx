import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
        <p className="font-display text-8xl font-extrabold text-brand/20 relative z-10 select-none">404</p>
        <div className="text-5xl relative z-10 opacity-40">🔍</div>
        <div className="relative z-10 space-y-2">
          <h1 className="font-display text-2xl font-bold text-ink">Pagina nu a fost gasita</h1>
          <p className="text-sm text-ink-muted">Adresa cautata nu exista sau a fost mutata.</p>
        </div>
        <div className="relative z-10">
          <Link to="/" className="btn-primary inline-flex">← Inapoi acasa</Link>
        </div>
      </div>
    </div>
  )
}
