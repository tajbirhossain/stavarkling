'use client'

import Header from '@/components/Header'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Why = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.set('.why-reveal', {
            opacity: 0,
            y: 25,
            filter: 'blur(8px)',
        })

        gsap.set('.why-title', {
            opacity: 0,
            y: 20,
            filter: 'blur(8px)',
        })

        gsap.set('.why-image', {
            opacity: 0,
            scale: 0.94,
            y: 30,
            filter: 'blur(12px)',
        })

        gsap.set('.why-meta', {
            opacity: 0,
            y: 15,
            filter: 'blur(6px)',
        })

        const tl = gsap.timeline({
            defaults: {
                ease: 'expo.out',
            },
        })

        tl.to('.why-reveal', {
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
            '.why-title',
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
            '.why-image',
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
            '.why-meta',
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

        gsap.to('.why-image', {
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
                <Header ind={2} />

                <section className="py-14 max-[1023px]:py-12 max-[639px]:py-8">
                    <div className="containerMain flex flex-row justify-between gap-y-0 max-[1023px]:flex-col max-[1023px]:gap-y-12">
                        <div className="flex w-[30%] max-[1023px]:w-full">
                            <div className="w-full border-[#cccccc] border-r pr-4 text-left max-[1023px]:border-r-0 max-[1023px]:pr-0 max-[1023px]:text-center">
                                <h4 className="why-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                                    <span className="fontCinzel font-medium">03 —</span> WHY <span className="fontCinzel font-medium">&euro; 1,000,000</span>?
                                </h4>

                                <h1 className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 why-reveal relative mb-13 max-[639px]:mb-10 text-[52px] max-[1500px]:text-[46px] max-[1350px]:text-[40px] max-[1200px]:text-[32px] max-[767px]:text-[2.625rem] max-[639px]:text-[2.25rem] leading-15 max-[1500px]:leading-[54px] max-[1350px]:leading-[48px] max-[1200px]:leading-[40px] max-[767px]:leading-[1.15] max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                                    Why <span className="fontCinzel font-medium">&euro; 1,000,000</span>?
                                </h1>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 why-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    Because if the number felt reasonable,{' '}
                                    <br className="block max-[639px]:hidden" />
                                    there would be no experiment.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 why-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    Every historic decision{' '}
                                    <br className="block max-[639px]:hidden" />
                                    sounds irrational{' '}
                                    <br className="block max-[639px]:hidden" />
                                    in the beginning.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 why-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    The purpose of this project{' '}
                                    <br className="block max-[639px]:hidden" />
                                    is not to prove that the artwork{' '}
                                    <br className="block max-[639px]:hidden" />
                                    is worth <span className="fontCinzel font-medium">&euro; 1,000,000</span>.
                                    <br className="block max-[639px]:hidden" />
                                    <br className="block max-[639px]:hidden" />
                                    The purpose is to observe{' '}
                                    <br className="block max-[639px]:hidden" />
                                    what happens when someone{' '}
                                    <br className="block max-[639px]:hidden" />
                                    decides it is.
                                </p>

                                <p className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 why-reveal relative mb-13 max-[639px]:mb-10 text-xl font-extrabold text-brand max-[639px]:text-lg before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                                    One artwork.
                                    <br />
                                    One collector.
                                    <br />
                                    One decision.
                                </p>
                            </div>
                        </div>

                        <div className="mx-0 w-1/2 max-w-none max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[520px]">
                            <h2 className='why-title relative mb-13 max-[639px]:mb-10 text-center text-7xl font-medium text-brand italic max-[1023px]:text-6xl max-[767px]:text-5xl max-[639px]:text-4xl before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""]'>
                                Universe. Decided.
                            </h2>

                            <img
                                src="/images/artwork.png"
                                alt=""
                                className="why-image mx-auto w-full max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-[1023px]:max-w-[420px] max-[1023px]:shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
                            />

                            <p className="why-meta mb-4 pt-13 max-[639px]:pt-10 text-center text-xl max-[639px]:text-lg font-medium">
                                Acquisition Position
                            </p>

                            <h2 className="why-meta fontCinzel mb-6 text-center text-6xl font-medium text-brand max-[1023px]:text-5xl max-[639px]:text-4xl">
                                &euro; 1,000,000
                            </h2>

                            <div className="why-meta flex items-center justify-center gap-x-4">
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
                </section>
            </div>
        </div>
    )
}

export default Why
