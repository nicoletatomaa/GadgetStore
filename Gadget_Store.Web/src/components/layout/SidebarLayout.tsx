import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ToastContainer from '@/components/ui/ToastContainer'

export default function SidebarLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4EF' }}>
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
