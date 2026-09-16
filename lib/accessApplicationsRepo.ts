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

export async function createAccessApplication(input: {
  payload: AccessApplicationSubmitPayload
  clientIp: string | null
  userAgent: string | null
}): Promise<
  | { ok: true; record: AccessApplicationRecord }
  | { ok: false; status: 400 | 409; errors: AccessApplicationFieldErrors }
> {
  const draftLike = {
    reflection: input.payload.reflection ?? '',
    fullName: input.payload.fullName,
    country: input.payload.country,
    email: input.payload.email,
    reason: input.payload.reason,
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

      try {
        const inserted = await client.query<DbRow>(
          `INSERT INTO access_applications (
             full_name,
             email,
             country,
             reason,
             reflection,
             idempotency_key,
             client_ip,
             user_agent
           ) VALUES ($1, $2, $3, $4, $5, $6, $7::inet, $8)
           RETURNING id, status, created_at`,
          [
            payload.fullName,
            payload.email,
            payload.country,
            payload.reason,
            payload.reflection,
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
          const conflict = new Error('ACTIVE_EMAIL_EXISTS') as Error & {
            code: 'ACTIVE_EMAIL_EXISTS'
          }
          conflict.code = 'ACTIVE_EMAIL_EXISTS'
          throw conflict
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
      return {
        ok: false,
        status: 409,
        errors: {
          email:
            'An application with this email is already under review. We will notify you by email.',
          form: 'Duplicate request blocked.',
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
    typeof value.reason !== 'string' ||
    typeof value.idempotencyKey !== 'string'
  ) {
    return null
  }

  return {
    reflection: typeof value.reflection === 'string' ? value.reflection : '',
    fullName: value.fullName,
    country: value.country,
    email: value.email,
    reason: value.reason,
    idempotencyKey: value.idempotencyKey,
  }
}
