import type { AccessStage } from '@/lib/accessStages'
import { getAccessSession } from '@/lib/accessSession'
import { redirect } from 'next/navigation'

export function accessPathForStage(stage: AccessStage) {
  if (stage === 1) return '/access'
  if (stage === 2) return '/access/stage-2'
  return '/access/stage-3'
}

/**
 * Allow stages up to the member's current DB stage.
 * Higher stages redirect back to the furthest unlocked path.
 */
export async function requireAccessStage(required: AccessStage) {
  const session = await getAccessSession()

  // Layout shows the auth wall when unauthenticated; keep a safe fallback.
  if (!session) {
    redirect('/access')
  }

  if (session.accessStage < required) {
    redirect(accessPathForStage(session.accessStage))
  }

  return session
}
