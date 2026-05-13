import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/api'

export default function AdminProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productsService.getAll({ pageSize: 50 }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produse</h1>
        <button className="btn-primary">+ Produs nou</button>
      </div>
      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4,5].map((i) => <div key={i} className="card p-4 h-14 animate-pulse" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Produs</th>
                <th className="px-4 py-3 font-medium">Pret</th>
                <th className="px-4 py-3 font-medium">Stoc</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.items.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand">{p.price.toFixed(2)} RON</td>
                  <td className="px-4 py-3">
                    <span className={p.stock > 0 ? 'badge-green' : 'badge-red'}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.isActive ? 'badge-green' : 'badge-gray'}>
                      {p.isActive ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Editeaza</button>
                      <button className="text-xs text-red-500 hover:underline">Sterge</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
