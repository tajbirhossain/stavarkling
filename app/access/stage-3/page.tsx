import AccessPage from '@/components/access/AccessPage'
import { getStageRequest } from '@/lib/accessStageRequests'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function AccessStage3() {
  const session = await requireAccessStage(3)
  const existing = await getStageRequest(session.applicationId, 3)

  return (
    <AccessPage stage={3} alreadyRequested={Boolean(existing)} />
  )
}
