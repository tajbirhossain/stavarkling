import PrivateAcquisitionContent from '@/components/access/PrivateAcquisitionContent'
import {
  getAcquisitionEnquiry,
  getApplicantForEmail,
} from '@/lib/acquisitionEnquiries'
import { requireAccessStage } from '@/lib/requireAccessStage'

export default async function PrivateAcquisitionPage() {
  const session = await requireAccessStage(3)

  let alreadySubmitted = false
  let confirmationEmail: string | null = null
  try {
    const enquiry = await getAcquisitionEnquiry(session.applicationId)
    alreadySubmitted = Boolean(enquiry)
    // Only claim a confirmation was sent when it actually was.
    if (enquiry?.confirmationSentAt) {
      const applicant = await getApplicantForEmail(session.applicationId)
      confirmationEmail = applicant?.email ?? null
    }
  } catch (err) {
    // Table not migrated yet or a transient error: show the page, not a 500.
    console.error('load acquisition enquiry failed', err)
  }

  return (
    <PrivateAcquisitionContent
      firstName={session.fullName.trim().split(/\s+/)[0] ?? ''}
      alreadySubmitted={alreadySubmitted}
      confirmationEmail={confirmationEmail}
    />
  )
}
