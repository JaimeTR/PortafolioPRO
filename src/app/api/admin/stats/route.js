import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { getTokenFromCookies, verifyAccessToken } from '@/lib/auth'

export async function GET(request) {
  const { accessToken } = getTokenFromCookies(request)
  if (!accessToken) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  const payload = await verifyAccessToken(accessToken)
  if (payload?.role !== 'super_admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const supabase = createServiceRoleClient()
  const { data: users, error } = await supabase
    .from('users')
    .select('plan, is_active')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const total_users = users.length
  const active_users = users.filter(u => u.is_active).length
  const free_users = users.filter(u => u.plan === 'free').length
  const pro_users = users.filter(u => u.plan === 'pro').length
  const premium_users = users.filter(u => u.plan === 'premium').length

  return NextResponse.json({
    success: true,
    data: { total_users, active_users, free_users, pro_users, premium_users }
  })
}
