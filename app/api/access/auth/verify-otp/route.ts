import {
  normalizeEmail,
  validateAccessEmail,
  validateOtpCode,
} from '@/lib/accessAuth'
import { verifyOtpChallenge } from '@/lib/accessAuthDb'
import { buildAccessSessionCookie } from '@/lib/accessSession'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    )
  }

  const email =
    body && typeof body === 'object' && 'email' in body
      ? String((body as { email: unknown }).email ?? '')
      : ''
  const code =
    body && typeof body === 'object' && 'code' in body
      ? String((body as { code: unknown }).code ?? '')
      : ''

  const emailError = validateAccessEmail(email)
  const codeError = validateOtpCode(code)

  if (emailError || codeError) {
    return NextResponse.json(
      {
        error: emailError || codeError,
        errors: {
          ...(emailError ? { email: emailError } : {}),
          ...(codeError ? { code: codeError } : {}),
        },
      },
      { status: 400 }
    )
  }

  try {
    const result = await verifyOtpChallenge({
      email: normalizeEmail(email),
      code,
    })

    if (!result.ok) {
      const messages = {
        not_found: 'Request a new code and try again.',
        expired: 'This code has expired. Request a new one.',
        invalid: 'That code is incorrect. Please try again.',
        too_many_attempts:
          'Too many attempts. Request a new code to continue.',
      } as const

      return NextResponse.json(
        {
          error: messages[result.reason],
          errors: { code: messages[result.reason] },
        },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      ok: true,
      accessStage: result.applicant.accessStage,
      panelStage: result.applicant.panelStage,
      message: 'Access granted.',
    })

    response.cookies.set(
      buildAccessSessionCookie(result.sessionToken, result.expiresAt)
    )

    return response
  } catch (err) {
    console.error('verify-otp failed', err)
    return NextResponse.json(
      {
        error: 'Unable to verify the code right now. Please try again.',
        errors: {
          form: 'Unable to verify the code right now. Please try again.',
        },
      },
      { status: 503 }
    )
  }
}
