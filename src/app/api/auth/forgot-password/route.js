import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const rlKey = getRateLimitKey(request, 'ip')
    const rl = await checkRateLimit(rlKey, 'login')
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Demasiados intentos. Intenta en 15 minutos.' }, { status: 429 })
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Buscar por email o username
    const isEmail = email.includes('@')
    let query = supabase.from('users').select('id, email, username')
    if (isEmail) query = query.eq('email', email)
    else query = query.eq('username', email.toLowerCase())
    const { data: user } = await query.single()

    // Siempre devolver éxito para no revelar si el usuario existe
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Si el usuario existe, recibirás un link de recuperación.'
      })
    }

    // Generar token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hora

    // Guardar en DB (usamos una tabla simple con upsert en refresh_tokens o una tabla dedicada)
    const { error } = await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token: `pwreset_${token}`,
      expires_at: expiresAt,
      revoked: false
    })

    if (error) {
      return NextResponse.json({ error: 'Error al generar token' }, { status: 500 })
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}&id=${user.id}`

    return NextResponse.json({
      success: true,
      message: 'Link de recuperación generado.',
      resetUrl
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
