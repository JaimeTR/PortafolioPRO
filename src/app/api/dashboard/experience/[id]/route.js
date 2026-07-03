import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

async function getUserId(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return null
  const payload = await verifyAccessToken(accessToken)
  return payload?.sub || null
}

export async function PUT(request, { params }) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('experiences')
    .update(body)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data })
}

export async function DELETE(request, { params }) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
