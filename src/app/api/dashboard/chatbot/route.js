import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

async function getUserId(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return null
  const payload = await verifyAccessToken(accessToken)
  return payload?.sub || null
}

export async function GET(request) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('chatbot_configs')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data: data || {
    is_enabled: false,
    bot_name: 'AsistenteIA',
    greeting_es: '', greeting_en: '',
    system_prompt_es: '', system_prompt_en: '',
    training_data: '',
    model: 'llama-3.1-8b-instant', provider: 'groq',
    temperature: 0.7, max_tokens: 150
  }})
}

export async function POST(request) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createServiceRoleClient()

  const { data: existing } = await supabase
    .from('chatbot_configs')
    .select('id')
    .eq('user_id', userId)
    .single()

  const updateData = {
    user_id: userId,
    is_enabled: body.is_enabled,
    bot_name: body.bot_name,
    greeting_es: body.greeting_es,
    greeting_en: body.greeting_en,
    return_greeting_es: body.return_greeting_es,
    return_greeting_en: body.return_greeting_en,
    quick_actions_es: body.quick_actions_es,
    quick_actions_en: body.quick_actions_en,
    system_prompt_es: body.system_prompt_es,
    system_prompt_en: body.system_prompt_en,
    training_data: body.training_data,
    model: body.model, provider: body.provider,
    temperature: body.temperature, max_tokens: body.max_tokens,
    updated_at: new Date().toISOString()
  }

  let result
  if (existing) {
    result = await supabase.from('chatbot_configs').update(updateData).eq('id', existing.id).select().single()
  } else {
    result = await supabase.from('chatbot_configs').insert(updateData).select().single()
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ success: true, data: result.data })
}
