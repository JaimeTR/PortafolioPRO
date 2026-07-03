import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, setAuthCookies, getTokenFromCookies } from '@/lib/auth'

export async function POST(request) {
  try {
    const { refreshToken } = getTokenFromCookies(request)

    if (!refreshToken) {
      return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 })
    }

    // Verificar firma del refresh token
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: 'Sesión expirada, inicia de nuevo' }, { status: 401 })
    }

    const supabase = createServiceRoleClient()

    // Verificar token en DB (no revocado)
    const { data: storedToken } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('revoked', false)
      .single()

    if (!storedToken) {
      return NextResponse.json({ error: 'Token inválido o revocado' }, { status: 401 })
    }

    // Verificar expiración
    if (new Date(storedToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Sesión expirada' }, { status: 401 })
    }

    // Rotación: revocar token viejo
    await supabase
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('id', storedToken.id)

    // Buscar usuario
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.sub)
      .single()

    if (!user || !user.is_active) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
    }

    // Generar nuevos tokens
    const userPayload = { id: user.id, username: user.username, email: user.email, role: 'user', plan: user.plan }
    const newAccessToken = await generateAccessToken(userPayload)
    const newRefreshToken = await generateRefreshToken(userPayload)

    // Guardar nuevo refresh token
    await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })

    const response = NextResponse.json({ success: true })
    return setAuthCookies(response, newAccessToken, newRefreshToken)

  } catch (error) {
    console.error('Refresh error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
