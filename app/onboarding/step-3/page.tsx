'use client'

import OnboardingScreen from '@/components/onboarding/OnboardingScreen'

const OnboardingStepThree = () => {
  return (
    <OnboardingScreen
      step={3}
      backgroundTextSrc="/images/onboarding-text-3.svg"
      eyebrow="THE PREMISE"
      message={
        <>
          Can something unknown become valuable{' '}
          <br className="block max-[639px]:hidden" />
          simply because someone decides it is?
        </>
      }
      continueHref="/onboarding/step-4"
    />
  )
}

export default OnboardingStepThree
