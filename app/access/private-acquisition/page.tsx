import PrivateAcquisitionContent from '@/components/access/PrivateAcquisitionContent'
import { getAcquisitionEnquiry } from '@/lib/acquisitionEnquiries'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function PrivateAcquisitionPage() {
  const session = await requireAccessStage(3)

  let existingCreatedAt: string | null = null
  try {
    const enquiry = await getAcquisitionEnquiry(session.applicationId)
    existingCreatedAt = enquiry?.createdAt.toISOString() ?? null
  } catch (err) {
    // Table not migrated yet or a transient error: show the page, not a 500.
    console.error('load acquisition enquiry failed', err)
  }

  return (
    <PrivateAcquisitionContent
      firstName={session.fullName.trim().split(/\s+/)[0] ?? ''}
      existingCreatedAt={existingCreatedAt}
    />
  )
}
