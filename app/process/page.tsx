'use client'

import Header from '@/components/Header'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Process = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.set('.process-reveal', {
            opacity: 0,
            y: 25,
            filter: 'blur(8px)',
        })

        gsap.set('.process-title', {
            opacity: 0,
            y: 20,
            filter: 'blur(8px)',
        })

        gsap.set('.process-image', {
            opacity: 0,
            scale: 0.94,
            y: 30,
            filter: 'blur(12px)',
        })

        gsap.set('.process-meta', {
            opacity: 0,
            y: 15,
            filter: 'blur(6px)',
        })

        const tl = gsap.timeline({
            defaults: {
                ease: 'expo.out',
            },
        })

        tl.to('.process-reveal', {
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
            '.process-title',
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
            '.process-image',
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
            '.process-meta',
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

        gsap.to('.process-image', {
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
                <Header ind={1} />

                <section className="py-14 max-[1023px]:py-12 max-[639px]:py-8">
                    <div className="containerMain flex flex-row gap-y-0 max-[1023px]:flex-col max-[1023px]:gap-y-12">
                        <div className="flex w-1/2 max-[1023px]:w-full">
                            <div className="w-full max-w-md border-[#cccccc] border-r pr-4 text-left max-[1023px]:max-w-none max-[1023px]:border-r-0 max-[1023px]:pr-0 max-[1023px]:text-center">
                                <h4 className="process-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                                    <span className="fontCinzel font-medium">02 —</span> THE PROCESS
                                </h4>

                                <h1 className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 process-reveal relative mb-13 max-[639px]:mb-10 text-[52px] max-[1500px]:text-[46px] max-[1350px]:text-[40px] max-[1200px]:text-[32px] max-[767px]:text-[2.625rem] max-[639px]:text-[2.25rem] leading-15 max-[1500px]:leading-[54px] max-[1350px]:leading-[48px] max-[1200px]:leading-[40px] max-[767px]:leading-[1.15] max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                                    The Process
                                </h1>

                                {/* <p className="process-reveal mb-6 text-3xl font-semibold text-brand italic max-[639px]:text-2xl">
                                    An artistic experiment{' '}
                                    <br className="block max-[639px]:hidden" />
                                    Challenging the idea of value.
                                </p> */}

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 process-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    {/* <span className="mb-3 block">
                                        A radical vision redefining what society considers valuable
                                        in contemporary art.
                                    </span>
                                    This is not a traditional art sale. */}
                                    <span className="mb-3 block"><span className="fontCinzel font-medium">01</span> — PUBLIC EXPERIENCE</span>
                                    The artwork is revealed.
                                    <br />
                                    The question of value is left open.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 process-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    {/* No famous name.
                                    <br />
                                    No gallery history.
                                    <br />
                                    No institutional validation. */}
                                    <span className="mb-3 block"><span className="fontCinzel font-medium">02</span> — PRIVATE ACCESS</span>
                                    Move closer to the work.
                                    <br />
                                    Consider its place in your collection.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 process-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    {/* Only the artwork.
                                    <br />
                                    The idea.
                                    <br />
                                    And the decision. */}
                                    <span className="mb-3 block"><span className="fontCinzel font-medium">03</span> — SELECTION, NOT SCALE</span>
                                    A personal conviction.
                                    <br />
                                    The choice to acquire what you see value in.
                                </p>
                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 process-reveal relative mb-13 max-[639px]:mb-10 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    <span className="mb-3 block"><span className="fontCinzel font-medium">04</span> — THE ACQUISITION</span>
                                    The final stage is private.
                                    <br />
                                    The work enters your collection.
                                    <br />
                                    Your decision enters its story.
                                </p>

                                {/* <p className="process-reveal text-xl font-extrabold text-brand max-[639px]:text-lg">
                                    One artwork.
                                    <br />
                                    One acquisition.
                                    <br />
                                    One final decision.
                                    <br />
                                    One access.
                                </p> */}
                            </div>
                        </div>

                        <div className="mx-0 w-1/2 max-w-none max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[520px]">
                            <h2 className='process-title relative mb-13 max-[639px]:mb-10 text-center text-7xl font-medium text-brand italic max-[1023px]:text-6xl max-[767px]:text-5xl max-[639px]:text-4xl before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""]'>
                                Universe. Decided.
                            </h2>

                            <img
                                src="/images/artwork.png"
                                alt=""
                                className="process-image mx-auto w-full max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-[1023px]:max-w-[420px] max-[1023px]:shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
                            />

                            <p className='art-meta fontCinzel relative mb-10 max-[639px]:mb-8 pt-13 max-[639px]:pt-10 text-center text-xl max-[639px]:text-base before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""] after:absolute after:top-6 after:left-1/2 after:h-0.5 after:w-10 after:-translate-x-1/2 after:bg-brand after:content-[""]'>
                                104.3 x 75.2 x 1.5 cm
                                <br />
                                41.1 x 29.6 x 0.6 in
                                <br />
                                <span className="capitalize">(Including frame)</span>
                            </p>

                            {/* <p className="process-meta text-center text-xl max-[639px]:text-base font-medium">
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

export default Process