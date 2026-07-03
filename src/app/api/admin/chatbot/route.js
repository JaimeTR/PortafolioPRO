import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function GET() {
  try {
    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('chatbot_configs')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = getServiceClient()

    const { data: existing } = await supabase
      .from('chatbot_configs')
      .select('id')
      .limit(1)
      .single()

    const updateData = {
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
      model: body.model,
      provider: body.provider,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
      link_experience_es: body.link_experience_es,
      link_experience_en: body.link_experience_en,
      link_contact_es: body.link_contact_es,
      link_contact_en: body.link_contact_en,
      updated_at: new Date().toISOString()
    }

    let result
    if (existing) {
      result = await supabase
        .from('chatbot_configs')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('chatbot_configs')
        .insert(updateData)
        .select()
        .single()
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
