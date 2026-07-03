/**
 * Auth Helpers - JWT sign, verify, password hashing
 */
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret')
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret')

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export async function generateAccessToken(user) {
  return new SignJWT({
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    plan: user.plan || 'free'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET)
}

export async function generateRefreshToken(user) {
  return new SignJWT({
    sub: user.id,
    type: 'refresh'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_REFRESH_SECRET)
}

export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
    return payload
  } catch {
    return null
  }
}

export function getTokenFromCookies(request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...val] = c.split('=')
      return [key, val.join('=')]
    })
  )
  return {
    accessToken: cookies['ppro_access_token'] || null,
    refreshToken: cookies['ppro_refresh_token'] || null
  }
}

export function setAuthCookies(response, accessToken, refreshToken) {
  const isProduction = process.env.NODE_ENV === 'production'
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  }

  response.cookies.set('ppro_access_token', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60, // 1 hora
  })

  response.cookies.set('ppro_refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  })

  return response
}

export function clearAuthCookies(response) {
  response.cookies.set('ppro_access_token', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  response.cookies.set('ppro_refresh_token', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
