'use client'

import Header from '@/components/Header'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState, type FormEvent } from 'react'

type Step = 'email' | 'otp'

const fieldClass =
  'w-full rounded-[10px] bg-white/80 border border-[rgba(154,35,73,0.35)] px-6 py-4 text-lg font-medium italic text-[#2a2a2a] placeholder:text-[#b0a8ab] placeholder:italic outline-none focus:border-brand/50 transition-colors disabled:opacity-60'

export default function AccessAuthWall() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [statusLine, setStatusLine] = useState('Sending your private code…')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [cooldown])

  useEffect(() => {
    if (!busy) return
    const lines =
      step === 'email'
        ? [
            'Looking for your application…',
            'Preparing a private code…',
            'Sending to your inbox…',
          ]
        : [
            'Confirming your code…',
            'Opening the Access section…',
            'Almost there…',
          ]
    setStatusLine(lines[0])
    let index = 0
    const id = window.setInterval(() => {
      index = (index + 1) % lines.length
      setStatusLine(lines[index])
    }, 1600)
    return () => window.clearInterval(id)
  }, [busy, step])

  useGSAP(() => {
    gsap.fromTo(
      '.auth-reveal',
      { opacity: 0, y: 24, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        clearProps: 'all',
      }
    )
  }, { scope: containerRef, dependencies: [step] })

  async function requestOtp(e?: FormEvent) {
    e?.preventDefault()
    if (busy) return

    setError(null)
    setBusy(true)

    try {
      const response = await fetch('/api/access/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as {
        error?: string
        errors?: { email?: string; form?: string }
        retryAfterSeconds?: number
      }

      if (!response.ok) {
        if (response.status === 429 && data.retryAfterSeconds) {
          setCooldown(data.retryAfterSeconds)
        }
        setError(data.errors?.email || data.errors?.form || data.error || 'Unable to continue.')
        setBusy(false)
        return
      }

      setCooldown(60)
      setStep('otp')
      setCode('')
      setBusy(false)
    } catch {
      setError('A quiet interruption occurred. Please try again.')
      setBusy(false)
    }
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault()
    if (busy) return

    setError(null)
    setBusy(true)

    try {
      const response = await fetch('/api/access/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = (await response.json()) as {
        error?: string
        errors?: { code?: string; form?: string }
        accessStage?: number
        panelStage?: number
      }

      if (!response.ok) {
        setError(data.errors?.code || data.errors?.form || data.error || 'Unable to verify.')
        setBusy(false)
        return
      }

      // Land on the panel they've entered, not merely the granted ceiling.
      const stage = data.panelStage ?? data.accessStage ?? 1
      const path =
        stage === 3
          ? '/access/stage-3'
          : stage === 2
            ? '/access/stage-2'
            : '/access'

      // Hard navigation so the server re-reads the live DB stage.
      window.location.assign(path)
      return
    } catch {
      setError('A quiet interruption occurred. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div ref={containerRef}>
      <div className="bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover min-h-dvh">
        <Header ind={4} />

        <section className="py-14 max-[1023px]:py-12 max-[639px]:py-8">
          <div className="containerMain flex justify-center">
            <div className="auth-reveal relative w-full max-w-[520px] rounded-[15px] border border-[rgba(154,35,73,0.2)] bg-[rgba(154,35,73,0.06)] px-10 py-12 max-[639px]:px-5 max-[639px]:py-8">
              {busy ? (
                <div
                  className="absolute inset-0 z-20 overflow-hidden rounded-[15px]"
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="absolute inset-0 bg-[rgba(241,231,232,0.84)] backdrop-blur-[6px]" />
                  <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center px-8 text-center max-[639px]:min-h-[280px] max-[639px]:px-5">
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-brand/25 bg-white/40 max-[639px]:mb-6 max-[639px]:h-16 max-[639px]:w-16">
                      <img
                        src="/images/icons/lotus-solid-icon.png"
                        alt=""
                        className="w-10 animate-pulse max-[639px]:w-8"
                      />
                    </div>
                    <p className="fontCinzel mb-4 text-sm tracking-[0.28em] text-brand uppercase max-[639px]:mb-3 max-[639px]:text-xs">
                      Please wait
                    </p>
                    <p className="mb-8 text-2xl font-medium text-[#2a2a2a] italic max-[639px]:mb-6 max-[639px]:text-xl">
                      {statusLine}
                    </p>
                    <span className="block h-[1.5px] w-28 bg-brand max-[639px]:w-20" />
                  </div>
                </div>
              ) : null}

              <p className="mb-4 text-lg font-bold text-brand max-[639px]:text-base tracking-wide">
                PRIVATE ENTRY
              </p>

              <h1 className="relative mb-8 text-[40px] max-[639px]:text-[2rem] leading-12 max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1rem] before:left-0 before:h-0.5 before:w-10 before:bg-brand before:content-['']">
                {step === 'email' ? 'PRIVATE ACCESS' : 'VERIFY ACCESS'}
              </h1>

              <p className="mb-10 max-[639px]:mb-8 pt-2 text-lg max-[639px]:text-base leading-8 max-[639px]:leading-7 font-medium">
                {step === 'email' ? (
                  <>
                    Enter the email used in your access application.{' '}
                    <br className="block max-[639px]:hidden" />
                    <span className="text-brand italic">
                      Only verified applicants may continue.
                    </span>
                  </>
                ) : (
                  <>
                    A private code has been sent to{' '}
                    <br className="block max-[639px]:hidden" />
                    <span className="text-brand italic break-all">{email.trim()}</span>
                  </>
                )}
              </p>

              {step === 'email' ? (
                <form className="flex flex-col gap-y-6" onSubmit={requestOtp} noValidate>
                  <div>
                    <label
                      htmlFor="access-email"
                      className="block text-lg font-bold text-brand tracking-wide mb-2"
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="access-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError(null)
                      }}
                      placeholder="The email on your application"
                      className={fieldClass}
                    />
                  </div>

                  {error ? (
                    <p className="text-base font-medium text-brand italic" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={busy || !email.trim()}
                    className={`btnGradient w-full py-4 text-lg inline-flex items-center justify-center gap-x-4 duration-300 ${
                      busy || !email.trim()
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:gap-x-6'
                    }`}
                  >
                    CONTINUE
                    <img
                      src="/images/icons/arrow-right.png"
                      alt=""
                      className="w-5 brightness-[100]"
                    />
                  </button>
                </form>
              ) : (
                <form className="flex flex-col gap-y-6" onSubmit={verifyOtp} noValidate>
                  <div>
                    <label
                      htmlFor="access-otp"
                      className="block text-lg font-bold text-brand tracking-wide mb-2"
                    >
                      VERIFICATION CODE
                    </label>
                    <input
                      id="access-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      value={code}
                      onChange={(e) => {
                        const next = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setCode(next)
                        setError(null)
                      }}
                      placeholder="6-digit code"
                      className={`${fieldClass} tracking-[0.35em] text-center not-italic`}
                    />
                  </div>

                  {error ? (
                    <p className="text-base font-medium text-brand italic" role="alert">
                      {error}
                    </p>
                  ) : (
                    <p className="text-base font-medium text-[#767676]">
                      The code expires in 10 minutes.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy || code.length !== 6}
                    className={`btnGradient w-full py-4 text-lg inline-flex items-center justify-center gap-x-4 duration-300 ${
                      busy || code.length !== 6
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:gap-x-6'
                    }`}
                  >
                    ENTER ACCESS
                    <img
                      src="/images/icons/arrow-right.png"
                      alt=""
                      className="w-5 brightness-[100]"
                    />
                  </button>

                  <div className="flex flex-row items-center justify-between gap-x-4 pt-1 max-[639px]:flex-col max-[639px]:items-start max-[639px]:gap-3">
                    <button
                      type="button"
                      className="text-base font-medium text-brand italic underline-offset-4 hover:underline"
                      onClick={() => {
                        setStep('email')
                        setCode('')
                        setError(null)
                      }}
                    >
                      Use a different email
                    </button>

                    <button
                      type="button"
                      disabled={busy || cooldown > 0}
                      onClick={() => requestOtp()}
                      className={`text-base font-medium italic ${
                        cooldown > 0
                          ? 'text-[#767676] cursor-not-allowed'
                          : 'text-brand underline-offset-4 hover:underline'
                      }`}
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </form>
              )}

              <div className="flex items-center justify-center gap-x-4 mt-10">
                <span className="w-10 h-0.5 bg-brand" />
                <img
                  src="/images/icons/lotus-solid-icon.png"
                  alt=""
                  className="w-6"
                />
                <span className="w-10 h-0.5 bg-brand" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
