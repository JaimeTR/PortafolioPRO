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
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data: data || [] })
}

export async function POST(request) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('skills')
    .insert({ ...body, user_id: userId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data })
}
