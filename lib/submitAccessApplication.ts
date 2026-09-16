import type {
  AccessApplicationDraft,
  AccessApplicationFieldErrors,
} from '@/lib/accessApplication'

export type SubmitAccessApplicationResult =
  | {
      ok: true
      application: { id: string; status: string; createdAt: string }
      replayed: boolean
    }
  | {
      ok: false
      status: number
      error: string
      errors: AccessApplicationFieldErrors
    }

export async function submitAccessApplication(
  draft: AccessApplicationDraft
): Promise<SubmitAccessApplicationResult> {
  const response = await fetch('/api/access-applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': draft.idempotencyKey,
    },
    body: JSON.stringify({
      reflection: draft.reflection,
      fullName: draft.fullName,
      country: draft.country,
      email: draft.email,
      reason: draft.reason,
      idempotencyKey: draft.idempotencyKey,
    }),
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  const payload = (data ?? {}) as {
    error?: string
    errors?: AccessApplicationFieldErrors
    application?: { id: string; status: string; createdAt: string }
    replayed?: boolean
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload.error ?? 'Unable to submit application right now.',
      errors: payload.errors ?? {
        form: payload.error ?? 'Unable to submit application right now.',
      },
    }
  }

  if (!payload.application) {
    return {
      ok: false,
      status: 500,
      error: 'Unexpected server response.',
      errors: { form: 'Unexpected server response. Please try again.' },
    }
  }

  return {
    ok: true,
    application: payload.application,
    replayed: Boolean(payload.replayed),
  }
}
