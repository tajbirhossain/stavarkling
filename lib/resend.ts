import { Resend } from 'resend'
import { LEGAL } from '@/lib/legal'

let resendClient: Resend | null = null

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set.')
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

function getFromEmail() {
  const from = process.env.RESEND_FROM_EMAIL
  if (!from) {
    throw new Error(
      'RESEND_FROM_EMAIL is not set. Example: Stavarkling Access <access@yourdomain.com>'
    )
  }
  return from
}

export async function sendAccessOtpEmail(input: {
  to: string
  code: string
}) {
  const resend = getResend()

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: input.to,
    subject: 'Your Stavarkling access code',
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; background:#f1e7e8; padding:40px 20px; color:#2a2a2a;">
        <div style="max-width:480px; margin:0 auto; background:#fff; border:1px solid rgba(154,35,73,0.2); border-radius:12px; padding:40px 36px; text-align:center;">
          <p style="margin:0 0 12px; color:#9a2349; letter-spacing:0.22em; font-size:12px; text-transform:uppercase;">Private Access</p>
          <h1 style="margin:0 0 24px; font-size:28px; font-weight:500;">Your entry code</h1>
          <p style="margin:0 0 28px; font-size:16px; line-height:1.6; color:#5a5354;">
            Use this code to continue into the Access section. It expires in 10 minutes.
          </p>
          <p style="margin:0 0 28px; font-size:36px; letter-spacing:0.35em; color:#9a2349; font-weight:600;">
            ${input.code}
          </p>
          <p style="margin:0; font-size:14px; line-height:1.6; color:#767676; font-style:italic;">
            If you did not request this, you may ignore this message.
          </p>
        </div>
      </div>
    `,
    text: `Your Stavarkling access code is ${input.code}. It expires in 10 minutes.`,
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Sent once when a new access application is saved. Tells the applicant it was
 * received, that it is under personal review, and exactly what happens next.
 */
export async function sendApplicationReceivedEmail(input: {
  to: string
  fullName: string
}) {
  const resend = getResend()
  const firstName = escapeHtml(input.fullName.trim().split(/\s+/)[0] || 'there')
  const contact = LEGAL.contactEmail

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: input.to,
    replyTo: contact,
    subject: 'Your Stavarkling request has been received',
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; background:#f1e7e8; padding:40px 20px; color:#2a2a2a;">
        <div style="max-width:520px; margin:0 auto; background:#fff; border:1px solid rgba(154,35,73,0.2); border-radius:12px; padding:40px 36px;">
          <p style="margin:0 0 12px; text-align:center; color:#9a2349; letter-spacing:0.22em; font-size:12px; text-transform:uppercase;">Private Access</p>
          <h1 style="margin:0 0 24px; text-align:center; font-size:28px; font-weight:500;">Request received</h1>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">Dear ${firstName},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            Thank you. Your request for private access to <em>Stavarkle #1 &mdash; Universe. Decided.</em>
            has been received and is now under review.
          </p>
          <p style="margin:24px 0 8px; color:#9a2349; letter-spacing:0.16em; font-size:12px; text-transform:uppercase;">What happens next</p>
          <ol style="margin:0 0 20px; padding-left:20px; font-size:16px; line-height:1.65;">
            <li style="margin-bottom:8px;">Every request is reviewed personally.</li>
            <li style="margin-bottom:8px;">If access is granted, you will hear from me by email.</li>
            <li style="margin-bottom:8px;">You can then enter Access with this email address and a one-time code sent to it.</li>
          </ol>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            There is nothing further you need to do. The outcome of the experiment remains open.
          </p>
          <p style="margin:24px 0 0; font-size:14px; line-height:1.6; color:#767676; font-style:italic;">
            If you did not make this request, you can safely ignore this message. Questions: ${escapeHtml(contact)}.
          </p>
        </div>
      </div>
    `,
    text: [
      `Dear ${input.fullName.trim().split(/\s+/)[0] || 'there'},`,
      '',
      'Thank you. Your request for private access to Stavarkle #1 - Universe. Decided. has been received and is now under review.',
      '',
      'What happens next:',
      '1. Every request is reviewed personally.',
      '2. If access is granted, you will hear from me by email.',
      '3. You can then enter Access with this email address and a one-time code sent to it.',
      '',
      'There is nothing further you need to do. The outcome of the experiment remains open.',
      '',
      `If you did not make this request, you can safely ignore this message. Questions: ${contact}`,
    ].join('\n'),
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}

