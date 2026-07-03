'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FiPlus, FiTrash2, FiEdit3, FiLock, FiUnlock } from 'react-icons/fi'

const FONTS = [
  { id: 'Poppins', name: 'Poppins (Moderna)' }, { id: 'Inter', name: 'Inter (Profesional)' },
  { id: 'Lora', name: 'Lora (Elegante)' }, { id: 'Playfair Display', name: 'Playfair (Clásica)' },
  { id: 'DM Sans', name: 'DM Sans (Minimalista)' }, { id: 'Nunito', name: 'Nunito (Amigable)' },
  { id: 'Montserrat', name: 'Montserrat (Geométrica)' }, { id: 'Roboto', name: 'Roboto (Estándar)' },
  { id: 'Merriweather', name: 'Merriweather (Serio)' }, { id: 'Bebas Neue', name: 'Bebas Neue (Impactante)' },
  { id: 'Outfit', name: 'Outfit (Moderna 2)' }, { id: 'Lexend', name: 'Lexend (Legible)' },
  { id: 'Raleway', name: 'Raleway (Delgada)' }, { id: 'Source Serif 4', name: 'Source Serif (Académica)' },
]

const CATEGORIES = ['medicina','odontologia','ing_sistemas','obstetricia','ing_telecomunicaciones','ing_minera','derecho','ing_naval','ciberseguridad','ing_mecanica','economia','contabilidad','admin_empresas','ing_civil','arquitectura','marketing','psicologia','educacion','otro']

export default function TemplatesAdminPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)

  useEffect(() => { loadTemplates() }, [])

  const loadTemplates = async () => {
    const res = await fetch('/api/dashboard/templates?all=1')
    const d = await res.json()
    if (d.success) setTemplates(d.data)
    setLoading(false)
  }

  const openNew = () => {
    setForm({ id: '', name: '', desc: '', category: 'otro', font: 'Poppins', mode: 'dark', audience: 'neutral', plan: 'free', colors: { primary: '#2563eb', secondary: '#6366f1', accent: '#06b6d4', bg: '#ffffff', surface: '#f8fafc', text: '#0f172a' } })
    setEditing('new')
  }

  const openEdit = (t) => { setForm({ ...t }); setEditing(t.id) }

  const handleSave = async () => {
    if (!form.name.trim()) return
    const body = {
      name: form.name,
      description: form.desc || '',
      category: form.category,
      font: form.font,
      mode: form.mode,
      audience: form.audience,
      plan: form.plan,
      colors: form.colors,
      template_key: form.id || form.name?.toLowerCase().replace(/\s+/g, '-'),
    }
    const res = await fetch('/api/dashboard/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (res.ok) { toast.success('Template guardado'); loadTemplates(); setEditing(null) }
    else { const d = await res.json(); toast.error(d.error || 'Error') }
  }

  const handleDelete = async (key) => {
    if (!confirm('Eliminar este template?')) return
    const res = await fetch(`/api/dashboard/templates?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Eliminado'); loadTemplates() }
    else toast.error('Error al eliminar')
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Braze','Poppins',sans-serif" }}>Gestión de Templates</h1>
          <p className="text-sm text-gray-500 mt-1">{templates.length} templates · Free/Premium desde la DB</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <FiPlus size={16} /> Nuevo
        </button>
      </div>

      {editing && (
        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editing === 'new' ? 'Nuevo Template' : 'Editar Template'}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Nombre</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700" /></div>
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Categoría</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Fuente</label>
              <select value={form.font} onChange={e => setForm({...form, font: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700">
                {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Modo</label>
              <select value={form.mode} onChange={e => setForm({...form, mode: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700">
                <option value="dark">Dark</option><option value="light">Light</option></select></div>
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Audiencia</label>
              <select value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700">
                <option value="neutral">Unisex</option><option value="femenino">Femenino</option></select></div>
            <div><label className="block text-xs font-medium mb-1 dark:text-gray-300">Plan</label>
              <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700">
                <option value="free">Gratis</option><option value="premium">Premium</option></select></div>
          </div>
          <label className="block text-xs font-medium mb-1 dark:text-gray-300">Descripción</label>
          <input value={form.desc || ''} onChange={e => setForm({...form, desc: e.target.value})} className="w-full p-2 border rounded-lg text-sm dark:bg-dark-800 dark:border-dark-700" placeholder="Breve descripción..." />
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(form.colors || {}).map(([k, v]) => (
              <div key={k}><label className="block text-xs font-medium mb-1 capitalize dark:text-gray-300">{k}</label>
                <div className="flex gap-2"><input type="color" value={v} onChange={e => setForm({...form, colors: {...form.colors, [k]: e.target.value}})} className="w-10 h-9 rounded border" />
                <input value={v} onChange={e => setForm({...form, colors: {...form.colors, [k]: e.target.value}})} className="flex-1 p-2 border rounded-lg text-xs dark:bg-dark-800 dark:border-dark-700 font-mono" /></div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded-lg text-sm font-medium">Guardar</button>
            <button onClick={() => { setEditing(null); setForm(null) }} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(t => (
          <div key={t.id} className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl overflow-hidden">
            <div style={{ backgroundColor: t.colors?.bg || '#f8fafc', height: '80px' }} className="flex items-end p-3 gap-1.5 relative">
              <div className="h-1.5 rounded-full flex-1" style={{ backgroundColor: t.colors?.primary || '#2563eb' }} />
              <div className="h-1.5 rounded-full w-1/3" style={{ backgroundColor: t.colors?.secondary || '#6366f1' }} />
              <div className="h-1.5 rounded-full w-1/5" style={{ backgroundColor: t.colors?.accent || '#06b6d4' }} />
              <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-bold ${t.plan === 'premium' ? 'bg-amber-400 text-amber-900' : 'bg-green-400 text-green-900'}`}>
                {t.plan === 'premium' ? <><FiLock size={10} className="inline mr-0.5" />Premium</> : <><FiUnlock size={10} className="inline mr-0.5" />Free</>}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm" style={{ fontFamily: t.font }}>{t.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{t.category} · {t.mode} · {t.audience}</p>
                  <p className="text-xs text-gray-400">Fuente: {t.font} | {t.plan === 'premium' ? '🔒 Premium' : '✓ Gratis'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-primary-600"><FiEdit3 size={14} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <p className="text-lg">No hay templates en la base de datos</p>
            <p className="text-sm mt-1">Crea uno con el botón &quot;Nuevo&quot; o verifica la conexión a Supabase</p>
          </div>
        )}
      </div>
    </div>
  )
}
