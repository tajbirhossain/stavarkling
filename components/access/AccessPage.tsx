'use client'

import Header from '@/components/Header'
import AccessHero from '@/components/access/AccessHero'
import JourneyProgress from '@/components/access/JourneyProgress'
import NextStepsCard from '@/components/access/NextStepsCard'
import ConfidentialFooter from '@/components/access/ConfidentialFooter'
import { STAGE_CONTENT, type AccessStage } from '@/lib/accessStages'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type AccessPageProps = {
  stage: AccessStage
  memberStage: AccessStage
  alreadyRequested?: boolean
}

const AccessPage = ({
  stage,
  memberStage,
  alreadyRequested = false,
}: AccessPageProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const content = STAGE_CONTENT[stage]

  useGSAP(() => {
    gsap.set('.access-reveal', {
      opacity: 0,
      y: 25,
      filter: 'blur(8px)',
    })

    gsap.set('.access-image', {
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

    tl.to('.access-reveal', {
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
      '.access-image',
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
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <div className="relative overflow-hidden bg-[url('/images/hero-bg.png')] bg-cover bg-[position:center_top] max-[639px]:bg-[position:72%_center]">
        <Header ind={4} />
        <AccessHero stage={stage} content={content} />
      </div>

      <div className="bg-[#f7f3f4]">
        <JourneyProgress stage={stage} />
        <NextStepsCard
          content={content.nextSteps}
          pageStage={stage}
          memberStage={memberStage}
          alreadyRequested={alreadyRequested}
        />
        <ConfidentialFooter />
      </div>
    </div>
  )
}

export default AccessPage
