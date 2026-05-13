import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Gadget Store</h3>
            <p className="text-xs text-gray-500">Platforma ta de incredere pentru gadgeturi electronice de calitate.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Navigare</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/" className="hover:text-brand">Acasa</Link></li>
              <li><Link to="/catalog" className="hover:text-brand">Catalog</Link></li>
              <li><Link to="/account/orders" className="hover:text-brand">Comenzile mele</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Cont</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link to="/login" className="hover:text-brand">Login</Link></li>
              <li><Link to="/register" className="hover:text-brand">Inregistrare</Link></li>
              <li><Link to="/account/wishlist" className="hover:text-brand">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>support@gadgetstore.ro</li>
              <li>+40 721 000 000</li>
              <li>Bucuresti, Romania</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-8 pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Gadget Store. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  )
}
