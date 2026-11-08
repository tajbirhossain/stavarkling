'use client'

import { useState } from 'react'

type Props = {
  firstName: string
  contactEmail: string
  /** ISO date when a request already exists; shows the confirmed state. */
  existingCreatedAt: string | null
}

const ctaClassName =
  'btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base disabled:cursor-wait disabled:opacity-70'

const AcquisitionConversation = ({
  firstName,
  contactEmail,
  existingCreatedAt,
}: Props) => {
  const [done, setDone] = useState(Boolean(existingCreatedAt))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/access/acquisition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Unable to send your request right now.')
        setSubmitting(false)
        return
      }
      setDone(true)
    } catch {
      setError('Unable to send your request right now. Please try again.')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="access-reveal mb-10 max-w-xl max-[1023px]:mx-auto">
        <p className="mb-3 text-lg font-bold tracking-wide text-brand">
          YOUR REQUEST HAS BEEN RECEIVED
        </p>
        <p className="text-lg leading-8 font-medium">
          Thank you{firstName ? `, ${firstName}` : ''}. The artist will be in
          touch with you personally within 24 hours.
        </p>
        <p className="mt-3 text-base leading-7 font-medium text-[#5f5f5f]">
          A confirmation is on its way to your inbox. Anything further:{' '}
          <a
            href={`mailto:${contactEmail}`}
            className="text-brand underline-offset-4 hover:underline"
          >
            {contactEmail}
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="access-reveal mb-10 max-w-xl max-[1023px]:mx-auto">
      <label
        htmlFor="acq-message"
        className="mb-3 block text-base font-semibold text-[#5f5f5f]"
      >
        Anything you would like the artist to know? (optional)
      </label>
      <textarea
        id="acq-message"
        rows={3}
        maxLength={2000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mb-6 w-full rounded-[10px] border border-[rgba(154,35,73,0.25)] bg-white/70 px-4 py-3 text-lg font-medium outline-none focus:border-brand"
      />

      <div className="flex flex-col items-start gap-4 max-[1023px]:items-center">
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className={ctaClassName}
        >
          {submitting ? 'SENDING…' : 'REQUEST PRIVATE ACQUISITION'}
          {!submitting && (
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="w-5 brightness-[100]"
            />
          )}
        </button>
        {error && (
          <p className="text-base font-medium text-brand/80">{error}</p>
        )}
        <a
          href={`mailto:${contactEmail}`}
          className="text-lg font-medium tracking-wide text-brand underline-offset-4 duration-300 hover:underline max-[639px]:text-base"
        >
          {contactEmail}
        </a>
      </div>
    </div>
  )
}

export default AcquisitionConversation
