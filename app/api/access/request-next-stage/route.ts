import { getAccessSession } from '@/lib/accessSession'
import {
  createStageRequest,
  getStageRequest,
} from '@/lib/accessStageRequests'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function clientIpFrom(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    return first || null
  }
  return null
}

export async function GET() {
  const session = await getAccessSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const request = await getStageRequest(
      session.applicationId,
      session.accessStage
    )

    return NextResponse.json({
      alreadyRequested: Boolean(request),
      requestedAt: request?.requestedAt?.toISOString() ?? null,
    })
  } catch (err) {
    console.error('get stage request failed', err)
    return NextResponse.json(
      { error: 'Unable to check request status right now.' },
      { status: 503 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getAccessSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const result = await createStageRequest({
      applicationId: session.applicationId,
      fromStage: session.accessStage,
      clientIp: clientIpFrom(request),
      userAgent: request.headers.get('user-agent'),
    })

    if (result.alreadyExisted) {
      return NextResponse.json(
        {
          alreadyRequested: true,
          message:
            'Your request has already been received. Patience is part of the process.',
          requestedAt: result.request.requestedAt.toISOString(),
        },
        { status: 409 }
      )
    }

    return NextResponse.json({
      alreadyRequested: true,
      message:
        'Your request has been received. We will continue when the moment is right.',
      requestedAt: result.request.requestedAt.toISOString(),
    })
  } catch (err) {
    console.error('create stage request failed', err)
    return NextResponse.json(
      {
        error: 'Unable to submit your request right now. Please try again.',
      },
      { status: 503 }
    )
  }
}