/** Sent to the artist's inbox when a collector begins the private conversation. */
export async function sendAcquisitionEnquiryAlertEmail(input: {
  fullName: string
  email: string
  country: string | null
  placeAnswer: string
  drawAnswer: string | null
  contactMethod: string
  contactDetail: string | null
  bestTime: string | null
}) {
  const resend = getResend()
  const row = (label: string, value: string | null) =>
    value
      ? `<p style="margin:0 0 14px;"><strong>${label}</strong><br />${escapeHtml(value).replace(/\n/g, '<br />')}</p>`
      : ''

  const who = `${input.fullName} <${input.email}>${input.country ? ` - ${input.country}` : ''}`
  const how = `${input.contactMethod}${input.contactDetail ? ` - ${input.contactDetail}` : ''}`

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: LEGAL.contactEmail,
    replyTo: input.email,
    subject: `Private acquisition enquiry - ${input.fullName}`,
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; line-height:1.6; color:#2a2a2a; max-width:560px;">
        <p style="margin:0 0 18px;">A collector has begun the private conversation. Please reply within 24 hours.</p>
        ${row('Collector', who)}
        ${row('Where they would place it', input.placeAnswer)}
        ${row('What drew them to it', input.drawAnswer)}
        ${row('Preferred contact', how)}
        ${row('Best time', input.bestTime)}
      </div>
    `,
    text: [
      'A collector has begun the private conversation. Please reply within 24 hours.',
      '',
      `Collector: ${who}`,
      `Where they would place it: ${input.placeAnswer}`,
      input.drawAnswer ? `What drew them to it: ${input.drawAnswer}` : '',
      `Preferred contact: ${how}`,
      input.bestTime ? `Best time: ${input.bestTime}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}

/** Confirmation to the collector that their private conversation has begun. */
export async function sendAcquisitionConfirmationEmail(input: {
  to: string
  fullName: string
}) {
  const resend = getResend()
  const first = input.fullName.trim().split(/\s+/)[0] || 'there'
  const contact = LEGAL.contactEmail

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: input.to,
    replyTo: contact,
    subject: 'Your private conversation has begun',
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; background:#f1e7e8; padding:40px 20px; color:#2a2a2a;">
        <div style="max-width:520px; margin:0 auto; background:#fff; border:1px solid rgba(154,35,73,0.2); border-radius:12px; padding:40px 36px;">
          <p style="margin:0 0 12px; text-align:center; color:#9a2349; letter-spacing:0.22em; font-size:12px; text-transform:uppercase;">Private Acquisition</p>
          <h1 style="margin:0 0 24px; text-align:center; font-size:28px; font-weight:500;">The conversation has begun</h1>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">Dear ${escapeHtml(first)},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            Thank you. The artist will reply to you personally within 24 hours.
          </p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            Your enquiry does not confirm a purchase, reserve the artwork or transfer ownership.
          </p>
          <p style="margin:24px 0 0; font-size:14px; line-height:1.6; color:#767676; font-style:italic;">
            Questions: ${escapeHtml(contact)}.
          </p>
        </div>
      </div>
    `,
    text: [
      `Dear ${first},`,
      '',
      'Thank you. The artist will reply to you personally within 24 hours.',
      'Your enquiry does not confirm a purchase, reserve the artwork or transfer ownership.',
      '',
      `Questions: ${contact}`,
    ].join('\n'),
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}
