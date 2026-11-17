'use client'

import { useEffect, useRef } from 'react'

type Mote = {
  x: number
  y: number
  r: number
  a: number
  speed: number
  phase: number
  drift: number
  gold: boolean
}

/**
 * Rose and gold motes that twinkle and drift slowly upward behind the
 * Access guide. Fixed to the viewport, never intercepts clicks.
 */
export default function GuideStarfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let motes: Mote[] = []
    let rafId = 0
    let width = 0
    let height = 0
    let resizeTimer = 0
    let last = 0

    function build() {
      const count = Math.min(140, Math.floor((width * height) / 11000))
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.35,
        a: Math.random() * 0.45 + 0.15,
        speed: Math.random() * 0.0016 + 0.0006,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.12 + 0.03,
        gold: Math.random() < 0.28,
      }))
    }

    function draw(time: number) {
      const dt = last ? Math.min(time - last, 50) : 16
      last = time
      ctx!.clearRect(0, 0, width, height)
      for (const m of motes) {
        if (!reducedMotion) {
          m.y -= m.drift * (dt / 16)
          if (m.y < -4) {
            m.y = height + 4
            m.x = Math.random() * width
          }
        }
        const twinkle = reducedMotion ? 1 : 0.45 + 0.55 * Math.sin(time * m.speed + m.phase)
        const alpha = m.a * twinkle
        const color = m.gold ? `rgba(196, 152, 98, ${alpha})` : `rgba(154, 35, 73, ${alpha})`
        // soft halo
        ctx!.beginPath()
        ctx!.arc(m.x, m.y, m.r * 3.2, 0, Math.PI * 2)
        ctx!.fillStyle = m.gold
          ? `rgba(214, 178, 120, ${alpha * 0.16})`
          : `rgba(190, 70, 110, ${alpha * 0.14})`
        ctx!.fill()
        // core
        ctx!.beginPath()
        ctx!.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx!.fillStyle = color
        ctx!.fill()
      }
      if (!reducedMotion) rafId = window.requestAnimationFrame(draw)
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      if (reducedMotion) draw(0)
    }

    resize()
    if (!reducedMotion) rafId = window.requestAnimationFrame(draw)

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
