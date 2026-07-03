'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

export default function ProjectsPage() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [form, setForm] = useState({ title_es: '', title_en: '', description_es: '', description_en: '', image_url: '', category_es: 'General', category_en: 'General', technologies: [], link_url: '', github_url: '', is_featured: false, is_visible: true, sort_order: 0, features_es: [], features_en: [], abstract_es: '', abstract_en: '' })
  const [techInput, setTechInput] = useState('')
  const [featEsInput, setFeatEsInput] = useState('')
  const [featEnInput, setFeatEnInput] = useState('')

  const fetchData = async () => {
    const res = await fetch('/api/dashboard/projects')
    const d = await res.json()
    if (d.success) setItems(d.data)
    else if (d.error === 'No autorizado') router.push('/login')
    setLoading(false)
  }
  useEffect(() => { fetchData() }, [])

  const openNew = () => { setForm({ title_es: '', title_en: '', description_es: '', description_en: '', image_url: '', category_es: 'General', category_en: 'General', technologies: [], link_url: '', github_url: '', is_featured: false, is_visible: true, sort_order: items.length, features_es: [], features_en: [], abstract_es: '', abstract_en: '' }); setTechInput(''); setFeatEsInput(''); setFeatEnInput(''); setIsNew(true); setEditing(null) }
  const openEdit = (item) => { setForm({ ...item, technologies: item.technologies || [], features_es: item.features_es || [], features_en: item.features_en || [] }); setTechInput(''); setFeatEsInput(''); setFeatEnInput(''); setIsNew(false); setEditing(item.id) }
  const cancelEdit = () => { setEditing(null); setIsNew(false) }

  const addTech = () => { if (techInput.trim()) { setForm({...form, technologies: [...form.technologies, techInput.trim()]}); setTechInput('') } }
  const removeTech = (i) => { setForm({...form, technologies: form.technologies.filter((_, idx) => idx !== i)}) }
  const addFeatEs = () => { if (featEsInput.trim()) { setForm({...form, features_es: [...form.features_es, featEsInput.trim()]}); setFeatEsInput('') } }
  const removeFeatEs = (i) => { setForm({...form, features_es: form.features_es.filter((_, idx) => idx !== i)}) }
  const addFeatEn = () => { if (featEnInput.trim()) { setForm({...form, features_en: [...form.features_en, featEnInput.trim()]}); setFeatEnInput('') } }
  const removeFeatEn = (i) => { setForm({...form, features_en: form.features_en.filter((_, idx) => idx !== i)}) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title_es.trim()) { toast.error('El título es obligatorio'); return }
    const url = isNew ? '/api/dashboard/projects' : `/api/dashboard/projects/${editing}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(isNew ? 'Proyecto creado' : 'Proyecto actualizado'); fetchData(); cancelEdit() }
    else toast.error('Error al guardar')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    const res = await fetch(`/api/dashboard/projects/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Eliminado'); fetchData() }
    else toast.error('Error al eliminar')
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Proyectos</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <FiPlus size={16} /> Añadir
        </button>
      </div>

      {(editing || isNew) && (
        <form onSubmit={handleSave} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white">{isNew ? 'Nuevo Proyecto' : 'Editar Proyecto'}</h2>
            <button type="button" onClick={cancelEdit} className="text-dark-400 hover:text-dark-600"><FiX size={20} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Título (ES) *</label><input value={form.title_es} onChange={e => setForm({...form, title_es: e.target.value})} required className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Título (EN)</label><input value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Categoría (ES)</label><input value={form.category_es} onChange={e => setForm({...form, category_es: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Categoría (EN)</label><input value={form.category_en} onChange={e => setForm({...form, category_en: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">URL Imagen</label><input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="https://..." /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">Descripción (ES)</label><textarea value={form.description_es} onChange={e => setForm({...form, description_es: e.target.value})} rows={3} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">Descripción (EN)</label><textarea value={form.description_en} onChange={e => setForm({...form, description_en: e.target.value})} rows={3} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Link del proyecto</label><input value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">GitHub</label><input value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Tecnologías</label>
              <div className="flex gap-2"><input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /><button type="button" onClick={addTech} className="px-3 py-2 bg-dark-100 dark:bg-dark-800 rounded-md text-sm">+</button></div>
              <div className="flex flex-wrap gap-1 mt-2">{form.technologies.map((t, i) => <span key={i} className="px-2 py-0.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex items-center gap-1">{t}<button type="button" onClick={() => removeTech(i)} className="hover:text-red-500">×</button></span>)}</div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Características (ES)</label>
              <div className="flex gap-2"><input value={featEsInput} onChange={e => setFeatEsInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeatEs())} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /><button type="button" onClick={addFeatEs} className="px-3 py-2 bg-dark-100 dark:bg-dark-800 rounded-md text-sm">+</button></div>
              <div className="flex flex-wrap gap-1 mt-2">{form.features_es.map((f, i) => <span key={i} className="px-2 py-0.5 text-xs bg-dark-100 dark:bg-dark-800 rounded flex items-center gap-1">{f}<button type="button" onClick={() => removeFeatEs(i)} className="hover:text-red-500">×</button></span>)}</div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">Características (EN)</label>
              <div className="flex gap-2"><input value={featEnInput} onChange={e => setFeatEnInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeatEn())} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /><button type="button" onClick={addFeatEn} className="px-3 py-2 bg-dark-100 dark:bg-dark-800 rounded-md text-sm">+</button></div>
              <div className="flex flex-wrap gap-1 mt-2">{form.features_en.map((f, i) => <span key={i} className="px-2 py-0.5 text-xs bg-dark-100 dark:bg-dark-800 rounded flex items-center gap-1">{f}<button type="button" onClick={() => removeFeatEn(i)} className="hover:text-red-500">×</button></span>)}</div>
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} /> Destacado</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_visible} onChange={e => setForm({...form, is_visible: e.target.checked})} /> Visible</label>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"><FiSave size={16} /> Guardar</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl overflow-hidden">
            {item.image_url && <img src={item.image_url} alt={item.title_es} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-dark-900 dark:text-white">{item.title_es}</h3>
                  <p className="text-xs text-dark-400">{item.category_es} {!item.is_visible && '(Oculto)'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-dark-400 hover:text-primary-600"><FiEdit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-dark-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                </div>
              </div>
              {item.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.technologies.map((t, i) => <span key={i} className="px-2 py-0.5 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">{t}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && (
          <div className="md:col-span-2 text-center py-12 text-dark-400">
            <p className="text-lg">No tienes proyectos</p>
            <p className="text-sm mt-1">Añade tu primer proyecto con el botón &quot;Añadir&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}
