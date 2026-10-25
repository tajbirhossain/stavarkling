'use client'

import {
  isStoredAccessStage,
  type AccessStage,
  type StageContent,
} from '@/lib/accessStages'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

type NextStepsCardProps = {
  content: StageContent['nextSteps']
  pageStage: AccessStage
  memberStage: AccessStage
  alreadyRequested?: boolean
}

const PENDING_TITLE = 'REQUEST RECEIVED'
const PENDING_BODY =
  'Your request for the next stage is awaiting personal review.'

const CtaArrow = () => (
  <img
    src="/images/icons/arrow-right.png"
    alt=""
    className="w-5 brightness-[100]"
  />
)

const ctaClassName =
  'btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base'

const NextStepsCard = ({
  content,
  pageStage,
  memberStage,
  alreadyRequested = false,
}: NextStepsCardProps) => {
  const router = useRouter()
  const [requested, setRequested] = useState(alreadyRequested)
  const [liveMemberStage, setLiveMemberStage] = useState(memberStage)
  const [error, setError] = useState('')
  const [isAdvancing, setIsAdvancing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setLiveMemberStage(memberStage)
  }, [memberStage])

  useEffect(() => {
    setRequested(alreadyRequested)
  }, [alreadyRequested])

  // While awaiting review, pick up admin stage grants without a full reload.
  useEffect(() => {
    if (!requested || liveMemberStage > pageStage || pageStage >= 3) return

    let cancelled = false

    const checkStage = async () => {
      try {
        const res = await fetch('/api/access/request-next-stage')
        if (!res.ok || cancelled) return
        const data = (await res.json()) as { accessStage?: unknown }
        if (isStoredAccessStage(data.accessStage) && !cancelled) {
          setLiveMemberStage(data.accessStage)
        }
      } catch {
        // Ignore transient network errors while polling.
      }
    }

    void checkStage()
    const id = window.setInterval(checkStage, 4000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [requested, liveMemberStage, pageStage])

  const canAdvance =
    liveMemberStage > pageStage &&
    Boolean(content.advanceCta) &&
    Boolean(content.advanceHref)

  const isAcquisition = Boolean(content.ctaHref)

  const advancingLabel =
    pageStage === 1 ? 'ENTERING…' : 'PROCEEDING…'

  const handleAdvance = () => {
    if (!content.advanceHref || isAdvancing) return
    setError('')
    setIsAdvancing(true)

    void (async () => {
      try {
        const res = await fetch('/api/access/enter-next-panel', {
          method: 'POST',
        })
        const data = (await res.json()) as {
          path?: string
          error?: string
        }

        if (!res.ok) {
          setError(data.error || 'Unable to continue right now. Please try again.')
          setIsAdvancing(false)
          return
        }

        router.push(data.path || content.advanceHref!)
      } catch {
        setError('Unable to continue right now. Please try again.')
        setIsAdvancing(false)
      }
    })()
  }

  const handleRequest = () => {
    if (requested || isPending || canAdvance || isAcquisition) return
    setError('')

    startTransition(async () => {
      try {
        const res = await fetch('/api/access/request-next-stage', {
          method: 'POST',
        })
        const data = (await res.json()) as {
          alreadyRequested?: boolean
          error?: string
        }

        if (res.status === 409 || data.alreadyRequested) {
          setRequested(true)
          return
        }

        if (!res.ok) {
          setError(
            data.error ||
              'Unable to submit your request right now. Please try again.'
          )
          return
        }

        setRequested(true)
      } catch {
        setError('Unable to submit your request right now. Please try again.')
      }
    })
  }

  return (
    <section className="pb-20 max-[767px]:pb-16">
      <div className="containerMain">
        <div className="access-reveal mx-auto flex max-w-4xl flex-row items-start gap-12 rounded-[15px] border border-[rgba(154,35,73,0.15)] bg-[rgba(154,35,73,0.04)] px-14 py-12 max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-8 max-[767px]:px-8 max-[767px]:py-10">
          <img
            src="/images/icons/lotus-icon-colored.png"
            alt=""
            className="w-14 shrink-0"
          />

          <div className="w-full text-left max-[767px]:text-center">
            <h2 className="mb-8 text-xl font-bold tracking-wide text-brand max-[767px]:mb-7">
              {content.title}
            </h2>

            <div className="space-y-7">
              {content.beats.map((beat) => (
                <div key={`${beat.label}-${beat.title ?? ''}`}>
                  <p className="mb-2 text-sm font-bold tracking-[0.14em] text-brand">
                    {beat.label}
                  </p>
                  {beat.title ? (
                    <p className="mb-2 text-lg font-bold tracking-wide text-brand">
                      {beat.title}
                    </p>
                  ) : null}
                  <p className="relative pb-5 text-lg font-medium leading-8 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-8 before:bg-brand before:content-[''] max-[767px]:before:left-1/2 max-[767px]:before:-translate-x-1/2">
                    {beat.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start gap-4 max-[767px]:items-center">
              {canAdvance ? (
                <button
                  type="button"
                  onClick={handleAdvance}
                  disabled={isAdvancing}
                  className={`${ctaClassName} disabled:cursor-wait disabled:opacity-70`}
                >
                  {isAdvancing ? advancingLabel : content.advanceCta}
                  {!isAdvancing && <CtaArrow />}
                </button>
              ) : isAcquisition ? (
                <Link href={content.ctaHref!} className={ctaClassName}>
                  {content.cta}
                  <CtaArrow />
                </Link>
              ) : requested ? (
                <div className="max-w-xl">
                  <p className="text-lg font-bold tracking-wide text-brand">
                    {PENDING_TITLE}
                  </p>
                  <p className="mt-2 text-lg font-medium leading-8 text-brand/90">
                    {PENDING_BODY}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequest}
                  disabled={isPending}
                  className={`${ctaClassName} disabled:cursor-wait disabled:opacity-70`}
                >
                  {isPending ? 'SUBMITTING…' : content.cta}
                  {!isPending && <CtaArrow />}
                </button>
              )}

              {error && (
                <p className="text-base font-medium text-brand/80">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NextStepsCard
