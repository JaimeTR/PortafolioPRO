'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FiActivity, FiTrash2, FiSearch, FiEdit3 } from 'react-icons/fi'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingPlan, setEditingPlan] = useState(null)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    const res = await fetch('/api/admin/users')
    const d = await res.json()
    if (d.success) setUsers(d.data)
    setLoading(false)
  }

  const toggleStatus = async (userId) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_status' })
    })
    if (res.ok) { toast.success('Estado actualizado'); loadUsers() }
    else toast.error('Error')
  }

  const deleteUser = async (userId, username) => {
    if (!confirm(`Eliminar permanentemente a ${username}?`)) return
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Usuario eliminado'); loadUsers() }
    else toast.error('Error')
  }

  const changePlan = async (userId, plan) => {
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdhc2FweG9jbnZobm12b3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk1MTQzMCwiZXhwIjoyMDk4NTI3NDMwfQ.gUZj-56Jgfspzj9FRNqokH12epw8jmCzRf-Is6y_av0'
    await fetch(`https://bmugasapxocnvhnmvosn.supabase.co/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': key, 'Authorization': `Bearer ${key}`, 'Prefer': 'return=representation' },
      body: JSON.stringify({ plan })
    })
    toast.success(`Plan cambiado a ${plan}`)
    setEditingPlan(null)
    loadUsers()
  }

  const filtered = users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Braze','Poppins',sans-serif" }}>Gestión de Usuarios</h1>
        <span className="text-sm text-gray-500">{users.length} usuarios</span>
      </div>

      <div className="relative mb-6">
        <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email..." className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl text-sm" />
      </div>

      <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-950 text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Profesión</th>
                <th className="text-left px-4 py-3">Plan</th>
                <th className="text-left px-4 py-3">Rol</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No se encontraron usuarios</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-gray-100 dark:border-dark-800">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.username}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3">{u.profession_category || '-'}</td>
                  <td className="px-4 py-3">
                    {editingPlan === u.id ? (
                      <select value={u.plan} onChange={e => changePlan(u.id, e.target.value)}
                        className="text-xs border rounded px-1 py-0.5 dark:bg-dark-800">
                        <option value="free">Gratis</option>
                        <option value="pro">Pro</option>
                        <option value="premium">Premium</option>
                      </select>
                    ) : (
                      <button onClick={() => setEditingPlan(u.id)}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${u.plan === 'premium' ? 'bg-purple-100 text-purple-700' : u.plan === 'pro' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {u.plan} <FiEdit3 size={10} />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${u.role === 'super_admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => toggleStatus(u.id)} className="p-1.5 text-gray-400 hover:text-blue-600" title="Toggle estado">
                        <FiActivity size={14} />
                      </button>
                      <button onClick={() => deleteUser(u.id, u.username)} className="p-1.5 text-gray-400 hover:text-red-600" title="Eliminar">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
