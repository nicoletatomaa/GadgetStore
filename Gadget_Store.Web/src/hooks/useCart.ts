import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@/services/api'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import type { AddToCartRequest } from '@/types'

export function useCartQuery() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setCart = useCartStore((s) => s.setCart)

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await cartService.get()
      setCart(cart.items)
      return cart
    },
    enabled: isAuthenticated,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const { addToast } = useUiStore()
  const { openCart } = useCartStore()

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addItem(data),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart)
      useCartStore.getState().setCart(cart.items)
      useCartStore.getState().setCanUndo(true)
      addToast('Produs adaugat in cos!', 'success')
      openCart()
    },
    onError: () => {
      addToast('Nu s-a putut adauga produsul.', 'error')
    },
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()
  const { addToast } = useUiStore()

  return useMutation({
    mutationFn: (cartItemId: number) => cartService.removeItem(cartItemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart)
      useCartStore.getState().setCart(cart.items)
      useCartStore.getState().setCanUndo(true)
    },
    onError: () => {
      addToast('Nu s-a putut elimina produsul.', 'error')
    },
  })
}

export function useUndoCart() {
  const queryClient = useQueryClient()
  const { addToast } = useUiStore()

  return useMutation({
    mutationFn: () => cartService.undo(),
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart)
      useCartStore.getState().setCart(cart.items)
      addToast('Ultima actiune anulata.', 'info')
    },
    onError: () => {
      addToast('Nu exista actiuni de anulat.', 'warning')
    },
  })
}
