'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const userId = searchParams.get('id') || ''

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, userId, password })
      })
      const d = await res.json()
      if (d.success) {
        setDone(true)
      } else {
        setError(d.error || 'Error')
      }
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  if (!token || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-950 dark:to-dark-900 px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
            Portafolio<span className="text-primary-600">PRO</span>
          </h1>
          <p className="text-gray-500 mb-6">Link inválido o expirado.</p>
          <Link href="/forgot-password" className="text-primary-600 hover:underline font-medium">Solicitar nuevo link</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-dark-950 dark:to-dark-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
            Portafolio<span className="text-primary-600">PRO</span>
          </h1>
        </div>

        {!done ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nueva Contraseña</h2>
            <p className="text-sm text-gray-500 mb-8">Elige una contraseña nueva para tu cuenta.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nueva Contraseña</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    required minLength={8} className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Mínimo 8 caracteres" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                <div className="mt-1">
                  <div className={`h-1 rounded-full transition-all ${password.length >= 8 ? 'bg-green-400 w-full' : password.length >= 4 ? 'bg-amber-400 w-1/2' : 'bg-gray-200 dark:bg-gray-700 w-0'}`} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-primary-700 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl font-semibold transition">
                {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiCheck size={28} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Contraseña Actualizada!</h2>
            <p className="text-sm text-gray-500 mb-4">Todas las sesiones han sido cerradas por seguridad.</p>
            <button onClick={() => router.push('/login')}
              className="w-full py-3 bg-primary-700 hover:bg-primary-600 text-white rounded-xl font-semibold transition">
              Ir al Inicio de Sesión
            </button>
          </div>
        )}

        {!done && (
          <div className="text-center mt-6">
            <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <FiArrowLeft size={14} /> Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
