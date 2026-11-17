import type { Metadata } from 'next'
import AccessGuide from '@/components/access/AccessGuide'

// Public on purpose: it sits outside app/access/(private), so it has no login wall.
// People land here straight after applying, before they have signed in.
export const metadata: Metadata = {
  title: 'Your path through Access | Stavarkling',
  description:
    'How the three stages of Access work, and what to do after your request has been received.',
}

export default function AccessGuidePage() {
  return <AccessGuide />
}
