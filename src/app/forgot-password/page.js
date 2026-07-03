'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const d = await res.json()
      if (d.success) {
        setDone(true)
        setResetUrl(d.resetUrl || '')
      } else {
        setError(d.error || 'Error')
      }
    } catch {
      setError('Error de conexión')
    }
    setLoading(false)
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recuperar Contraseña</h2>
            <p className="text-sm text-gray-500 mb-8">Ingresa tu email o usuario y te enviaremos un link.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email o Usuario</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                  required className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="tu@email.com" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-primary-700 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl font-semibold transition">
                {loading ? 'Enviando...' : 'Enviar Link de Recuperación'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiCheck size={28} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Link Generado</h2>
            <p className="text-sm text-gray-500 mb-4">Si el usuario existe, usa este link para restablecer tu contraseña:</p>
            {resetUrl && (
              <a href={resetUrl} className="block w-full py-3 bg-primary-700 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition mb-3">
                Ir a Restablecer Contraseña
              </a>
            )}
            <button onClick={() => setDone(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Solicitar otro link
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <FiArrowLeft size={14} /> Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
