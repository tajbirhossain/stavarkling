'use client'

import Header from '@/components/Header'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const WhyAnonymous = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.set('.anon-reveal', {
            opacity: 0,
            y: 25,
            filter: 'blur(8px)',
        })

        gsap.set('.anon-title', {
            opacity: 0,
            y: 20,
            filter: 'blur(8px)',
        })

        gsap.set('.anon-image', {
            opacity: 0,
            scale: 0.94,
            y: 30,
            filter: 'blur(12px)',
        })

        gsap.set('.anon-meta', {
            opacity: 0,
            y: 15,
            filter: 'blur(6px)',
        })

        const tl = gsap.timeline({
            defaults: {
                ease: 'expo.out',
            },
        })

        tl.to('.anon-reveal', {
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
            '.anon-title',
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
            '.anon-image',
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
            '.anon-meta',
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
            <div className="bg-[url('/images/main-bg.png')] bg-no-repeat bg-center bg-cover">
                <Header ind={3} />

                <section className="py-14 max-[1023px]:py-12 max-[639px]:py-8">
                    <div className="containerMain flex flex-row justify-between gap-y-0 max-[1023px]:flex-col max-[1023px]:gap-y-12">
                        <div className="flex w-[30%] max-[1023px]:w-full">
                            <div className="w-full border-[#cccccc] border-r pr-4 text-left max-[1023px]:border-r-0 max-[1023px]:pr-0 max-[1023px]:text-center">
                                <h4 className="anon-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base">
                                    <span className="fontCinzel font-medium">04 —</span> WHY ANONYMOUS?
                                </h4>

                                <h1 className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 anon-reveal relative mb-10 max-[639px]:mb-8 text-[52px] max-[1500px]:text-[46px] max-[1350px]:text-[40px] max-[1200px]:text-[32px] max-[767px]:text-[2.625rem] max-[639px]:text-[2.25rem] leading-15 max-[1500px]:leading-[54px] max-[1350px]:leading-[48px] max-[1200px]:leading-[40px] max-[767px]:leading-[1.15] max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                                    Why <span className="text-brand">Anonymous?</span>
                                </h1>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 anon-reveal relative mb-8 max-[639px]:mb-6 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    {/* The artist&apos;s identity is intentionally{' '}
                                    <br className="block max-[639px]:hidden" />
                                    secondary to the experiment. */}
                                    The moment a name enters the conversation,
                                    <br />
                                    perception changes.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 anon-reveal relative mb-8 max-[639px]:mb-6 text-lg max-[639px]:text-base font-medium before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    {/* The experiment was never designed around a name —{' '}
                                    <br className="block max-[639px]:hidden" />
                                    it was designed around a decision.{' '}
                                    <br className="block max-[639px]:hidden" />
                                    The moment a name enters, perception changes. */}
                                    Anonymity is part of the experiment.
                                    <br />
                                    The artist’s identity is intentionally secondary.
                                </p>

                                <p className='max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 anon-reveal relative mb-8 max-[639px]:mb-6 text-xl max-[639px]:text-lg before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-[""]'>
                                    {/* Not to hide.
                                    <br />
                                    To observe. */}
                                    You encounter the artwork without a reputation to guide your judgement.
                                </p>

                                <p className="anon-reveal text-3xl font-medium text-brand italic max-[639px]:text-2xl">
                                    {/* Can something unknown become valuable{' '}
                                    <br className="block max-[639px]:hidden" />
                                    simply because someone decides it is? */}
                                    What you see in it is yours to decide.
                                </p>
                            </div>
                        </div>

                        <div className="mx-0 w-1/2 max-w-none max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[520px]">
                            <h2 className='anon-title relative mb-13 max-[639px]:mb-10 text-center text-7xl font-medium text-brand italic max-[1023px]:text-6xl max-[767px]:text-5xl max-[639px]:text-4xl before:absolute before:bottom-[-1.25rem] before:left-1/2 before:h-0.5 before:w-10 before:-translate-x-1/2 before:bg-brand before:content-[""]'>
                                Universe. Decided.
                            </h2>

                            <img
                                src="/images/artwork.png"
                                alt=""
                                className="anon-image mx-auto w-full max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.18)] max-[1023px]:max-w-[420px] max-[1023px]:shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
                            />

                            <p className="anon-meta mb-4 pt-13 max-[639px]:pt-10 text-center text-xl max-[639px]:text-lg font-medium tracking-wide">
                                Artist Identity
                            </p>

                            <h2 className="anon-meta fontCinzel mb-6 text-center text-5xl font-medium tracking-[0.35em] text-brand max-[1200]:text-4xl max-[1023px]:tracking-[0.28em] max-[639px]:text-3xl max-[639px]:tracking-[0.18em]">
                                UNDISCLOSED
                            </h2>

                            <div className="anon-meta flex items-center justify-center gap-x-4">
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

export default WhyAnonymous
