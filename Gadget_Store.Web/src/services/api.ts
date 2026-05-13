import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { AuthResponse } from '@/types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ─── Request interceptor — ataseaza access token ──────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response interceptor — refresh token la 401 ─────────────────────────

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  )
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Nu reincerca pe endpoint-urile de auth
    if (originalRequest.url?.includes('/api/auth/')) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      processQueue(error, null)
      isRefreshing = false
      clearAuthStorage()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post<AuthResponse>(
        `${BASE_URL}/api/auth/refresh`,
        { refreshToken }
      )
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

      processQueue(null, data.accessToken)
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearAuthStorage()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

function clearAuthStorage() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// ─── Auth endpoints ────────────────────────────────────────────────────────

import type { LoginRequest, RegisterRequest } from '@/types'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/api/auth/register', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/api/auth/logout', { refreshToken }),

  me: () =>
    api.get('/api/auth/me').then((r) => r.data),
}

// ─── Products endpoints ────────────────────────────────────────────────────

import type { Product, ProductFilters, PagedResult, ProductOffer } from '@/types'

export const productsService = {
  getAll: (filters?: ProductFilters) =>
    api.get<PagedResult<Product>>('/api/products', { params: filters }).then((r) => r.data),

  getById: (id: number) =>
    api.get<Product>(`/api/products/${id}`).then((r) => r.data),

  create: (data: Partial<Product>) =>
    api.post<Product>('/api/products', data).then((r) => r.data),

  update: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/api/products/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/products/${id}`),

  cloneFromTemplate: (templateKey: string, overrides: Partial<Product>) =>
    api.post<Product>('/api/products/clone', { templateKey, ...overrides }).then((r) => r.data),

  getTemplates: () =>
    api.get<string[]>('/api/products/templates').then((r) => r.data),

  updateStock: (id: number, stock: number) =>
    api.patch(`/api/products/${id}/stock`, { stock }),

  updatePrice: (id: number, price: number) =>
    api.patch(`/api/products/${id}/price`, { price }),

  calculateOffer: (productId: number, decorators: string[]) =>
    api.post<ProductOffer>('/api/products/offers', { productId, decorators }).then((r) => r.data),
}

// ─── Catalog endpoints ─────────────────────────────────────────────────────

import type { Category } from '@/types'

export const catalogService = {
  getTree: () =>
    api.get<Category[]>('/api/catalog').then((r) => r.data),

  getProductsByCategory: (categoryId: number, filters?: ProductFilters) =>
    api.get<PagedResult<Product>>(`/api/catalog/${categoryId}/products`, { params: filters })
       .then((r) => r.data),
}

// ─── Cart endpoints ────────────────────────────────────────────────────────

import type { Cart, AddToCartRequest, UpdateCartRequest } from '@/types'

export const cartService = {
  get: () =>
    api.get<Cart>('/api/cart').then((r) => r.data),

  addItem: (data: AddToCartRequest) =>
    api.post<Cart>('/api/cart/items', data).then((r) => r.data),

  removeItem: (cartItemId: number) =>
    api.delete<Cart>(`/api/cart/items/${cartItemId}`).then((r) => r.data),

  updateQuantity: (data: UpdateCartRequest) =>
    api.put<Cart>('/api/cart/update', data).then((r) => r.data),

  undo: () =>
    api.post<Cart>('/api/cart/undo').then((r) => r.data),

  clear: () =>
    api.delete('/api/cart'),
}

// ─── Checkout endpoints ────────────────────────────────────────────────────

import type { CheckoutRequest, CheckoutSummary, CheckoutResult } from '@/types'

export const checkoutService = {
  validate: (cartItems: AddToCartRequest[]) =>
    api.post('/api/checkout/validate', { items: cartItems }).then((r) => r.data),

  getSummary: (data: CheckoutRequest) =>
    api.post<CheckoutSummary>('/api/checkout/summary', data).then((r) => r.data),

  process: (data: CheckoutRequest) =>
    api.post<CheckoutResult>('/api/checkout/process', data).then((r) => r.data),
}

// ─── Orders endpoints ──────────────────────────────────────────────────────

import type { Order, OrderStatus } from '@/types'

export const ordersService = {
  getMyOrders: () =>
    api.get<Order[]>('/api/orders').then((r) => r.data),

  getById: (id: string) =>
    api.get<Order>(`/api/orders/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch(`/api/orders/${id}/status`, { status }),
}

// ─── Payments endpoints ────────────────────────────────────────────────────

import type { Payment, PaymentMethod } from '@/types'

export const paymentsService = {
  process: (orderId: string, method: PaymentMethod, token?: string) =>
    api.post<Payment>('/api/payments/process', { orderId, method, token }).then((r) => r.data),

  getByOrder: (orderId: string) =>
    api.get<Payment>(`/api/payments/${orderId}`).then((r) => r.data),
}

// ─── Regional endpoints ────────────────────────────────────────────────────

import type { Region, RegionalCalculation } from '@/types'

export const regionalService = {
  getTaxRate: (region: Region) =>
    api.get<{ taxRate: number }>(`/api/regional/${region}/tax-rate`).then((r) => r.data),

  getShippingOptions: (region: Region) =>
    api.get(`/api/regional/${region}/shipping-options`).then((r) => r.data),

  calculate: (region: Region, subtotal: number) =>
    api.post<RegionalCalculation>(`/api/regional/${region}/calculate`, { subtotal }).then((r) => r.data),
}

// ─── Reviews endpoints ─────────────────────────────────────────────────────

import type { Review, CreateReviewRequest } from '@/types'

export const reviewsService = {
  getByProduct: (productId: number) =>
    api.get<Review[]>(`/api/reviews/products/${productId}`).then((r) => r.data),

  create: (productId: number, data: CreateReviewRequest) =>
    api.post<Review>(`/api/reviews/products/${productId}`, data).then((r) => r.data),

  delete: (reviewId: number) =>
    api.delete(`/api/reviews/${reviewId}`),
}

// ─── Wishlist endpoints ────────────────────────────────────────────────────

import type { WishlistItem } from '@/types'

export const wishlistService = {
  get: () =>
    api.get<WishlistItem[]>('/api/wishlist').then((r) => r.data),

  add: (productId: number) =>
    api.post('/api/wishlist', { productId }),

  remove: (productId: number) =>
    api.delete(`/api/wishlist/${productId}`),

  moveToCart: (productId: number) =>
    api.post(`/api/wishlist/${productId}/move-to-cart`),
}

// ─── Admin endpoints ───────────────────────────────────────────────────────

import type { DashboardStats, SalesReport } from '@/types'

export const adminService = {
  getDashboard: () =>
    api.get<DashboardStats>('/api/admin/dashboard').then((r) => r.data),

  getSalesReport: (from?: string, to?: string) =>
    api.get<SalesReport>('/api/admin/reports/sales', { params: { from, to } }).then((r) => r.data),
}

// ─── Alerts endpoints ──────────────────────────────────────────────────────

import type { AlertSubscribeRequest } from '@/types'

export const alertsService = {
  subscribe: (data: AlertSubscribeRequest) =>
    api.post('/api/alerts/subscribe', data),

  unsubscribe: (productId: number) =>
    api.delete('/api/alerts/unsubscribe', { data: { productId } }),
}
