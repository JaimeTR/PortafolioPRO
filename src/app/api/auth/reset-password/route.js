import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export async function POST(request) {
  try {
    const { token, userId, password } = await request.json()

    if (!token || !userId || !password) {
      return NextResponse.json({ error: 'Token, usuario y contraseña requeridos' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Verificar token
    const { data: storedToken } = await supabase
      .from('refresh_tokens')
      .select('*')
      .eq('token', `pwreset_${token}`)
      .eq('user_id', userId)
      .eq('revoked', false)
      .single()

    if (!storedToken) {
      return NextResponse.json({ error: 'Token inválido o ya usado' }, { status: 400 })
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'El token ha expirado. Solicita uno nuevo.' }, { status: 400 })
    }

    // Actualizar contraseña
    const passwordHash = await hashPassword(password)
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', userId)

    if (updateError) {
      return NextResponse.json({ error: 'Error al actualizar contraseña' }, { status: 500 })
    }

    // Revocar token
    await supabase
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('id', storedToken.id)

    // Invalidar todas las sesiones activas del usuario
    await supabase
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('user_id', userId)
      .eq('revoked', false)

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada. Todas las sesiones han sido cerradas.'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
