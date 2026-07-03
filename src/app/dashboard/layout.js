'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiUser, FiBriefcase, FiFolder, FiCode, FiMessageSquare, FiSettings, FiHome, FiLogOut, FiMenu, FiX, FiLayout, FiShield } from 'react-icons/fi'
import { getCurrentUser } from '@/lib/autoRefresh'

const navItems = [
  { href: '/dashboard', icon: FiHome, label: 'Inicio' },
  { href: '/dashboard/profile', icon: FiUser, label: 'Perfil' },
  { href: '/dashboard/experience', icon: FiBriefcase, label: 'Experiencia' },
  { href: '/dashboard/projects', icon: FiFolder, label: 'Proyectos' },
  { href: '/dashboard/skills', icon: FiCode, label: 'Habilidades' },
  { href: '/dashboard/templates', icon: FiLayout, label: 'Templates' },
  { href: '/dashboard/chatbot', icon: FiMessageSquare, label: 'Chatbot IA' },
  { href: '/dashboard/settings', icon: FiSettings, label: 'Configuración' },
]

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        if (user) setUser(user)
        else router.push('/login')
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 p-4 shrink-0">
        <Link href="/dashboard" className="text-xl font-bold text-dark-900 dark:text-white mb-8 px-3">
          Portafolio<span className="text-primary-600">PRO</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === item.href
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          {user?.role === 'super_admin' && (
            <Link href="/super-admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
              <FiShield size={18} /> Super Admin
            </Link>
          )}
        </nav>
        <div className="border-t border-dark-200 dark:border-dark-800 pt-4">
          <div className="px-3 mb-3">
            <p className="text-xs text-dark-400">Sesión</p>
            <p className="text-sm font-medium text-dark-700 dark:text-dark-300 truncate">{user.email}</p>
            <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-medium">
              {user.plan === 'free' ? 'Gratis' : user.plan === 'pro' ? 'Pro' : 'Premium'}
            </span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg w-full transition">
            <FiLogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-lg font-bold text-dark-900 dark:text-white">
          Portafolio<span className="text-primary-600">PRO</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 p-4 pt-16 z-30">
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    pathname === item.href
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              {user?.role === 'super_admin' && (
                <Link href="/super-admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <FiShield size={18} /> Super Admin
                </Link>
              )}
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg w-full transition">
                <FiLogOut size={16} /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
