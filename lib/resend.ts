import { Resend } from 'resend'

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
