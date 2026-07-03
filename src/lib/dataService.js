/**
 * Servicio de Datos Centralizado
 * ==============================
 * Abstrae el origen de datos: Supabase o archivos JSON locales.
 * Todos los componentes deben usar estas funciones en vez de llamar a Supabase directamente.
 */

import { supabase, createServiceRoleClient } from '@/lib/supabase'
import siteConfig from '@/config/site.config'

// ========== HELPERS ==========

function getBackendMode() {
  return siteConfig.backend?.provider || 'supabase'
}

function isSupabase() {
  return getBackendMode() === 'supabase'
}

// ========== CACHE LOCAL ==========
// Para evitar múltiples llamadas en el mismo render
let profileCache = null
let skillsCache = null
let experienceCache = null
let projectsCache = null
let chatbotConfigCache = null
let headerCache = null
let footerCache = null

// ========== IMPORTADORES JSON (Lazy) ==========

async function loadJSONData(filename) {
  try {
    const mod = await import(`@/data/${filename}.json`)
    return mod.default || mod
  } catch {
    return null
  }
}

// ========== PROFILE ==========

export async function getProfile() {
  if (isSupabase()) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).single()
      if (!error && data) return data
    } catch (e) {
      console.warn('Supabase profile fallback:', e.message)
    }
    return null
  }

  const data = await loadJSONData('profile')
  return data
}

export async function getProfileAdmin() {
  if (!isSupabase()) return await loadJSONData('profile')
  const client = createServiceRoleClient()
  const { data } = await client.from('profiles').select('*').limit(1).single()
  return data
}

// ========== SKILLS ==========

export async function getSkills() {
  if (isSupabase()) {
    try {
      const { data, error } = await supabase.from('skills').select('*').order('sort_order')
      if (!error && data?.length) return data
    } catch (e) {
      console.warn('Supabase skills fallback:', e.message)
    }
    return []
  }

  const data = await loadJSONData('skills')
  return Array.isArray(data) ? data : []
}

// ========== EXPERIENCE ==========

export async function getExperience() {
  if (isSupabase()) {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order')
      if (!error && data?.length) return data
    } catch (e) {
      console.warn('Supabase experience fallback:', e.message)
    }
    return []
  }

  const data = await loadJSONData('experience')
  return Array.isArray(data) ? data : []
}

// ========== PROJECTS ==========

export async function getProjects({ featured = false, limit = 0 } = {}) {
  if (isSupabase()) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order')
      if (featured) query = query.eq('is_featured', true)
      if (limit) query = query.limit(limit)
      const { data, error } = await query
      if (!error && data?.length) return data
    } catch (e) {
      console.warn('Supabase projects fallback:', e.message)
    }
    return []
  }

  const data = await loadJSONData('projects')
  let projects = Array.isArray(data) ? data : []
  if (featured) projects = projects.filter(p => p.is_featured)
  if (limit) projects = projects.slice(0, limit)
  return projects
}

export async function getProjectBySlug(slug) {
  if (isSupabase()) {
    try {
      const { data } = await supabase.from('projects').select('*').eq('slug', slug).single()
      return data
    } catch { return null }
  }

  const projects = await getProjects()
  return projects.find(p => p.slug === slug || p.id === slug) || null
}

// ========== CHATBOT CONFIG ==========

export async function getChatbotConfig() {
  if (isSupabase()) {
    try {
      const { data } = await supabase.from('chatbot_configs').select('*').limit(1).single()
      if (data) return data
    } catch {
      // tabla no existe aún
    }
  }

  return {
    is_enabled: siteConfig.chatbot?.enabled !== false,
    bot_name: 'AsistenteIA',
    provider: siteConfig.chatbot?.provider || 'groq',
    model: siteConfig.chatbot?.model || 'llama-3.1-8b-instant',
    temperature: siteConfig.chatbot?.temperature ?? 0.7,
    max_tokens: siteConfig.chatbot?.maxTokens ?? 150,
  }
}

// ========== HEADER / NAVIGATION ==========

export async function getHeaderConfig() {
  if (isSupabase()) {
    try {
      const { data } = await supabase.from('header_config').select('*').limit(1).single()
      if (data) return data
    } catch {}
  }

  return null
}

// ========== SECTIONS ==========

export async function getSectionsConfig() {
  if (isSupabase()) {
    try {
      const { data } = await supabase.from('sections_config').select('*').order('sort_order')
      if (data?.length) return data
    } catch {}
  }

  const sections = siteConfig.sections
  return Object.entries(sections).map(([id, config]) => ({
    id,
    label: config.label || id,
    is_hidden: !config.enabled,
  }))
}

// ========== FOOTER ==========

export async function getFooterConfig() {
  if (isSupabase()) {
    try {
      const { data } = await supabase.from('footer_config').select('*').limit(1).single()
      if (data) return data
    } catch {}
  }
  return null
}

// ========== UTILIDAD: GUARDAR EN MODO JSON (SOLO SERVIDOR) ==========
// Importante: saveJSONData usa 'fs' y solo funciona en API routes del servidor.
// NO se debe importar en componentes cliente.
// Para guardar datos en modo JSON desde el admin, usa la API /api/admin/data en su lugar.
