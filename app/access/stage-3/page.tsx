import AccessPage from '@/components/access/AccessPage'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function AccessStage3() {
  await requireAccessStage(3)
  return <AccessPage stage={3} />
}
