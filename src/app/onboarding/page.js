'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiArrowLeft, FiUpload, FiCheck, FiX, FiLoader, FiSun, FiMoon, FiHeart, FiSearch } from 'react-icons/fi'

const PROFESSIONS = [
  { id: 'medicina', label: 'Medicina', icon: '🏥', color: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 border-emerald-200' },
  { id: 'odontologia', label: 'Odontología', icon: '🦷', color: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50 border-cyan-200' },
  { id: 'ing_sistemas', label: 'Ing. de Sistemas', icon: '💻', color: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 border-blue-200' },
  { id: 'derecho', label: 'Derecho', icon: '⚖️', color: 'from-amber-500 to-yellow-600', light: 'bg-amber-50 border-amber-200' },
  { id: 'admin_empresas', label: 'Admin. Empresas', icon: '💼', color: 'from-violet-500 to-purple-600', light: 'bg-violet-50 border-violet-200' },
  { id: 'economia', label: 'Economía', icon: '📊', color: 'from-green-500 to-emerald-600', light: 'bg-green-50 border-green-200' },
  { id: 'contabilidad', label: 'Contabilidad', icon: '📋', color: 'from-slate-500 to-gray-600', light: 'bg-slate-50 border-slate-200' },
  { id: 'ing_civil', label: 'Ing. Civil', icon: '🏗️', color: 'from-orange-500 to-red-600', light: 'bg-orange-50 border-orange-200' },
  { id: 'arquitectura', label: 'Arquitectura', icon: '🏛️', color: 'from-stone-500 to-neutral-600', light: 'bg-stone-50 border-stone-200' },
  { id: 'marketing', label: 'Marketing', icon: '📢', color: 'from-pink-500 to-rose-600', light: 'bg-pink-50 border-pink-200' },
  { id: 'psicologia', label: 'Psicología', icon: '🧠', color: 'from-fuchsia-500 to-pink-600', light: 'bg-fuchsia-50 border-fuchsia-200' },
  { id: 'educacion', label: 'Educación', icon: '📚', color: 'from-sky-500 to-blue-600', light: 'bg-sky-50 border-sky-200' },
  { id: 'obstetricia', label: 'Obstetricia', icon: '👶', color: 'from-rose-500 to-pink-600', light: 'bg-rose-50 border-rose-200' },
  { id: 'ing_telecomunicaciones', label: 'Ing. Telecomunicaciones', icon: '📡', color: 'from-indigo-500 to-violet-600', light: 'bg-indigo-50 border-indigo-200' },
  { id: 'ing_minera', label: 'Ing. Minera', icon: '⛏️', color: 'from-yellow-600 to-amber-600', light: 'bg-yellow-50 border-yellow-200' },
  { id: 'ing_mecanica', label: 'Ing. Mecánica', icon: '⚙️', color: 'from-zinc-500 to-slate-600', light: 'bg-zinc-50 border-zinc-200' },
  { id: 'ciberseguridad', label: 'Ciberseguridad', icon: '🔒', color: 'from-red-500 to-rose-600', light: 'bg-red-50 border-red-200' },
  { id: 'ing_naval', label: 'Ing. Naval', icon: '🚢', color: 'from-cyan-600 to-blue-700', light: 'bg-cyan-50 border-cyan-200' },
  { id: 'otro', label: 'Otro', icon: '🌟', color: 'from-purple-500 to-violet-600', light: 'bg-purple-50 border-purple-200' },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } } }
const slideRight = { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, x: -60, transition: { duration: 0.2 } } }
const slideLeft = { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0, transition: { duration: 0.4 } }, exit: { opacity: 0, x: 60, transition: { duration: 0.2 } } }

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profession, setProfession] = useState('')
  const [search, setSearch] = useState('')
  const [templates, setTemplates] = useState([])
  const [template, setTemplate] = useState('default')
  const [saving, setSaving] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [cvParsing, setCvParsing] = useState(false)
  const [cvData, setCvData] = useState(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.success) return router.push('/login')
      setUser(d.user)
      if (d.user.profession_category && d.user.profession_category !== 'otro') {
        router.push('/dashboard')
      }
    }).finally(() => setLoading(false))
  }, [])

  const loadTemplates = (cat) => {
    if (!cat) return
    fetch(`/api/dashboard/templates?category=${cat}`)
      .then(r => r.json()).then(d => {
        const tmp = d.data || []
        setTemplates(tmp)
        if (tmp.length > 0) setTemplate(tmp[0].id)
      })
  }

  const handleProfession = (cat) => {
    setProfession(cat)
    loadTemplates(cat)
    setStep(2)
  }

  const handleTemplateSelect = (id) => {
    setTemplate(id)
    setStep(3)
  }

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCvFile(file)
    setCvParsing(true)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res = await fetch('/api/auth/parse-cv', { method: 'POST', body: fd })
      const d = await res.json()
      if (d.success) setCvData(d.data)
    } catch {}
    setCvParsing(false)
  }

  const saveProfession = async (goToDashboard = false) => {
    // Guardar profesión y template aunque sea "otro" o se omita
    try {
      await fetch('/api/dashboard/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profession_category: profession || 'otro', template_id: template || 'default' })
      })
    } catch {}
    if (goToDashboard) router.push('/dashboard?onboarding=done')
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await saveProfession(false)

      if (cvData?.extracted) {
        const profileUpdates = {}
        const e = cvData.extracted
        if (e.full_name) { profileUpdates.name_es = e.full_name; profileUpdates.name_en = e.full_name }
        if (e.email) profileUpdates.email = e.email
        if (e.phone) { profileUpdates.phone = e.phone; profileUpdates.whatsapp = e.phone }
        if (e.summary) profileUpdates.about_me_paragraphs = [{ es: `<p>${e.summary}</p>`, en: e.summary_en ? `<p>${e.summary_en}</p>` : `<p>${e.summary}</p>` }]
        if (Object.keys(profileUpdates).length > 0) {
          await fetch('/api/dashboard/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profileUpdates) })
        }
        if (e.experience?.length > 0) {
          for (const exp of e.experience.slice(0, 5)) {
            await fetch('/api/dashboard/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role_es: exp.role, role_en: exp.role, company_es: exp.company, company_en: exp.company, description_es: exp.description, description_en: exp.description, date_es: exp.date, date_en: exp.date, is_active: true, is_featured: true }) })
          }
        }
        if (e.skills?.length > 0) {
          for (const s of e.skills.slice(0, 10)) {
            await fetch('/api/dashboard/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: s, category: 'Profesional', icon_name: 'star', proficiency: 80 }) })
          }
        }
      }
      router.push('/dashboard?onboarding=done')
    } catch {
      router.push('/dashboard')
    }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#050510]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div></div>

  const filteredProfessions = search ? PROFESSIONS.filter(p => p.label.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())) : PROFESSIONS

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col" style={{ fontFamily: "'Poppins', 'Braze', sans-serif" }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
        <span className="text-xl font-black" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>Portafolio<span className="text-primary-400">PRO</span></span>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-white/30">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex items-center gap-2 ${step >= s ? 'text-white/80' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > s ? 'bg-primary-600' : step === s ? 'bg-primary-600 ring-2 ring-primary-400/50' : 'bg-white/10'}`}>
                  {step > s ? <FiCheck size={14} /> : s}
                </div>
                <span className="hidden md:inline">{s === 1 ? 'Profesión' : s === 2 ? 'Plantilla' : 'CV'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: Profession */}
            {step === 1 && (
              <motion.div key="step1" {...slideRight}>
                <div className="text-center mb-10">
                  <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
                    ¿Cuál es tu <span className="text-primary-400">profesión</span>?
                  </motion.h1>
                  <p className="text-white/40 text-lg">Selecciona tu área para encontrar la plantilla perfecta.</p>
                </div>
                <div className="relative mb-6 max-w-md mx-auto">
                  <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar profesión..." className="w-full pl-11 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white text-sm" />
                </div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredProfessions.map(p => (
                    <motion.button key={p.id} variants={cardVariants} whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleProfession(p.id)}
                      className="group relative p-5 bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:border-primary-500/40 rounded-2xl text-center transition-all hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-primary-500/10">
                      <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {p.icon}
                      </div>
                      <p className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{p.label}</p>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* STEP 2: Template */}
            {step === 2 && (
              <motion.div key="step2" {...slideRight}>
                <div className="text-center mb-8">
                  <motion.h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
                    Elige tu <span className="text-primary-400">plantilla</span>
                  </motion.h1>
                  <p className="text-white/40 text-lg">Templates recomendados para {PROFESSIONS.find(p => p.id === profession)?.label}.</p>
                </div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible"
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {templates.map(t => (
                    <motion.button key={t.id} variants={cardVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleTemplateSelect(t.id)}
                      className="group relative bg-white/[0.03] backdrop-blur-xl border-2 border-white/5 hover:border-primary-500/40 rounded-2xl overflow-hidden text-left transition-all hover:shadow-2xl">
                      <div style={{ backgroundColor: t.colors?.bg || '#f8fafc' }} className="h-28 flex items-end p-3 gap-1.5">
                        <div className="h-2 rounded-full flex-1" style={{ backgroundColor: t.colors?.primary || '#2563eb' }} />
                        <div className="h-2 rounded-full w-1/3" style={{ backgroundColor: t.colors?.secondary || '#6366f1' }} />
                        <div className="h-2 rounded-full w-1/5" style={{ backgroundColor: t.colors?.accent || '#06b6d4' }} />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="font-bold text-white text-sm">{t.name}</h3>
                          {t.mode === 'dark' ? <FiMoon size={10} className="text-white/40" /> : <FiSun size={10} className="text-amber-400" />}
                          {t.audience === 'femenino' && <FiHeart size={10} className="text-pink-400" />}
                        </div>
                        <p className="text-xs text-white/40 line-clamp-1">{t.desc}</p>
                        <div className="flex gap-1 mt-2">
                          {Object.values(t.colors || {}).slice(0, 4).map((c, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
                <div className="flex justify-center mt-8">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition">
                    <FiArrowLeft size={16} /> Volver
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CV */}
            {step === 3 && (
              <motion.div key="step3" {...slideRight}>
                <div className="text-center mb-8">
                  <motion.h1 className="text-4xl md:text-5xl font-black mb-3" style={{ fontFamily: "'Braze', 'Poppins', sans-serif" }}>
                    ¿Tienes un <span className="text-primary-400">CV</span>?
                  </motion.h1>
                  <p className="text-white/40 text-lg">Sube tu CV en PDF y lo analizaremos para rellenar tu perfil automáticamente.</p>
                </div>

                {!cvFile && !cvParsing && (
                  <div className="max-w-lg mx-auto">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-primary-500/40 rounded-3xl p-14 cursor-pointer transition-all bg-white/[0.02] backdrop-blur-xl">
                      <div className="w-20 h-20 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-5">
                        <FiUpload size={32} className="text-primary-400" />
                      </div>
                      <p className="text-white font-semibold text-lg">Click para subir tu CV</p>
                      <p className="text-white/30 text-sm mt-1">PDF, máximo 5MB</p>
                      <input type="file" accept=".pdf" onChange={handleCvUpload} className="hidden" />
                    </label>
                  </div>
                )}

                {cvParsing && (
                  <div className="text-center py-16">
                    <FiLoader className="animate-spin inline text-primary-400" size={36} />
                    <p className="mt-4 text-white/50 text-lg">Analizando CV con IA...</p>
                  </div>
                )}

                {cvData?.extracted && !cvParsing && (
                  <div className="max-w-lg mx-auto space-y-4">
                    <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3">
                      <FiCheck size={22} className="text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-emerald-300">CV Procesado</p>
                        <p className="text-sm text-emerald-400/70 mt-1">
                          {cvData.extracted.full_name && `✓ ${cvData.extracted.full_name}`}<br/>
                          {cvData.extracted.profession && `✓ ${cvData.extracted.profession}`}<br/>
                          {cvData.extracted.experience?.length > 0 && `✓ ${cvData.extracted.experience.length} experiencias`}<br/>
                          {cvData.extracted.skills?.length > 0 && `✓ ${cvData.extracted.skills.length} habilidades`}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => { setCvFile(null); setCvData(null) }}
                      className="text-sm text-white/30 hover:text-white/50 transition flex items-center gap-1 mx-auto">
                      <FiX size={14} /> Quitar CV
                    </button>
                  </div>
                )}

                {cvData && !cvData.extracted && !cvParsing && (
                  <div className="max-w-lg mx-auto bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-5 text-sm text-amber-300/80 text-center">
                    No se pudieron extraer datos. Puedes continuar y rellenar manualmente.
                  </div>
                )}

                <div className="flex justify-center gap-4 mt-10">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 text-white/40 hover:text-white/70 transition">
                    <FiArrowLeft size={16} /> Volver
                  </button>
                  <button onClick={handleFinish} disabled={saving}
                    className="flex items-center gap-2 px-10 py-3.5 bg-primary-700 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg transition-all disabled:opacity-50 shadow-xl shadow-primary-700/20">
                    {saving ? 'Guardando...' : '¡Finalizar!'} <FiArrowRight size={18} />
                  </button>
                  {!cvData?.extracted && (
                    <button onClick={() => saveProfession(true)}
                      className="text-sm text-white/30 hover:text-white/50 transition">
                      Omitir →
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Skip button */}
      {step < 3 && (
        <div className="text-center py-4">
          <button onClick={() => saveProfession(true)} className="text-sm text-white/20 hover:text-white/40 transition">
            Omitir configuración por ahora →
          </button>
        </div>
      )}
    </div>
  )
}
