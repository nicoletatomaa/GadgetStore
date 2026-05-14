import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/api'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="animate-pulse card p-8 h-64" />
  if (!order) return <p className="text-center py-16 text-gray-500">Comanda nu a fost gasita.</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/account/orders" className="text-gray-400 hover:text-gray-600">в†ђ Comenzile mele</Link>
      </div>
      <h1 className="text-xl font-bold">Comanda #{order.id.slice(0,8).toUpperCase()}</h1>
      <div className="card p-4 space-y-2 text-sm">
        <p><span className="text-gray-500">Status:</span> <strong>{order.status}</strong></p>
        <p><span className="text-gray-500">Data:</span> {new Date(order.createdAt).toLocaleString('ro-RO')}</p>
        <p><span className="text-gray-500">Regiune:</span> {order.region}</p>
        <p><span className="text-gray-500">Adresa livrare:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
      </div>
      <div className="card p-4 space-y-3">
        <h2 className="font-semibold">Produse</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.productName} Г— {item.quantity}</span>
            <span className="font-medium">{(item.finalPrice * item.quantity).toFixed(2)} MDL</span>
          </div>
        ))}
        <div className="border-t pt-2 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{order.subtotal.toFixed(2)} MDL</span></div>
          <div className="flex justify-between text-gray-500"><span>Discount</span><span>-{order.discountAmount.toFixed(2)} MDL</span></div>
          <div className="flex justify-between text-gray-500"><span>Taxa</span><span>{order.taxAmount.toFixed(2)} MDL</span></div>
          <div className="flex justify-between text-gray-500"><span>Livrare</span><span>{order.shippingCost.toFixed(2)} MDL</span></div>
          <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-brand">{order.totalAmount.toFixed(2)} MDL</span></div>
        </div>
      </div>
    </div>
  )
}

