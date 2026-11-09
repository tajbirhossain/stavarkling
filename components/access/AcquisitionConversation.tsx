'use client'

import { useState } from 'react'

type Props = {
  /** confirmationEmail is set only when the confirmation email was sent. */
  onSubmitted: (result: { confirmationEmail: string | null }) => void
}

const ctaClassName =
  'btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base disabled:cursor-wait disabled:opacity-70'

const AcquisitionConversation = ({ onSubmitted }: Props) => {
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
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        confirmationEmail?: string | null
      }
      if (!res.ok) {
        setError(data.error || 'Unable to send your enquiry right now.')
        setSubmitting(false)
        return
      }
      onSubmitted({ confirmationEmail: data.confirmationEmail ?? null })
    } catch {
      setError('Unable to send your enquiry right now. Please try again.')
      setSubmitting(false)
    }
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

      <div className="flex flex-col items-start gap-6 max-[1023px]:items-center">
        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className={ctaClassName}
        >
          {submitting ? 'SENDING…' : 'BEGIN THE CONVERSATION'}
          {!submitting && (
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className="w-5 brightness-[100]"
            />
          )}
        </button>

        <p className="max-w-xl border-l-2 border-brand/40 pl-5 text-base leading-7 font-medium text-[#5f5f5f] max-[1023px]:border-t max-[1023px]:border-l-0 max-[1023px]:border-brand/30 max-[1023px]:pt-5 max-[1023px]:pl-0 max-[1023px]:text-center max-[639px]:text-[15px] max-[639px]:leading-6">
          Your enquiry begins a private conversation with the artist. No payment
          is taken through the website. Your enquiry does not confirm a
          purchase, reserve the artwork or transfer ownership.
        </p>

        {error && (
          <p className="text-base font-medium text-brand/80">{error}</p>
        )}
      </div>
    </div>
  )
}

export default AcquisitionConversation
