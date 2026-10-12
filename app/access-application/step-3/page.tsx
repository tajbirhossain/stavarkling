'use client'

import Header from '@/components/Header'
import { hasAccessApplicationSubmitted } from '@/lib/accessApplicationDraft'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const AccessApplicationStep3 = () => {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (!hasAccessApplicationSubmitted()) {
      router.replace('/access-application/step-2')
      return
    }
    setAllowed(true)
  }, [router])

  useGSAP(
    () => {
      if (!allowed) return

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
    },
    { scope: containerRef, dependencies: [allowed] }
  )

  if (!allowed) {
    return (
      <div className="min-h-dvh bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
        <div className="text-center px-8">
          <img
            src="/images/icons/lotus-solid-icon.png"
            alt=""
            className="w-10 mx-auto mb-6 opacity-80"
          />
          <p className="text-xl font-medium italic text-brand">
            Preparing your confirmation…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <div className="bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover">
        <Header ind={-1} />

        <section className="py-14 pb-0 max-[1023px]:py-12 max-[639px]:py-8">
          <div className="containerMain flex flex-row justify-between gap-x-10 max-[1023px]:flex-col max-[1023px]:gap-y-12">
            <div className="w-[42%] access-reveal max-[1023px]:w-full">
              <div className="flex min-h-[640px] flex-col items-center justify-center rounded-[15px] border border-[rgba(154,35,73,0.2)] bg-[rgba(154,35,73,0.06)] px-10 py-14 text-center max-[1023px]:min-h-0 max-[1023px]:px-8 max-[1023px]:py-12 max-[639px]:px-5 max-[639px]:py-10">
                <h4 className="mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                  STEP <span className="fontCinzel font-medium">3</span> OF{' '}
                  <span className="fontCinzel font-medium">3</span>
                </h4>

                <h1 className="relative mb-13 max-[639px]:mb-10 text-[42px] max-[1023px]:text-[2.625rem] max-[639px]:text-[2rem] leading-12 max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-['']">
                  APPLICATION RECEIVED
                </h1>

                <p className="mb-10 max-[639px]:mb-8 text-xl font-medium text-brand italic leading-8 max-[639px]:text-lg">
                  Your request has entered review.
                </p>

                <div className="mb-10 max-[639px]:mb-8 h-px w-full bg-[rgba(154,35,73,0.25)]" />

                <div className="mb-6 flex h-20 max-[639px]:h-16 w-20 max-[639px]:w-16 items-center justify-center rounded-full border-brand/30">
                  <img
                    src="/images/icons/lotus-solid-icon.png"
                    alt=""
                    className="w-10 max-[639px]:w-8"
                  />
                </div>

                <p className="mb-8 max-[639px]:mb-6 max-w-[340px] text-lg max-[639px]:text-base leading-8 max-[639px]:leading-7 font-medium">
                  Access to the Decision Space is reserved for selected
                  applicants.
                </p>

                <span className="mb-6 block h-0.5 w-10 bg-brand" />

                <p className="mb-10 max-w-[340px] text-lg leading-7 font-medium text-[#767676] max-[639px]:mb-8 max-[639px]:text-base">
                  You will be notified by email once a decision has been made.
                </p>

                <Link
                  href="/"
                  className="btnGradient mb-8 inline-flex w-auto items-center justify-center gap-x-4 px-8 py-4 text-lg duration-300 hover:gap-x-6 max-[639px]:w-full max-[639px]:py-3.5 max-[639px]:text-base"
                >
                  RETURN TO HOME
                  <img
                    src="/images/icons/arrow-right.png"
                    alt=""
                    className="w-5 brightness-[100]"
                  />
                </Link>

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
            <p className="mb-4 px-5 text-lg font-medium text-brand max-[639px]:text-base italic">
              The outcome remains unknown.
            </p>
            <span className="mx-auto block h-0.5 w-10 bg-brand" />
          </div>
        </section>
      </div>
    </div>
  )
}

export default AccessApplicationStep3
