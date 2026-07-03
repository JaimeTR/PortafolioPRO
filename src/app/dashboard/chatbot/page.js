'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FiMessageSquare, FiSave, FiToggleLeft, FiToggleRight, FiInfo } from 'react-icons/fi'

export default function ChatbotPage() {
  const router = useRouter()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quickEs, setQuickEs] = useState('')
  const [quickEn, setQuickEn] = useState('')

  useEffect(() => {
    fetch('/api/dashboard/chatbot').then(r => r.json()).then(d => {
      if (d.success && d.data) {
        setConfig(d.data)
        setQuickEs((d.data.quick_actions_es || []).join('\n'))
        setQuickEn((d.data.quick_actions_en || []).join('\n'))
      } else {
        setConfig({
          is_enabled: false, bot_name: 'AsistenteIA',
          greeting_es: '', greeting_en: '', return_greeting_es: '', return_greeting_en: '',
          system_prompt_es: '', system_prompt_en: '', training_data: '',
          model: 'llama-3.1-8b-instant', provider: 'groq', temperature: 0.7, max_tokens: 150
        })
      }
    }).catch(() => {
      setConfig({
        is_enabled: false, bot_name: 'AsistenteIA',
        model: 'llama-3.1-8b-instant', provider: 'groq', temperature: 0.7, max_tokens: 150
      })
    }).finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...config,
      quick_actions_es: quickEs.split('\n').filter(s => s.trim()),
      quick_actions_en: quickEn.split('\n').filter(s => s.trim())
    }
    const res = await fetch('/api/dashboard/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) toast.success('Chatbot configurado')
    else toast.error('Error al guardar')
    setSaving(false)
  }

  if (loading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mt-20"></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FiMessageSquare size={22} className="text-primary-600" />
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Chatbot IA</h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition"><FiSave size={16} /> {saving ? 'Guardando...' : 'Guardar'}</button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-dark-900 dark:text-white">Estado</h2><p className="text-sm text-dark-500">Activa o desactiva el chatbot en tu portafolio</p></div>
            <button type="button" onClick={() => setConfig(p => ({...p, is_enabled: !p.is_enabled}))} className="text-4xl">{config?.is_enabled ? <FiToggleRight className="text-green-500" /> : <FiToggleLeft className="text-dark-400" />}</button>
          </div>
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">Identidad y Saludos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Nombre del Bot</label><input name="bot_name" value={config?.bot_name || ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
            <div></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo Inicial (ES)</label><textarea name="greeting_es" value={config?.greeting_es || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm resize-y" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo Inicial (EN)</label><textarea name="greeting_en" value={config?.greeting_en || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm resize-y" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo Retorno (ES)</label><textarea name="return_greeting_es" value={config?.return_greeting_es || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm resize-y" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Saludo Retorno (EN)</label><textarea name="return_greeting_en" value={config?.return_greeting_en || ''} onChange={handleChange} rows={2} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm resize-y" /></div>
          </div>
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">Acciones Rápidas</h2>
          <p className="text-sm text-dark-500">Una acción por línea. Aparecen como botones sugeridos en el chat.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Acciones (ES)</label><textarea value={quickEs} onChange={e => setQuickEs(e.target.value)} rows={4} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm font-mono resize-y" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Acciones (EN)</label><textarea value={quickEn} onChange={e => setQuickEn(e.target.value)} rows={4} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm font-mono resize-y" /></div>
          </div>
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2"><FiInfo className="text-primary-500" /><h2 className="text-lg font-bold text-dark-900 dark:text-white">Datos de Entrenamiento</h2></div>
          <p className="text-sm text-dark-500">Toda la información que la IA debe conocer sobre ti: experiencia, servicios, FAQ, precios, horarios, etc.</p>
          <textarea name="training_data" value={config?.training_data || ''} onChange={handleChange} rows={10} className="w-full p-3 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm font-mono resize-y" placeholder="DATOS DEL PROFESIONAL:&#10;- Nombre: ...&#10;- Especialidad: ...&#10;&#10;SERVICIOS:&#10;- ...&#10;&#10;FAQ:&#10;- ..." />
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">Prompt del Sistema</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">System Prompt (ES)</label><textarea name="system_prompt_es" value={config?.system_prompt_es || ''} onChange={handleChange} rows={6} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm font-mono resize-y" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">System Prompt (EN)</label><textarea name="system_prompt_en" value={config?.system_prompt_en || ''} onChange={handleChange} rows={6} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm font-mono resize-y" /></div>
          </div>
        </section>

        <section className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">Modelo IA</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Proveedor</label><select name="provider" value={config?.provider || 'groq'} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm"><option value="groq">Groq</option><option value="openai">OpenAI</option><option value="gemini">Gemini</option></select></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Modelo</label><select name="model" value={config?.model || 'llama-3.1-8b-instant'} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm"><option value="llama-3.1-8b-instant">Llama 3.1 8B</option><option value="llama-3.3-70b-versatile">Llama 3.3 70B</option><option value="gpt-4o-mini">GPT-4o Mini</option><option value="gemini-1.5-flash">Gemini 1.5 Flash</option></select></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Temperatura ({config?.temperature ?? 0.7})</label><input type="range" name="temperature" min="0" max="2" step="0.1" value={config?.temperature ?? 0.7} onChange={handleChange} className="w-full" /></div>
            <div><label className="block text-sm font-medium mb-1 dark:text-dark-300">Max Tokens</label><input type="number" name="max_tokens" value={config?.max_tokens ?? 150} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 text-sm" /></div>
          </div>
        </section>
      </form>
    </div>
  )
}
