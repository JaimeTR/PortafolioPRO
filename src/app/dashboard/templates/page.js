'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiCheck, FiLayout, FiSun, FiMoon, FiType, FiDroplet, FiUserCheck, FiUsers, FiHeart, FiLock } from 'react-icons/fi'

const PROF_LABELS = {
  medicina: 'Medicina', ing_sistemas: 'Ing. Sistemas', ciberseguridad: 'Ciberseguridad',
  derecho: 'Derecho', arquitectura: 'Arquitectura', marketing: 'Marketing',
  economia: 'Economía', contabilidad: 'Contabilidad', admin_empresas: 'Admin. Empresas',
  ing_civil: 'Ing. Civil', psicologia: 'Psicología', educacion: 'Educación',
  odontologia: 'Odontología', obstetricia: 'Obstetricia', ing_telecomunicaciones: 'Ing. Telecomunicaciones',
  ing_mecanica: 'Ing. Mecánica', otro: 'Otro'
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [fonts, setFonts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Filters
  const [filterMode, setFilterMode] = useState('all')
  const [filterAudience, setFilterAudience] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Custom mode
  const [customMode, setCustomMode] = useState(false)
  const [customColors, setCustomColors] = useState({ primary: '#2563eb', secondary: '#6366f1', accent: '#06b6d4', bg: '#ffffff', surface: '#f8fafc', text: '#0f172a' })
  const [customFont, setCustomFont] = useState('Inter')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(auth => {
      if (!auth.success) return router.push('/login')
      setUser(auth.user)
      setFilterCategory(auth.user.profession_category)
      loadTemplates(auth.user.profession_category)
    })
  }, [])

  const loadTemplates = (cat) => {
    const params = new URLSearchParams()
    if (cat && cat !== 'all') params.set('category', cat)
    else params.set('category', 'otro')
    fetch(`/api/dashboard/templates?${params}`)
      .then(r => r.json())
      .then(d => {
        setTemplates(d.data || [])
        setFonts(d.fonts || [])
      })
      .finally(() => setLoading(false))
  }

  const filteredTemplates = templates.filter(t => {
    if (filterMode !== 'all' && t.mode !== filterMode) return false
    if (filterAudience !== 'all' && t.audience !== filterAudience) return false
    if (filterCategory !== 'all' && !t.categories.includes(filterCategory)) return false
    return true
  })

  const handleSelect = async (templateId) => {
    setSaving(true)
    const res = await fetch('/api/dashboard/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId })
    })
    const d = await res.json()
    if (res.ok) {
      setUser(prev => ({ ...prev, template_id: templateId }))
      setCustomMode(false)
      toast.success('Template aplicado')
    } else if (d.upgrade) {
      toast.error('Este template requiere plan Premium')
      router.push('/dashboard/settings')
    } else {
      toast.error(d.error || 'Error al cambiar template')
    }
    setSaving(false)
  }

  const handleCustomSave = async () => {
    setSaving(true)
    const res = await fetch('/api/dashboard/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: 'custom', custom_colors: customColors, custom_font: customFont })
    })
    if (res.ok) {
      setUser(prev => ({ ...prev, template_id: 'custom' }))
      toast.success('Template personalizado guardado')
    } else toast.error('Error')
    setSaving(false)
  }

  const handleCategoryChange = (cat) => {
    setFilterCategory(cat)
    loadTemplates(cat)
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>
  if (!user) return null

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <FiLayout size={22} className="text-primary-600 shrink-0" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates / Plantillas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Elige el diseño de tu portafolio. Filtra por categoría, modo y estilo.</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => handleCategoryChange('all')} className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${filterCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}>Todas</button>
        {Object.keys(PROF_LABELS).slice(0, 10).map(k => (
          <button key={k} onClick={() => handleCategoryChange(k)} className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${filterCategory === k ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}>{PROF_LABELS[k]}</button>
        ))}
      </div>

      {/* Mode + Audience filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-1 gap-1">
          <button onClick={() => setFilterMode('all')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-medium transition ${filterMode === 'all' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <FiLayout size={12} /> Todos
          </button>
          <button onClick={() => setFilterMode('dark')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-medium transition ${filterMode === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <FiMoon size={12} /> Dark
          </button>
          <button onClick={() => setFilterMode('light')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-medium transition ${filterMode === 'light' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <FiSun size={12} /> Light
          </button>
        </div>
        <div className="flex bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg p-1 gap-1">
          <button onClick={() => setFilterAudience('all')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-medium transition ${filterAudience === 'all' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <FiUsers size={12} /> Todos
          </button>
          <button onClick={() => setFilterAudience('neutral')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-medium transition ${filterAudience === 'neutral' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <FiUserCheck size={12} /> Unisex
          </button>
          <button onClick={() => setFilterAudience('femenino')} className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md font-medium transition ${filterAudience === 'femenino' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <FiHeart size={12} /> Femenino
          </button>
        </div>
        <button onClick={() => { setCustomMode(true); setCustomColors({ primary: '#e11d48', secondary: '#a855f7', accent: '#f472b6', bg: '#fdf2f8', surface: '#ffffff', text: '#500724' }); setCustomFont('Poppins') }}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-medium transition ${customMode ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-700 text-gray-500 hover:text-purple-600'}`}>
          <FiDroplet size={12} /> Personalizado
        </button>
      </div>

      {/* Custom mode */}
      {customMode && (
        <div className="bg-white dark:bg-dark-900 border-2 border-pink-500 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Template Personalizado</h2>
              <p className="text-sm text-gray-500">Elige tus propios colores y fuente</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCustomMode(false)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
              <button onClick={handleCustomSave} disabled={saving} className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-sm font-medium">{saving ? 'Guardando...' : 'Aplicar'}</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2"><FiDroplet size={12} /> Colores</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(customColors).map(([k, v]) => (
                  <div key={k}>
                    <label className="text-xs text-gray-400 capitalize">{k}</label>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <input type="color" value={v} onChange={e => setCustomColors(p => ({...p, [k]: e.target.value}))} className="w-8 h-8 rounded cursor-pointer border-0" />
                      <input type="text" value={v} onChange={e => setCustomColors(p => ({...p, [k]: e.target.value}))} className="flex-1 text-xs p-1 border rounded dark:bg-dark-800 dark:border-dark-700 font-mono" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2"><FiType size={12} /> Fuente</label>
              <div className="space-y-2">
                {fonts.map(f => (
                  <button key={f.id} onClick={() => setCustomFont(f.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition border ${customFont === f.id ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/20' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300'}`}>
                    <span style={{ fontFamily: f.id }} className="font-medium text-gray-800 dark:text-white">{f.name}</span>
                    <span className="block text-xs text-gray-400 capitalize">{f.category}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden" style={{ backgroundColor: customColors.bg }}>
              <div className="p-4" style={{ backgroundColor: customColors.surface, borderBottom: `3px solid ${customColors.primary}` }}>
                <span className="font-bold" style={{ fontFamily: customFont, color: customColors.text }}>Tu Nombre</span>
                <span className="text-xs ml-2" style={{ color: customColors.accent }}>Profesión</span>
              </div>
              <div className="p-4 space-y-2">
                {[customColors.primary, customColors.secondary, customColors.accent].map((c, i) => (
                  <div key={i} className="h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.8 - i * 0.3 }} />
                ))}
                <p className="text-xs opacity-50" style={{ fontFamily: customFont, color: customColors.text }}>Previsualización...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(t => {
          const isSelected = user.template_id === t.id && !customMode
          const isLocked = t.plan === 'premium' && user.plan === 'free'
          return (
          <div key={t.id}
            className={`rounded-2xl overflow-hidden border-2 transition ${isSelected ? 'border-primary-600 shadow-lg ring-2 ring-primary-600/20' : isLocked ? 'border-amber-400/50 opacity-80 cursor-not-allowed' : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600 cursor-pointer'}`}
            onClick={() => { if (!isLocked) { setCustomMode(false); handleSelect(t.id) } }}
          >
            {/* Mini preview */}
            <div style={{ backgroundColor: t.colors.bg, height: '100px' }} className="relative overflow-hidden">
              <div className="absolute inset-0 flex items-end p-3 gap-2">
                <div className="h-1.5 w-1/3 rounded-full" style={{ backgroundColor: t.colors.primary }} />
                <div className="h-1.5 w-1/4 rounded-full" style={{ backgroundColor: t.colors.secondary, opacity: 0.7 }} />
                <div className="h-1.5 w-1/5 rounded-full" style={{ backgroundColor: t.colors.accent, opacity: 0.5 }} />
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center"><FiCheck size={14} /></div>
              )}
              {isLocked && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FiLock size={12} /> Premium</div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</h3>
                <div className="flex gap-1">
                  {t.mode === 'dark' ? <FiMoon size={10} className="text-gray-400" /> : <FiSun size={10} className="text-amber-500" />}
                  {t.audience === 'femenino' && <FiHeart size={10} className="text-pink-500" />}
                  {t.plan === 'premium' && <FiLock size={10} className="text-amber-500" />}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2 line-clamp-1">{t.desc}</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {(t.colors && Object.values(t.colors).slice(0, 4).map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                  )))}
                </div>
                <span className="text-xs text-gray-400" style={{ fontFamily: t.font }}>{t.font ? t.font.split(' ')[0] : ''}</span>
              </div>
              {isLocked && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1"><FiLock size={10} /> Requiere plan Premium</p>
              )}
            </div>
          </div>
        )})}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No hay templates con esos filtros</p>
          <p className="text-sm mt-1">Prueba con otras combinaciones de modo, audiencia o categoría</p>
        </div>
      )}
    </div>
  )
}
