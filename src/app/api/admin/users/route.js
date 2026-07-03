import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

async function isSuperAdmin(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return false
  const payload = await verifyAccessToken(accessToken)
  return payload?.role === 'super_admin'
}

export async function GET(request) {
  if (!await isSuperAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, profession_category, plan, is_active, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, data: data || [] })
}
