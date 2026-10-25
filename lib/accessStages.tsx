import type { ReactNode } from 'react'

export type AccessStage = 1 | 2 | 3

/** Stored in DB — applications start at stage 1 */
export type StoredAccessStage = AccessStage

export type JourneyStageStatus = 'completed' | 'active' | 'locked'

export type JourneyStage = {
  id: AccessStage
  number: string
  title: string
  description: string
}

export type NextStepBeat = {
  label: string
  title?: string
  text: ReactNode
}

export type StageContent = {
  label: string
  heading: {
    title?: string
    subtitle?: string
    before?: string
    emphasis?: string
    after?: string
  }
  body: string[]
  invitation: string
  nextSteps: {
    title: string
    beats: NextStepBeat[]
    cta: string
    /** After the next stage is granted, while still on this panel */
    advanceCta?: string
    advanceHref?: string
    /** Stage 3 — opens the process; does not confirm purchase */
    ctaHref?: string
  }
}

export const EXPERIENCE_SECTION_TITLE = 'THE EXPERIENCE'

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    number: '01',
    title: 'THE BEGINNING',
    description: 'Every historic decision sounds irrational at first.',
  },
  {
    id: 2,
    number: '02',
    title: 'THE MOMENT',
    description: 'The impossible begins to feel possible.',
  },
  {
    id: 3,
    number: '03',
    title: 'THE DECISION',
    description: 'Value is created because someone decides it is.',
  },
]

export const STAGE_CONTENT: Record<AccessStage, StageContent> = {
  1: {
    label: 'ACCESS STAGE',
    heading: {
      title: 'THE BEGINNING',
      subtitle: 'Every revolution begins with a single decision.',
    },
    body: ['Some experiences begin quietly. This is one of them.'],
    invitation: 'This is not an approval.\nIt is an invitation.',
    nextSteps: {
      title: 'WHAT HAPPENS NEXT',
      beats: [
        {
          label: 'STAGE 01 OF 03',
          title: 'THE BEGINNING',
          text: (
            <>
              One unknown artist. One original artwork.
              <br />
              An experiment whose outcome remains open.
            </>
          ),
        },
        {
          label: 'NEXT',
          title: 'THE MOMENT',
          text: (
            <>
              The world can see this artwork.
              <br />
              The next stage invites you to imagine it in your collection.
            </>
          ),
        },
        {
          label: 'BEYOND THE MOMENT',
          title: 'THE DECISION',
          text: (
            <>
              One collector can give this experiment an answer.
              <br />
              And own the artwork at its centre.
            </>
          ),
        },
      ],
      cta: 'REQUEST THE NEXT STAGE',
      advanceCta: 'ENTER THE MOMENT',
      advanceHref: '/access/stage-2',
    },
  },
  2: {
    label: 'STAGE',
    heading: {
      title: 'THE MOMENT',
      subtitle: 'There comes a moment when perception begins to shift.',
    },
    body: ['Before the world believes, someone always believes first.'],
    invitation: 'This moment belongs to one person.',
    nextSteps: {
      title: 'WHAT HAPPENS NEXT',
      beats: [
        {
          label: 'STAGE 02 OF 03',
          title: 'THE MOMENT',
          text: (
            <>
              Imagine this artwork in your collection.
              <br />
              What would owning it mean to you?
            </>
          ),
        },
        {
          label: 'NEXT',
          title: 'THE DECISION',
          text: (
            <>
              Your own judgement brings you to the next step.
              <br />
              Explore the private acquisition of Stavarkle #1.
            </>
          ),
        },
        {
          label: 'THE POSSIBILITY',
          text: (
            <>
              To own the artwork.
              <br />
              To become part of the experiment through the choice you make.
            </>
          ),
        },
      ],
      cta: 'REQUEST THE FINAL STAGE',
      advanceCta: 'PROCEED TO THE DECISION',
      advanceHref: '/access/stage-3',
    },
  },
  3: {
    label: 'STAGE',
    heading: {
      title: 'THE DECISION',
      subtitle: 'Value does not wait for consensus.',
    },
    body: ['What happens next depends on one decision.'],
    invitation:
      'Before value is recognised by many, it is recognised by one.',
    nextSteps: {
      title: 'THE DECISION',
      beats: [
        {
          label: 'STAGE 03 OF 03',
          title: 'YOUR DECISION',
          text: (
            <>
              You have seen the artwork.
              <br />
              You know the premise.
              <br />
              The decision is yours.
            </>
          ),
        },
        {
          label: 'THE ARTWORK',
          text: (
            <>
              Stavarkle #1
              <br />
              <span className="text-brand">Universe. Decided.</span>
            </>
          ),
        },
        {
          label: 'ACQUISITION PRICE',
          text: (
            <>
              <span className="fontCinzel font-medium">&euro; 1,000,000</span>
            </>
          ),
        },
        {
          label: 'YOUR PART IN THE EXPERIMENT',
          text: (
            <>
              Your acquisition becomes the answer.
              <br />
              The artwork becomes yours.
            </>
          ),
        },
      ],
      cta: 'BEGIN PRIVATE ACQUISITION',
      ctaHref: '/access/private-acquisition',
    },
  },
}

export function getJourneyStatus(
  stageId: AccessStage,
  currentStage: AccessStage
): JourneyStageStatus {
  if (stageId < currentStage) return 'completed'
  if (stageId === currentStage) {
    if (currentStage === 3) return 'completed'
    return 'active'
  }
  return 'locked'
}

export function isStoredAccessStage(value: unknown): value is StoredAccessStage {
  return value === 1 || value === 2 || value === 3
}

export function toAccessStage(value: StoredAccessStage): AccessStage {
  return value
}
