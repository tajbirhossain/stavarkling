'use client'

import Link from 'next/link'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export type OnboardingScreenProps = {
  step: number
  totalSteps?: number
  backgroundTextSrc: string
  eyebrow: string
  message: React.ReactNode
  continueHref?: string
  ctaLabel?: string
  onContinue?: () => void
}

const ctaClassName =
  'onboard-reveal btnGradient mt-11 inline-flex w-auto max-w-none items-center justify-center gap-x-4 px-11 py-4 text-lg font-semibold tracking-[0.08em] opacity-0 duration-300 hover:gap-x-6 max-[767px]:mt-9 max-[767px]:px-9 max-[767px]:text-base max-[767px]:hover:gap-x-5 max-[639px]:mt-8 max-[639px]:w-full max-[639px]:max-w-[280px] max-[639px]:gap-x-3 max-[639px]:px-6 max-[639px]:py-3.5 max-[639px]:text-sm [@media(max-height:500px)]:mt-5 [@media(max-height:500px)]:py-3 [@media(max-height:500px)]:text-xs'

const OnboardingScreen = ({
  step,
  totalSteps = 4,
  backgroundTextSrc,
  eyebrow,
  message,
  continueHref,
  ctaLabel = 'CONTINUE',
  onContinue,
}: OnboardingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stepLabel = String(step).padStart(2, '0')
  const totalLabel = String(totalSteps).padStart(2, '0')
  const progressPercent = (step / totalSteps) * 100

  useGSAP(
    () => {
      gsap.set('.onboard-bg-text', {
        opacity: 0,
        scale: 0.98,
        filter: 'blur(10px)',
      })

      gsap.set('.onboard-reveal', {
        opacity: 0,
        y: 22,
        filter: 'blur(8px)',
      })

      gsap.set('.onboard-meta', {
        opacity: 0,
        y: 12,
        filter: 'blur(6px)',
      })

      gsap.set('.onboard-mask', {
        opacity: 0,
      })

      const tl = gsap.timeline({
        defaults: {
          ease: 'expo.out',
        },
      })

      tl.to('.onboard-mask', {
        opacity: 1,
        duration: 1.6,
      })

      tl.to(
        '.onboard-bg-text',
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          clearProps: 'filter,scale',
        },
        '-=1.2'
      )

      tl.to(
        '.onboard-reveal',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          stagger: 0.12,
          clearProps: 'filter,transform',
        },
        '-=0.9'
      )

      tl.to(
        '.onboard-meta',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          clearProps: 'filter,transform',
        },
        '-=0.7'
      )
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="relative h-dvh w-full overflow-hidden bg-[#F1E7E8]"
    >
      <div className="onboard-bg-text pointer-events-none absolute inset-x-0 top-[3%] z-0 flex justify-center px-[5%] opacity-0 max-[500px]:top-[12%] max-[639px]:top-[2%] max-[639px]:px-[4%] [@media(max-height:500px)]:top-[1%]">
        <img
          src={backgroundTextSrc}
          alt=""
          className="h-auto w-full max-w-[1050px] object-contain select-none [@media(max-height:500px)]:max-h-[10vh]"
        />
      </div>

      <img
        src="/images/onboarding-bg-mask.png"
        alt=""
        className="onboard-mask pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-bottom opacity-0"
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-12 pb-28 pt-20 max-[1023px]:px-10 max-[767px]:px-8 max-[767px]:pb-24 max-[639px]:px-5 max-[639px]:pb-20 max-[639px]:pt-16 [@media(max-height:500px)]:px-6 [@media(max-height:500px)]:pb-14 [@media(max-height:500px)]:pt-10">
        <div className="flex w-full max-w-[820px] flex-col items-center text-center max-[1023px]:max-w-[48rem] max-[767px]:max-w-[40rem] max-[639px]:max-w-[34rem]">
          <p className="onboard-reveal text-brand text-lg font-semibold tracking-[0.18em] opacity-0 max-[1023px]:text-base max-[767px]:text-sm max-[639px]:text-[0.7rem] max-[639px]:tracking-[0.16em] [@media(max-height:500px)]:text-[0.65rem]">
            {eyebrow}
          </p>

          <span className="onboard-reveal mt-4 mb-10 block h-[2px] w-10 bg-brand opacity-0 max-[767px]:mb-8 max-[639px]:mt-3 max-[639px]:mb-6 max-[639px]:w-8 [@media(max-height:500px)]:mt-2 [@media(max-height:500px)]:mb-4" />

          <p className="onboard-reveal text-[34px] font-medium leading-[1.45] text-[#0a0a0a] opacity-0 max-[1023px]:text-[1.875rem] max-[767px]:text-[1.625rem] max-[767px]:leading-[1.4] max-[639px]:text-[1.375rem] max-[639px]:leading-[1.45] [@media(max-height:500px)]:text-[1.125rem] [@media(max-height:500px)]:leading-snug">
            {message}
          </p>

          {onContinue ? (
            <button type="button" onClick={onContinue} className={ctaClassName}>
              {ctaLabel}
              <img
                src="/images/icons/arrow-right.png"
                alt=""
                className="w-5 brightness-[100] max-[639px]:w-4"
              />
            </button>
          ) : (
            <Link href={continueHref || '/'} className={ctaClassName}>
              {ctaLabel}
              <img
                src="/images/icons/arrow-right.png"
                alt=""
                className="w-5 brightness-[100] max-[639px]:w-4"
              />
            </Link>
          )}
        </div>
      </div>

      <div className="onboard-meta absolute bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center opacity-0 max-[767px]:bottom-[max(1.5rem,env(safe-area-inset-bottom))] max-[639px]:bottom-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="text-brand/50 text-lg font-medium tracking-[0.18em] max-[767px]:text-base max-[639px]:text-sm max-[639px]:tracking-[0.16em]">
          {stepLabel} <span className="text-brand/25">/</span> {totalLabel}
        </p>
        <div className="mt-2.5 h-[2px] w-20 overflow-hidden bg-[rgba(154,35,73,0.16)] max-[639px]:mt-2 max-[639px]:w-16">
          <div
            className="h-full bg-brand transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default OnboardingScreen
