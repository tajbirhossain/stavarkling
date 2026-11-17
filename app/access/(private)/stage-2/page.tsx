import AccessPage from '@/components/access/AccessPage'
import { getStageRequest } from '@/lib/accessStageRequests'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function AccessStage2() {
  const session = await requireAccessStage(2)
  const existing = await getStageRequest(session.applicationId, 2)

  return (
    <AccessPage
      stage={2}
      memberStage={session.accessStage}
      alreadyRequested={Boolean(existing)}
    />
  )
}
