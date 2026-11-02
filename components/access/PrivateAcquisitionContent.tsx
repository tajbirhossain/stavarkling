'use client'

import Header from '@/components/Header'
import ConfidentialFooter from '@/components/access/ConfidentialFooter'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CONTACT_EMAIL = 'private@stavarkling.com'

const PrivateAcquisitionContent = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.set('.access-reveal', {
      opacity: 0,
      y: 25,
      filter: 'blur(8px)',
    })

    gsap.set('.access-image', {
      opacity: 0,
      scale: 0.94,
      y: 30,
      filter: 'blur(12px)',
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
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <div className="relative overflow-hidden bg-[url('/images/hero-bg.png')] bg-cover bg-[position:center_top] max-[639px]:bg-[position:72%_center]">
        <Header ind={4} />
        <section className="relative pt-22 pb-32 max-[1023px]:pt-18 max-[1023px]:pb-24 max-[639px]:pt-14 max-[639px]:pb-16">
          <div className="containerMain ml-auto flex flex-row items-center justify-between gap-y-14 max-[1023px]:flex-col">
            <div className="w-1/3 text-left max-[1023px]:w-full max-[1023px]:max-w-2xl max-[1023px]:text-center">
              <p className="access-reveal mb-5 flex items-center gap-x-4 text-lg font-bold tracking-wide text-brand max-[1023px]:justify-center max-[639px]:text-base">
                <span className="h-px w-10 bg-brand/50" />
                PRIVATE ACQUISITION
              </p>

              <h1 className="access-reveal mb-5 text-5xl leading-[1.1] font-semibold text-brand max-[767px]:text-[42px] max-[767px]:leading-14 max-[639px]:text-[2.625rem] max-[639px]:leading-tight">
                From your decision to your collection.
              </h1>

              <p className="access-reveal relative mb-13 max-w-xl text-3xl font-semibold italic max-[1023px]:mx-auto max-[767px]:text-2xl max-[639px]:mb-10 max-[639px]:text-xl before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:bg-brand before:content-[''] max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2">
                Imagine this artwork in the place you would choose for it.
              </p>

              <div className="access-reveal mb-10 max-w-xl space-y-5 text-[22px] leading-8 font-semibold max-[1023px]:mx-auto max-[639px]:text-lg max-[639px]:leading-7">
                <p>
                  Your acquisition would become part of the experiment.
                  <br />
                  <span className="text-brand">
                    Your decision would shape its outcome.
                  </span>
                </p>
                <p>
                  Begin a private conversation with the artist about acquiring
                  Stavarkle #1,{' '}
                  <span className="text-brand">Universe. Decided.</span>
                </p>
              </div>

              <div className="access-reveal mb-10 flex flex-col items-start gap-4 max-[1023px]:items-center">
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                    'Private acquisition — Stavarkle #1'
                  )}`}
                  className="btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base"
                >
                  BEGIN THE CONVERSATION
                  <img
                    src="/images/icons/arrow-right.png"
                    alt=""
                    className="w-5 brightness-[100]"
                  />
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-lg font-medium tracking-wide text-brand underline-offset-4 duration-300 hover:underline max-[639px]:text-base"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              <p className="access-reveal max-w-xl border-l-2 border-brand/40 pl-5 text-base leading-7 font-medium text-[#5f5f5f] max-[1023px]:mx-auto max-[1023px]:border-t max-[1023px]:border-l-0 max-[1023px]:border-brand/30 max-[1023px]:pt-5 max-[1023px]:pl-0 max-[639px]:text-[15px] max-[639px]:leading-6">
                Your enquiry begins a private conversation about acquiring this
                artwork. It does not confirm a purchase, reserve the artwork or
                transfer ownership.
              </p>
            </div>

            <div className="flex w-2/3 justify-center max-[1023px]:w-full">
              {/* Static offset on the wrapper; GSAP animates only the inner element. */}
              <div className="translate-x-[8%] max-[1549px]:translate-x-[4%] max-[1249px]:translate-x-[2%] max-[1023px]:translate-x-0">
                <div className="access-image">
                  <img
                    src="/images/artwork.png"
                    alt="Stavarkle #1 — Universe. Decided."
                    className="h-140 w-auto max-w-none object-contain shadow-[30px_30px_52px_5px_#3c3c3c5e] max-[1549px]:h-115 max-[1249px]:h-95 max-[1023px]:h-auto max-[1023px]:w-full max-[1023px]:max-w-[420px] max-[1023px]:shadow-[24px_24px_44px_4px_#3c3c3c5e] max-[639px]:max-w-[320px] max-[639px]:shadow-[18px_18px_36px_4px_#3c3c3c5e]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="bg-[#f7f3f4]">
        <ConfidentialFooter className="pt-8 pb-8 max-[639px]:pt-6 max-[639px]:pb-6" />
      </div>
    </div>
  )
}

export default PrivateAcquisitionContent
