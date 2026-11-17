'use client'

import Header from '@/components/Header'
import GuideStarfield from '@/components/access/GuideStarfield'
import { JOURNEY_STAGES } from '@/lib/accessStages'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './AccessGuide.module.css'

const NOW_STEPS = [
  {
    numeral: 'I',
    title: 'Open Access',
    text: 'The button at the end of this page leads into the private Access section.',
  },
  {
    numeral: 'II',
    title: 'Enter your email',
    text: 'Use the same email address you applied with.',
  },
  {
    numeral: 'III',
    title: 'Confirm your private code',
    text: 'A short code arrives in your inbox. If it does not, look in your spam folder.',
  },
]

type StageState = 'lit' | 'glow' | 'veiled'

// How each stage opens. Keyed by stage id so titles and descriptions
// stay in sync with JOURNEY_STAGES.
const HOW_IT_OPENS: Record<1 | 2 | 3, { state: StageState; label: string; text: string }> = {
  1: {
    state: 'lit',
    label: 'Open to you now',
    text: 'Available as soon as you sign in. Take your time with the artwork and the premise.',
  },
  2: {
    state: 'glow',
    label: 'Your choice',
    text: 'Enter it yourself, whenever you are ready. No approval is needed.',
  },
  3: {
    state: 'veiled',
    label: 'By personal invitation',
    text: 'From The Moment, you can ask for access to The Decision. You will receive an email when it opens to you.',
  },
}

const Sparkle = ({ className = '' }: { className?: string }) => (
  <span className={`${styles.sparkle} ${className}`} aria-hidden="true">
    ✦
  </span>
)

const Divider = () => (
  <div className={styles.divider} aria-hidden="true">
    <span className={styles.dividerLine} />
    <img src="/images/icons/lotus-solid-icon.png" alt="" className={styles.dividerLotus} />
    <span className={`${styles.dividerLine} ${styles.dividerLineRight}`} />
  </div>
)

export default function AccessGuide() {
  const rootRef = useRef<HTMLDivElement>(null)

  // Soft blur-in for each part as it scrolls into view.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || typeof IntersectionObserver === 'undefined') {
      items.forEach((el) => el.classList.add(styles.visible))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add(styles.visible)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className={styles.page}>
      {/* Atmosphere */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.veil} />
        <div className={`${styles.mist} ${styles.mistA}`} />
        <div className={`${styles.mist} ${styles.mistB}`} />
        <div className={`${styles.mist} ${styles.mistC}`} />
        <GuideStarfield className={styles.stars} />
      </div>

      <div className={styles.headerWrap}>
        <Header ind={4} />
      </div>

      <main className={styles.main}>
        {/* Intro */}
        <section className={styles.hero}>
          <p className={`${styles.kicker} ${styles.reveal}`} data-reveal>
            <Sparkle /> PRIVATE ACCESS <Sparkle />
          </p>
          <h1 className={`${styles.headline} ${styles.reveal}`} data-reveal>
            <span>YOUR PATH</span>
            <span>THROUGH ACCESS</span>
          </h1>
          <div className={styles.reveal} data-reveal>
            <Divider />
          </div>
          <p className={`${styles.lede} ${styles.reveal}`} data-reveal>
            Your request has been received.
            <br />
            Three stages lie ahead. Each one reveals a little more.
          </p>
        </section>

        {/* What to do now */}
        <section
          aria-labelledby="guide-now"
          className={`${styles.glass} ${styles.nowPanel} ${styles.reveal}`}
          data-reveal
        >
          <p className={styles.panelKicker}>BEGIN HERE</p>
          <h2 id="guide-now" className={styles.panelTitle}>
            What to do now
          </h2>
          <p className={styles.panelSub}>Your first stage is already waiting for you.</p>

          <ol className={styles.nowSteps}>
            {NOW_STEPS.map((step) => (
              <li key={step.title} className={styles.nowStep}>
                <span className={`fontCinzel ${styles.nowRing}`}>{step.numeral}</span>
                <h3 className={styles.nowTitle}>{step.title}</h3>
                <p className={styles.nowText}>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* The three stages */}
        <section aria-labelledby="guide-stages" className={styles.stagesSection}>
          <div className={`${styles.sectionHead} ${styles.reveal}`} data-reveal>
            <p className={styles.panelKicker}>THE JOURNEY</p>
            <h2 id="guide-stages" className={styles.sectionTitle}>
              The three stages
            </h2>
          </div>

          <ol className={styles.constellation}>
            <span className={styles.thread} aria-hidden="true" />
            {JOURNEY_STAGES.map((stage, i) => {
              const how = HOW_IT_OPENS[stage.id]
              return (
                <li
                  key={stage.id}
                  className={`${styles.stage} ${i % 2 === 1 ? styles.stageRight : ''} ${
                    styles[how.state]
                  } ${styles.reveal}`}
                  data-reveal
                >
                  <span className={styles.orb} aria-hidden="true">
                    {how.state === 'veiled' ? (
                      <img src="/images/icons/lock.png" alt="" className={styles.orbLock} />
                    ) : (
                      <span className={styles.orbCore} />
                    )}
                  </span>

                  <div className={`${styles.glass} ${styles.stageCard}`}>
                    <span className={`fontCinzel ${styles.watermark}`} aria-hidden="true">
                      {stage.number}
                    </span>
                    <p className={styles.stageLabel}>
                      STAGE <span className="fontCinzel">{stage.number}</span>
                    </p>
                    <h3 className={styles.stageTitle}>{stage.title}</h3>
                    <p className={styles.stageDesc}>{stage.description}</p>
                    <div className={styles.stageRule} />
                    <p className={styles.howLabel}>
                      <Sparkle className={styles.howSparkle} /> {how.label}
                    </p>
                    <p className={styles.howText}>{how.text}</p>
                    {how.state === 'veiled' ? <span className={styles.sheen} aria-hidden="true" /> : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {/* After the decision */}
        <section className={`${styles.after} ${styles.reveal}`} data-reveal aria-labelledby="guide-after">
          <p className={styles.panelKicker}>BEYOND</p>
          <h2 id="guide-after" className={styles.sectionTitle}>
            After The Decision
          </h2>
          <p className={styles.afterText}>
            Inside The Decision, you can send a private enquiry about acquiring Stavarkle{' '}
            <span className="fontCinzel">#1</span>. The artist will reply to you personally by
            email.
          </p>
          <p className={styles.afterWhisper}>What happens then is still unwritten.</p>
        </section>

        {/* CTA */}
        <section className={`${styles.ctaBlock} ${styles.reveal}`} data-reveal>
          <Divider />
          <div className={styles.ctaHalo}>
            <Link href="/access" className={`btnGradient ${styles.cta}`}>
              GO TO ACCESS
              <img src="/images/icons/arrow-right.png" alt="" className={styles.ctaArrow} />
            </Link>
          </div>
          <p className={styles.ctaNote}>Sign in with the email address you applied with.</p>
        </section>
      </main>
    </div>
  )
}
