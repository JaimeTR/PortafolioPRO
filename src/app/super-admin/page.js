'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiUsers, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
    ]).then(([statsRes, usersRes]) => {
      if (statsRes.success) setStats(statsRes.data)
      if (usersRes.success) setRecentUsers(usersRes.data.slice(0, 5))
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Braze','Poppins',sans-serif" }}>
        Panel de Administración
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Usuarios', value: stats?.total_users || 0, icon: FiUsers, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Activos', value: stats?.active_users || 0, icon: FiActivity, color: 'text-green-600 bg-green-50 dark:bg-green-950/20' },
          { label: 'Plan Premium', value: stats?.premium_users || 0, icon: FiDollarSign, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20' },
          { label: 'Plan Gratis', value: stats?.free_users || 0, icon: FiTrendingUp, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={20} /></div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Últimos Registros</h2>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-400">No hay usuarios registrados</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{u.username}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.plan === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{u.plan}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link href="/super-admin/users" className="block p-3 border border-gray-200 dark:border-dark-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition">
              Gestionar Usuarios → Activar/desactivar cuentas, eliminar
            </Link>
            <Link href="/super-admin/templates" className="block p-3 border border-gray-200 dark:border-dark-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition">
              Gestionar Templates → Añadir/quitar plantillas
            </Link>
            <Link href="/super-admin/plans" className="block p-3 border border-gray-200 dark:border-dark-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition">
              Planes y Pagos → Cambiar plan de usuarios
            </Link>
            <Link href="/" target="_blank" className="block p-3 border border-gray-200 dark:border-dark-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-800 transition">
              Ver Landing Page → PortafolioPRO.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
