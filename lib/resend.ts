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

/** Sent to the artist's inbox when a collector requests the private acquisition. */
export async function sendAcquisitionEnquiryAlertEmail(input: {
  fullName: string
  email: string
  country: string | null
  message: string | null
}) {
  const resend = getResend()
  const who = `${input.fullName} <${input.email}>${input.country ? ` - ${input.country}` : ''}`
  const messageHtml = input.message
    ? `<p style="margin:0 0 14px;"><strong>Their message</strong><br />${escapeHtml(input.message).replace(/\n/g, '<br />')}</p>`
    : ''

  const { error } = await resend.emails.send({
    from: getFromEmail(),
    to: LEGAL.contactEmail,
    replyTo: input.email,
    subject: `Private acquisition request - ${input.fullName}`,
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; font-size:16px; line-height:1.6; color:#2a2a2a; max-width:560px;">
        <p style="margin:0 0 18px;">A collector has requested the private acquisition of Stavarkle #1 for &euro;1,000,000. Please reply within 24 hours. It is also in the admin panel.</p>
        <p style="margin:0 0 14px;"><strong>Collector</strong><br />${escapeHtml(who)}</p>
        ${messageHtml}
      </div>
    `,
    text: [
      'A collector has requested the private acquisition of Stavarkle #1 for EUR 1,000,000. Please reply within 24 hours. It is also in the admin panel.',
      '',
      `Collector: ${who}`,
      input.message ? `Their message: ${input.message}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}

/** Confirmation to the collector that their private acquisition request was received. */
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
    subject: 'Your private acquisition request has been received',
    html: `
      <div style="font-family: Georgia, 'Times New Roman', serif; background:#f1e7e8; padding:40px 20px; color:#2a2a2a;">
        <div style="max-width:520px; margin:0 auto; background:#fff; border:1px solid rgba(154,35,73,0.2); border-radius:12px; padding:40px 36px;">
          <p style="margin:0 0 12px; text-align:center; color:#9a2349; letter-spacing:0.22em; font-size:12px; text-transform:uppercase;">Private Acquisition</p>
          <h1 style="margin:0 0 24px; text-align:center; font-size:28px; font-weight:500;">Your request has been received</h1>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">Dear ${escapeHtml(first)},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            Thank you. You have expressed your interest in acquiring
            <em>Stavarkle #1 &mdash; Universe. Decided.</em> for &euro;1,000,000.
            The artist will be in touch with you personally within 24 hours.
          </p>
          <p style="margin:24px 0 8px; color:#9a2349; letter-spacing:0.16em; font-size:12px; text-transform:uppercase;">What happens next</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            The purchase agreement, payment, documentation and delivery of the artwork
            are all arranged privately between you and the artist. No payment is taken
            through the website, and no bank details are ever shown on it.
          </p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.65;">
            Your request does not create a binding purchase agreement, reserve the
            artwork or transfer ownership.
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
      'Thank you. You have expressed your interest in acquiring Stavarkle #1 - Universe. Decided. for EUR 1,000,000. The artist will be in touch with you personally within 24 hours.',
      '',
      'What happens next: the purchase agreement, payment, documentation and delivery of the artwork are all arranged privately between you and the artist. No payment is taken through the website, and no bank details are ever shown on it.',
      '',
      'Your request does not create a binding purchase agreement, reserve the artwork or transfer ownership.',
      '',
      `Questions: ${contact}`,
    ].join('\n'),
  })

  if (error) {
    throw new Error(error.message || 'Failed to send email')
  }
}
