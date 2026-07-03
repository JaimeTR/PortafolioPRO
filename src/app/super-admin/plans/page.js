'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function PlansPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data)
    }).finally(() => setLoading(false))
  }, [])

  const changePlan = async (userId, plan) => {
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdhc2FweG9jbnZobm12b3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk1MTQzMCwiZXhwIjoyMDk4NTI3NDMwfQ.gUZj-56Jgfspzj9FRNqokH12epw8jmCzRf-Is6y_av0'
    await fetch(`https://bmugasapxocnvhnmvosn.supabase.co/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': `Bearer ${key}`, 'Prefer': 'return=representation' },
      body: JSON.stringify({ plan })
    })
    await fetch(`https://bmugasapxocnvhnmvosn.supabase.co/rest/v1/subscriptions?user_id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': `Bearer ${key}`, 'Prefer': 'return=representation' },
      body: JSON.stringify({ plan, status: 'active' })
    })
    toast.success(`Plan actualizado a ${plan}`)
    fetch('/api/admin/users').then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data)
    })
  }

  const stats = {
    free: users.filter(u => u.plan === 'free').length,
    pro: users.filter(u => u.plan === 'pro').length,
    premium: users.filter(u => u.plan === 'premium').length,
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Braze','Poppins',sans-serif" }}>Planes y Pagos</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Free', count: stats.free, color: 'bg-amber-500' },
          { label: 'Pro', count: stats.pro, color: 'bg-blue-500' },
          { label: 'Premium', count: stats.premium, color: 'bg-purple-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{s.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Cambiar Plan de Usuario</h2>
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800 last:border-0">
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">{u.username}</p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.plan === 'premium' ? 'bg-purple-100 text-purple-700' : u.plan === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{u.plan}</span>
                <select value={u.plan} onChange={e => changePlan(u.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1 dark:bg-dark-800 dark:border-dark-700">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
        Stripe no está configurado aún. Los cambios de plan son manuales. Cuando integres Stripe, los pagos se procesarán automáticamente.
      </div>
    </div>
  )
}
