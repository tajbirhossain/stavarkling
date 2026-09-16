import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'crypto'

export const ACCESS_SESSION_COOKIE = 'stavarkling_access_session'
export const OTP_LENGTH = 6
export const OTP_TTL_MS = 10 * 60 * 1000
export const OTP_MAX_ATTEMPTS = 5
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function getAuthSecret() {
  const secret = process.env.ACCESS_AUTH_SECRET
  if (!secret || secret.length < 16) {
    throw new Error(
      'ACCESS_AUTH_SECRET is missing or too short. Add a long random string to .env.local.'
    )
  }
  return secret
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function validateAccessEmail(email: string): string | null {
  const value = email.trim()
  if (!value) return 'Email address is required.'
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.'
  if (value.length > 254) return 'Email address is too long.'
  return null
}

export function validateOtpCode(code: string): string | null {
  const value = code.trim()
  if (!value) return 'Enter the code from your email.'
  if (!/^\d{6}$/.test(value)) return 'Enter the 6-digit code.'
  return null
}

export function hashSecret(value: string) {
  return createHmac('sha256', getAuthSecret()).update(value).digest('hex')
}

export function safeEqualHex(a: string, b: string) {
  try {
    const left = Buffer.from(a, 'hex')
    const right = Buffer.from(b, 'hex')
    if (left.length !== right.length) return false
    return timingSafeEqual(left, right)
  } catch {
    return false
  }
}

export function generateOtpCode() {
  const max = 10 ** OTP_LENGTH
  return String(randomInt(0, max)).padStart(OTP_LENGTH, '0')
}

export function generateSessionToken() {
  return randomBytes(32).toString('hex')
}

export function otpExpiresAt(from = new Date()) {
  return new Date(from.getTime() + OTP_TTL_MS)
}

export function sessionExpiresAt(from = new Date()) {
  return new Date(from.getTime() + SESSION_TTL_MS)
}
