'use client'
import { toast } from 'sonner'

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Braze','Poppins',sans-serif" }}>Configuración del SaaS</h1>

      <div className="space-y-6">
        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Base de Datos</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">URL</p><p className="font-mono text-xs text-gray-700 dark:text-gray-300">bmugasapxocnvhnmvosn.supabase.co</p></div>
            <div><p className="text-gray-500">Estado</p><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5" />Conectado</div>
            <div><p className="text-gray-500">Tablas</p><p className="text-gray-700 dark:text-gray-300">11 tablas (users, profiles, experiences, projects, skills, sections_config, chatbot_configs, contact_messages, subscriptions, refresh_tokens, rate_limits)</p></div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Variables de Entorno</h2>
          <pre className="text-xs text-gray-500 bg-gray-50 dark:bg-dark-950 p-4 rounded-lg overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://bmugasapxocnvhnmvosn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
JWT_SECRET=portafoliopro_jwt_secret_2025
GROQ_API_KEY=your_groq_api_key_here
ADMIN_TOKEN=portafoliopro_admin_2025`}
          </pre>
        </div>

        <div className="bg-white dark:bg-dark-900 border border-gray-200 dark:border-dark-800 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Integraciones Pendientes</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800">
              <span className="text-gray-500">Stripe (Pagos)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">Pendiente</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800">
              <span className="text-gray-500">Email (Resend/SendGrid)</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">Pendiente</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500">Dominio personalizado</span>
              <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">Listo (localhost)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
