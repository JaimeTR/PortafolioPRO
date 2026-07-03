'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

export default function ExperiencePage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ role_es: '', role_en: '', company_es: '', company_en: '', description_es: '', description_en: '', date_es: '', date_en: '', sort_order: 0, is_active: true, is_featured: true })
  const [isNew, setIsNew] = useState(false)

  const fetchData = async () => {
    const res = await fetch('/api/dashboard/experience')
    const d = await res.json()
    if (d.success) setItems(d.data)
    else if (d.error === 'No autorizado') router.push('/login')
    setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const openNew = () => { setForm({ role_es: '', role_en: '', company_es: '', company_en: '', description_es: '', description_en: '', date_es: '', date_en: '', sort_order: items.length, is_active: true, is_featured: true }); setIsNew(true); setEditing(null) }
  const openEdit = (item) => { setForm(item); setIsNew(false); setEditing(item.id) }
  const cancelEdit = () => { setEditing(null); setIsNew(false) }

  const handleSave = async (e) => {
    e.preventDefault()
    const url = isNew ? '/api/dashboard/experience' : `/api/dashboard/experience/${editing}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(isNew ? 'Experiencia añadida' : 'Experiencia actualizada'); fetchData(); cancelEdit() }
    else toast.error('Error al guardar')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta experiencia?')) return
    const res = await fetch(`/api/dashboard/experience/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Eliminada'); fetchData() }
    else toast.error('Error al eliminar')
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Experiencia Laboral</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <FiPlus size={16} /> Añadir
        </button>
      </div>

      {(editing || isNew) && (
        <form onSubmit={handleSave} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white">{isNew ? 'Nueva Experiencia' : 'Editar Experiencia'}</h2>
            <button type="button" onClick={cancelEdit} className="text-dark-400 hover:text-dark-600"><FiX size={20} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Cargo (ES)</label><input name="role_es" value={form.role_es} onChange={e => setForm({...form, role_es: e.target.value})} required className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Cargo (EN)</label><input name="role_en" value={form.role_en} onChange={e => setForm({...form, role_en: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Empresa (ES)</label><input name="company_es" value={form.company_es} onChange={e => setForm({...form, company_es: e.target.value})} required className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Empresa (EN)</label><input name="company_en" value={form.company_en} onChange={e => setForm({...form, company_en: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Fechas (ES)</label><input name="date_es" value={form.date_es} onChange={e => setForm({...form, date_es: e.target.value})} placeholder="2020 - Presente" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Fechas (EN)</label><input name="date_en" value={form.date_en} onChange={e => setForm({...form, date_en: e.target.value})} placeholder="2020 - Present" className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">Descripción (ES)</label><textarea name="description_es" value={form.description_es} onChange={e => setForm({...form, description_es: e.target.value})} rows={3} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">Descripción (EN)</label><textarea name="description_en" value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} rows={3} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Activo</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /> Destacado</label>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            <FiSave size={16} /> Guardar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-5 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-dark-900 dark:text-white">{item.role_es}</h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm">{item.company_es}</p>
              {item.date_es && <p className="text-xs text-dark-400 mt-0.5">{item.date_es}</p>}
              {item.description_es && <p className="text-sm text-dark-500 mt-2 line-clamp-2">{item.description_es}</p>}
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button onClick={() => openEdit(item)} className="p-2 text-dark-400 hover:text-primary-600 transition"><FiEdit2 size={16} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-dark-400 hover:text-red-600 transition"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <div className="text-center py-12 text-dark-400">
            <p className="text-lg">No tienes experiencia registrada</p>
            <p className="text-sm mt-1">Añade tu primer cargo con el botón &quot;Añadir&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}
