import AccessPage from '@/components/access/AccessPage'
import { getAcquisitionEnquiry } from '@/lib/acquisitionEnquiries'
import { enterNextPanel } from '@/lib/accessPanelStage'
import { getAccessSession } from '@/lib/accessSession'
import { requireAccessStage } from '@/lib/requireAccessStage'
import { redirect } from 'next/navigation'

export default async function AccessStage3() {
  // Opening this page (for example from the invitation email) enters The
  // Decision once access has been granted, without a second request.
  const current = await getAccessSession()
  if (current && current.accessStage >= 3 && current.panelStage === 2) {
    try {
      await enterNextPanel(current.applicationId, 2)
    } catch (err) {
      console.error('enter the decision failed', err)
    }
  }

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
