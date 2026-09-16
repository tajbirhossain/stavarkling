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
      eyebrow="A DECISION IS REQUIRED"
      message={
        <>
          Proceed only if you are willing to question what creates value.
          <br className="block max-[639px]:hidden" />{' '}
          My art – Universe.{' '}
          <em className="text-brand">Decided.</em>
        </>
      }
      ctaLabel="ENTER WEBSITE"
      onContinue={handleEnterWebsite}
    />
  )
}

export default OnboardingStepFour
