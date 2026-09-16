'use client'

import OnboardingScreen from '@/components/onboarding/OnboardingScreen'

const OnboardingStepOne = () => {
  return (
    <OnboardingScreen
      step={1}
      backgroundTextSrc="/images/onboarding-text-1.svg"
      eyebrow="BEFORE YOU PROCEED"
      message={
        <>
          This project may permanently alter your{' '}
          <br className="block max-[639px]:hidden" />
          perception of value.
        </>
      }
      continueHref="/onboarding/step-2"
    />
  )
}

export default OnboardingStepOne
