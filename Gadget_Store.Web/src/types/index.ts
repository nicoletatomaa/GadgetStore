// ─── Auth ──────────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresAt?: string
  expiresIn?: number
  user: UserInfo
}

export interface UserInfo {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'Customer' | 'Admin'
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginRequest {
  email: string
  password: string
}

// ─── Product ───────────────────────────────────────────────────────────────

export interface Product {
  id: string        // Guid din backend
  name: string
  description: string
  price: number
  stock: number
  categoryId: number
  categoryName?: string
  brand: string
  type: 'Electronics' | 'Accessory'
  imageUrl?: string
  isTemplate: boolean
  templateName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  categoryId?: number
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  search?: string
  page?: number
  pageSize?: number
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProductOffer {
  productId: string    // Guid din backend
  productName: string
  basePrice: number
  finalPrice: number
  decorators: string[]
  description: string
}

// ─── Category ──────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
  description?: string
  imageUrl?: string
  parentCategoryId?: number
  children: Category[]
  sortOrder: number
  isActive: boolean
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number
  productId: string    // Guid din backend
  productName: string
  productImageUrl?: string
  unitPrice: number
  quantity: number
  decorators: string[]
  finalPrice: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
  canUndo?: boolean
}

export interface AddToCartRequest {
  productId: string    // Guid din backend
  quantity: number
  decorators?: string[]
}

export interface UpdateCartRequest {
  cartItemId: number
  quantity: number
}

// ─── Order ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  region: string
  subtotal: number
  discountAmount: number
  taxAmount: number
  shippingCost: number
  totalAmount: number
  shippingAddress: Address
  billingAddress: Address
  notes?: string
  items: OrderItem[]
  payment?: Payment
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  decorators: string[]
  finalPrice: number
}

export interface Address {
  street: string
  city: string
  country: string
  postalCode: string
  region?: string
}

// ─── Payment ───────────────────────────────────────────────────────────────

export type PaymentMethod = 'Card' | 'PayPal' | 'Crypto' | 'Stripe'
export type PaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded'

export interface Payment {
  id: number
  orderId: string
  method: PaymentMethod
  amount: number
  status: PaymentStatus
  transactionId?: string
  processedAt?: string
  failureReason?: string
}

// ─── Checkout ──────────────────────────────────────────────────────────────

export interface CheckoutRequest {
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  region: string
  couponCode?: string
  notes?: string
}

export interface CheckoutSummary {
  subtotal: number
  discountAmount: number
  discountCode?: string
  taxAmount: number
  taxRate: number
  shippingCost: number
  shippingMethod: string
  totalAmount: number
  region: string
}

export interface CheckoutResult {
  success: boolean
  orderId?: string
  message: string
  orderTotal?: number
}

// ─── Review ────────────────────────────────────────────────────────────────

export interface Review {
  id: number
  productId: number
  userId: string
  userFirstName: string
  userLastName: string
  rating: number
  comment: string
  isVerified: boolean
  createdAt: string
}

export interface CreateReviewRequest {
  rating: number
  comment: string
}

// ─── Wishlist ──────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number
  productId: string    // Guid din backend
  productName: string
  productPrice: number
  productImageUrl?: string
  productStock: number
  addedAt: string
}

// ─── Regional ──────────────────────────────────────────────────────────────

export type Region = 'EU' | 'US' | 'Asia'

export interface RegionalCalculation {
  region: Region
  subtotal: number
  taxAmount: number
  taxRate: number
  shippingCost: number
  shippingMethod: string
  total: number
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  salesToday: number
  newOrders: number
  criticalStock: number
  newUsers: number
  totalRevenue: number
  ordersThisMonth: number
}

export interface SalesReport {
  period: string
  totalRevenue: number
  orderCount: number
  avgOrderValue: number
  topProducts: { productId: number; productName: string; sold: number; revenue: number }[]
}

// ─── Coupon ────────────────────────────────────────────────────────────────

export interface Coupon {
  id: number
  code: string
  type: 'Fixed' | 'Percentage'
  value: number
  minOrderAmount: number
  expiresAt?: string
  maxUses?: number
  usedCount: number
  isActive: boolean
}

// ─── Alert ─────────────────────────────────────────────────────────────────

export interface AlertSubscribeRequest {
  productId: string    // Guid din backend
  thresholdQty?: number
  alertOnPriceDrop?: boolean
}

// ─── API error ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode: number
  details?: string
}
