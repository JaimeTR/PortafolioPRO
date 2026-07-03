'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiUsers, FiBarChart2, FiGrid, FiDollarSign, FiSettings, FiLogOut, FiActivity } from 'react-icons/fi'

const navItems = [
  { href: '/super-admin', icon: FiBarChart2, label: 'Dashboard' },
  { href: '/super-admin/users', icon: FiUsers, label: 'Usuarios' },
  { href: '/super-admin/templates', icon: FiGrid, label: 'Templates' },
  { href: '/super-admin/plans', icon: FiDollarSign, label: 'Planes y Pagos' },
  { href: '/super-admin/settings', icon: FiSettings, label: 'Configuración' },
]

export default function SuperAdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.success || d.user.role !== 'super_admin') {
          router.push('/login')
          return
        }
        setUser(d.user)
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 p-4 shrink-0">
        <Link href="/super-admin" className="text-xl font-black mb-8 px-3" style={{ fontFamily: "'Braze','Poppins',sans-serif" }}>
          Portafolio<span className="text-primary-600">PRO</span>
          <span className="block text-red-500 text-xs font-normal">Super Admin</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === item.href ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}>
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-200 dark:border-dark-800 pt-4">
          <div className="px-3 mb-3">
            <p className="text-xs text-gray-400">Admin</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg w-full transition">
            <FiLogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-dark-900 border-b px-4 py-3 flex justify-between items-center">
        <Link href="/super-admin" className="text-lg font-bold">PortafolioPRO <span className="text-red-500 text-xs">Admin</span></Link>
        <button onClick={handleLogout} className="text-sm text-red-600">Salir</button>
      </div>

      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
