import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

export async function PUT(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const payload = await verifyAccessToken(accessToken)
  if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const supabase = createServiceRoleClient()

  const updates = {}
  if (body.profession_category) updates.profession_category = body.profession_category
  if (body.template_id) updates.template_id = body.template_id

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
  }

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', payload.sub)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
