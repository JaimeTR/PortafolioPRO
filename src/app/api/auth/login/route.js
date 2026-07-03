import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase'
import { comparePassword, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth'
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit'

const LoginSchema = z.object({
  email: z.string().min(1, 'Email o usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export async function POST(request) {
  try {
    const rlKey = getRateLimitKey(request, 'ip')
    const rl = await checkRateLimit(rlKey, 'login')
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      )
    }

    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Email/usuario y contraseña requeridos' }, { status: 400 })
    }

    const { email, password } = parsed.data
    const supabase = createServiceRoleClient()

    // Buscar por email O username
    const isEmail = email.includes('@')
    let query = supabase.from('users').select('*')
    if (isEmail) {
      query = query.eq('email', email)
    } else {
      query = query.eq('username', email.toLowerCase())
    }
    const { data: user } = await query.single()

    if (!user) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    if (!user.is_active) {
      return NextResponse.json({ error: 'Cuenta desactivada. Contacta al soporte.' }, { status: 403 })
    }

    const validPassword = await comparePassword(password, user.password_hash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Generar tokens
    const userPayload = { id: user.id, username: user.username, email: user.email, role: 'user', plan: user.plan }
    const accessToken = await generateAccessToken(userPayload)
    const refreshToken = await generateRefreshToken(userPayload)

    // Guardar refresh token
    await supabase.from('refresh_tokens').insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        profession_category: user.profession_category,
        template_id: user.template_id,
        language: user.language,
        plan: user.plan
      }
    })

    return setAuthCookies(response, accessToken, refreshToken)

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
