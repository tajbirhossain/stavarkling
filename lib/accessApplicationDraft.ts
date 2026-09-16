import {
  createIdempotencyKey,
  emptyAccessApplicationDraft,
  type AccessApplicationDraft,
} from '@/lib/accessApplication'

const DRAFT_STORAGE_KEY = 'stavarkling_access_application_draft'
const SUBMITTED_STORAGE_KEY = 'stavarkling_access_application_submitted'

function isBrowser() {
  return typeof window !== 'undefined'
}

function isDraftShape(value: unknown): value is AccessApplicationDraft {
  if (!value || typeof value !== 'object') return false
  const draft = value as Record<string, unknown>
  return (
    typeof draft.reflection === 'string' &&
    typeof draft.fullName === 'string' &&
    typeof draft.country === 'string' &&
    typeof draft.email === 'string' &&
    typeof draft.reason === 'string' &&
    typeof draft.idempotencyKey === 'string'
  )
}

export function readAccessApplicationDraft(): AccessApplicationDraft {
  if (!isBrowser()) return emptyAccessApplicationDraft()

  try {
    const raw = window.sessionStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return emptyAccessApplicationDraft()

    const parsed: unknown = JSON.parse(raw)
    if (!isDraftShape(parsed)) return emptyAccessApplicationDraft()

    return {
      ...parsed,
      idempotencyKey: parsed.idempotencyKey || createIdempotencyKey(),
    }
  } catch {
    return emptyAccessApplicationDraft()
  }
}

export function writeAccessApplicationDraft(
  patch: Partial<AccessApplicationDraft>
): AccessApplicationDraft {
  const next: AccessApplicationDraft = {
    ...readAccessApplicationDraft(),
    ...patch,
  }

  if (!next.idempotencyKey) {
    next.idempotencyKey = createIdempotencyKey()
  }

  if (isBrowser()) {
    window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(next))
  }

  return next
}

export function clearAccessApplicationDraft() {
  if (!isBrowser()) return
  window.sessionStorage.removeItem(DRAFT_STORAGE_KEY)
}

export function markAccessApplicationSubmitted() {
  if (!isBrowser()) return
  window.sessionStorage.setItem(SUBMITTED_STORAGE_KEY, '1')
  clearAccessApplicationDraft()
}

export function hasAccessApplicationSubmitted() {
  if (!isBrowser()) return false
  return window.sessionStorage.getItem(SUBMITTED_STORAGE_KEY) === '1'
}

/**
 * Failed network retries must keep the same idempotency key.
 * Only rotate when starting a brand-new draft after success.
 */
export function rotateAccessApplicationIdempotencyKey() {
  return writeAccessApplicationDraft({
    idempotencyKey: createIdempotencyKey(),
  })
}
