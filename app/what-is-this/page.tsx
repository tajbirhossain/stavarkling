'use client'

import Header from '@/components/Header'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const WhatIsThis = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.set('.what-reveal', {
            opacity: 0,
            y: 25,
            filter: 'blur(8px)',
        })

        gsap.set('.what-title', {
            opacity: 0,
            y: 20,
            filter: 'blur(8px)',
        })

        gsap.set('.what-image', {
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

        tl.to('.what-reveal', {
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
            '.what-title',
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
            '.what-image',
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

        gsap.to('.what-image', {
            y: '-=6',
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        })
    }, { scope: containerRef })

    return (
        <div ref={containerRef}>
            <div className="bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover">
                <Header ind={-1} />

                <section className="py-14 max-[1023px]:py-12 max-[639px]:py-8">
                    <div className="containerMain flex flex-row justify-between gap-y-0 max-[1023px]:flex-col max-[1023px]:gap-y-12">
                        <div className="flex w-[30%] max-[1023px]:w-full">
                            <div className="w-full border-[#cccccc] border-r pr-4 text-left max-[1023px]:border-r-0 max-[1023px]:pr-0 max-[1023px]:text-center">
                                <h4 className="what-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                                    WHAT IS THIS?
                                </h4>

                                <h1 className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 what-reveal relative mb-13 max-[639px]:mb-10 text-[52px] max-[1500px]:text-[46px] max-[1350px]:text-[40px] max-[1200px]:text-[32px] max-[767px]:text-[2.625rem] max-[639px]:text-[2.25rem] leading-15 max-[1500px]:leading-[54px] max-[1350px]:leading-[48px] max-[1200px]:leading-[40px] max-[767px]:leading-[1.15] max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                                    What Is This?
                                </h1>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 what-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    <span className="mb-3 block">
                                        Stavarkling is an artistic social experiment exploring
                                        perception, emotional value, rarity, and belief in the
                                        digital age.
                                    </span>

                                    <span className="mb-3 block text-brand italic">
                                        Can something unknown become valuable simply because
                                        someone decides it is?
                                    </span>

                                    An unknown artist.
                                    <br />
                                    One artwork.
                                    <br />
                                    No gallery.
                                    <br />
                                    One final decision.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 what-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    <span className="mb-3 block">
                                        The question was never whether{' '}
                                        <br className="block max-[639px]:hidden" />
                                        the artwork is worth one million.
                                    </span>

                                    The question is{' '}
                                    <br className="block max-[639px]:hidden" />

                                    <span className="text-3xl text-brand max-[639px]:text-2xl">
                                        What creates value{' '}
                                        <br className="block max-[639px]:hidden" />
                                        in the first place?
                                    </span>
                                </p>

                                <p className="what-reveal text-lg max-[639px]:text-base font-medium">
                                    it exists for one collector.
                                </p>
                            </div>
                        </div>

                        <div className="mx-0 w-1/2 max-w-none max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[520px]">
                            <h2 className='what-title relative mb-13 max-[639px]:mb-10 text-center text-7xl font-medium text-brand italic max-[1023px]:text-6xl max-[767px]:text-5xl max-[639px]:text-4xl before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""]'>
                                Universe. Decided.
                            </h2>

                            <img
                                src="/images/artwork.png"
                                alt=""
                                className="what-image mx-auto w-full max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-[1023px]:max-w-[420px] max-[1023px]:shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default WhatIsThis