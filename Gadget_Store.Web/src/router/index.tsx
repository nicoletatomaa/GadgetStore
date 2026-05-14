import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import MainLayout from '@/components/layout/MainLayout'

// Pages вЂ" public
import HomePage from '@/pages/HomePage'
import CatalogPage from '@/pages/CatalogPage'
import ProductPage from '@/pages/ProductPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Pages вЂ" protected (require auth)
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/checkout/CheckoutPage'
import OrderConfirmPage from '@/pages/checkout/OrderConfirmPage'
import ProfilePage from '@/pages/account/ProfilePage'
import OrdersPage from '@/pages/account/OrdersPage'
import OrderDetailPage from '@/pages/account/OrderDetailPage'
import WishlistPage from '@/pages/account/WishlistPage'

// Pages вЂ" admin only
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'

// в"Ђв"Ђв"Ђ Guard components в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ

function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function RequireAdmin() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'Admin') return <Navigate to="/" replace />
  return <Outlet />
}

function GuestOnly() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}

// в"Ђв"Ђв"Ђ Router в"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђв"Ђ

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:categoryId', element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductPage /> },

      // Guest-only routes (redirecteaza autentificatii)
      {
        element: <GuestOnly />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },

      // Protected routes
      {
        element: <RequireAuth />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'checkout/confirm/:orderId', element: <OrderConfirmPage /> },
          { path: 'account/profile', element: <ProfilePage /> },
          { path: 'account/orders', element: <OrdersPage /> },
          { path: 'account/orders/:id', element: <OrderDetailPage /> },
          { path: 'account/wishlist', element: <WishlistPage /> },
        ],
      },

      // Admin routes
      {
        path: 'admin',
        element: <RequireAdmin />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

