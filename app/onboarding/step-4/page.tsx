'use client'

import { useRouter } from 'next/navigation'
import OnboardingScreen from '@/components/onboarding/OnboardingScreen'
import { completeOnboarding } from '@/lib/onboarding'

const OnboardingStepFour = () => {
  const router = useRouter()

  const handleEnterWebsite = () => {
    completeOnboarding()
    router.replace('/')
  }

  return (
    <OnboardingScreen
      step={4}
      backgroundTextSrc="/images/onboarding-text-4.svg"
      eyebrow="THE DECISION IS YOURS"
      message={
        <>
          Enter the experiment.
          <br className="block" />{' '}
          {/* My art – Universe.{' '}
          <em className="text-brand">Decided.</em> */}
          You do not need the world to agree.
        </>
      }
      ctaLabel="STEP INSIDE"
      onContinue={handleEnterWebsite}
    />
  )
}

export default OnboardingStepFour
