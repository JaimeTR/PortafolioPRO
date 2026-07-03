'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (res.ok && data.success) {
        setUser(data.user)
        if (data.user.role === 'super_admin') {
          router.push('/super-admin')
        } else if (data.user.profession_category === 'otro') {
          router.push('/onboarding')
        }
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

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

  const planLabel = { free: 'Gratis', pro: 'Pro', premium: 'Premium' }[user.plan] || 'Gratis'
  const profLabels = {
    medicina: 'Medicina', ing_sistemas: 'Ing. de Sistemas', derecho: 'Derecho',
    arquitectura: 'Arquitectura', marketing: 'Marketing', contabilidad: 'Contabilidad',
    economia: 'Economía', admin_empresas: 'Admin. Empresas', ing_civil: 'Ing. Civil',
    psicologia: 'Psicología', educacion: 'Educación', odontologia: 'Odontología',
    obstetricia: 'Obstetricia', ing_telecomunicaciones: 'Ing. Telecomunicaciones',
    ing_minera: 'Ing. Minera', ing_naval: 'Ing. Naval', ciberseguridad: 'Ciberseguridad',
    ing_mecanica: 'Ing. Mecánica', otro: 'Otro'
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* Top Bar */}
      <nav className="bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-dark-900 dark:text-white">
            Portafolio<span className="text-primary-600">PRO</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-500">
              {planLabel} · <a href={`/${user.username}`} target="_blank" className="text-primary-600 hover:underline">/{user.username}</a>
            </span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Cerrar sesión</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
            ¡Bienvenido, {user.username}!
          </h1>
          <p className="mt-2 text-dark-500">
            {profLabels[user.profession_category] || 'Profesional'} · Plan {planLabel}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Plantilla', value: user.template_id || 'default' },
            { label: 'Profesión', value: profLabels[user.profession_category] || user.profession_category },
            { label: 'Plan', value: planLabel },
            { label: 'Portafolio', value: <a href={`/${user.username}`} target="_blank" className="text-primary-600 hover:underline">Ver →</a> },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-5">
              <p className="text-xs text-dark-400 uppercase tracking-wider">{stat.label}</p>
              <p className="mt-1 text-lg font-bold text-dark-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sections to manage */}
        <h2 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Gestionar mi Portafolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '👤', title: 'Perfil', desc: 'Edita tu nombre, foto, biografía y redes sociales', href: '/dashboard/profile' },
            { icon: '💼', title: 'Experiencia', desc: 'Añade tu experiencia laboral', href: '/dashboard/experience' },
            { icon: '📁', title: 'Proyectos', desc: 'Muestra tu portafolio de trabajos', href: '/dashboard/projects' },
            { icon: '🛠️', title: 'Habilidades', desc: 'Gestiona tus skills y tecnologías', href: '/dashboard/skills' },
            { icon: '🤖', title: 'Chatbot IA', desc: user.plan === 'premium' ? 'Configura tu asistente virtual' : 'Desbloquear con Premium', href: user.plan === 'premium' ? '/dashboard/chatbot' : '/dashboard/upgrade' },
            { icon: '⚙️', title: 'Configuración', desc: 'Cambia plantilla, colores, dominio', href: '/dashboard/settings' },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition group"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-dark-900 dark:text-white group-hover:text-primary-600 transition">{item.title}</h3>
              <p className="mt-1 text-sm text-dark-500">{item.desc}</p>
              {item.href === '/dashboard/upgrade' && (
                <span className="mt-3 inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">Premium</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
