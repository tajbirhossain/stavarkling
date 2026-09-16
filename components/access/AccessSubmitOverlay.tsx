'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

const STATUS_LINES = [
  'Gathering your request…',
  'Sealing your reflection…',
  'Entering private review…',
]

type AccessSubmitOverlayProps = {
  open: boolean
}

export default function AccessSubmitOverlay({ open }: AccessSubmitOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const lotusRef = useRef<HTMLImageElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    if (!open) {
      setStatusIndex(0)
      return
    }

    const id = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_LINES.length)
    }, 1800)

    return () => window.clearInterval(id)
  }, [open])

  useGSAP(
    () => {
      if (!open || !overlayRef.current) return

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: 'power2.out' }
      )

      if (lotusRef.current) {
        gsap.fromTo(
          lotusRef.current,
          { opacity: 0, scale: 0.86, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: 'expo.out',
          }
        )

        gsap.to(lotusRef.current, {
          scale: 1.06,
          duration: 2.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 2.8,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            transformOrigin: 'left center',
          }
        )
      }
    },
    { dependencies: [open] }
  )

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-20 overflow-hidden rounded-[15px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-0 bg-[rgba(241,231,232,0.82)] backdrop-blur-[6px]" />

      <div className="relative flex h-full min-h-[420px] flex-col items-center justify-center px-10 text-center max-[1023px]:min-h-[360px] max-[1023px]:px-8 max-[639px]:min-h-[280px] max-[639px]:px-5">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-brand/25 bg-white/40 max-[639px]:mb-6 max-[639px]:h-16 max-[639px]:w-16">
          <img
            ref={lotusRef}
            src="/images/icons/lotus-solid-icon.png"
            alt=""
            className="w-10 max-[639px]:w-8"
          />
        </div>

        <p className="fontCinzel mb-4 text-sm tracking-[0.28em] text-brand uppercase max-[639px]:mb-3 max-[639px]:text-xs">
          Please wait
        </p>

        <p className="mb-8 min-h-[2rem] text-2xl font-medium text-[#2a2a2a] italic max-[639px]:mb-6 max-[639px]:min-h-[1.75rem] max-[639px]:text-xl">
          {STATUS_LINES[statusIndex]}
        </p>

        <span
          ref={lineRef}
          className="block h-[1.5px] w-28 origin-left bg-brand max-[639px]:w-20"
        />

        <p className="mt-8 max-w-[280px] text-base leading-7 font-medium text-[#767676] max-[639px]:mt-6 max-[639px]:text-sm">
          Your request is being received with care.{' '}
          <br className="block max-[639px]:hidden" />
          Do not close this page.
        </p>
      </div>
    </div>
  )
}
