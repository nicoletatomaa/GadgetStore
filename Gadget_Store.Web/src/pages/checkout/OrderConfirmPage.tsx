import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/api'

export default function OrderConfirmPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getById(orderId!),
    enabled: !!orderId,
  })

  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-6">
      <div className="text-7xl">✅</div>
      <h1 className="text-3xl font-bold text-gray-900">Comanda plasata!</h1>
      <p className="text-gray-500">
        Numarul comenzii tale este <span className="font-mono font-bold text-gray-800">{orderId?.slice(0, 8).toUpperCase()}</span>
      </p>
      {order && (
        <div className="card p-4 text-left text-sm space-y-1">
          <p><span className="text-gray-500">Total:</span> <strong>{order.totalAmount.toFixed(2)} RON</strong></p>
          <p><span className="text-gray-500">Status:</span> <span className="badge-blue">{order.status}</span></p>
          <p><span className="text-gray-500">Metoda plata:</span> {order.payment?.method}</p>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        <Link to="/account/orders" className="btn-secondary">Istoricul comenzilor</Link>
        <Link to="/catalog" className="btn-primary">Continua cumparaturile</Link>
      </div>
    </div>
  )
}
