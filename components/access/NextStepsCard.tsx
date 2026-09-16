import type { StageContent } from '@/lib/accessStages'

type NextStepsCardProps = {
  content: StageContent['nextSteps']
}

const NextStepsCard = ({ content }: NextStepsCardProps) => {
  return (
    <section className="pb-20">
      <div className="containerMain">
        <div className="access-reveal max-w-4xl mx-auto rounded-[15px] bg-[rgba(154,35,73,0.04)] border border-[rgba(154,35,73,0.15)] px-14 py-12 max-[767px]:px-8 max-[767px]:py-10 flex flex-row items-start gap-12 max-[767px]:flex-col max-[767px]:items-center max-[767px]:gap-8">
          <img
            src="/images/icons/lotus-icon-colored.png"
            alt=""
            className="w-14 shrink-0"
          />

          <div className="text-left max-[767px]:text-center">
            <h2 className="text-xl font-bold text-brand tracking-wide mb-5">
              {content.title}
            </h2>

            <div className="space-y-2">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg font-medium leading-8">
                  {paragraph}
                </p>
              ))}
            </div>

            {content.cta && (
              <button
                type="button"
                className="btnGradient mt-8 py-3 px-5 text-lg inline-flex items-center justify-center gap-x-7 duration-300 hover:gap-x-9"
              >
                {content.cta}
                <img
                  src="/images/icons/arrow-right.png"
                  alt=""
                  className="w-5 brightness-[100]"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NextStepsCard
