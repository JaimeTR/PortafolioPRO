'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiSave, FiUpload, FiTrash2 } from 'react-icons/fi'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/dashboard/profile')
      .then(r => r.json())
      .then(d => {
        if (d.success) setProfile(d.data || {})
        else if (d.error === 'No autorizado') router.push('/login')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfile(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleParagraphsChange = (index, lang, value) => {
    const paragraphs = [...(profile?.about_me_paragraphs || [])]
    if (!paragraphs[index]) paragraphs[index] = { es: '', en: '' }
    paragraphs[index][lang] = value
    setProfile(prev => ({ ...prev, about_me_paragraphs: paragraphs }))
  }

  const addParagraph = () => {
    const paragraphs = [...(profile?.about_me_paragraphs || []), { es: '', en: '' }]
    setProfile(prev => ({ ...prev, about_me_paragraphs: paragraphs }))
  }

  const removeParagraph = (index) => {
    const paragraphs = (profile?.about_me_paragraphs || []).filter((_, i) => i !== index)
    setProfile(prev => ({ ...prev, about_me_paragraphs: paragraphs }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/dashboard/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
    if (res.ok) toast.success('Perfil guardado')
    else toast.error('Error al guardar')
    setSaving(false)
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Editar Perfil</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition">
          <FiSave size={16} /> {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSave}>
        {/* Hero */}
        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Hero (Inicio)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo (ES)</label><input name="greeting_es" value={profile?.greeting_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="Hola" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo (EN)</label><input name="greeting_en" value={profile?.greeting_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="Hello" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Nombre (ES)</label><input name="name_es" value={profile?.name_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="Dr. Juan Pérez" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Nombre (EN)</label><input name="name_en" value={profile?.name_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="Dr. Juan Perez" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">Título Profesional (ES)</label><input name="hero_title_es" value={profile?.hero_title_es || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="Médico Cardiólogo | Especialista en Ecocardiografía" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">Título Profesional (EN)</label><input name="hero_title_en" value={profile?.hero_title_en || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">URL Foto de Perfil</label><input name="hero_image_url" value={profile?.hero_image_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" placeholder="https://..." /></div>
          </div>
        </section>

        {/* Contacto */}
        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Contacto y Redes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Email</label><input name="email" value={profile?.email || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Teléfono / WhatsApp</label><input name="whatsapp" value={profile?.whatsapp || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">LinkedIn</label>
              <div className="flex gap-2">
                <input name="linkedin_url" value={profile?.linkedin_url || ''} onChange={handleChange} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" />
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="is_linkedin_visible" checked={profile?.is_linkedin_visible !== false} onChange={handleChange} /> Mostrar</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-300">GitHub</label>
              <div className="flex gap-2">
                <input name="github_url" value={profile?.github_url || ''} onChange={handleChange} className="flex-1 p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" />
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="is_github_visible" checked={profile?.is_github_visible !== false} onChange={handleChange} /> Mostrar</label>
              </div>
            </div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1 dark:text-dark-300">URL del CV</label><input name="cv_url" value={profile?.cv_url || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
          </div>
        </section>

        {/* About */}
        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-dark-900 dark:text-white">Sobre Mí</h2>
            <button type="button" onClick={addParagraph} className="text-sm text-primary-600 hover:underline">+ Añadir párrafo</button>
          </div>
          {(profile?.about_me_paragraphs || []).map((p, i) => (
            <div key={i} className="mb-4 p-3 border border-dark-200 dark:border-dark-700 rounded-lg relative">
              <button type="button" onClick={() => removeParagraph(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><FiTrash2 size={14} /></button>
              <label className="text-xs font-medium text-dark-400">Párrafo {i + 1} - Español</label>
              <textarea value={p.es || ''} onChange={(e) => handleParagraphsChange(i, 'es', e.target.value)} rows={3} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm mt-1" />
              <label className="text-xs font-medium text-dark-400 mt-2 block">Párrafo {i + 1} - English</label>
              <textarea value={p.en || ''} onChange={(e) => handleParagraphsChange(i, 'en', e.target.value)} rows={3} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm mt-1" />
            </div>
          ))}
          {(profile?.about_me_paragraphs || []).length === 0 && (
            <p className="text-sm text-dark-400">No hay párrafos. Añade uno para tu sección &quot;Sobre Mí&quot;.</p>
          )}
        </section>

        {/* Stats */}
        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Estadísticas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Proyectos Completados</label><input type="number" name="stats_projects_completed" value={profile?.stats_projects_completed || 0} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Clientes Satisfechos</label><input type="number" name="stats_happy_clients" value={profile?.stats_happy_clients || 0} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
          </div>
        </section>
      </form>
    </div>
  )
}
