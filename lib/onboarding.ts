export const ONBOARDING_STORAGE_KEY = 'stavarkling_onboarding_complete'
export const ONBOARDING_COOKIE_KEY = 'stavarkling_onboarding_complete'
export const ONBOARDING_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1'
}

export function setOnboardingCookie(): void {
  document.cookie = `${ONBOARDING_COOKIE_KEY}=1; path=/; max-age=${ONBOARDING_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearOnboardingCookie(): void {
  document.cookie = `${ONBOARDING_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`
}

export function completeOnboarding(): void {
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
  setOnboardingCookie()
}

/**
 * Keep localStorage and the proxy cookie aligned.
 * If storage was cleared, drop the cookie too so onboarding can run again
 * and we don't bounce between / and /onboarding.
 */
export function syncOnboardingFromStorage(): boolean {
  const complete = hasCompletedOnboarding()
  if (complete) {
    setOnboardingCookie()
    return true
  }

  clearOnboardingCookie()
  return false
}
