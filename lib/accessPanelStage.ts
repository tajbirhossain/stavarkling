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
 * Called when the member clicks ENTER THE MOMENT / ENTER THE DECISION.
 *
 * Stage 1 -> 2 needs no approval: entering The Moment grants stage 2 itself.
 * Stage 2 -> 3 only opens once access_stage has been granted (admin approval).
 */
export async function enterNextPanel(
  applicationId: string,
  fromStage?: AccessStage
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

    // The page the member clicked on is out of date (another tab or device
    // already moved them on). Send them to the panel they are actually on.
    if (fromStage && panelStage > fromStage) {
      return {
        ok: true as const,
        panelStage,
        accessStage,
        path: accessPathForStage(panelStage),
      }
    }

    // The Beginning is open to everyone who has verified their email.
    if (panelStage === 1 && accessStage === 1) {
      const opened = await client.query<{
        access_stage: number
        panel_stage: number
      }>(
        `UPDATE access_applications
         SET access_stage = 2,
             panel_stage = 2
         WHERE id = $1
           AND panel_stage = 1
           AND access_stage = 1
         RETURNING access_stage, panel_stage`,
        [applicationId]
      )
      const row2 = opened.rows[0]
      if (!row2) {
        return { ok: false as const, reason: 'not_ready' as const }
      }
      return {
        ok: true as const,
        panelStage: row2.panel_stage as AccessStage,
        accessStage: row2.access_stage as AccessStage,
        path: accessPathForStage(row2.panel_stage as AccessStage),
      }
    }

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
