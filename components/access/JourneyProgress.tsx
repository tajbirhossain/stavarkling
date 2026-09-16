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

const JourneyProgress = ({ stage }: JourneyProgressProps) => {
  return (
    <section className="py-20 max-[767px]:py-16">
      <div className="containerMain">
        <h2 className="access-reveal text-brand text-4xl font-semibold tracking-[0.15em] text-center mb-16">
          {EXPERIENCE_SECTION_TITLE}
        </h2>

        <div className="relative">
          <div className="block max-[767px]:hidden absolute left-[16.66%] right-[16.66%] top-[calc(100%-18px)] h-px bg-brand/30" />
          <div
            className={`block max-[767px]:hidden absolute left-[16.66%] top-[calc(100%-18px)] h-px bg-brand transition-all duration-500 ${progressLineWidth[stage]}`}
          />

          <div className="flex flex-row gap-y-0 max-[767px]:flex-col max-[767px]:gap-y-12">
            {JOURNEY_STAGES.map((item) => {
              const status = getJourneyStatus(item.id, stage)
              const isReached = status === 'completed' || status === 'active'

              return (
                <div
                  key={item.id}
                  className="access-reveal relative flex-1 flex flex-col items-center text-center px-6"
                >
                  <span
                    className={`fontCinzel text-5xl font-medium mb-4 ${
                      isReached ? 'text-brand' : 'text-brand/40'
                    }`}
                  >
                    {item.number}.
                  </span>

                  <h3
                    className={`text-sm font-bold tracking-wide mb-4 relative before:content-[''] before:w-8 before:h-0.5 before:bg-brand before:absolute before:left-1/2 before:-translate-x-1/2 before:-bottom-2.5 ${
                      isReached ? 'text-brand' : 'text-brand/50'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-lg font-medium leading-7 max-w-[280px] mt-4 mb-10 max-[767px]:mb-8 ${
                      isReached ? 'text-[#2a2a2a]' : 'text-[#6a6362]'
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="relative z-10 mt-auto max-[767px]:mt-0">
                    <StatusIndicator status={status} />
                  </div>

                  {item.id < 3 && (
                    <div className="hidden max-[767px]:block w-px h-10 bg-brand/30 mt-4" />
                  )}
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
