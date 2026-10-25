import AccessPage from '@/components/access/AccessPage'
import { getStageRequest } from '@/lib/accessStageRequests'
import { requireCurrentAccessStage } from '@/lib/requireAccessStage'

export default async function Access() {
  const session = await requireCurrentAccessStage(1)
  const existing = await getStageRequest(session.applicationId, 1)

  return (
    <AccessPage stage={1} alreadyRequested={Boolean(existing)} />
  )
}
