'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'
import { setLenisInstance } from '@/lib/lenisControl'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScrollProvider({
    children,
}: {
    children: ReactNode
}) {
    const pathname = usePathname()
    const lenisRef = useRef<Lenis | null>(null)
    const isFirstPathRef = useRef(true)

    useEffect(() => {
        const lenis = new Lenis({
            // Lerp feels less "stuck" at scroll bounds than a long duration curve.
            lerp: 0.1,
            smoothWheel: true,
            wheelMultiplier: 1,
            stopInertiaOnNavigate: true,
            autoResize: true,
        })

        lenisRef.current = lenis
        setLenisInstance(lenis)
        lenis.on('scroll', ScrollTrigger.update)

        const tick = (time: number) => {
            lenis.raf(time * 1000)
        }

        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(tick)
            lenis.destroy()
            lenisRef.current = null
            setLenisInstance(null)
        }
    }, [])

    useEffect(() => {
        const lenis = lenisRef.current
        if (!lenis) return

        // Skip the initial mount — Next already starts at the top.
        if (isFirstPathRef.current) {
            isFirstPathRef.current = false
            return
        }

        lenis.scrollTo(0, { immediate: true })
        lenis.resize()
        ScrollTrigger.refresh()

        // Recalc after layout/images settle so the scroll limit isn't stale.
        const rafId = requestAnimationFrame(() => {
            lenis.resize()
            ScrollTrigger.refresh()
        })
        const timeoutId = window.setTimeout(() => {
            lenis.resize()
            ScrollTrigger.refresh()
        }, 300)

        return () => {
            cancelAnimationFrame(rafId)
            window.clearTimeout(timeoutId)
        }
    }, [pathname])

    return <>{children}</>
}
