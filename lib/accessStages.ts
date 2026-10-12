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
  text: string
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
    process: NextStepBeat
    next: NextStepBeat
    final: NextStepBeat
    cta: string
  }
  // Original nextSteps shape (restore with original NextStepsCard):
  // nextSteps: {
  //   title: string
  //   paragraphs: string[]
  //   cta?: string
  // }
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
      process: {
        label: 'WHERE YOU ARE',
        text: 'You are at stage 1 of 3. Request the next stage when you are ready — we unlock each step selectively.',
      },
      next: {
        label: 'NEXT',
        text: 'Stage 2 — THE MOMENT. Space to sit with the work before any decision.',
      },
      final: {
        label: 'FINAL',
        text: 'Stage 3 — THE DECISION. Private acquisition of one artwork, for one collector.',
      },
      cta: 'REQUEST THE NEXT STAGE',
    },
    // Original nextSteps:
    // nextSteps: {
    //   title: 'THE EXPERIENCE CONTINUES',
    //   paragraphs: [
    //     'Some moments deserve patience.',
    //     'Some decisions deserve certainty.',
    //     'This is one of them.',
    //     'Every stage brings one step closer to a single decision.',
    //   ],
    // },
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
      process: {
        label: 'WHERE YOU ARE',
        text: 'You are at stage 2 of 3. Request the final stage when you are ready — advancement remains selective.',
      },
      next: {
        label: 'NEXT',
        text: 'Stage 3 — THE DECISION. The last step before private acquisition.',
      },
      final: {
        label: 'FINAL',
        text: 'Acquisition of Stavarkle #1 — Universe. Decided. One buyer. One million.',
      },
      cta: 'REQUEST THE FINAL STAGE',
    },
    // Original nextSteps:
    // nextSteps: {
    //   title: 'THE EXPERIENCE CONTINUES',
    //   paragraphs: [
    //     'Some moments deserve patience.',
    //     'Some decisions deserve certainty.',
    //     'This is one of them.',
    //     'Every stage brings one step closer to a single decision.',
    //   ],
    // },
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
      title: 'THE FINAL STEP',
      process: {
        label: 'WHERE YOU ARE',
        text: 'You are at stage 3 of 3 — THE DECISION. What remains is private acquisition.',
      },
      next: {
        label: 'NEXT',
        text: 'Begin acquisition when you are certain. This step is for one collector only.',
      },
      final: {
        label: 'FINAL',
        text: 'Stavarkle #1 — Universe. Decided. One artwork. One buyer. One million.',
      },
      cta: 'BEGIN PRIVATE ACQUISITION',
    },
    // Original nextSteps:
    // nextSteps: {
    //   title: 'THE EXPERIENCE CONTINUES',
    //   paragraphs: [
    //     'Some moments deserve patience.',
    //     'Some decisions deserve certainty.',
    //     'This is one of them.',
    //     'Every stage brings one step closer to a single decision.',
    //   ],
    //   cta: 'BEGIN PRIVATE ACQUISITION',
    // },
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
