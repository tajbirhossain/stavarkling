import PrivateAcquisitionContent from '@/components/access/PrivateAcquisitionContent'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function PrivateAcquisitionPage() {
  await requireAccessStage(3)

  return <PrivateAcquisitionContent />
}
