import {
  toAccessApplicationSubmitPayload,
  validateAccessApplicationSubmission,
  type AccessApplicationDraft,
  type AccessApplicationFieldErrors,
  type AccessApplicationSubmitPayload,
} from '@/lib/accessApplication'
import { withClient } from '@/lib/db'
import type { PoolClient } from 'pg'

export type AccessApplicationRecord = {
  id: string
  status: string
  createdAt: string
  replayed: boolean
}

type DbRow = {
  id: string
  status: string
  created_at: Date
}

function isUniqueViolation(err: unknown, constraint?: string) {
  if (!err || typeof err !== 'object') return false
  const pgErr = err as { code?: string; constraint?: string }
  if (pgErr.code !== '23505') return false
  if (!constraint) return true
  return pgErr.constraint === constraint
}

async function findByIdempotencyKey(
  client: PoolClient,
  idempotencyKey: string
): Promise<DbRow | null> {
  const result = await client.query<DbRow>(
    `SELECT id, status, created_at
     FROM access_applications
     WHERE idempotency_key = $1
     LIMIT 1`,
    [idempotencyKey]
  )
  return result.rows[0] ?? null
}

function toRecord(row: DbRow, replayed: boolean): AccessApplicationRecord {
  return {
    id: row.id,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    replayed,
  }
}

function activeEmailConflict(existingStatus: string) {
  const conflict = new Error('ACTIVE_EMAIL_EXISTS') as Error & {
    code: 'ACTIVE_EMAIL_EXISTS'
    existingStatus: string
  }
  conflict.code = 'ACTIVE_EMAIL_EXISTS'
  conflict.existingStatus = existingStatus
  return conflict
}

export async function createAccessApplication(input: {
  payload: AccessApplicationSubmitPayload
  clientIp: string | null
  userAgent: string | null
}): Promise<
  | { ok: true; record: AccessApplicationRecord }
  | { ok: false; status: 400 | 409; errors: AccessApplicationFieldErrors }
> {
  const draftLike = {
    reflection: '',
    fullName: input.payload.fullName,
    country: input.payload.country,
    email: input.payload.email,
    reason: input.payload.reason ?? '',
    idempotencyKey: input.payload.idempotencyKey,
  }

  const errors = validateAccessApplicationSubmission(draftLike)
  if (Object.keys(errors).length > 0) {
    return { ok: false, status: 400, errors }
  }

  const payload = toAccessApplicationSubmitPayload(draftLike)

  try {
    const record = await withClient(async (client) => {
      const existing = await findByIdempotencyKey(client, payload.idempotencyKey)
      if (existing) return toRecord(existing, true)

      // One open or approved application per email. The unique index only
      // covers pending/under_review, so approved members must be checked here.
      const open = await client.query<{ status: string }>(
        `SELECT status
         FROM access_applications
         WHERE email_normalized = lower(btrim($1))
           AND status IN ('pending', 'under_review', 'approved')
         ORDER BY CASE status WHEN 'approved' THEN 0 ELSE 1 END
         LIMIT 1`,
        [payload.email]
      )
      if (open.rows[0]) {
        throw activeEmailConflict(open.rows[0].status)
      }

      try {
        const inserted = await client.query<DbRow>(
          `INSERT INTO access_applications (
             full_name,
             email,
             country,
             reason,
             idempotency_key,
             client_ip,
             user_agent
           ) VALUES ($1, $2, $3, $4, $5, $6::inet, $7)
           RETURNING id, status, created_at`,
          [
            payload.fullName,
            payload.email,
            payload.country,
            payload.reason,
            payload.idempotencyKey,
            input.clientIp,
            input.userAgent,
          ]
        )

        return toRecord(inserted.rows[0], false)
      } catch (err) {
        // Concurrent retry with the same key — treat as success replay
        if (isUniqueViolation(err, 'access_applications_idempotency_key_unique')) {
          const replay = await findByIdempotencyKey(client, payload.idempotencyKey)
          if (replay) return toRecord(replay, true)
        }

        // Active application already exists for this email
        if (isUniqueViolation(err, 'access_applications_email_active_uidx')) {
          throw activeEmailConflict('pending')
        }

        throw err
      }
    })

    return { ok: true, record }
  } catch (err) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      err.code === 'ACTIVE_EMAIL_EXISTS'
    ) {
      const alreadyApproved =
        'existingStatus' in err && err.existingStatus === 'approved'

      return {
        ok: false,
        status: 409,
        errors: alreadyApproved
          ? {
              email:
                'This email address already has access. Please use Access to sign in with a one-time code.',
              form: 'You already have access with this email address.',
            }
          : {
              email:
                'We already have a request from this email address and it is under review. There is no need to apply again. We will reply by email.',
              form: 'Your request is already with us. Please check your inbox for our confirmation.',
            },
      }
    }

    throw err
  }
}

export function parseAccessApplicationBody(
  body: unknown
): AccessApplicationDraft | null {
  if (!body || typeof body !== 'object') return null
  const value = body as Record<string, unknown>

  if (
    typeof value.fullName !== 'string' ||
    typeof value.country !== 'string' ||
    typeof value.email !== 'string' ||
    typeof value.idempotencyKey !== 'string'
  ) {
    return null
  }

  return {
    reflection: '',
    fullName: value.fullName,
    country: value.country,
    email: value.email,
    reason: typeof value.reason === 'string' ? value.reason : '',
    idempotencyKey: value.idempotencyKey,
  }
}
