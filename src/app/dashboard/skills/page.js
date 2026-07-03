'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

const ICONS = ['code', 'heart', 'activity', 'star', 'book', 'brain', 'cpu', 'database', 'globe', 'tool', 'award', 'briefcase', 'users', 'chart', 'shield', 'lightbulb']

export default function SkillsPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', icon_name: 'star', proficiency: 80, sort_order: 0 })

  const fetchData = async () => {
    const res = await fetch('/api/dashboard/skills')
    const d = await res.json()
    if (d.success) setItems(d.data)
    else if (d.error === 'No autorizado') router.push('/login')
    setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const openNew = () => { setForm({ name: '', category: '', icon_name: 'star', proficiency: 80, sort_order: items.length }); setIsNew(true); setEditing(null) }
  const openEdit = (item) => { setForm(item); setIsNew(false); setEditing(item.id) }
  const cancelEdit = () => { setEditing(null); setIsNew(false) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return }
    const url = isNew ? '/api/dashboard/skills' : `/api/dashboard/skills/${editing}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(isNew ? 'Habilidad añadida' : 'Habilidad actualizada'); fetchData(); cancelEdit() }
    else toast.error('Error al guardar')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta habilidad?')) return
    const res = await fetch(`/api/dashboard/skills/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Eliminada'); fetchData() }
    else toast.error('Error al eliminar')
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  const grouped = items.reduce((acc, s) => { if (!acc[s.category]) acc[s.category] = []; acc[s.category].push(s); return acc }, {})

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Habilidades</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"><FiPlus size={16} /> Añadir</button>
      </div>

      {(editing || isNew) && (
        <form onSubmit={handleSave} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white">{isNew ? 'Nueva Habilidad' : 'Editar Habilidad'}</h2>
            <button type="button" onClick={cancelEdit} className="text-dark-400 hover:text-dark-600"><FiX size={20} /></button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Nombre *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Categoría</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Ej: Frontend, Diagnóstico, Especialidad" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Icono</label><select value={form.icon_name} onChange={e => setForm({...form, icon_name: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm">{ICONS.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Nivel ({form.proficiency}%)</label><input type="range" min="0" max="100" value={form.proficiency} onChange={e => setForm({...form, proficiency: parseInt(e.target.value)})} className="w-full" /></div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"><FiSave size={16} /> Guardar</button>
        </form>
      )}

      {Object.keys(grouped).length === 0 && !editing ? (
        <div className="text-center py-12 text-dark-400"><p className="text-lg">No tienes habilidades</p><p className="text-sm mt-1">Añade tus habilidades con el botón &quot;Añadir&quot;</p></div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} className="mb-6">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-dark-200 mb-3">{cat}</h3>
            <div className="space-y-2">
              {catItems.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-dark-900 dark:text-white font-medium">{s.name}</span>
                    <div className="w-24 h-2 bg-dark-100 dark:bg-dark-800 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{width: `${s.proficiency}%`}} /></div>
                    <span className="text-xs text-dark-400">{s.proficiency}%</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-dark-400 hover:text-primary-600"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 text-dark-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
