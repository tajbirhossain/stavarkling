'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import WelcomeStarfield from '@/components/onboarding/WelcomeStarfield'
import styles from './WelcomeScreen.module.css'

const Divider = () => (
  <div className={`${styles.divider} ${styles.reveal}`} data-reveal aria-hidden="true">
    <span className={styles.dividerLine} />
    <img
      src="/images/icons/lotus-solid-icon.png"
      alt=""
      className={styles.dividerLotus}
    />
    <span className={styles.dividerLine} />
  </div>
)

/**
 * The very first onboarding screen. The existing onboarding steps follow it
 * unchanged, starting at /onboarding.
 */
const WelcomeScreen = () => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = rootRef.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!items) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reducedMotion) {
      items.forEach((el) => el.classList.add(styles.visible))
      return
    }

    const timers: number[] = []
    items.forEach((el, index) => {
      timers.push(
        window.setTimeout(() => el.classList.add(styles.visible), 120 + index * 140)
      )
    })

    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  return (
    <div ref={rootRef} className={styles.page}>
      <div className={styles.bgArtwork} aria-hidden="true" />
      <img
        src="/images/primary-bg-mask.png"
        alt=""
        className={styles.lightCurve}
        aria-hidden="true"
      />
      <WelcomeStarfield className={styles.stars} />

      <main className={styles.content}>
        <header className={`${styles.brand} ${styles.reveal}`} data-reveal>
          <img
            src="/images/icons/lotus-icon-colored.png"
            alt=""
            className={styles.brandLotus}
          />
          <h1 className={styles.brandName}>STAVARKLING</h1>
          <p className={styles.brandTagline}>LUXURY VISIONARY ART</p>
        </header>

        <h2 className={`${styles.headline} ${styles.reveal}`} data-reveal>
          <span>WHAT IF VALUE</span>
          <span>IS THE DECISION?</span>
        </h2>

        <Divider />

        <ul className={`${styles.mantra} ${styles.reveal}`} data-reveal>
          <li>ONE ARTWORK.</li>
          <li>ONE COLLECTOR.</li>
          <li>ONE DECISION.</li>
        </ul>

        {/* The fade-in lives on the wrapper so it never overrides the button's own hover transition. */}
        <div className={styles.reveal} data-reveal>
          <Link href="/onboarding" className={`btnGradient ${styles.cta}`}>
            ENTER THE EXPERIMENT
            <img
              src="/images/icons/arrow-right.png"
              alt=""
              className={styles.ctaArrow}
            />
          </Link>
        </div>
      </main>
    </div>
  )
}

export default WelcomeScreen
