'use client'

import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { startLenis, stopLenis } from '@/lib/lenisControl'

type HeaderProp = {
  ind: number
}

const navItems = [
  { href: '/artwork', label: 'THE ARTWORK' },
  { href: '/process', label: 'THE PROCESS' },
  {
    href: '/why',
    label: (
      <>
        WHY <span className="fontCinzel font-medium">&euro; 1,000,000</span>
      </>
    ),
  },
  { href: '/why-anonymous', label: 'WHY ANONYMOUS' },
  { href: '/access', label: 'ACCESS' },
] as const

const Header = ({ ind }: HeaderProp) => {
  const [activeInd, setActiveInd] = useState<number>(ind)
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) {
      startLenis()
      document.body.style.overflow = ''
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    stopLenis()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      startLenis()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  useGSAP(
    () => {
      const hasPlayed = sessionStorage.getItem('headerIntroPlayed')

      if (hasPlayed) return

      gsap.set('.header-logo', {
        opacity: 0,
        y: -10,
        filter: 'blur(10px)',
        scale: 0.98,
      })

      gsap.set('.header-item', {
        opacity: 0,
        y: -8,
        filter: 'blur(8px)',
      })

      gsap.set('.header-cta', {
        opacity: 0,
        y: -10,
        scale: 0.96,
        filter: 'blur(10px)',
      })

      const tl = gsap.timeline({
        defaults: {
          ease: 'expo.out',
        },
        onComplete: () => {
          sessionStorage.setItem('headerIntroPlayed', 'true')
        },
      })

      tl.to('.header-logo', {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.1,
      })

      tl.to(
        '.header-item',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.08,
        },
        '-=0.6'
      )

      tl.to(
        '.header-cta',
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
        },
        '-=0.7'
      )
    },
    { scope: containerRef }
  )

  useGSAP(
    () => {
      if (!menuOpen || !mobileMenuRef.current) return

      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.mobile-menu-shell',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' }
        )

        gsap.fromTo(
          '.mobile-menu-reveal',
          { opacity: 0, y: 18, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.85,
            stagger: 0.07,
            ease: 'expo.out',
            delay: 0.08,
            clearProps: 'filter,transform',
          }
        )
      }, mobileMenuRef)

      return () => ctx.revert()
    },
    { dependencies: [menuOpen] }
  )

  const closeMenu = () => setMenuOpen(false)

  return (
    <header ref={containerRef} className="relative z-50 py-5 max-[639px]:py-4">
      <div className="containerMain flex items-center justify-between gap-x-4">
        <Link href="/" className="shrink-0" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Stavarkling"
            className="header-logo w-50 max-[1023px]:w-44 max-[639px]:w-36"
          />
        </Link>

        <div className="flex items-center gap-x-4 max-[1279px]:hidden">
          <ul className="flex items-center gap-x-4 font-semibold">
            {navItems.map((item, index) => (
              <li
                key={item.href}
                className="header-item border-b-2 duration-300 hover:border-[#ab3d62]!"
                style={{
                  borderColor: activeInd === index ? '#ab3d62' : 'transparent',
                }}
                onClick={() => setActiveInd(index)}
              >
                <Link href={item.href} className="block py-2 text-base max-[1279px]:text-sm">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/access-application"
            className="header-cta btnGradient inline-block px-5 py-3 text-base max-[1279px]:text-sm"
          >
            REQUEST ACCESS
          </Link>
        </div>

        <div className="hidden items-center gap-x-3 max-[1279px]:flex">
          <Link
            href="/access-application"
            className="header-cta btnGradient inline-block px-4 py-2.5 text-sm max-[639px]:hidden"
            onClick={closeMenu}
          >
            REQUEST ACCESS
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="header-item flex h-11 w-11 items-center justify-center rounded-full border border-brand/25 bg-white/50 text-brand shadow-[0_1px_8px_rgba(154,35,73,0.08)] backdrop-blur-sm"
            onClick={() => setMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <span className="relative block h-3.5 w-5">
              <span className="absolute top-0 left-0 block h-0.5 w-full bg-brand" />
              <span className="absolute top-1.5 left-0 block h-0.5 w-full bg-brand" />
              <span className="absolute top-3 left-0 block h-0.5 w-full bg-brand" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="mobile-menu-shell fixed inset-0 z-[80] hidden flex-col bg-[linear-gradient(180deg,#FBF6F7_0%,#F3E8EB_48%,#EEDFE4_100%)] max-[1279px]:flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="pointer-events-none absolute -right-10 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(154,35,73,0.12)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -left-16 bottom-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(154,35,73,0.08)_0%,transparent_70%)]" />

          <div className="relative z-10 flex items-center justify-between px-8 pt-[max(1rem,env(safe-area-inset-top))] pb-4 max-[639px]:px-5">
            <Link href="/" className="shrink-0" onClick={closeMenu}>
              <img
                src="/logo.png"
                alt="Stavarkling"
                className="w-44 max-[639px]:w-36"
              />
            </Link>

            <button
              type="button"
              aria-label="Close menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-white text-brand shadow-[0_2px_12px_rgba(154,35,73,0.1)] transition-colors duration-300 hover:bg-[#F7F0F2]"
              onClick={closeMenu}
            >
              <span className="sr-only">Close menu</span>
              <span className="relative block h-3.5 w-5">
                <span className="absolute top-1.5 left-0 block h-0.5 w-full rotate-45 bg-brand" />
                <span className="absolute top-1.5 left-0 block h-0.5 w-full -rotate-45 bg-brand" />
              </span>
            </button>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col px-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 max-[639px]:px-6">
            <div className="mobile-menu-reveal mb-8 flex items-center justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-brand">
                  EXCLUSIVE ACCESS ONLY
                </p>
                <span className="mt-3 block h-[2px] w-8 bg-brand" />
              </div>
              <img
                src="/images/icons/lotus-icon-colored.png"
                alt=""
                className="w-9 opacity-80"
              />
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto">
              <ul className="flex flex-col">
                {navItems.map((item, index) => {
                  const isActive = activeInd === index
                  const step = String(index + 1).padStart(2, '0')

                  return (
                    <li key={item.href} className="mobile-menu-reveal">
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-x-4 border-b border-brand/10 py-4 transition-colors duration-300 ${
                          isActive ? 'text-brand' : 'text-[#1a0a10]'
                        }`}
                        onClick={() => {
                          setActiveInd(index)
                          closeMenu()
                        }}
                      >
                        <span className="fontCinzel w-8 shrink-0 text-sm font-medium text-brand/45 transition-colors duration-300 group-hover:text-brand">
                          {step}
                        </span>
                        <span className="flex-1 text-xl font-semibold tracking-[0.04em] max-[639px]:text-[1.15rem]">
                          {item.label}
                        </span>
                        <img
                          src="/images/icons/arrow-right.png"
                          alt=""
                          className={`w-4 transition-all duration-300 ${
                            isActive
                              ? 'translate-x-0 opacity-70'
                              : 'translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-50'
                          }`}
                        />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="mobile-menu-reveal mt-8 space-y-4">
              <Link
                href="/access-application"
                className="btnGradient inline-flex w-full items-center justify-center gap-x-4 px-5 py-4 text-sm font-semibold tracking-[0.08em] duration-300 hover:gap-x-6"
                onClick={closeMenu}
              >
                REQUEST ACCESS
                <img
                  src="/images/icons/arrow-right.png"
                  alt=""
                  className="w-4 brightness-[100]"
                />
              </Link>
              <p className="text-center text-sm font-semibold text-brand/55 italic">
                One artwork. One buyer. One million.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
