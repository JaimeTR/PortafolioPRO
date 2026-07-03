import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { verifyAccessToken, getTokenFromCookies } from '@/lib/auth'

export async function GET(request) {
  try {
    const { accessToken } = getTokenFromCookies(request)

    if (!accessToken) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const payload = await verifyAccessToken(accessToken)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    const supabase = createServiceRoleClient()
    const { data: user } = await supabase
      .from('users')
      .select('id, username, email, profession_category, template_id, language, plan, role, is_active')
      .eq('id', payload.sub)
      .single()

    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Usuario no encontrado o desactivado' }, { status: 401 })
    }

    return NextResponse.json({ success: true, user })

  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
