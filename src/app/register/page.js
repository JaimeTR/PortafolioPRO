'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiCheck, FiX, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Username checker
  const [usernameStatus, setUsernameStatus] = useState('idle') // idle | checking | available | taken
  const debounceRef = useRef(null)

  const checkUsername = useCallback(async (val) => {
    if (val.length < 3) { setUsernameStatus('idle'); return }
    setUsernameStatus('checking')
    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(val.toLowerCase())}`)
      const d = await res.json()
      setUsernameStatus(d.available ? 'available' : 'taken')
    } catch {
      setUsernameStatus('idle')
    }
  }, [])

  const handleUsernameChange = (val) => {
    setForm(p => ({ ...p, username: val.toLowerCase().replace(/[^a-z0-9_]/g, '') }))
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setUsernameStatus('idle')
    debounceRef.current = setTimeout(() => checkUsername(val), 500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (usernameStatus === 'taken') { setError('El nombre de usuario ya está en uso'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, username: form.username.toLowerCase(), profession_category: 'otro', template_id: 'default', language: 'es' })
      })
      const d = await res.json()
      if (res.ok && d.success) {
        router.push('/onboarding')
      } else {
        setError(d.error || 'Error al crear cuenta')
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
            Crea tu portafolio profesional en minutos. Después del registro te guiaremos paso a paso.
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Crear Cuenta</h2>
          <p className="text-gray-500 mb-8">Regístrate y luego personaliza tu portafolio.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre de usuario</label>
              <div className="relative">
                <input type="text" value={form.username} onChange={e => handleUsernameChange(e.target.value)}
                  required minLength={3} maxLength={30}
                  className={`w-full px-4 py-3 bg-white dark:bg-dark-800 border rounded-xl focus:ring-2 outline-none dark:text-white pr-10 transition ${
                    usernameStatus === 'available' ? 'border-green-400 focus:ring-green-500/50' :
                    usernameStatus === 'taken' ? 'border-red-400 focus:ring-red-500/50' :
                    'border-gray-200 dark:border-dark-700 focus:ring-primary-500'
                  }`} placeholder="tuusuario" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === 'checking' && <FiLoader className="animate-spin text-gray-400" size={16} />}
                  {usernameStatus === 'available' && <FiCheck className="text-green-500" size={18} />}
                  {usernameStatus === 'taken' && <FiX className="text-red-500" size={18} />}
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <p className={`text-xs ${usernameStatus === 'available' ? 'text-green-600' : usernameStatus === 'taken' ? 'text-red-500' : 'text-gray-400'}`}>
                  {usernameStatus === 'available' && '✓ Disponible'}
                  {usernameStatus === 'taken' && '✗ No disponible'}
                  {usernameStatus === 'checking' && 'Verificando...'}
                  {usernameStatus === 'idle' && (form.username.length >= 3 ? 'Escribe para verificar' : 'Mínimo 3 caracteres')}
                </p>
                <p className="text-xs text-gray-400">portafoliopro.com/{form.username || 'usuario'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                required className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="tu@email.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  required minLength={8} className="w-full px-4 py-3 pr-12 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white" placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              <div className="mt-1">
                <div className={`h-1 rounded-full transition-all ${form.password.length >= 8 ? 'bg-green-400 w-full' : form.password.length >= 4 ? 'bg-amber-400 w-1/2' : 'bg-gray-200 dark:bg-gray-700 w-0'}`} />
              </div>
            </div>

            <button type="submit" disabled={loading || usernameStatus === 'taken' || usernameStatus === 'checking'}
              className="w-full py-3.5 bg-primary-700 hover:bg-primary-600 disabled:opacity-50 text-white rounded-xl font-semibold transition shadow-lg shadow-primary-700/20">
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
