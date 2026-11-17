import type { Metadata } from 'next'
import WelcomeScreen from '@/components/onboarding/WelcomeScreen'

export const metadata: Metadata = {
  title: 'Stavarkling | Luxury Visionary Art',
}

const OnboardingWelcome = () => {
  return <WelcomeScreen />
}

export default OnboardingWelcome
