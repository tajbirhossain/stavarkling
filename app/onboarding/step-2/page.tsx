'use client'

import OnboardingScreen from '@/components/onboarding/OnboardingScreen'

const OnboardingStepTwo = () => {
  return (
    <OnboardingScreen
      step={2}
      backgroundTextSrc="/images/onboarding-text-2.svg"
      eyebrow="AN EXPERIMENT IN VALUE"
      message={
        <>
          The artwork is complete.{' '}
          <br />
          The outcome remains unknown.
        </>
      }
      continueHref="/onboarding/step-3"
    />
  )
}

export default OnboardingStepTwo
