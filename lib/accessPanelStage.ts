import { withTransaction } from '@/lib/db'
import type { AccessStage } from '@/lib/accessStages'
import { accessPathForStage } from '@/lib/requireAccessStage'

export type EnterNextPanelResult =
  | {
      ok: true
      panelStage: AccessStage
      accessStage: AccessStage
      path: string
    }
  | { ok: false; reason: 'not_ready' | 'not_found' }

/**
 * Advance panel_stage by one when access_stage is ahead.
 * Called when the member clicks ENTER THE MOMENT / PROCEED TO THE DECISION.
 */
export async function enterNextPanel(
  applicationId: string
): Promise<EnterNextPanelResult> {
  return withTransaction(async (client) => {
    const current = await client.query<{
      access_stage: number
      panel_stage: number
    }>(
      `SELECT access_stage, panel_stage
       FROM access_applications
       WHERE id = $1
       LIMIT 1
       FOR UPDATE`,
      [applicationId]
    )

    const row = current.rows[0]
    if (!row) return { ok: false as const, reason: 'not_found' as const }

    const accessStage = row.access_stage as AccessStage
    const panelStage = row.panel_stage as AccessStage

    if (panelStage >= accessStage || panelStage >= 3) {
      return { ok: false as const, reason: 'not_ready' as const }
    }

    const nextPanel = (panelStage + 1) as AccessStage

    const updated = await client.query<{
      access_stage: number
      panel_stage: number
    }>(
      `UPDATE access_applications
       SET panel_stage = $2
       WHERE id = $1
         AND panel_stage = $3
         AND access_stage >= $2
       RETURNING access_stage, panel_stage`,
      [applicationId, nextPanel, panelStage]
    )

    const next = updated.rows[0]
    if (!next) {
      return { ok: false as const, reason: 'not_ready' as const }
    }

    const newPanel = next.panel_stage as AccessStage
    return {
      ok: true as const,
      panelStage: newPanel,
      accessStage: next.access_stage as AccessStage,
      path: accessPathForStage(newPanel),
    }
  })
}
