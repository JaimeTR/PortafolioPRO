import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { clearAuthCookies } from '@/lib/auth'

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    let refreshToken = null
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(c => {
          const [key, ...val] = c.split('=')
          return [key, val.join('=')]
        })
      )
      refreshToken = cookies['ppro_refresh_token'] || null
    }

    if (refreshToken) {
      const supabase = createServiceRoleClient()
      await supabase
        .from('refresh_tokens')
        .update({ revoked: true })
        .eq('token', refreshToken)
    }

    const response = NextResponse.json({ success: true })
    return clearAuthCookies(response)

  } catch (error) {
    const response = NextResponse.json({ success: true })
    return clearAuthCookies(response)
  }
}
