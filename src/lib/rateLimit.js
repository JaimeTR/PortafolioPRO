/**
 * Rate Limiting - Basado en DB (Supabase) para simplicidad
 * Sin dependencia externa de Redis
 */
import { createServiceRoleClient } from '@/lib/supabase'

const LIMITS = {
  login: { max: 5, window: 15 * 60 },     // 5 intentos en 15 min
  register: { max: 3, window: 60 * 60 },   // 3 registros en 1 hora
  chat: { max: 30, window: 60 },           // 30 req/min (free)
  chat_premium: { max: 100, window: 60 },  // 100 req/min (premium)
  api: { max: 60, window: 60 },            // 60 req/min general
  api_auth: { max: 100, window: 60 },      // 100 req/min autenticado
}

export async function checkRateLimit(key, limitType = 'api') {
  const supabase = createServiceRoleClient()
  const { max, window: windowSec } = LIMITS[limitType] || LIMITS.api
  const now = Date.now()
  const resetAt = new Date(now + windowSec * 1000).toISOString()

  try {
    const { data, error } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single()

    if (error && error.code === 'PGRST116') {
      // No existe, crear nuevo
      await supabase.from('rate_limits').insert({
        key,
        count: 1,
        reset_at: resetAt
      })
      return { allowed: true, remaining: max - 1 }
    }

    if (data) {
      const isExpired = new Date(data.reset_at) < new Date()
      
      if (isExpired) {
        await supabase
          .from('rate_limits')
          .update({ count: 1, reset_at: resetAt })
          .eq('key', key)
        return { allowed: true, remaining: max - 1 }
      }

      const newCount = data.count + 1

      if (data.count >= max) {
        return { allowed: false, remaining: 0 }
      }

      await supabase
        .from('rate_limits')
        .update({ count: newCount })
        .eq('key', key)

      return { allowed: true, remaining: max - newCount }
    }
  } catch (e) {
    console.error('Rate limit error:', e)
    // Si falla, permitir (fail open)
  }

  return { allowed: true, remaining: max }
}

export function getRateLimitKey(request, type = 'ip') {
  if (type === 'ip') {
    const forwarded = request.headers.get('x-forwarded-for')
    return `rl:${type}:${forwarded || '127.0.0.1'}`
  }
  if (type === 'user') {
    const userId = request.headers.get('x-user-id') || 'anonymous'
    return `rl:${type}:${userId}`
  }
  return `rl:${type}:unknown`
}

export { LIMITS }
