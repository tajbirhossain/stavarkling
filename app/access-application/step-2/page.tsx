'use client'

import AccessSubmitOverlay from '@/components/access/AccessSubmitOverlay'
import Header from '@/components/Header'
import {
  ACCESS_APPLICATION_COUNTRIES,
  ACCESS_APPLICATION_LIMITS,
  isAccessApplicationStep2Valid,
  validateAccessApplicationStep2,
  type AccessApplicationFieldErrors,
} from '@/lib/accessApplication'
import {
  markAccessApplicationSubmitted,
  readAccessApplicationDraft,
  writeAccessApplicationDraft,
} from '@/lib/accessApplicationDraft'
import { submitAccessApplication } from '@/lib/submitAccessApplication'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const fieldClassName = (hasError: boolean) =>
  `w-full rounded-[10px] bg-white/80 border px-6 py-4 text-lg font-medium italic text-[#2a2a2a] placeholder:text-[#b0a8ab] placeholder:italic outline-none transition-colors disabled:opacity-60 max-[639px]:px-4 max-[639px]:py-3.5 max-[639px]:text-base ${
    hasError
      ? 'border-brand focus:border-brand'
      : 'border-[rgba(154,35,73,0.35)] focus:border-brand/50'
  }`

const AccessApplicationStep2 = () => {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [fullName, setFullName] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<AccessApplicationFieldErrors>({})
  const [touched, setTouched] = useState<
    Partial<Record<'fullName' | 'country' | 'email' | 'reason', boolean>>
  >({})
  const [hydrated, setHydrated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const draft = readAccessApplicationDraft()
    setFullName(draft.fullName)
    setCountry(draft.country)
    setEmail(draft.email)
    setReason(draft.reason)
    setHydrated(true)
  }, [])

  useGSAP(() => {
    gsap.set('.access-reveal', {
      opacity: 0,
      y: 25,
      filter: 'blur(8px)',
    })

    gsap.set('.access-title', {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    })

    gsap.set('.access-image', {
      opacity: 0,
      scale: 0.94,
      y: 30,
      filter: 'blur(12px)',
    })

    gsap.set('.access-meta', {
      opacity: 0,
      y: 15,
      filter: 'blur(6px)',
    })

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.out',
      },
    })

    tl.to('.access-reveal', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      stagger: {
        each: 0.08,
      },
      clearProps: 'all',
    })

    tl.to(
      '.access-title',
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.3,
        clearProps: 'all',
      },
      '-=0.9'
    )

    tl.to(
      '.access-image',
      {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.8,
        ease: 'power3.out',
        clearProps: 'all',
      },
      '-=1'
    )

    tl.to(
      '.access-meta',
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.1,
        clearProps: 'all',
      },
      '-=0.8'
    )

    gsap.to('.access-image', {
      y: '-=6',
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, { scope: containerRef })

  const draftFields = { fullName, country, email, reason }
  const canSubmit = isAccessApplicationStep2Valid(draftFields)

  function persistStep2(patch: Partial<typeof draftFields>) {
    writeAccessApplicationDraft(patch)
  }

  function clearFieldError(field: keyof AccessApplicationFieldErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  function markTouched(field: 'fullName' | 'country' | 'email' | 'reason') {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const nextErrors = validateAccessApplicationStep2(draftFields)
    setErrors((prev) => {
      const next = { ...prev }
      if (nextErrors[field]) next[field] = nextErrors[field]
      else delete next[field]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return

    const nextErrors = validateAccessApplicationStep2(draftFields)
    setErrors(nextErrors)
    setTouched({
      fullName: true,
      country: true,
      email: true,
      reason: true,
    })

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    // Merge step 2 into the session draft, then send steps 1+2 together
    const draft = writeAccessApplicationDraft({
      fullName: fullName.trim(),
      country: country.trim(),
      email: email.trim().toLowerCase(),
      reason: reason.trim(),
    })

    try {
      const result = await submitAccessApplication(draft)

      if (!result.ok) {
        setErrors(result.errors)
        setSubmitting(false)
        return
      }

      markAccessApplicationSubmitted()
      router.push('/access-application/step-3')
    } catch {
      setErrors({
        form: 'A quiet interruption occurred. Please try again.',
      })
      setSubmitting(false)
    }
  }

  return (
    <div ref={containerRef}>
      <div className="bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover">
        <Header ind={-1} />

        <section className="py-14 pb-0 max-[1023px]:py-12 max-[639px]:py-8">
          <div className="containerMain flex flex-row justify-between gap-x-10 max-[1023px]:flex-col max-[1023px]:gap-y-12">
            <div className="w-[42%] access-reveal max-[1023px]:w-full">
              <div className="relative rounded-[15px] border border-[rgba(154,35,73,0.2)] bg-[rgba(154,35,73,0.06)] px-10 py-10 max-[1023px]:px-8 max-[639px]:px-5 max-[639px]:py-8">
                <AccessSubmitOverlay open={submitting} />

                <h4 className="mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                  STEP <span className="fontCinzel font-medium">2</span> OF{' '}
                  <span className="fontCinzel font-medium">3</span>
                </h4>

                <h1 className="relative mb-13 max-[639px]:mb-10 text-[42px] max-[1023px]:text-[2.625rem] max-[639px]:text-[2rem] leading-12 max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:bg-brand before:content-['']">
                  PRIVATE ACQUISITION{' '}
                  <br className="block max-[639px]:hidden" />
                  REQUEST
                </h1>

                <p className="mb-10 max-[639px]:mb-8 text-lg max-[639px]:text-base leading-8 max-[639px]:leading-7 font-medium">
                  Please provide the following details.{' '}
                  <br className="block max-[639px]:hidden" />
                  Your request will be reviewed personally.
                </p>

                <form
                  className="mb-8 flex-col gap-y-6 max-[639px]:gap-y-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <fieldset disabled={submitting} className="contents">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-lg font-bold text-brand max-[639px]:text-base tracking-wide"
                      >
                        FULL NAME <span className="font-medium">*</span>
                      </label>
                      <input
                        id="name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={ACCESS_APPLICATION_LIMITS.fullName.min}
                        maxLength={ACCESS_APPLICATION_LIMITS.fullName.max}
                        value={hydrated ? fullName : ''}
                        onChange={(e) => {
                          const value = e.target.value.slice(
                            0,
                            ACCESS_APPLICATION_LIMITS.fullName.max
                          )
                          setFullName(value)
                          persistStep2({ fullName: value })
                          clearFieldError('fullName')
                        }}
                        onBlur={() => markTouched('fullName')}
                        placeholder="Your full name"
                        aria-invalid={Boolean(
                          touched.fullName && errors.fullName
                        )}
                        aria-describedby={
                          touched.fullName && errors.fullName
                            ? 'fullName-error'
                            : undefined
                        }
                        className={fieldClassName(
                          Boolean(touched.fullName && errors.fullName)
                        )}
                      />
                      {touched.fullName && errors.fullName ? (
                        <p
                          id="fullName-error"
                          className="mt-2 text-base font-medium text-brand max-[639px]:text-sm"
                        >
                          {errors.fullName}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-lg font-bold text-brand max-[639px]:text-base tracking-wide"
                      >
                        COUNTRY <span className="font-medium">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="country"
                          name="country"
                          required
                          value={hydrated ? country : ''}
                          onChange={(e) => {
                            setCountry(e.target.value)
                            persistStep2({ country: e.target.value })
                            clearFieldError('country')
                          }}
                          onBlur={() => markTouched('country')}
                          aria-invalid={Boolean(
                            touched.country && errors.country
                          )}
                          aria-describedby={
                            touched.country && errors.country
                              ? 'country-error'
                              : undefined
                          }
                          className={`w-full appearance-none rounded-[10px] border bg-white/80 px-6 py-4 pr-12 text-lg font-medium italic outline-none transition-colors disabled:opacity-60 max-[639px]:px-4 max-[639px]:py-3.5 max-[639px]:pr-10 max-[639px]:text-base ${
                            touched.country && errors.country
                              ? 'border-brand focus:border-brand'
                              : 'border-[rgba(154,35,73,0.35)] focus:border-brand/50'
                          } ${country ? 'text-[#2a2a2a]' : 'text-[#b0a8ab]'}`}
                        >
                          <option value="" disabled>
                            Select your country
                          </option>
                          {ACCESS_APPLICATION_COUNTRIES.map((c) => (
                            <option
                              key={c}
                              value={c}
                              className="text-[#2a2a2a] not-italic"
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute top-1/2 right-5 max-[639px]:right-4 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      {touched.country && errors.country ? (
                        <p
                          id="country-error"
                          className="mt-2 text-base font-medium text-brand max-[639px]:text-sm"
                        >
                          {errors.country}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-lg font-bold text-brand max-[639px]:text-base tracking-wide"
                      >
                        EMAIL ADDRESS <span className="font-medium">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        maxLength={254}
                        value={hydrated ? email : ''}
                        onChange={(e) => {
                          const value = e.target.value.slice(0, 254)
                          setEmail(value)
                          persistStep2({ email: value })
                          clearFieldError('email')
                        }}
                        onBlur={() => markTouched('email')}
                        placeholder="Your email address"
                        aria-invalid={Boolean(touched.email && errors.email)}
                        aria-describedby={
                          touched.email && errors.email
                            ? 'email-error'
                            : undefined
                        }
                        className={fieldClassName(
                          Boolean(touched.email && errors.email)
                        )}
                      />
                      {touched.email && errors.email ? (
                        <p
                          id="email-error"
                          className="mt-2 text-base font-medium text-brand max-[639px]:text-sm"
                        >
                          {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="reason"
                        className="mb-2 block text-lg font-bold text-brand max-[639px]:text-base tracking-wide"
                      >
                        WHAT BROUGHT YOU THIS FAR?{' '}
                        <span className="font-medium">*</span>
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        required
                        minLength={ACCESS_APPLICATION_LIMITS.reason.min}
                        maxLength={ACCESS_APPLICATION_LIMITS.reason.max}
                        value={hydrated ? reason : ''}
                        onChange={(e) => {
                          const value = e.target.value.slice(
                            0,
                            ACCESS_APPLICATION_LIMITS.reason.max
                          )
                          setReason(value)
                          persistStep2({ reason: value })
                          clearFieldError('reason')
                        }}
                        onBlur={() => markTouched('reason')}
                        placeholder="Share what convinced you to continue."
                        rows={5}
                        aria-invalid={Boolean(touched.reason && errors.reason)}
                        aria-describedby={
                          touched.reason && errors.reason
                            ? 'reason-error'
                            : 'reason-hint'
                        }
                        className={`w-full resize-none rounded-[10px] border bg-white/80 px-6 py-5 text-lg font-medium text-[#2a2a2a] italic outline-none transition-colors placeholder:text-[#b0a8ab] placeholder:italic disabled:opacity-60 max-[639px]:px-4 max-[639px]:py-4 max-[639px]:text-base ${
                          touched.reason && errors.reason
                            ? 'border-brand focus:border-brand'
                            : 'border-[rgba(154,35,73,0.35)] focus:border-brand/50'
                        }`}
                      />
                      <div className="mt-2 flex items-start justify-between gap-x-4">
                        <p
                          id={
                            touched.reason && errors.reason
                              ? 'reason-error'
                              : 'reason-hint'
                          }
                          className={`text-base font-medium max-[639px]:text-sm ${
                            touched.reason && errors.reason
                              ? 'text-brand'
                              : 'text-[#767676]'
                          }`}
                        >
                          {touched.reason && errors.reason
                            ? errors.reason
                            : `Required. At least ${ACCESS_APPLICATION_LIMITS.reason.min} characters.`}
                        </p>
                        <p className="shrink-0 text-base font-medium text-[#767676] max-[639px]:text-sm">
                          {reason.trim().length}/
                          {ACCESS_APPLICATION_LIMITS.reason.max}
                        </p>
                      </div>
                    </div>
                  </fieldset>

                  {errors.form ? (
                    <p
                      className="text-base font-medium text-brand italic max-[639px]:text-sm"
                      role="alert"
                    >
                      {errors.form}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    aria-busy={submitting}
                    className={`btnGradient mb-0 inline-flex w-full items-center justify-center gap-x-4 py-4 text-lg duration-300 max-[639px]:py-3.5 max-[639px]:text-base ${
                      !canSubmit || submitting
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:gap-x-6'
                    }`}
                  >
                    {submitting ? 'RECEIVING…' : 'SUBMIT REQUEST'}
                    {!submitting ? (
                      <img
                        src="/images/icons/arrow-right.png"
                        alt=""
                        className="w-5 brightness-[100]"
                      />
                    ) : null}
                  </button>
                </form>

                <div className="flex items-center justify-center gap-x-4">
                  <span className="h-0.5 w-10 bg-brand" />
                  <img
                    src="/images/icons/lotus-solid-icon.png"
                    alt=""
                    className="w-6"
                  />
                  <span className="h-0.5 w-10 bg-brand" />
                </div>
              </div>
            </div>

            <div className="mx-0 w-[50%] max-w-none max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[520px]">
              <h2 className='access-title relative mb-13 max-[639px]:mb-10 text-center text-7xl font-medium text-brand italic max-[1023px]:text-6xl max-[767px]:text-5xl max-[639px]:text-4xl before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""]'>
                A Universe. Decided.
              </h2>

              <img
                src="/images/artwork.png"
                alt=""
                className="access-image mx-auto w-full max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-[1023px]:max-w-[420px] max-[1023px]:shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
              />

              <p className="access-meta mb-3 pt-10 max-[639px]:pt-8 text-center text-xl max-[639px]:text-lg font-medium">
                Stavarkle <span className="fontCinzel font-medium">#1</span>
              </p>

              <p className="access-meta fontCinzel mb-6 text-center text-lg max-[639px]:text-base leading-7">
                104.4 x 75.2 x 1.5 cm
                <br />
                41.06 x 29.61 x 0.59 in
              </p>

              <div className="access-meta flex items-center justify-center gap-x-4">
                <span className="h-0.5 w-10 bg-brand" />
                <img
                  src="/images/icons/lotus-solid-icon.png"
                  alt=""
                  className="w-6"
                />
                <span className="h-0.5 w-10 bg-brand" />
              </div>
            </div>
          </div>

          <div className="access-meta mt-16 max-[639px]:mt-10 bg-[rgba(154,35,73,0.06)] py-8 max-[639px]:py-6">
            <p className="px-5 text-lg font-medium text-brand max-[639px]:text-base italic">
              Access to the Decision Space is reserved for selected applicants.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AccessApplicationStep2
