import {
  EXPERIENCE_SECTION_TITLE,
  JOURNEY_STAGES,
  getJourneyStatus,
  type AccessStage,
  type JourneyStageStatus,
} from '@/lib/accessStages'

type JourneyProgressProps = {
  stage: AccessStage
}

const StatusIndicator = ({ status }: { status: JourneyStageStatus }) => {
  if (status === 'locked') {
    return (
      <div className="w-9 h-9 rounded-full border border-brand bg-[#f7f3f4] flex items-center justify-center">
        <img src="/images/icons/lock.png" alt="" className="w-3.5" />
      </div>
    )
  }

  return (
    <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
      <svg
        width="14"
        height="11"
        viewBox="0 0 14 11"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1.5 5.5L5 9L12.5 1.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

const progressLineWidth: Record<AccessStage, string> = {
  1: 'w-0',
  2: 'w-1/3',
  3: 'w-2/3',
}

const StageCopy = ({
  item,
  isReached,
  align,
}: {
  item: (typeof JOURNEY_STAGES)[number]
  isReached: boolean
  align: 'center' | 'left'
}) => (
  <>
    <span
      className={`fontCinzel text-5xl font-medium mb-4 max-[767px]:text-4xl ${
        isReached ? 'text-brand' : 'text-brand/40'
      } ${align === 'left' ? 'block' : ''}`}
    >
      {item.number}.
    </span>

    <h3
      className={`text-sm font-bold tracking-wide mb-4 relative before:content-[''] before:w-8 before:h-0.5 before:bg-brand before:absolute before:-bottom-2.5 ${
        isReached ? 'text-brand' : 'text-brand/50'
      } ${
        align === 'center'
          ? 'before:left-1/2 before:-translate-x-1/2'
          : 'before:left-0'
      }`}
    >
      {item.title}
    </h3>

    <p
      className={`text-lg font-medium leading-7 max-w-[280px] mt-4 ${
        isReached ? 'text-[#2a2a2a]' : 'text-[#6a6362]'
      }`}
    >
      {item.description}
    </p>
  </>
)

const JourneyProgress = ({ stage }: JourneyProgressProps) => {
  return (
    <section className="py-20 max-[767px]:py-16">
      <div className="containerMain">
        <h2 className="access-reveal text-brand text-4xl font-semibold tracking-[0.15em] text-center mb-16 max-[767px]:mb-12 max-[767px]:text-3xl">
          {EXPERIENCE_SECTION_TITLE}
        </h2>

        {/* Desktop — horizontal */}
        <div className="relative max-[767px]:hidden">
          <div className="absolute left-[16.66%] right-[16.66%] top-[calc(100%-18px)] h-px bg-brand/30" />
          <div
            className={`absolute left-[16.66%] top-[calc(100%-18px)] h-px bg-brand transition-all duration-500 ${progressLineWidth[stage]}`}
          />

          <div className="flex flex-row">
            {JOURNEY_STAGES.map((item) => {
              const status = getJourneyStatus(item.id, stage)
              const isReached = status === 'completed' || status === 'active'

              return (
                <div
                  key={item.id}
                  className="access-reveal relative flex-1 flex flex-col items-center text-center px-6"
                >
                  <StageCopy item={item} isReached={isReached} align="center" />
                  <div className="relative z-10 mt-auto pt-10">
                    <StatusIndicator status={status} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile — left timeline + content */}
        <div className="relative hidden max-[767px]:block">
          <div className="flex flex-col">
            {JOURNEY_STAGES.map((item, index) => {
              const status = getJourneyStatus(item.id, stage)
              const isReached = status === 'completed' || status === 'active'
              const isLast = index === JOURNEY_STAGES.length - 1
              const segmentFilled = stage > item.id

              return (
                <div
                  key={item.id}
                  className="access-reveal relative flex flex-row items-stretch gap-x-4"
                >
                  <div className="relative z-10 flex w-9 shrink-0 flex-col items-center">
                    <StatusIndicator status={status} />
                    {!isLast ? (
                      <div
                        className={`w-px flex-1 ${
                          segmentFilled ? 'bg-brand' : 'bg-brand/30'
                        }`}
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <div
                    className={`min-w-0 flex-1 pt-0.5 text-center ${
                      isLast ? 'pb-0' : 'pb-10'
                    }`}
                  >
                    <div className="mx-auto flex max-w-[280px] flex-col items-center">
                      <StageCopy
                        item={item}
                        isReached={isReached}
                        align="center"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default JourneyProgress
