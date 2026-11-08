import { getAccessSession } from '@/lib/accessSession'
import {
  CONTACT_METHODS,
  createAcquisitionEnquiry,
  getApplicantForEmail,
  type ContactMethod,
} from '@/lib/acquisitionEnquiries'
import {
  sendAcquisitionConfirmationEmail,
  sendAcquisitionEnquiryAlertEmail,
} from '@/lib/resend'
import { isIP } from 'node:net'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function clientIpFrom(request: Request): string | null {
  const first = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return first && isIP(first) ? first : null
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : null
}

export async function POST(request: Request) {
  const session = await getAccessSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // Only the member who has entered the final panel can begin the conversation.
  if (session.accessStage < 3 || session.panelStage < 3) {
    return NextResponse.json(
      { error: 'This step is not available yet.' },
      { status: 403 }
    )
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null

  const placeAnswer = clean(body?.placeAnswer, 2000)
  if (!placeAnswer) {
    return NextResponse.json(
      { error: 'Please tell us where you would place the artwork.' },
      { status: 400 }
    )
  }

  const contactMethod: ContactMethod = CONTACT_METHODS.includes(
    body?.contactMethod as ContactMethod
  )
    ? (body?.contactMethod as ContactMethod)
    : 'email'

  const drawAnswer = clean(body?.drawAnswer, 2000)
  const contactDetail = clean(body?.contactDetail, 200)
  const bestTime = clean(body?.bestTime, 200)

  try {
    const { created, enquiry } = await createAcquisitionEnquiry({
      applicationId: session.applicationId,
      placeAnswer,
      drawAnswer,
      contactMethod,
      contactDetail,
      bestTime,
      clientIp: clientIpFrom(request),
      userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
    })

    // Emails are best-effort: the enquiry is already safely stored.
    if (created) {
      try {
        const applicant = await getApplicantForEmail(session.applicationId)
        if (applicant) {
          await Promise.allSettled([
            sendAcquisitionEnquiryAlertEmail({
              fullName: applicant.full_name,
              email: applicant.email,
              country: applicant.country,
              placeAnswer,
              drawAnswer,
              contactMethod,
              contactDetail,
              bestTime,
            }),
            sendAcquisitionConfirmationEmail({
              to: applicant.email,
              fullName: applicant.full_name,
            }),
          ])
        }
      } catch (err) {
        console.error('acquisition emails failed', err)
      }
    }

    return NextResponse.json({
      ok: true,
      status: enquiry.status,
      createdAt: enquiry.createdAt.toISOString(),
    })
  } catch (err) {
    console.error('create acquisition enquiry failed', err)
    return NextResponse.json(
      { error: 'Unable to begin the conversation right now. Please try again.' },
      { status: 503 }
    )
  }
}
