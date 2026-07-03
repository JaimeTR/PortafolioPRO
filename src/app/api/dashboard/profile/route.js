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
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function PUT(request) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createServiceRoleClient()

  const fields = [
    'hero_title_es','hero_title_en','greeting_es','greeting_en','name_es','name_en',
    'hero_subtitle_es','hero_subtitle_en','hero_image_url','about_me_paragraphs',
    'about_me_alignment','about_image_url','email','phone','address_es','address_en',
    'whatsapp','cv_url','is_cv_visible','cv_btn_text_es','cv_btn_text_en',
    'linkedin_url','is_linkedin_visible','github_url','is_github_visible',
    'facebook_url','is_facebook_visible','instagram_url','is_instagram_visible',
    'tiktok_url','is_tiktok_visible','hero_button1_text_es','hero_button1_text_en',
    'hero_button1_link','hero_button1_icon','is_button1_visible',
    'hero_button2_text_es','hero_button2_text_en','hero_button2_link',
    'hero_button2_icon','is_button2_visible','hero_buttons_order',
    'is_particles_visible','stats_projects_completed','stats_happy_clients'
  ]

  const updateData = {}
  fields.forEach(f => { if (body[f] !== undefined) updateData[f] = body[f] })
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data })
}
