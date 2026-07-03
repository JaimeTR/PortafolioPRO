import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'username requerido' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  const { data: user } = await supabase
    .from('users')
    .select('id, plan, is_active')
    .eq('username', username)
    .single()

  if (!user || !user.is_active) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Solo premium tiene chatbot habilitado
  if (user.plan !== 'premium') {
    return NextResponse.json({ success: true, data: { is_enabled: false } })
  }

  const { data: config } = await supabase
    .from('chatbot_configs')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!config || config.is_enabled === false) {
    return NextResponse.json({ success: true, data: { is_enabled: false } })
  }

  return NextResponse.json({ success: true, data: config })
}
