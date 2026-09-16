'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { syncOnboardingFromStorage } from '@/lib/onboarding'

const OnboardingGate = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const isOnboarding = pathname.startsWith('/onboarding')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const complete = syncOnboardingFromStorage()

    if (complete && isOnboarding) {
      router.replace('/')
      return
    }

    if (!complete && !isOnboarding) {
      router.replace('/onboarding')
      return
    }

    setReady(true)
  }, [pathname, router, isOnboarding])

  if (!ready) {
    return <div className="min-h-dvh w-full bg-[#F1E7E8]" />
  }

  return <>{children}</>
}

export default OnboardingGate
