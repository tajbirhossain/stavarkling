'use client'

import type { StageContent } from '@/lib/accessStages'
import { useState, useTransition } from 'react'

type NextStepsCardProps = {
  content: StageContent['nextSteps']
  alreadyRequested?: boolean
}

const beats = (content: StageContent['nextSteps']) =>
  [content.process, content.next, content.final] as const

const ALREADY_MESSAGE =
  'Your request has already been received. Patience is part of the process.'

const SUCCESS_MESSAGE =
  'Your request has been received. We will continue when the moment is right.'

const NextStepsCard = ({
  content,
  alreadyRequested = false,
}: NextStepsCardProps) => {
  const [requested, setRequested] = useState(alreadyRequested)
  const [message, setMessage] = useState(
    alreadyRequested ? ALREADY_MESSAGE : ''
  )
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleRequest = () => {
    if (requested || isPending) return
    setError('')

    startTransition(async () => {
      try {
        const res = await fetch('/api/access/request-next-stage', {
          method: 'POST',
        })
        const data = (await res.json()) as {
          alreadyRequested?: boolean
          message?: string
          error?: string
        }

        if (res.status === 409 || data.alreadyRequested) {
          setRequested(true)
          setMessage(data.message || ALREADY_MESSAGE)
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
        setMessage(data.message || SUCCESS_MESSAGE)
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
              {beats(content).map((beat) => (
                <div key={beat.label}>
                  <p className="mb-2 text-sm font-bold tracking-[0.14em] text-brand">
                    {beat.label}
                  </p>
                  <p className="relative pb-5 text-lg font-medium leading-8 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-8 before:bg-brand before:content-[''] max-[767px]:before:left-1/2 max-[767px]:before:-translate-x-1/2">
                    {beat.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start gap-4 max-[767px]:items-center">
              {requested ? (
                <p className="max-w-xl text-lg font-medium leading-8 text-brand italic">
                  {message}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleRequest}
                  disabled={isPending}
                  className="btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 disabled:cursor-wait disabled:opacity-70 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base"
                >
                  {isPending ? 'SUBMITTING…' : content.cta}
                  {!isPending && (
                    <img
                      src="/images/icons/arrow-right.png"
                      alt=""
                      className="w-5 brightness-[100]"
                    />
                  )}
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

/*
 * ---------------------------------------------------------------------------
 * ORIGINAL NextStepsCard (paragraph list + optional CTA)
 * Restore if client prefers the previous card. Also restore original
 * nextSteps shape in lib/accessStages.ts (see comment there).
 * ---------------------------------------------------------------------------
 *
 * const NextStepsCard = ({ content }: NextStepsCardProps) => {
 *   return (
 *     <section className="pb-20">
 *       <div className="containerMain">
 *         <div className="access-reveal max-w-4xl mx-auto rounded-[15px] bg-[rgba(154,35,73,0.04)] border border-[rgba(154,35,73,0.15)] px-14 py-12 max-[767px]:px-8 max-[767px]:py-10 flex flex-row items-start gap-12 max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-8">
 *           <img
 *             src="/images/icons/lotus-icon-colored.png"
 *             alt=""
 *             className="w-14 shrink-0"
 *           />
 *
 *           <div className="text-left max-[767px]:text-center">
 *             <h2 className="text-xl font-bold text-brand tracking-wide mb-5">
 *               {content.title}
 *             </h2>
 *
 *             <div className="space-y-2">
 *               {content.paragraphs.map((paragraph) => (
 *                 <p key={paragraph} className="text-lg font-medium leading-8">
 *                   {paragraph}
 *                 </p>
 *               ))}
 *             </div>
 *
 *             {content.cta && (
 *               <button
 *                 type="button"
 *                 className="btnGradient mt-8 py-3 px-5 text-lg inline-flex items-center justify-center gap-x-7 duration-300 hover:gap-x-9"
 *               >
 *                 {content.cta}
 *                 <img
 *                   src="/images/icons/arrow-right.png"
 *                   alt=""
 *                   className="w-5 brightness-[100]"
 *                 />
 *               </button>
 *             )}
 *           </div>
 *         </div>
 *       </div>
 *     </section>
 *   )
 * }
 */

export default NextStepsCard
