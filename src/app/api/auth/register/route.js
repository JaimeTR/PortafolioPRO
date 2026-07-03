import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceRoleClient } from '@/lib/supabase'
import { hashPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/lib/auth'
import { checkRateLimit, getRateLimitKey } from '@/lib/rateLimit'

const VALID_PROFESSIONS = [
  'medicina', 'odontologia', 'ing_sistemas', 'obstetricia',
  'ing_telecomunicaciones', 'ing_minera', 'derecho',
  'ing_naval', 'ciberseguridad', 'ing_mecanica',
  'economia', 'contabilidad', 'admin_empresas', 'ing_civil',
  'arquitectura', 'marketing', 'psicologia', 'educacion', 'otro'
]

const RegisterSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Solo letras minúsculas, números y _'),
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  profession_category: z.enum(VALID_PROFESSIONS),
  template_id: z.string().default('default'),
  language: z.enum(['es', 'en', 'bilingual']).default('es'),
})

export async function POST(request) {
  try {
    // Rate limiting
    const rlKey = getRateLimitKey(request, 'ip')
    const rl = await checkRateLimit(rlKey, 'register')
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos de registro. Intenta en 1 hora.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      )
    }

    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map(e => `${e.path}: ${e.message}`).join(', ')
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { username, email, password, profession_category, template_id, language } = parsed.data

    const supabase = createServiceRoleClient()

    // Verificar username único
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'El nombre de usuario ya está en uso' }, { status: 409 })
    }

    // Verificar email único
    const { data: existingEmail } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
    }

    // Crear usuario
    const passwordHash = await hashPassword(password)
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        profession_category,
        template_id,
        language,
        plan: 'free'
      })
      .select('*')
      .single()

    if (createError || !newUser) {
      console.error('Error creating user:', createError)
      return NextResponse.json({ error: 'Error al crear la cuenta' }, { status: 500 })
    }

    // Crear suscripción free por defecto
    await supabase.from('subscriptions').insert({
      user_id: newUser.id,
      plan: 'free',
      status: 'active'
    })

    // Si hay datos del CV, pre-llenar perfil y experiencia
    const cvData = body.cv_data
    if (cvData) {
      try {
        const profileUpdates = {}
        if (cvData.full_name) {
          profileUpdates.name_es = cvData.full_name
          profileUpdates.name_en = cvData.full_name
        }
        if (cvData.email) profileUpdates.email = cvData.email
        if (cvData.phone) profileUpdates.phone = cvData.phone
        if (cvData.whatsapp || cvData.phone) profileUpdates.whatsapp = cvData.whatsapp || cvData.phone
        if (cvData.linkedin) profileUpdates.linkedin_url = cvData.linkedin
        if (cvData.github) profileUpdates.github_url = cvData.github
        if (cvData.summary) {
          profileUpdates.about_me_paragraphs = [{ es: `<p>${cvData.summary}</p>`, en: cvData.summary_en ? `<p>${cvData.summary_en}</p>` : `<p>${cvData.summary}</p>` }]
        }

        if (Object.keys(profileUpdates).length > 0) {
          await supabase.from('profiles').update(profileUpdates).eq('user_id', newUser.id)
        }

        // Crear experiencias del CV
        if (cvData.experience?.length > 0) {
          const experiences = cvData.experience.slice(0, 5).map((exp, i) => ({
            user_id: newUser.id,
            role_es: exp.role || '',
            role_en: exp.role || '',
            company_es: exp.company || '',
            company_en: exp.company || '',
            description_es: exp.description || '',
            description_en: exp.description || '',
            date_es: exp.date || '',
            date_en: exp.date || '',
            sort_order: i,
            is_active: true,
            is_featured: true
          }))
          await supabase.from('experiences').insert(experiences)
        }

        // Crear skills del CV
        if (cvData.skills?.length > 0) {
          const skills = cvData.skills.slice(0, 10).map((s, i) => ({
            user_id: newUser.id,
            name: s,
            category: 'Profesional',
            icon_name: 'star',
            proficiency: 80,
            sort_order: i
          }))
          await supabase.from('skills').insert(skills)
        }
      } catch (cvError) {
        console.warn('CV data fill error:', cvError.message)
      }
    }

    // Generar tokens
    const userPayload = { ...newUser, role: 'user' }
    const accessToken = await generateAccessToken(userPayload)
    const refreshToken = await generateRefreshToken(userPayload)

    // Guardar refresh token en DB
    await supabase.from('refresh_tokens').insert({
      user_id: newUser.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })

    // Setear cookies
    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profession_category: newUser.profession_category,
        template_id: newUser.template_id,
        language: newUser.language,
        plan: newUser.plan
      }
    }, { status: 201 })

    return setAuthCookies(response, accessToken, refreshToken)

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
