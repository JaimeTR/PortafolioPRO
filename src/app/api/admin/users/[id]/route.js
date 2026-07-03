import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

async function isSuperAdmin(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return false
  const payload = await verifyAccessToken(accessToken)
  return payload?.role === 'super_admin'
}

export async function PUT(request, { params }) {
  if (!await isSuperAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { id } = await params
  const body = await request.json()

  if (body.action === 'toggle_status') {
    const supabase = createServiceRoleClient()
    const { data: user } = await supabase.from('users').select('is_active').eq('id', id).single()
    const { error } = await supabase.from('users').update({ is_active: !user.is_active }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 })
}

export async function DELETE(request, { params }) {
  if (!await isSuperAdmin(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { id } = await params
  const supabase = createServiceRoleClient()
  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
