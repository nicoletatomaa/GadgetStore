import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { wishlistService } from '@/services/api'
import { useUiStore } from '@/store/uiStore'

export default function WishlistPage() {
  const queryClient = useQueryClient()
  const { addToast } = useUiStore()

  const { data: items, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.get(),
  })

  const { mutate: remove } = useMutation({
    mutationFn: (productId: number) => wishlistService.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const { mutate: moveToCart } = useMutation({
    mutationFn: (productId: number) => wishlistService.moveToCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      addToast('Produs mutat in cos!', 'success')
    },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="card p-4 h-32 animate-pulse" />)}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 space-y-3">
              <Link to={`/products/${item.productId}`} className="block">
                <p className="font-medium text-gray-800 hover:text-brand">{item.productName}</p>
                <p className="text-brand font-bold">{item.productPrice.toFixed(2)} RON</p>
                <p className="text-xs text-gray-400">
                  {item.productStock > 0 ? <span className="text-green-600">In stoc</span> : <span className="text-red-500">Stoc epuizat</span>}
                </p>
              </Link>
              <div className="flex gap-2">
                <button onClick={() => moveToCart(item.productId)} disabled={item.productStock === 0}
                  className="btn-primary flex-1 text-sm py-1.5">
                  Muta in cos
                </button>
                <button onClick={() => remove(item.productId)} className="btn-secondary text-sm py-1.5 px-3">✕</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">❤️</p>
          <p>Wishlist-ul tau este gol.</p>
          <Link to="/catalog" className="btn-primary inline-flex mt-4">Descopera produse</Link>
        </div>
      )}
    </div>
  )
}
