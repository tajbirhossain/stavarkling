import { getAccessSession } from '@/lib/accessSession'
import {
  createAcquisitionEnquiry,
  getApplicantForEmail,
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

export async function POST(request: Request) {
  const session = await getAccessSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // Only the member who has entered the final panel can make the request.
  if (session.accessStage < 3 || session.panelStage < 3) {
    return NextResponse.json(
      { error: 'This step is not available yet.' },
      { status: 403 }
    )
  }

  const body = (await request.json().catch(() => null)) as {
    message?: unknown
  } | null
  const message =
    typeof body?.message === 'string' && body.message.trim()
      ? body.message.trim().slice(0, 2000)
      : null

  try {
    const { created, enquiry } = await createAcquisitionEnquiry({
      applicationId: session.applicationId,
      message,
      clientIp: clientIpFrom(request),
      userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
    })

    // Emails are best-effort: the request is already safely stored.
    if (created) {
      try {
        const applicant = await getApplicantForEmail(session.applicationId)
        if (applicant) {
          const results = await Promise.allSettled([
            sendAcquisitionEnquiryAlertEmail({
              fullName: applicant.full_name,
              email: applicant.email,
              country: applicant.country,
              message,
            }),
            sendAcquisitionConfirmationEmail({
              to: applicant.email,
              fullName: applicant.full_name,
            }),
          ])
          for (const r of results) {
            if (r.status === 'rejected') {
              console.error('acquisition email failed', r.reason)
            }
          }
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
      { error: 'Unable to send your request right now. Please try again.' },
      { status: 503 }
    )
  }
}
