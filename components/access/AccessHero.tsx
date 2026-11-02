import type { AccessStage, StageContent } from '@/lib/accessStages'
import Link from 'next/link'

type AccessHeroProps = {
  stage: AccessStage
  content: StageContent
}

const AccessHero = ({ stage, content }: AccessHeroProps) => {
  const stageLabel = String(stage).padStart(2, '0')
  const { heading } = content

  return (
    <section className="relative pt-22 pb-32 max-[1023px]:pt-18 max-[1023px]:pb-24 max-[639px]:pt-14 max-[639px]:pb-16">
      <div className="containerMain ml-auto flex flex-row items-center justify-between gap-y-14 max-[1023px]:flex-col">
        <div className="w-1/3 text-left max-[1023px]:w-full max-[1023px]:text-center">
          <h4 className="access-reveal mb-4 text-lg font-bold text-brand max-[639px]:text-base tracking-wide">
            {content.label}{' '}
            <span className="fontCinzel font-medium">{stageLabel}</span> OF{' '}
            <span className="fontCinzel font-medium">03</span>
          </h4>

          {heading.title ? (
            <>
              <h1 className="access-reveal mb-5 text-7xl leading-none font-semibold text-brand max-[767px]:text-[42px] max-[767px]:leading-14 max-[639px]:text-[2.625rem] max-[639px]:leading-tight">
                {heading.title}
              </h1>

              {heading.subtitle && (
                <p className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 access-reveal relative mb-13 max-[639px]:mb-10 text-3xl max-[767px]:text-2xl max-[639px]:text-xl font-semibold italic whitespace-pre-line before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
                  {heading.subtitle}
                </p>
              )}
            </>
          ) : (
            <h1 className="max-[1023px]:before:left-1/2 max-[1023px]:before:-translate-x-1/2 access-reveal relative mb-13 max-[639px]:mb-10 text-7xl max-[767px]:text-[42px] max-[639px]:text-[2.625rem] leading-none max-[767px]:leading-14 max-[639px]:leading-tight font-semibold before:absolute before:bottom-[-1.25rem] before:left-0 before:h-0.5 before:w-10 before:translate-x-0 before:bg-brand before:content-['']">
              {heading.before}{' '}
              <span className="text-brand italic">{heading.emphasis}</span>{' '}
              {heading.after}
            </h1>
          )}

          <div className="access-reveal mb-10 space-y-5">
            {content.body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[22px] max-[639px]:text-lg leading-8 max-[639px]:leading-7 font-semibold whitespace-pre-line"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="access-reveal text-xl leading-8 font-semibold text-brand italic whitespace-pre-line max-[639px]:text-lg max-[639px]:leading-7">
            {content.invitation}
          </p>

          {content.nextSteps.ctaHref && (
            <div className="access-reveal mt-10 max-[639px]:mt-8">
              <Link
                href={content.nextSteps.ctaHref}
                className="btnGradient inline-flex items-center justify-center gap-x-7 px-6 py-3 text-lg duration-300 hover:gap-x-9 max-[639px]:gap-x-5 max-[639px]:px-5 max-[639px]:text-base"
              >
                {content.nextSteps.cta}
                <img
                  src="/images/icons/arrow-right.png"
                  alt=""
                  className="w-5 brightness-[100]"
                />
              </Link>
            </div>
          )}
        </div>

        <div className="flex w-2/3 justify-center max-[1023px]:w-full">
          {/* Static offset lives on the wrapper; GSAP animates only the inner
              element so clearProps never touches the Tailwind translate. */}
          <div className="translate-x-[8%] max-[1549px]:translate-x-[4%] max-[1249px]:translate-x-[2%] max-[1023px]:translate-x-0">
            <div className="access-image">
              <img
                src="/images/artwork.png"
                alt="Stavarkle #1 — Universe. Decided."
                className="h-140 w-auto max-w-none object-contain shadow-[30px_30px_52px_5px_#3c3c3c5e] max-[1549px]:h-115 max-[1249px]:h-95 max-[1023px]:h-auto max-[1023px]:w-full max-[1023px]:max-w-[420px] max-[1023px]:shadow-[24px_24px_44px_4px_#3c3c3c5e] max-[639px]:max-w-[320px] max-[639px]:shadow-[18px_18px_36px_4px_#3c3c3c5e]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccessHero
