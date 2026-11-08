import AccessPage from '@/components/access/AccessPage'
import { getAcquisitionEnquiry } from '@/lib/acquisitionEnquiries'
import { requireAccessStage } from '@/lib/requireAccessStage'
import { redirect } from 'next/navigation'

export default async function AccessStage3() {
  const session = await requireAccessStage(3)

  // Once the private acquisition request is sent, that page is their home.
  let hasRequested = false
  try {
    hasRequested = Boolean(await getAcquisitionEnquiry(session.applicationId))
  } catch (err) {
    // On a lookup error, fall back to the normal stage 3 page.
    console.error('load acquisition enquiry failed', err)
  }
  if (hasRequested) {
    redirect('/access/private-acquisition')
  }

  return <AccessPage stage={3} memberStage={session.accessStage} />
}
