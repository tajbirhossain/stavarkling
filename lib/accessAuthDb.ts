import {
  generateOtpCode,
  generateSessionToken,
  hashSecret,
  normalizeEmail,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  otpExpiresAt,
  safeEqualHex,
  sessionExpiresAt,
} from '@/lib/accessAuth'
import { withClient, withTransaction } from '@/lib/db'
import type { AccessStage } from '@/lib/accessStages'

export type AccessApplicant = {
  id: string
  email: string
  emailNormalized: string
  fullName: string
  accessStage: AccessStage
  status: string
}

export type AccessSessionRecord = {
  id: string
  emailNormalized: string
  applicationId: string
  accessStage: AccessStage
  fullName: string
}

type ApplicationRow = {
  id: string
  email: string
  email_normalized: string
  full_name: string
  access_stage: number
  status: string
}

export async function findApplicantByEmail(
  email: string
): Promise<AccessApplicant | null> {
  const emailNormalized = normalizeEmail(email)

  return withClient(async (client) => {
    const result = await client.query<ApplicationRow>(
      `SELECT id, email, email_normalized, full_name, access_stage, status
       FROM access_applications
       WHERE email_normalized = $1
       ORDER BY
         CASE status
           WHEN 'approved' THEN 0
           WHEN 'under_review' THEN 1
           WHEN 'pending' THEN 2
           ELSE 3
         END,
         created_at DESC
       LIMIT 1`,
      [emailNormalized]
    )

    const row = result.rows[0]
    if (!row) return null

    return {
      id: row.id,
      email: row.email,
      emailNormalized: row.email_normalized,
      fullName: row.full_name,
      accessStage: row.access_stage as AccessStage,
      status: row.status,
    }
  })
}

export async function createOtpChallenge(input: {
  applicant: AccessApplicant
  clientIp: string | null
}): Promise<
  | { ok: true; code: string; expiresAt: Date }
  | { ok: false; reason: 'cooldown'; retryAfterSeconds: number }
> {
  return withTransaction(async (client) => {
    const recent = await client.query<{ created_at: Date }>(
      `SELECT created_at
       FROM access_otp_challenges
       WHERE email_normalized = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [input.applicant.emailNormalized]
    )

    const last = recent.rows[0]
    if (last) {
      const elapsed = Date.now() - last.created_at.getTime()
      if (elapsed < OTP_RESEND_COOLDOWN_MS) {
        return {
          ok: false as const,
          reason: 'cooldown' as const,
          retryAfterSeconds: Math.ceil(
            (OTP_RESEND_COOLDOWN_MS - elapsed) / 1000
          ),
        }
      }
    }

    // Invalidate unused challenges for this email
    await client.query(
      `UPDATE access_otp_challenges
       SET consumed_at = now()
       WHERE email_normalized = $1
         AND consumed_at IS NULL`,
      [input.applicant.emailNormalized]
    )

    const code = generateOtpCode()
    const expiresAt = otpExpiresAt()

    await client.query(
      `INSERT INTO access_otp_challenges (
         email_normalized,
         application_id,
         code_hash,
         expires_at,
         request_ip
       ) VALUES ($1, $2, $3, $4, $5::inet)`,
      [
        input.applicant.emailNormalized,
        input.applicant.id,
        hashSecret(code),
        expiresAt.toISOString(),
        input.clientIp,
      ]
    )

    return { ok: true as const, code, expiresAt }
  })
}

export async function verifyOtpChallenge(input: {
  email: string
  code: string
}): Promise<
  | { ok: true; applicant: AccessApplicant; sessionToken: string; expiresAt: Date }
  | {
      ok: false
      reason: 'not_found' | 'expired' | 'invalid' | 'too_many_attempts'
    }
> {
  const emailNormalized = normalizeEmail(input.email)
  const codeHash = hashSecret(input.code.trim())

  return withTransaction(async (client) => {
    const challengeResult = await client.query<{
      id: string
      application_id: string
      code_hash: string
      expires_at: Date
      attempt_count: number
    }>(
      `SELECT id, application_id, code_hash, expires_at, attempt_count
       FROM access_otp_challenges
       WHERE email_normalized = $1
         AND consumed_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [emailNormalized]
    )

    const challenge = challengeResult.rows[0]
    if (!challenge) return { ok: false as const, reason: 'not_found' as const }

    if (challenge.expires_at.getTime() < Date.now()) {
      await client.query(
        `UPDATE access_otp_challenges SET consumed_at = now() WHERE id = $1`,
        [challenge.id]
      )
      return { ok: false as const, reason: 'expired' as const }
    }

    if (challenge.attempt_count >= OTP_MAX_ATTEMPTS) {
      await client.query(
        `UPDATE access_otp_challenges SET consumed_at = now() WHERE id = $1`,
        [challenge.id]
      )
      return { ok: false as const, reason: 'too_many_attempts' as const }
    }

    if (!safeEqualHex(challenge.code_hash, codeHash)) {
      await client.query(
        `UPDATE access_otp_challenges
         SET attempt_count = attempt_count + 1
         WHERE id = $1`,
        [challenge.id]
      )
      return { ok: false as const, reason: 'invalid' as const }
    }

    await client.query(
      `UPDATE access_otp_challenges SET consumed_at = now() WHERE id = $1`,
      [challenge.id]
    )

    const appResult = await client.query<ApplicationRow>(
      `SELECT id, email, email_normalized, full_name, access_stage, status
       FROM access_applications
       WHERE id = $1
       LIMIT 1`,
      [challenge.application_id]
    )

    const row = appResult.rows[0]
    if (!row) return { ok: false as const, reason: 'not_found' as const }

    const sessionToken = generateSessionToken()
    const expiresAt = sessionExpiresAt()

    await client.query(
      `INSERT INTO access_sessions (
         email_normalized,
         application_id,
         token_hash,
         expires_at
       ) VALUES ($1, $2, $3, $4)`,
      [
        row.email_normalized,
        row.id,
        hashSecret(sessionToken),
        expiresAt.toISOString(),
      ]
    )

    return {
      ok: true as const,
      applicant: {
        id: row.id,
        email: row.email,
        emailNormalized: row.email_normalized,
        fullName: row.full_name,
        accessStage: row.access_stage as AccessStage,
        status: row.status,
      },
      sessionToken,
      expiresAt,
    }
  })
}

export async function getSessionByToken(
  token: string
): Promise<AccessSessionRecord | null> {
  if (!token) return null
  const tokenHash = hashSecret(token)

  return withClient(async (client) => {
    const result = await client.query<{
      id: string
      email_normalized: string
      application_id: string
      access_stage: number
      full_name: string
      expires_at: Date
    }>(
      `SELECT
         s.id,
         s.email_normalized,
         s.application_id,
         s.expires_at,
         a.access_stage,
         a.full_name
       FROM access_sessions s
       INNER JOIN access_applications a ON a.id = s.application_id
       WHERE s.token_hash = $1
       LIMIT 1`,
      [tokenHash]
    )

    const row = result.rows[0]
    if (!row) return null
    if (row.expires_at.getTime() < Date.now()) {
      await client.query(`DELETE FROM access_sessions WHERE id = $1`, [row.id])
      return null
    }

    // Best-effort last seen bump (ignore failures)
    await client.query(
      `UPDATE access_sessions SET last_seen_at = now() WHERE id = $1`,
      [row.id]
    )

    return {
      id: row.id,
      emailNormalized: row.email_normalized,
      applicationId: row.application_id,
      accessStage: row.access_stage as AccessStage,
      fullName: row.full_name,
    }
  })
}
