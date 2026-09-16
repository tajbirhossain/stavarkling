import {
  normalizeEmail,
  validateAccessEmail,
} from '@/lib/accessAuth'
import {
  createOtpChallenge,
  findApplicantByEmail,
} from '@/lib/accessAuthDb'
import { sendAccessOtpEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')?.trim() || null
}

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

  const emailError = validateAccessEmail(email)
  if (emailError) {
    return NextResponse.json(
      { error: emailError, errors: { email: emailError } },
      { status: 400 }
    )
  }

  try {
    const applicant = await findApplicantByEmail(email)
    if (!applicant) {
      return NextResponse.json(
        {
          error: 'No application was found for this email address.',
          errors: {
            email: 'No application was found for this email address.',
          },
        },
        { status: 404 }
      )
    }

    const challenge = await createOtpChallenge({
      applicant,
      clientIp: getClientIp(request),
    })

    if (!challenge.ok) {
      return NextResponse.json(
        {
          error: `Please wait ${challenge.retryAfterSeconds}s before requesting another code.`,
          errors: {
            form: `Please wait ${challenge.retryAfterSeconds}s before requesting another code.`,
          },
          retryAfterSeconds: challenge.retryAfterSeconds,
        },
        { status: 429 }
      )
    }

    await sendAccessOtpEmail({
      to: applicant.email,
      code: challenge.code,
    })

    return NextResponse.json({
      ok: true,
      email: normalizeEmail(email),
      expiresAt: challenge.expiresAt.toISOString(),
      message: 'A verification code has been sent to your email.',
    })
  } catch (err) {
    console.error('request-otp failed', err)
    return NextResponse.json(
      {
        error: 'Unable to send a verification code right now. Please try again.',
        errors: {
          form: 'Unable to send a verification code right now. Please try again.',
        },
      },
      { status: 503 }
    )
  }
}
