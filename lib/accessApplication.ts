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
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'British Virgin Islands',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Polynesia',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Holy See (Vatican City)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Republic of the Congo',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'São Tomé and Príncipe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'US Virgin Islands',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
  'Other',
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
  if (!value) return null
  if (value.length < ACCESS_APPLICATION_LIMITS.reason.min) {
    return `Please write at least ${ACCESS_APPLICATION_LIMITS.reason.min} characters, or leave this blank.`
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
  fullName: string
  country: string
  email: string
  reason: string | null
  idempotencyKey: string
}

export function toAccessApplicationSubmitPayload(
  draft: AccessApplicationDraft
): AccessApplicationSubmitPayload {
  const normalized = normalizeAccessApplicationDraft(draft)
  return {
    fullName: normalized.fullName,
    country: normalized.country,
    email: normalized.email,
    reason: normalized.reason || null,
    idempotencyKey: normalized.idempotencyKey,
  }
}
