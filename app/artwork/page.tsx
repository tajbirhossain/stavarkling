'use client'

import Header from '@/components/Header'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Artwork = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.set('.art-reveal', {
      opacity: 0,
      y: 25,
      filter: 'blur(8px)',
    })

    gsap.set('.art-title', {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    })

    gsap.set('.art-image', {
      opacity: 0,
      scale: 0.94,
      y: 30,
      filter: 'blur(12px)',
    })

    gsap.set('.art-meta', {
      opacity: 0,
      y: 15,
      filter: 'blur(6px)',
    })

    const tl = gsap.timeline({
      defaults: {
        ease: 'expo.out',
      },
    })

    tl.to('.art-reveal', {
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
      '.art-title',
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
      '.art-image',
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
      '.art-meta',
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

  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <div className="bg-[url('/images/main-bg2.png')] bg-no-repeat bg-center bg-cover">
        <Header ind={0} />

        <section className="py-14 max-[1023px]:py-12 max-[639px]:py-8">
          <div className="containerMain flex flex-row justify-between gap-y-0 max-[1023px]:flex-col max-[1023px]:gap-y-12">
            <div className="flex w-[30%] max-[1023px]:w-full">
              <div className="w-full border-[#cccccc] border-r pr-4 text-left max-[1023px]:border-r-0 max-[1023px]:pr-0 max-[1023px]:text-center">
                <h4 className="art-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                  <span className="fontCinzel font-medium">01 —</span> THE ARTWORK
                </h4>

                <h1 className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-10 max-[639px]:mb-8 text-[52px] max-[1500px]:text-[46px] max-[1350px]:text-[40px] max-[1200px]:text-[32px] max-[767px]:text-[2.625rem] max-[639px]:text-[2.25rem] leading-15 max-[1500px]:leading-[54px] max-[1350px]:leading-[48px] max-[1200px]:leading-[40px] max-[767px]:leading-[1.15] max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                  Stavarkle <span className="fontCinzel font-medium">#1</span>
                  <br />
                  <span className="block text-brand italic">
                    Universe. Decided.
                  </span>
                </h1>

                {/* <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-8 max-[639px]:mb-6 text-3xl max-[639px]:text-2xl font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                  One artwork.
                  <br />
                  One decision.
                  <br />
                  <span className="text-brand italic">One million.</span>
                </p> */}

                <h2 className="art-reveal fontCinzel mb-4 text-6xl font-medium text-brand max-[1449px]:text-5xl max-[1200px]:text-4xl max-[639px]:text-3xl">
                  &euro; 1,000,000
                </h2>

                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-8 max-[639px]:mb-6 text-3xl max-[639px]:text-2xl font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                  {/* Not as a price.
                  <br />
                  <span className="text-brand italic">As a position.</span> */}
                  ONE ORIGINAL ARTWORK
                </p>

                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-8 max-[639px]:mb-6 text-xl font-semiboldd max-[639px]:text-lg leading-10 max-[639px]:leading-8 before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                  Thousands of individual elements, placed entirely by hand.
                  <br />
                  A study in precision, repetition, and perception.
                </p>

                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-8 max-[639px]:mb-6 text-xl font-semibold text-brand max-[639px]:text-lg leading-10 max-[639px]:leading-8 before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                  SIGNED BY THE ARTIST
                  <br />
                  ACCOMPANIED BY A CERTIFICATE OF AUTHENTICITY
                </p>

                {/* <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-8 max-[639px]:mb-6 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                  Created to test perception, value, and belief —{' '}
                  <br className="block max-[639px]:hidden" />
                  not decoration. A statement about value, time,{' '}
                  <br className="block max-[639px]:hidden" />
                  attention, and emotional conviction.
                </p>

                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 art-reveal relative mb-8 max-[639px]:mb-6 text-xl font-extrabold text-brand max-[639px]:text-lg before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                  One artwork.
                  <br />
                  One collector.
                  <br />
                  One decision.
                </p>

                <p className="art-reveal text-lg font-medium text-brand max-[639px]:text-base">
                  The courage to decide before the rest of the world understands.
                </p> */}
              </div>
            </div>

            <div className="mx-0 w-1/2 max-w-none max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[520px]">
              <h2 className='art-title relative mb-13 max-[639px]:mb-10 text-center text-7xl font-medium text-brand italic max-[1023px]:text-6xl max-[767px]:text-5xl max-[639px]:text-4xl before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""]'>
                Universe. Decided.
              </h2>

              <img
                src="/images/artwork.png"
                alt=""
                className="art-image mx-auto w-full max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-[1023px]:max-w-[420px] max-[1023px]:shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
              />

              <p className='art-meta fontCinzel relative mb-10 max-[639px]:mb-8 pt-13 max-[639px]:pt-10 text-center text-xl max-[639px]:text-base before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""] after:absolute after:top-6 after:left-1/2 after:h-0.5 after:w-10 after:-translate-x-1/2 after:bg-brand after:content-[""]'>
                104.3 x 75.2 x 1.5 cm
                <br />
                41.1 x 29.6 x 0.6 in
                <br />
                <span className="capitalize">(Including frame)</span>
              </p>

              {/* <p className="art-meta text-center text-xl max-[639px]:text-base font-medium">
                The artist&apos;s identity is intensionally{' '}
                <br className="block max-[639px]:hidden" />
                secondary to the experiment.
              </p> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Artwork