export const ACCESS_APPLICATION_LIMITS = {
  fullName: { min: 2, max: 120 },
  reason: { min: 10, max: 4000 },
  reflection: { max: 4000 },
  country: { min: 2, max: 80 },
} as const

export const ACCESS_APPLICATION_COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Denmark',
  'Egypt',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hong Kong',
  'India',
  'Indonesia',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Kenya',
  'Malaysia',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'Norway',
  'Pakistan',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Russia',
  'Saudi Arabia',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'Turkey',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Vietnam',
] as const

export type AccessApplicationCountry =
  (typeof ACCESS_APPLICATION_COUNTRIES)[number]

export type AccessApplicationDraft = {
  reflection: string
  fullName: string
  country: string
  email: string
  reason: string
  /** Stable per-draft key used for idempotent submits */
  idempotencyKey: string
}

export type AccessApplicationFieldErrors = Partial<
  Record<
    'reflection' | 'fullName' | 'country' | 'email' | 'reason' | 'form',
    string
  >
>

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function trim(value: string) {
  return value.trim()
}

export function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8
    return value.toString(16)
  })
}

export function emptyAccessApplicationDraft(): AccessApplicationDraft {
  return {
    reflection: '',
    fullName: '',
    country: '',
    email: '',
    reason: '',
    idempotencyKey: createIdempotencyKey(),
  }
}

export function normalizeAccessApplicationDraft(
  draft: AccessApplicationDraft
): AccessApplicationDraft {
  return {
    reflection: trim(draft.reflection),
    fullName: trim(draft.fullName),
    country: trim(draft.country),
    email: trim(draft.email).toLowerCase(),
    reason: trim(draft.reason),
    idempotencyKey: draft.idempotencyKey || createIdempotencyKey(),
  }
}

export function validateReflection(reflection: string): string | null {
  const value = trim(reflection)
  if (!value) return null
  if (value.length > ACCESS_APPLICATION_LIMITS.reflection.max) {
    return `Reflection must be ${ACCESS_APPLICATION_LIMITS.reflection.max} characters or fewer.`
  }
  return null
}

export function validateFullName(fullName: string): string | null {
  const value = trim(fullName)
  if (!value) return 'Full name is required.'
  if (value.length < ACCESS_APPLICATION_LIMITS.fullName.min) {
    return `Full name must be at least ${ACCESS_APPLICATION_LIMITS.fullName.min} characters.`
  }
  if (value.length > ACCESS_APPLICATION_LIMITS.fullName.max) {
    return `Full name must be ${ACCESS_APPLICATION_LIMITS.fullName.max} characters or fewer.`
  }
  return null
}

export function validateCountry(country: string): string | null {
  const value = trim(country)
  if (!value) return 'Country is required.'
  if (
    !ACCESS_APPLICATION_COUNTRIES.includes(value as AccessApplicationCountry)
  ) {
    return 'Select a valid country from the list.'
  }
  return null
}

export function validateEmail(email: string): string | null {
  const value = trim(email)
  if (!value) return 'Email address is required.'
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.'
  if (value.length > 254) return 'Email address is too long.'
  return null
}

export function validateReason(reason: string): string | null {
  const value = trim(reason)
  if (!value) return 'Please share what brought you this far.'
  if (value.length < ACCESS_APPLICATION_LIMITS.reason.min) {
    return `Please write at least ${ACCESS_APPLICATION_LIMITS.reason.min} characters.`
  }
  if (value.length > ACCESS_APPLICATION_LIMITS.reason.max) {
    return `Response must be ${ACCESS_APPLICATION_LIMITS.reason.max} characters or fewer.`
  }
  return null
}

export function validateAccessApplicationStep1(draft: {
  reflection: string
}): AccessApplicationFieldErrors {
  const reflectionError = validateReflection(draft.reflection)
  return reflectionError ? { reflection: reflectionError } : {}
}

export function validateAccessApplicationStep2(draft: {
  fullName: string
  country: string
  email: string
  reason: string
}): AccessApplicationFieldErrors {
  const errors: AccessApplicationFieldErrors = {}
  const fullName = validateFullName(draft.fullName)
  const country = validateCountry(draft.country)
  const email = validateEmail(draft.email)
  const reason = validateReason(draft.reason)

  if (fullName) errors.fullName = fullName
  if (country) errors.country = country
  if (email) errors.email = email
  if (reason) errors.reason = reason

  return errors
}

export function isAccessApplicationStep2Valid(draft: {
  fullName: string
  country: string
  email: string
  reason: string
}) {
  return Object.keys(validateAccessApplicationStep2(draft)).length === 0
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validateIdempotencyKey(key: string): string | null {
  if (!key || !UUID_PATTERN.test(key)) {
    return 'Invalid submission key. Refresh the page and try again.'
  }
  return null
}

export function validateAccessApplicationSubmission(draft: {
  reflection: string
  fullName: string
  country: string
  email: string
  reason: string
  idempotencyKey: string
}): AccessApplicationFieldErrors {
  const errors: AccessApplicationFieldErrors = {
    ...validateAccessApplicationStep1(draft),
    ...validateAccessApplicationStep2(draft),
  }

  const idempotencyKey = validateIdempotencyKey(draft.idempotencyKey)
  if (idempotencyKey) errors.form = idempotencyKey

  return errors
}

export type AccessApplicationSubmitPayload = {
  reflection: string | null
  fullName: string
  country: string
  email: string
  reason: string
  idempotencyKey: string
}

export function toAccessApplicationSubmitPayload(
  draft: AccessApplicationDraft
): AccessApplicationSubmitPayload {
  const normalized = normalizeAccessApplicationDraft(draft)
  return {
    reflection: normalized.reflection || null,
    fullName: normalized.fullName,
    country: normalized.country,
    email: normalized.email,
    reason: normalized.reason,
    idempotencyKey: normalized.idempotencyKey,
  }
}
