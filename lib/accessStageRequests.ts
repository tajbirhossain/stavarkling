import { withClient } from '@/lib/db'
import type { AccessStage } from '@/lib/accessStages'

export type AccessStageRequest = {
  id: string
  applicationId: string
  fromStage: AccessStage
  requestedAt: Date
}

export async function getStageRequest(
  applicationId: string,
  fromStage: AccessStage
): Promise<AccessStageRequest | null> {
  return withClient(async (client) => {
    const result = await client.query<{
      id: string
      application_id: string
      from_stage: number
      requested_at: Date
    }>(
      `SELECT id, application_id, from_stage, requested_at
       FROM access_stage_requests
       WHERE application_id = $1
         AND from_stage = $2
       LIMIT 1`,
      [applicationId, fromStage]
    )

    const row = result.rows[0]
    if (!row) return null

    return {
      id: row.id,
      applicationId: row.application_id,
      fromStage: row.from_stage as AccessStage,
      requestedAt: row.requested_at,
    }
  })
}

export async function createStageRequest(input: {
  applicationId: string
  fromStage: AccessStage
  clientIp: string | null
  userAgent: string | null
}): Promise<
  | { ok: true; request: AccessStageRequest; alreadyExisted: false }
  | { ok: true; request: AccessStageRequest; alreadyExisted: true }
> {
  return withClient(async (client) => {
    const existing = await client.query<{
      id: string
      application_id: string
      from_stage: number
      requested_at: Date
    }>(
      `SELECT id, application_id, from_stage, requested_at
       FROM access_stage_requests
       WHERE application_id = $1
         AND from_stage = $2
       LIMIT 1`,
      [input.applicationId, input.fromStage]
    )

    if (existing.rows[0]) {
      const row = existing.rows[0]
      return {
        ok: true as const,
        alreadyExisted: true as const,
        request: {
          id: row.id,
          applicationId: row.application_id,
          fromStage: row.from_stage as AccessStage,
          requestedAt: row.requested_at,
        },
      }
    }

    const inserted = await client.query<{
      id: string
      application_id: string
      from_stage: number
      requested_at: Date
    }>(
      `INSERT INTO access_stage_requests (
         application_id,
         from_stage,
         client_ip,
         user_agent
       ) VALUES ($1, $2, $3::inet, $4)
       ON CONFLICT (application_id, from_stage) DO NOTHING
       RETURNING id, application_id, from_stage, requested_at`,
      [
        input.applicationId,
        input.fromStage,
        input.clientIp,
        input.userAgent,
      ]
    )

    if (inserted.rows[0]) {
      const row = inserted.rows[0]
      return {
        ok: true as const,
        alreadyExisted: false as const,
        request: {
          id: row.id,
          applicationId: row.application_id,
          fromStage: row.from_stage as AccessStage,
          requestedAt: row.requested_at,
        },
      }
    }

    // Race: another request won the unique constraint
    const raced = await client.query<{
      id: string
      application_id: string
      from_stage: number
      requested_at: Date
    }>(
      `SELECT id, application_id, from_stage, requested_at
       FROM access_stage_requests
       WHERE application_id = $1
         AND from_stage = $2
       LIMIT 1`,
      [input.applicationId, input.fromStage]
    )

    const row = raced.rows[0]
    return {
      ok: true as const,
      alreadyExisted: true as const,
      request: {
        id: row.id,
        applicationId: row.application_id,
        fromStage: row.from_stage as AccessStage,
        requestedAt: row.requested_at,
      },
    }
  })
}
