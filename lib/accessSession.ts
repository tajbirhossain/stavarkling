import {
  ACCESS_SESSION_COOKIE,
  SESSION_TTL_MS,
} from '@/lib/accessAuth'
import { getSessionByToken, type AccessSessionRecord } from '@/lib/accessAuthDb'
import { cookies } from 'next/headers'

export async function getAccessSession(): Promise<AccessSessionRecord | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_SESSION_COOKIE)?.value
  if (!token) return null

  try {
    return await getSessionByToken(token)
  } catch (err) {
    console.error('access session lookup failed', err)
    return null
  }
}

export function buildAccessSessionCookie(token: string, expiresAt: Date) {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    name: ACCESS_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    expires: expiresAt,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  }
}
