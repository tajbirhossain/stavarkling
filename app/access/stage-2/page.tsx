import AccessPage from '@/components/access/AccessPage'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function AccessStage2() {
  await requireAccessStage(2)
  return <AccessPage stage={2} />
}
