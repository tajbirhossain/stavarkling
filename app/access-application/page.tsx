'use client'

import Header from '@/components/Header'
import {
  ACCESS_APPLICATION_LIMITS,
  validateAccessApplicationStep1,
  type AccessApplicationFieldErrors,
} from '@/lib/accessApplication'
import {
  readAccessApplicationDraft,
  writeAccessApplicationDraft,
} from '@/lib/accessApplicationDraft'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const questions = [
  'What creates value?',
  'What would ownership mean to you?',
  'Can something unknown become valuable simply because someone decides it is?',
]

const AccessApplication = () => {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [reflection, setReflection] = useState('')
  const [errors, setErrors] = useState<AccessApplicationFieldErrors>({})
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const draft = readAccessApplicationDraft()
    setReflection(draft.reflection)
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

  const reflectionLength = reflection.trim().length
  const reflectionError = errors.reflection

  function handleContinue() {
    const nextErrors = validateAccessApplicationStep1({ reflection })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    writeAccessApplicationDraft({ reflection: reflection.trim() })
    router.push('/access-application/step-2')
  }

  return (
    <div ref={containerRef}>
      <div className="bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover">
        <Header ind={-1} />

        <section className="py-14 pb-0 max-[1023px]:py-12 max-[639px]:py-8">
          <div className="containerMain flex flex-row justify-between gap-x-10 max-[1023px]:flex-col max-[1023px]:gap-y-12">
            {/* Left — application */}
            <div className="w-[42%] access-reveal max-[1023px]:w-full">
              <div className="rounded-[15px] border border-[rgba(154,35,73,0.2)] bg-[rgba(154,35,73,0.06)] px-10 py-10 max-[1023px]:px-8 max-[639px]:px-5 max-[639px]:py-8">
                <h4 className="mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                  STEP <span className="fontCinzel font-medium">1</span> OF{' '}
                  <span className="fontCinzel font-medium">3</span>
                </h4>

                <h1 className="relative mb-13 max-[639px]:mb-10 text-[42px] max-[1023px]:text-[2.625rem] max-[639px]:text-[2rem] leading-12 max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:bg-brand before:content-['']">
                  ACCESS APPLICATION
                </h1>

                <p className="mb-10 max-[639px]:mb-8 text-lg max-[639px]:text-base leading-8 max-[639px]:leading-7 font-medium">
                  Access to further stages is reviewed personally.{' '}
                  <br className="block max-[639px]:hidden" />
                  Not every application proceeds.{' '}
                  <br className="block max-[639px]:hidden" />
                  <span className="text-brand italic">
                    The outcome remains unknown.
                  </span>
                </p>

                <div className="mb-10 max-[639px]:mb-8">
                  <h2 className="mb-2 text-lg font-bold text-brand max-[639px]:text-base tracking-wide">
                    PRIVATE REFLECTION
                  </h2>
                  <p className="mb-6 max-[639px]:mb-5 text-lg max-[639px]:text-base leading-7 font-medium">
                    Take a moment to reflect on the questions below.{' '}
                    <br className="block max-[639px]:hidden" />
                    There are no right or wrong answers.
                  </p>

                  <div className="border-t border-[rgba(154,35,73,0.2)]">
                    {questions.map((question, index) => {
                      const isOpen = openQuestion === index

                      return (
                        <div
                          key={question}
                          className="border-b border-[rgba(154,35,73,0.2)]"
                        >
                          <button
                            type="button"
                            // onClick={() =>
                            //   setOpenQuestion(isOpen ? null : index)
                            // }
                            className="flex w-full cursor-pointer items-center justify-between gap-x-4 max-[639px]:gap-x-3 py-5 max-[639px]:py-4 text-left"
                          >
                            <span className="flex items-baseline gap-x-4 max-[639px]:gap-x-3">
                              <span className="fontCinzel shrink-0 text-2xl font-medium text-brand max-[639px]:text-xl">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="text-xl leading-8 font-semibold max-[639px]:text-base max-[639px]:leading-7">
                                {question}
                              </span>
                            </span>
                            {/* <img
                              src="/images/icons/arrow-down.png"
                              alt=""
                              className="w-3.5 shrink-0 opacity-60 transition-transform duration-300"
                              style={{
                                transform: isOpen
                                  ? 'rotate(-90deg)'
                                  : 'rotate(0deg)',
                              }}
                            /> */}
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen ? 'max-h-24 pb-5' : 'max-h-0'
                            }`}
                          >
                            <p className="pl-12 max-[639px]:pl-0 text-lg font-medium text-brand/70 italic max-[639px]:text-base">
                              Reflect privately. Nothing here is recorded.
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="mb-2 text-lg font-bold text-brand max-[639px]:text-base tracking-wide">
                    OPTIONAL REFLECTION
                  </h2>
                  <p className="mb-5 text-lg max-[639px]:text-base leading-7 font-medium">
                    What stayed with you? Share your thoughts if you wish.{' '}
                    <br className="block max-[639px]:hidden" />
                    This is entirely optional.
                  </p>
                  <textarea
                    value={hydrated ? reflection : ''}
                    onChange={(e) => {
                      const value = e.target.value.slice(
                        0,
                        ACCESS_APPLICATION_LIMITS.reflection.max
                      )
                      setReflection(value)
                      if (errors.reflection) {
                        setErrors((prev) => {
                          const next = { ...prev }
                          delete next.reflection
                          return next
                        })
                      }
                    }}
                    placeholder="Type here..."
                    rows={5}
                    maxLength={ACCESS_APPLICATION_LIMITS.reflection.max}
                    aria-invalid={Boolean(reflectionError)}
                    aria-describedby={
                      reflectionError ? 'reflection-error' : 'reflection-hint'
                    }
                    className={`w-full resize-none rounded-[10px] border bg-white/80 px-6 py-5 text-lg font-medium text-[#2a2a2a] italic outline-none transition-colors placeholder:text-[#b0a8ab] placeholder:italic max-[639px]:px-4 max-[639px]:py-4 max-[639px]:text-base ${
                      reflectionError
                        ? 'border-brand focus:border-brand'
                        : 'border-[rgba(154,35,73,0.35)] focus:border-brand/50'
                    }`}
                  />
                  <div className="mt-2 flex items-start justify-between gap-x-4">
                    <p
                      id={reflectionError ? 'reflection-error' : 'reflection-hint'}
                      className={`text-base font-medium max-[639px]:text-sm ${
                        reflectionError ? 'text-brand' : 'text-[#767676]'
                      }`}
                    >
                      {reflectionError ?? 'Optional. You may leave this blank.'}
                    </p>
                    <p className="shrink-0 text-base font-medium text-[#767676] max-[639px]:text-sm">
                      {reflectionLength}/{ACCESS_APPLICATION_LIMITS.reflection.max}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="btnGradient mb-8 inline-flex w-full items-center justify-center gap-x-4 py-4 max-[639px]:py-3.5 text-lg max-[639px]:text-base duration-300 hover:gap-x-6"
                >
                  CONTINUE
                  <img
                    src="/images/icons/arrow-right.png"
                    alt=""
                    className="w-5 brightness-[100]"
                  />
                </button>

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

            {/* Right — artwork */}
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
                {/* 104.4 x 75.2 x 1.5 cm
                <br />
                41.06 x 29.61 x 0.59 in */}
                104.3 x 75.2 x 1.5 cm
                <br />
                41.1 x 29.6 x 0.6 in
                <br />
                <span className="capitalize">(Including frame)</span>
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
            <p className="px-5 text-lg font-medium text-brand text-center max-[639px]:text-base italic">
              This is not a traditional art sale.{' '}
              <br className="block max-[639px]:hidden" />
              It is a social experiment.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AccessApplication
