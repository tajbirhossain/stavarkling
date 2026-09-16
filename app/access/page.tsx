import AccessPage from '@/components/access/AccessPage'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function Access() {
  await requireAccessStage(1)
  return <AccessPage stage={1} />
}
