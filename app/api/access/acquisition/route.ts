import { getAccessSession } from '@/lib/accessSession'
import {
  createAcquisitionEnquiry,
  getApplicantForEmail,
  markConfirmationSent,
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

  // Only the member who has entered the final panel can send the enquiry.
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

    let confirmationSent = Boolean(enquiry.confirmationSentAt)
    let confirmationEmail: string | null = null

    // Emails are best-effort: the enquiry is already safely stored.
    try {
      const applicant = await getApplicantForEmail(session.applicationId)
      if (applicant) {
        confirmationEmail = applicant.email

        if (created) {
          const [alert, confirmation] = await Promise.allSettled([
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

          if (alert.status === 'rejected') {
            console.error('acquisition alert email failed', alert.reason)
          }
          if (confirmation.status === 'rejected') {
            console.error('acquisition confirmation email failed', confirmation.reason)
          } else {
            confirmationSent = true
            await markConfirmationSent(enquiry.id).catch((err) =>
              console.error('mark confirmation sent failed', err)
            )
          }
        }
      }
    } catch (err) {
      console.error('acquisition emails failed', err)
    }

    return NextResponse.json({
      ok: true,
      status: enquiry.status,
      createdAt: enquiry.createdAt.toISOString(),
      confirmationSent,
      confirmationEmail: confirmationSent ? confirmationEmail : null,
    })
  } catch (err) {
    console.error('create acquisition enquiry failed', err)
    return NextResponse.json(
      { error: 'Unable to send your enquiry right now. Please try again.' },
      { status: 503 }
    )
  }
}
