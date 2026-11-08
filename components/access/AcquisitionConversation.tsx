'use client'

import { useState } from 'react'

type Props = {
  firstName: string
  contactEmail: string
  /** ISO date when an enquiry already exists; shows the confirmed state. */
  existingCreatedAt: string | null
}

type Method = 'email' | 'phone' | 'video'

const ctaClassName =
  'btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base disabled:cursor-wait disabled:opacity-70'

const fieldClassName =
  'w-full rounded-[10px] border border-[rgba(154,35,73,0.25)] bg-white/70 px-4 py-3 text-lg font-medium outline-none focus:border-brand'

const CtaArrow = () => (
  <img
    src="/images/icons/arrow-right.png"
    alt=""
    className="w-5 brightness-[100]"
  />
)

const METHODS: { value: Method; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'video', label: 'Video call' },
]

const AcquisitionConversation = ({
  firstName,
  contactEmail,
  existingCreatedAt,
}: Props) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const [done, setDone] = useState(Boolean(existingCreatedAt))
  const [placeAnswer, setPlaceAnswer] = useState('')
  const [drawAnswer, setDrawAnswer] = useState('')
  const [contactMethod, setContactMethod] = useState<Method>('email')
  const [contactDetail, setContactDetail] = useState('')
  const [bestTime, setBestTime] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const next = () => {
    setError('')
    if (step === 1 && !placeAnswer.trim()) {
      setError('A few words are enough.')
      return
    }
    setStep((s) => Math.min(3, s + 1) as 0 | 1 | 2 | 3)
  }

  const submit = async () => {
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/access/acquisition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeAnswer,
          drawAnswer,
          contactMethod,
          contactDetail,
          bestTime,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Unable to begin the conversation right now.')
        setSubmitting(false)
        return
      }
      setDone(true)
    } catch {
      setError('Unable to begin the conversation right now. Please try again.')
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="access-reveal mb-10 max-w-xl max-[1023px]:mx-auto">
        <p className="mb-3 text-lg font-bold tracking-wide text-brand">
          THE CONVERSATION HAS BEGUN
        </p>
        <p className="text-lg leading-8 font-medium">
          Thank you{firstName ? `, ${firstName}` : ''}. The artist will reply to
          you personally within 24 hours.
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

  if (step === 0) {
    return (
      <div className="access-reveal mb-10 flex flex-col items-start gap-4 max-[1023px]:items-center">
        <button type="button" onClick={() => setStep(1)} className={ctaClassName}>
          BEGIN THE CONVERSATION
          <CtaArrow />
        </button>
        <a
          href={`mailto:${contactEmail}`}
          className="text-lg font-medium tracking-wide text-brand underline-offset-4 duration-300 hover:underline max-[639px]:text-base"
        >
          {contactEmail}
        </a>
      </div>
    )
  }

  return (
    <div className="access-reveal mb-10 max-w-xl max-[1023px]:mx-auto">
      <p className="mb-4 text-sm font-bold tracking-[0.14em] text-brand">
        {step} OF 3
      </p>

      {step === 1 && (
        <div>
          <label
            htmlFor="acq-place"
            className="mb-3 block text-2xl leading-9 font-semibold"
          >
            Where would you place it?
          </label>
          <textarea
            id="acq-place"
            rows={4}
            maxLength={2000}
            value={placeAnswer}
            onChange={(e) => setPlaceAnswer(e.target.value)}
            placeholder="A room, a wall, a city, a moment."
            className={fieldClassName}
            autoFocus
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <label
            htmlFor="acq-draw"
            className="mb-3 block text-2xl leading-9 font-semibold"
          >
            What drew you to it?
          </label>
          <textarea
            id="acq-draw"
            rows={4}
            maxLength={2000}
            value={drawAnswer}
            onChange={(e) => setDrawAnswer(e.target.value)}
            placeholder="Optional."
            className={fieldClassName}
            autoFocus
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <p className="text-2xl leading-9 font-semibold">
            How should the artist reach you?
          </p>
          <div className="flex flex-wrap gap-3" role="radiogroup">
            {METHODS.map((m) => (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={contactMethod === m.value}
                onClick={() => setContactMethod(m.value)}
                className={`rounded-full border px-5 py-2 text-base font-semibold duration-200 ${
                  contactMethod === m.value
                    ? 'border-brand bg-brand text-white'
                    : 'border-[rgba(154,35,73,0.3)] text-brand'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {contactMethod !== 'email' && (
            <input
              type="text"
              maxLength={200}
              value={contactDetail}
              onChange={(e) => setContactDetail(e.target.value)}
              placeholder={
                contactMethod === 'phone'
                  ? 'Phone number'
                  : 'Video platform or handle'
              }
              className={fieldClassName}
              aria-label="Contact detail"
            />
          )}
          <input
            type="text"
            maxLength={200}
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
            placeholder="Best time, with your time zone (optional)"
            className={fieldClassName}
            aria-label="Best time to reach you"
          />
        </div>
      )}

      {error && <p className="mt-3 text-base font-medium text-brand/80">{error}</p>}

      <div className="mt-6 flex items-center gap-6">
        {step < 3 ? (
          <button type="button" onClick={next} className={ctaClassName}>
            CONTINUE
            <CtaArrow />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className={ctaClassName}
          >
            {submitting ? 'SENDING…' : 'SEND TO THE ARTIST'}
            {!submitting && <CtaArrow />}
          </button>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2 | 3)}
            className="text-base font-medium text-brand underline-offset-4 hover:underline"
          >
            Back
          </button>
        )}
      </div>
    </div>
  )
}

export default AcquisitionConversation
