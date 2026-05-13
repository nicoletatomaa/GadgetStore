import { create } from 'zustand'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  canUndo: boolean

  setCart: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (cartItemId: number) => void
  updateItem: (cartItemId: number, quantity: number) => void
  clearCart: () => void
  setCanUndo: (canUndo: boolean) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  canUndo: false,

  setCart: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== cartItemId),
    })),

  updateItem: (cartItemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === cartItemId ? { ...i, quantity } : i
      ),
    })),

  clearCart: () => set({ items: [], canUndo: false }),

  setCanUndo: (canUndo) => set({ canUndo }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0),
}))
