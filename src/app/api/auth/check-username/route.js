import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ available: false, error: 'username requerido' }, { status: 400 })
  }

  if (username.length < 3) {
    return NextResponse.json({ available: false, error: 'Mínimo 3 caracteres' })
  }

  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('username', username.toLowerCase())
    .maybeSingle()

  return NextResponse.json({
    available: !data,
    username: username.toLowerCase()
  })
}
