'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiExternalLink, FiCopy } from 'react-icons/fi'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.success) setUser(d.user)
        else router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [])

  const copyUrl = () => {
    navigator.clipboard.writeText(`/${user?.username}`)
    toast.success('Link copiado')
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>
  if (!user) return null

  const planLabel = { free: 'Gratis', pro: 'Pro', premium: 'Premium' }[user.plan] || 'Gratis'
  const planColor = user.plan === 'premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : user.plan === 'pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Configuración</h1>
      <div className="space-y-6">
        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Información General</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-dark-400">Usuario</p><p className="font-medium text-dark-900 dark:text-white">{user.username}</p></div>
            <div><p className="text-dark-400">Email</p><p className="font-medium text-dark-900 dark:text-white">{user.email}</p></div>
            <div><p className="text-dark-400">Profesión</p><p className="font-medium text-dark-900 dark:text-white">{user.profession_category}</p></div>
            <div><p className="text-dark-400">Template</p><p className="font-medium text-dark-900 dark:text-white">{user.template_id}</p></div>
            <div><p className="text-dark-400">Idioma</p><p className="font-medium text-dark-900 dark:text-white">{user.language === 'bilingual' ? 'Bilingüe ES/EN' : user.language?.toUpperCase()}</p></div>
            <div><p className="text-dark-400">Plan</p><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${planColor}`}>{planLabel}</span></div>
          </div>
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Tu Portafolio</h2>
          <p className="text-sm text-dark-500 mb-3">Comparte este link para que vean tu portafolio:</p>
          <div className="flex gap-2">
            <input readOnly value={`/${user.username}`} className="flex-1 p-3 border rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white font-mono text-sm" />
            <button onClick={copyUrl} className="flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition"><FiCopy size={14} /> Copiar</button>
            <a href={`/${user.username}`} target="_blank" className="flex items-center gap-1 px-4 py-2 border border-dark-200 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800 rounded-lg text-sm font-medium transition"><FiExternalLink size={14} /> Ver</a>
          </div>
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Planes</h2>
          <p className="text-sm text-dark-500 mb-4">Próximamente: planes Pro y Premium con Chatbot IA, proyectos ilimitados y dominios personalizados.</p>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-700 dark:text-amber-400">
            Los pagos con Stripe estarán disponibles pronto. Por ahora, todos los usuarios tienen acceso gratuito.
          </div>
        </section>
      </div>
    </div>
  )
}
