import AccessPage from '@/components/access/AccessPage'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function AccessStage3() {
  const session = await requireAccessStage(3)

  return <AccessPage stage={3} memberStage={session.accessStage} />
}
