import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface UiState {
  toasts: Toast[]
  isGlobalLoading: boolean
  searchQuery: string
  mobileMenuOpen: boolean

  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  setGlobalLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
}

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  isGlobalLoading: false,
  searchQuery: '',
  mobileMenuOpen: false,

  addToast: (message, type = 'info') =>
    set((state) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const toast: Toast = { id, message, type }
      // auto-remove dupa 4 secunde
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
      }, 4000)
      return { toasts: [...state.toasts, toast] }
    }),

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clearToasts: () => set({ toasts: [] }),

  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}))
