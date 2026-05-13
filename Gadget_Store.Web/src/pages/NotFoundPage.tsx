import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="text-center py-24 space-y-4">
      <p className="text-8xl font-black text-gray-200">404</p>
      <h1 className="text-2xl font-bold text-gray-700">Pagina nu a fost gasita</h1>
      <p className="text-gray-400">Adresa cautata nu exista sau a fost mutata.</p>
      <Link to="/" className="btn-primary inline-flex mt-4">Inapoi acasa</Link>
    </div>
  )
}
