import {
  parseAccessApplicationBody,
  createAccessApplication,
} from '@/lib/accessApplicationsRepo'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  return realIp || null
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.', errors: { form: 'Invalid request body.' } },
      { status: 400 }
    )
  }

  const draft = parseAccessApplicationBody(body)
  if (!draft) {
    return NextResponse.json(
      {
        error: 'Missing required fields.',
        errors: { form: 'Missing required application fields.' },
      },
      { status: 400 }
    )
  }

  // Prefer header key when present (standard idempotency), else body key
  const headerKey = request.headers.get('idempotency-key')?.trim()
  if (headerKey) {
    draft.idempotencyKey = headerKey
  }

  try {
    const result = await createAccessApplication({
      payload: {
        reflection: draft.reflection.trim() || null,
        fullName: draft.fullName,
        country: draft.country,
        email: draft.email,
        reason: draft.reason,
        idempotencyKey: draft.idempotencyKey,
      },
      clientIp: getClientIp(request),
      userAgent: request.headers.get('user-agent'),
    })

    if (!result.ok) {
      return NextResponse.json(
        {
          error:
            result.status === 409
              ? 'An active application already exists for this email.'
              : 'Validation failed.',
          errors: result.errors,
        },
        { status: result.status }
      )
    }

    return NextResponse.json(
      {
        application: {
          id: result.record.id,
          status: result.record.status,
          createdAt: result.record.createdAt,
        },
        replayed: result.record.replayed,
      },
      { status: result.record.replayed ? 200 : 201 }
    )
  } catch (err) {
    console.error('access-applications POST failed', err)
    return NextResponse.json(
      {
        error: 'Unable to submit application right now. Please try again.',
        errors: { form: 'Unable to submit application right now. Please try again.' },
      },
      { status: 503 }
    )
  }
}
