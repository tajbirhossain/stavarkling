import type { AccessStage } from '@/lib/accessStages'
import { getAccessSession } from '@/lib/accessSession'
import { redirect } from 'next/navigation'

export function accessPathForStage(stage: AccessStage) {
  if (stage === 1) return '/access'
  if (stage === 2) return '/access/stage-2'
  return '/access/stage-3'
}

/**
 * Show the panel that matches the member's entered panel_stage.
 * access_stage is the admin-granted ceiling (ENTER when ahead of panel).
 */
export async function requireAccessStage(required: AccessStage) {
  const session = await getAccessSession()

  // Layout shows the auth wall when unauthenticated; keep a safe fallback.
  if (!session) {
    redirect('/access')
  }

  // Not granted this far yet — send them to the panel they've entered.
  if (session.accessStage < required) {
    redirect(accessPathForStage(session.panelStage))
  }

  // Always land on the panel they've entered (survives home → ACCESS).
  if (session.panelStage !== required) {
    redirect(accessPathForStage(session.panelStage))
  }

  return session
}

/**
 * @deprecated Prefer requireAccessStage — panel_stage is the source of truth for landing.
 */
export async function requireCurrentAccessStage(pageStage: AccessStage) {
  return requireAccessStage(pageStage)
}
