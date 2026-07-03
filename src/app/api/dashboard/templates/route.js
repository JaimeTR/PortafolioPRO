import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

const FONTS = [
  { id: 'Poppins', name: 'Poppins (Moderna)' },
  { id: 'Inter', name: 'Inter (Profesional)' },
  { id: 'Lora', name: 'Lora (Elegante)' },
  { id: 'Playfair Display', name: 'Playfair (Clásica)' },
  { id: 'DM Sans', name: 'DM Sans (Minimalista)' },
  { id: 'Roboto', name: 'Roboto (Estándar)' },
  { id: 'Nunito', name: 'Nunito (Amigable)' },
  { id: 'Montserrat', name: 'Montserrat (Geométrica)' },
  { id: 'Raleway', name: 'Raleway (Delgada)' },
  { id: 'Outfit', name: 'Outfit (Moderna 2)' },
  { id: 'Lexend', name: 'Lexend (Legible)' },
  { id: 'Merriweather', name: 'Merriweather (Serio)' },
  { id: 'Bebas Neue', name: 'Bebas Neue (Impactante)' },
  { id: 'Source Serif 4', name: 'Source Serif (Académica)' },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const audience = searchParams.get('audience')
  const mode = searchParams.get('mode')
  const all = searchParams.get('all') === '1'

  const supabase = createServiceRoleClient()
  let query = supabase.from('templates').select('*').eq('is_active', true).order('sort_order')

  if (!all) {
    // Por defecto solo mostrar free (a menos que el usuario sea premium)
    if (category && category !== 'all' && category !== 'otro') {
      query = query.eq('category', category)
    }
    if (audience && audience !== 'all') query = query.eq('audience', audience)
    if (mode && mode !== 'all') query = query.eq('mode', mode)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Formatear para compatibilidad
  const templates = (data || []).map(t => ({
    id: t.template_key,
    name: t.name,
    desc: t.description,
    category: t.category,
    font: t.font,
    mode: t.mode,
    audience: t.audience,
    plan: t.plan,
    colors: t.colors,
    style: t.mode === 'dark' ? 'modern' : 'minimal',
    categories: [t.category],
    fontImport: `@fontsource/${t.font.toLowerCase().replace(/\s+/g, '-')}`,
  }))

  return NextResponse.json({ success: true, data: templates, fonts: FONTS })
}

// PUT: usuario selecciona un template
export async function PUT(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = await verifyAccessToken(accessToken)
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { template_id } = body

  if (!template_id) return NextResponse.json({ error: 'template_id requerido' }, { status: 400 })

  const supabase = createServiceRoleClient()

  // Verificar si el template es premium y el usuario es free
  if (template_id !== 'custom') {
    const { data: template } = await supabase
      .from('templates')
      .select('plan')
      .eq('template_key', template_id)
      .single()

    if (template?.plan === 'premium' && payload.plan === 'free') {
      return NextResponse.json({ error: 'Este template requiere plan Premium', upgrade: true }, { status: 402 })
    }
  }

  const updates = { template_id }
  if (template_id === 'custom' && body.custom_colors) {
    try {
      await supabase.from('profiles').update({
        custom_template: { colors: body.custom_colors, font: body.custom_font }
      }).eq('user_id', payload.sub)
    } catch {}
  }

  const { error } = await supabase.from('users').update(updates).eq('id', payload.sub)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, message: 'Template actualizado' })
}

// POST: super admin crea template
export async function POST(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = await verifyAccessToken(accessToken)
  if (payload?.role !== 'super_admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const body = await request.json()
  const supabase = createServiceRoleClient()

  const { error } = await supabase.from('templates').insert({
    template_key: body.template_key || body.name?.toLowerCase().replace(/\s+/g, '-'),
    name: body.name,
    description: body.description || body.desc || '',
    category: body.category || 'otro',
    font: body.font || 'Poppins',
    mode: body.mode || 'dark',
    audience: body.audience || 'neutral',
    plan: body.plan || 'free',
    colors: body.colors || {},
    sort_order: body.sort_order || 0
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE: super admin elimina template
export async function DELETE(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = await verifyAccessToken(accessToken)
  if (payload?.role !== 'super_admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) return NextResponse.json({ error: 'key requerido' }, { status: 400 })

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('templates').delete().eq('template_key', key)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
