'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login, password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.user?.role === 'super_admin') {
          router.push('/super-admin')
        } else if (data.user?.profession_category === 'otro') {
          router.push('/onboarding')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-950 dark:to-dark-900">
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-primary-800 to-indigo-900 p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative text-center text-white max-w-md">
          <h2 className="text-5xl font-black mb-4" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
            Portafolio<span className="text-blue-200">PRO</span>
          </h2>
          <p className="text-xl text-blue-100/80 leading-relaxed">
            Crea un portafolio profesional en minutos. Sin código, sin complicaciones.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
              Portafolio<span className="text-primary-600">PRO</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Iniciar Sesión</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Ingresa a tu cuenta para gestionar tu portafolio.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email o Usuario</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="tuusuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-700 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl font-semibold transition shadow-lg shadow-primary-700/20"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
